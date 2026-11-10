import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import env from '../src/config/env.js';
import app from '../src/app.js';
import { findProduct, PRODUCTS } from '../src/config/products.js';
import { PRODUCTS as SHARED_PRODUCTS } from '@reiki-vastu/shared/products.js';
import Payment, { ALLOWED_TRANSITIONS, PAYMENT_STATUS } from '../src/models/Payment.js';
import { paymentOrderRateLimiter } from '../src/middleware/rateLimiters.js';
import { createRazorpayOrder, setTestRazorpayClient } from '../src/services/razorpay.service.js';

const FAKE_KEY_ID = 'rzp_test_fakeKeyId';
const FAKE_KEY_SECRET = 'fake_key_secret_never_exposed';
const PRODUCT_A = 'black-obsidian';
const CUSTOMER = {
  name: 'Asha Patil',
  phone: '9822012345',
  email: 'asha@example.com',
  address: { line1: '12 Walcut Compound, Camp Road', line2: '', city: 'Amravati', state: 'Maharashtra', pincode: '444601' }
};

describe('Payment order creation', () => {
  let mongod;
  let server;
  let baseUrl;
  let razorpayCalls;
  let razorpayBehaviour;
  const originalEnv = {};

  const post = (body) =>
    fetch(`${baseUrl}/api/payments/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const orderBody = (overrides = {}) => ({
    productId: PRODUCT_A,
    quantity: 2,
    idempotencyKey: crypto.randomUUID(),
    customer: CUSTOMER,
    ...overrides
  });

  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Payment.init(); // wait for unique indexes, which the duplicate tests rely on
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    originalEnv.keyId = env.RAZORPAY_KEY_ID;
    originalEnv.keySecret = env.RAZORPAY_KEY_SECRET;
  });

  after(async () => {
    env.RAZORPAY_KEY_ID = originalEnv.keyId;
    env.RAZORPAY_KEY_SECRET = originalEnv.keySecret;
    setTestRazorpayClient(null);
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Tests never use the real credentials or reach Razorpay
    env.RAZORPAY_KEY_ID = FAKE_KEY_ID;
    env.RAZORPAY_KEY_SECRET = FAKE_KEY_SECRET;
    razorpayCalls = [];
    razorpayBehaviour = async (params) => ({
      id: `order_mock${razorpayCalls.length}`,
      entity: 'order',
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      status: 'created'
    });
    setTestRazorpayClient({
      orders: {
        create: (params) => {
          razorpayCalls.push(params);
          return razorpayBehaviour(params);
        }
      }
    });
    await Payment.deleteMany({});
    await paymentOrderRateLimiter.resetKey('127.0.0.1');
    await paymentOrderRateLimiter.resetKey('::ffff:127.0.0.1');
  });

  describe('Catalog', () => {
    test('lists the real products with the shared prices and reports payments as enabled', async () => {
      const res = await fetch(`${baseUrl}/api/products`);
      const { data } = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.paymentsEnabled, true);
      assert.equal(data.pricesConfirmed, false); // provisional until the business confirms
      assert.deepEqual(
        data.products.map((p) => [p.id, p.unitPricePaise]),
        SHARED_PRODUCTS.map((p) => [p.id, p.pricePaise])
      );
      assert.ok(data.products.every((product) => product.isPlaceholder === false));
    });

    test('every catalog price is whole paise of at least ₹1', () => {
      for (const product of PRODUCTS) {
        assert.ok(Number.isInteger(product.unitPricePaise) && product.unitPricePaise >= 100, product.id);
      }
    });

    test('reports payments as disabled for a non-test key', async () => {
      env.RAZORPAY_KEY_ID = 'rzp_live_notAllowed';
      const res = await fetch(`${baseUrl}/api/products`);
      const { data } = await res.json();

      assert.equal(data.paymentsEnabled, false);
    });
  });

  describe('Successful order', () => {
    test('returns the order and stores a PENDING record', async () => {
      const res = await post(orderBody({ quantity: 3 }));
      const body = await res.json();
      const unitPrice = findProduct(PRODUCT_A).unitPricePaise;

      assert.equal(res.status, 201);
      assert.equal(body.data.razorpayOrderId, 'order_mock1');
      assert.equal(body.data.razorpayKeyId, FAKE_KEY_ID);
      assert.equal(body.data.amountPaise, unitPrice * 3);
      assert.equal(body.data.currency, 'INR');
      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);

      const record = await Payment.findOne({ reference: body.data.reference });
      assert.equal(record.status, PAYMENT_STATUS.PENDING);
      assert.equal(record.razorpayOrderId, 'order_mock1');
      assert.equal(record.amountPaise, unitPrice * 3);
      assert.equal(record.product.name, findProduct(PRODUCT_A).name);
      assert.ok(record.orderCreatedAt);
    });

    test('sends Razorpay the amount in paise with our reference as the receipt', async () => {
      const res = await post(orderBody({ productId: 'lava-stone', quantity: 2 }));
      const { data } = await res.json();

      assert.equal(razorpayCalls.length, 1);
      assert.equal(razorpayCalls[0].amount, 199800); // ₹999 × 2 in paise, never a decimal
      assert.equal(razorpayCalls[0].currency, 'INR');
      assert.equal(razorpayCalls[0].receipt, data.reference);
    });

    test('never returns the key secret or internal fields', async () => {
      const res = await post(orderBody());
      const text = await res.text();

      assert.ok(!text.includes(FAKE_KEY_SECRET));
      assert.ok(!text.includes('idempotencyKey'));
      assert.ok(!text.includes('_id'));
    });

    test('saves the record before calling Razorpay', async () => {
      let statusDuringCall;
      razorpayBehaviour = async (params) => {
        const record = await Payment.findOne({ reference: params.receipt });
        statusDuringCall = record?.status;
        return { id: 'order_sequence' };
      };

      await post(orderBody());

      assert.equal(statusDuringCall, PAYMENT_STATUS.CREATED);
    });
  });

  describe('Input validation and price integrity', () => {
    test('rejects an unknown product without contacting Razorpay', async () => {
      const res = await post(orderBody({ productId: 'does-not-exist' }));
      const body = await res.json();

      assert.equal(res.status, 404);
      assert.equal(body.error.code, 'PRODUCT_NOT_FOUND');
      assert.equal(razorpayCalls.length, 0);
      assert.equal(await Payment.countDocuments(), 0);
    });

    test('rejects an unavailable product', async () => {
      const product = findProduct('selenite');
      product.available = false;
      const res = await post(orderBody({ productId: 'selenite', quantity: 1 })).finally(() => {
        product.available = true;
      });
      const body = await res.json();

      assert.equal(res.status, 409);
      assert.equal(body.error.code, 'PRODUCT_UNAVAILABLE');
      assert.equal(razorpayCalls.length, 0);
    });

    for (const quantity of [0, -1, 1.5, 11, '2', null]) {
      test(`rejects quantity ${JSON.stringify(quantity)}`, async () => {
        const res = await post(orderBody({ quantity }));
        const body = await res.json();

        assert.equal(res.status, 422);
        assert.ok(body.error.fields.quantity);
        assert.equal(razorpayCalls.length, 0);
      });
    }

    test('rejects a quantity above the limit for that product', async () => {
      const res = await post(orderBody({ quantity: findProduct(PRODUCT_A).maxQuantity + 1 }));
      const body = await res.json();

      assert.equal(res.status, 422);
      assert.equal(body.error.code, 'QUANTITY_LIMIT_EXCEEDED');
      assert.equal(razorpayCalls.length, 0);
    });

    test('rejects a missing or malformed idempotency key', async () => {
      const res = await post(orderBody({ idempotencyKey: 'not-a-uuid' }));

      assert.equal(res.status, 422);
      assert.equal(razorpayCalls.length, 0);
    });

    test('ignores any amount or price sent by the client', async () => {
      const res = await post(
        orderBody({
          quantity: 1,
          amount: 1,
          amountPaise: 1,
          unitPricePaise: 1,
          price: 1,
          currency: 'USD',
          status: PAYMENT_STATUS.PAID
        })
      );
      const { data } = await res.json();
      const unitPrice = findProduct(PRODUCT_A).unitPricePaise;

      assert.equal(res.status, 201);
      assert.equal(razorpayCalls[0].amount, unitPrice);
      assert.equal(razorpayCalls[0].currency, 'INR');
      assert.equal(data.amountPaise, unitPrice);
      assert.equal(data.status, PAYMENT_STATUS.PENDING);
    });
  });

  describe('Delivery details', () => {
    test('are stored with the payment', async () => {
      const res = await post(orderBody());
      const { data } = await res.json();
      const record = await Payment.findOne({ reference: data.reference }).lean();

      assert.equal(res.status, 201);
      assert.equal(record.customer.name, CUSTOMER.name);
      assert.equal(record.customer.phone, CUSTOMER.phone);
      assert.equal(record.customer.email, CUSTOMER.email);
      assert.deepEqual(record.customer.address, CUSTOMER.address);
    });

    test('are never sent to Razorpay or returned to the browser', async () => {
      const res = await post(orderBody());
      const text = await res.text();
      const sentToRazorpay = JSON.stringify(razorpayCalls[0]);

      for (const value of [CUSTOMER.name, CUSTOMER.phone, CUSTOMER.email, CUSTOMER.address.line1, CUSTOMER.address.pincode]) {
        assert.ok(!text.includes(value), `response must not include ${value}`);
        assert.ok(!sentToRazorpay.includes(value), `Razorpay must not receive ${value}`);
      }
    });

    test('are required', async () => {
      const res = await post(orderBody({ customer: undefined }));
      const body = await res.json();

      assert.equal(res.status, 422);
      assert.ok(body.error.fields.customer);
      assert.equal(razorpayCalls.length, 0);
    });

    const invalid = [
      ['name', { name: 'A' }],
      ['phone', { phone: '12345' }],
      ['email', { email: 'not-an-email' }],
      ['address.line1', { address: { ...CUSTOMER.address, line1: '' } }],
      ['address.city', { address: { ...CUSTOMER.address, city: '' } }],
      ['address.state', { address: { ...CUSTOMER.address, state: '' } }],
      ['address.pincode', { address: { ...CUSTOMER.address, pincode: '04460' } }]
    ];
    for (const [field, change] of invalid) {
      test(`reject an invalid ${field} with a field-level error`, async () => {
        const res = await post(orderBody({ customer: { ...CUSTOMER, ...change } }));
        const body = await res.json();

        assert.equal(res.status, 422);
        assert.ok(body.error.fields[`customer.${field}`], JSON.stringify(body.error.fields));
        assert.equal(razorpayCalls.length, 0);
      });
    }

    test('changing the address under the same key is refused, not silently ignored', async () => {
      const key = crypto.randomUUID();

      await post(orderBody({ idempotencyKey: key }));
      const res = await post(
        orderBody({ idempotencyKey: key, customer: { ...CUSTOMER, address: { ...CUSTOMER.address, city: 'Nagpur' } } })
      );
      const body = await res.json();

      assert.equal(res.status, 409);
      assert.equal(body.error.code, 'IDEMPOTENCY_KEY_REUSED');
      assert.equal(razorpayCalls.length, 1);
    });
  });

  describe('Payments unavailable', () => {
    test('refuses with 503 when credentials are missing', async () => {
      env.RAZORPAY_KEY_ID = undefined;
      env.RAZORPAY_KEY_SECRET = undefined;

      const res = await post(orderBody());
      const body = await res.json();

      assert.equal(res.status, 503);
      assert.equal(body.error.code, 'PAYMENTS_UNCONFIGURED');
      assert.equal(await Payment.countDocuments(), 0);
    });

    test('refuses a live key without contacting Razorpay', async () => {
      env.RAZORPAY_KEY_ID = 'rzp_live_notAllowed';

      const res = await post(orderBody());
      const body = await res.json();

      assert.equal(res.status, 503);
      assert.equal(body.error.code, 'PAYMENTS_TEST_MODE_ONLY');
      assert.equal(razorpayCalls.length, 0);
    });
  });

  describe('Razorpay failures', () => {
    test('API rejection gives 502 and an ORDER_FAILED record', async () => {
      razorpayBehaviour = async () => {
        throw {
          statusCode: 400,
          error: { code: 'BAD_REQUEST_ERROR', description: 'Internal Razorpay detail' }
        };
      };

      const key = crypto.randomUUID();
      const res = await post(orderBody({ idempotencyKey: key }));
      const body = await res.json();

      assert.equal(res.status, 502);
      assert.equal(body.error.code, 'PAYMENT_PROVIDER_ERROR');
      assert.ok(!JSON.stringify(body).includes('Internal Razorpay detail'));

      const record = await Payment.findOne({ idempotencyKey: key });
      assert.equal(record.status, PAYMENT_STATUS.ORDER_FAILED);
      assert.equal(record.failure.code, 'BAD_REQUEST_ERROR');
      assert.equal(record.razorpayOrderId, undefined);
    });

    test("does not pass Razorpay's 401 on to the customer", async () => {
      razorpayBehaviour = async () => {
        throw {
          statusCode: 401,
          error: { code: 'BAD_REQUEST_ERROR', description: 'Authentication failed' }
        };
      };

      const res = await post(orderBody());

      assert.equal(res.status, 502);
    });

    test('handles the TypeError the SDK raises when there is no response', async () => {
      razorpayBehaviour = async () => {
        throw new TypeError("Cannot read properties of undefined (reading 'status')");
      };

      const key = crypto.randomUUID();
      const res = await post(orderBody({ idempotencyKey: key }));
      const record = await Payment.findOne({ idempotencyKey: key });

      assert.equal(res.status, 502);
      assert.equal(record.status, PAYMENT_STATUS.ORDER_FAILED);
      assert.equal(record.failure.code, 'RAZORPAY_NETWORK_ERROR');
    });

    test('times out instead of waiting forever', async () => {
      razorpayBehaviour = () => new Promise(() => {});

      await assert.rejects(
        () => createRazorpayOrder({ amount: 100, currency: 'INR' }, 20),
        (err) => err.name === 'RazorpayError' && err.code === 'RAZORPAY_TIMEOUT'
      );
    });
  });

  describe('Database failures', () => {
    const originalCreate = Payment.create;
    const originalTransition = Payment.transition;

    afterEach(() => {
      Payment.create = originalCreate;
      Payment.transition = originalTransition;
    });

    test('does not contact Razorpay if the record cannot be saved', async () => {
      Payment.create = async () => {
        throw new Error('database unavailable');
      };

      const res = await post(orderBody());

      assert.equal(res.status, 500);
      assert.equal(razorpayCalls.length, 0);
    });

    test('leaves the record CREATED, not PENDING, if linking the order fails', async () => {
      Payment.transition = async () => {
        throw new Error('database unavailable');
      };

      const key = crypto.randomUUID();
      const res = await post(orderBody({ idempotencyKey: key }));
      const body = await res.json();
      const record = await Payment.findOne({ idempotencyKey: key });

      assert.equal(res.status, 500);
      assert.equal(body.data, undefined); // no order id, so Checkout cannot open
      assert.equal(record.status, PAYMENT_STATUS.CREATED);
    });

    test('still answers 502 if recording ORDER_FAILED also fails', async () => {
      razorpayBehaviour = async () => {
        throw { statusCode: 500, error: { code: 'SERVER_ERROR', description: 'Razorpay down' } };
      };
      Payment.transition = async () => {
        throw new Error('database unavailable');
      };

      const res = await post(orderBody());

      assert.equal(res.status, 502);
    });
  });

  describe('Duplicate requests', () => {
    test('a repeated request returns the same order without a second Razorpay call', async () => {
      const body = orderBody();

      const first = await post(body);
      const second = await post(body);
      const firstBody = await first.json();
      const secondBody = await second.json();

      assert.equal(first.status, 201);
      assert.equal(second.status, 200);
      assert.equal(secondBody.data.razorpayOrderId, firstBody.data.razorpayOrderId);
      assert.equal(secondBody.data.statusToken, firstBody.data.statusToken);
      assert.equal(razorpayCalls.length, 1);
      assert.equal(await Payment.countDocuments(), 1);
    });

    test('concurrent duplicates create one record and one Razorpay order', async () => {
      const body = orderBody();
      const original = razorpayBehaviour;
      razorpayBehaviour = async (params) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return original(params);
      };

      const responses = await Promise.all(Array.from({ length: 5 }, () => post(body)));
      const statuses = responses.map((res) => res.status);

      assert.equal(razorpayCalls.length, 1);
      assert.equal(await Payment.countDocuments(), 1);
      assert.equal(statuses.filter((status) => status === 201).length, 1);
      assert.ok(statuses.every((status) => [200, 201, 409].includes(status)));
    });

    test('rejects a key reused for a different product or quantity', async () => {
      const key = crypto.randomUUID();

      await post(orderBody({ idempotencyKey: key, quantity: 1 }));
      const res = await post(orderBody({ idempotencyKey: key, quantity: 2 }));
      const body = await res.json();

      assert.equal(res.status, 409);
      assert.equal(body.error.code, 'IDEMPOTENCY_KEY_REUSED');
      assert.equal(razorpayCalls.length, 1);
    });

    test('a key that failed is not retried; a new key succeeds', async () => {
      const key = crypto.randomUUID();
      razorpayBehaviour = async () => {
        throw { statusCode: 500, error: { code: 'SERVER_ERROR', description: 'Razorpay down' } };
      };
      await post(orderBody({ idempotencyKey: key }));

      const repeat = await post(orderBody({ idempotencyKey: key }));
      const repeatBody = await repeat.json();
      assert.equal(repeat.status, 409);
      assert.equal(repeatBody.error.code, 'ORDER_CREATION_FAILED');

      razorpayBehaviour = async () => ({ id: 'order_afterRetry' });
      const retry = await post(orderBody());
      assert.equal(retry.status, 201);
    });

    test('a paid payment cannot be restarted with the same key', async () => {
      const body = orderBody();
      const first = await (await post(body)).json();
      await Payment.updateOne({ reference: first.data.reference }, { status: PAYMENT_STATUS.PAID });

      const res = await post(body);
      const repeat = await res.json();

      assert.equal(res.status, 409);
      assert.equal(repeat.error.code, 'PAYMENT_ALREADY_COMPLETED');
    });
  });

  describe('Rate limiting', () => {
    test('blocks excessive valid attempts from one client', async () => {
      const responses = [];
      for (let i = 0; i < 21; i += 1) {
        responses.push(await post(orderBody()));
      }

      assert.equal(responses[19].status, 201);
      assert.equal(responses[20].status, 429);
      assert.equal(razorpayCalls.length, 20); // the 21st never reached Razorpay
    });

    test('invalid forms do not use up the limit', async () => {
      for (let i = 0; i < 25; i += 1) {
        const res = await post(orderBody({ customer: { ...CUSTOMER, address: { ...CUSTOMER.address, pincode: 'bad' } } }));
        assert.equal(res.status, 422);
      }

      const valid = await post(orderBody());
      assert.equal(valid.status, 201);
    });
  });

  describe('Payment model', () => {
    const newPayment = (overrides = {}) => ({
      reference: `RVP-TEST-${crypto.randomUUID()}`.slice(0, 40),
      statusToken: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      product: { id: PRODUCT_A, name: 'Test', unitPricePaise: 10000, isPlaceholder: false },
      quantity: 1,
      amountPaise: 10000,
      customer: CUSTOMER,
      ...overrides
    });

    const allStatuses = Object.values(PAYMENT_STATUS);

    for (const from of allStatuses) {
      for (const to of allStatuses) {
        const allowed = ALLOWED_TRANSITIONS[from].includes(to);

        test(`${from} -> ${to} is ${allowed ? 'allowed' : 'refused'}`, async () => {
          const payment = await Payment.create(newPayment({ status: from }));

          const result = await Payment.transition(payment._id, to);
          const stored = await Payment.findById(payment._id);

          if (allowed) {
            assert.equal(result.status, to);
            assert.equal(stored.status, to);
          } else {
            assert.equal(result, null);
            assert.equal(stored.status, from);
          }
        });
      }
    }

    test('only one of many concurrent transitions wins', async () => {
      const payment = await Payment.create(newPayment({ status: PAYMENT_STATUS.CREATED }));

      const results = await Promise.all(
        Array.from({ length: 5 }, () => Payment.transition(payment._id, PAYMENT_STATUS.PENDING))
      );

      assert.equal(results.filter(Boolean).length, 1);
    });

    test('rejects decimal, zero and negative amounts', async () => {
      for (const amountPaise of [100.5, 0, -100]) {
        await assert.rejects(() => Payment.create(newPayment({ amountPaise })), { name: 'ValidationError' });
      }
    });

    test('rejects an unknown status or currency', async () => {
      await assert.rejects(() => Payment.create(newPayment({ status: 'REFUNDED' })), { name: 'ValidationError' });
      await assert.rejects(() => Payment.create(newPayment({ currency: 'USD' })), { name: 'ValidationError' });
    });

    test('allows many records without a Razorpay order id', async () => {
      await Payment.create(newPayment());
      await Payment.create(newPayment());

      assert.equal(await Payment.countDocuments({ razorpayOrderId: { $exists: false } }), 2);
    });

    test('rejects a duplicate Razorpay order id', async () => {
      await Payment.create(newPayment({ razorpayOrderId: 'order_same' }));

      await assert.rejects(() => Payment.create(newPayment({ razorpayOrderId: 'order_same' })), { code: 11000 });
    });
  });
});
