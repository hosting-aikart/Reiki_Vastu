import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import env from '../src/config/env.js';
import app from '../src/app.js';
import Payment, { PAYMENT_STATUS } from '../src/models/Payment.js';
import { paymentStatusRateLimiter, paymentVerifyRateLimiter } from '../src/middleware/rateLimiters.js';
import { setTestRazorpayClient } from '../src/services/razorpay.service.js';
import { computeSignature, isValidSignature } from '../src/utils/razorpaySignature.js';

const require = createRequire(import.meta.url);
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const FAKE_KEY_ID = 'rzp_test_fakeKeyId';
const FAKE_KEY_SECRET = 'fake_key_secret_never_exposed';
const ORDER_ID = 'order_TestOrder001';
const PAYMENT_ID = 'pay_TestPayment001';
const AMOUNT = 20000;

const sign = (orderId, paymentId, secret = FAKE_KEY_SECRET) => computeSignature(`${orderId}|${paymentId}`, secret);

// The shape Razorpay returns for one payment attempt (only the fields we read)
const attempt = (overrides = {}) => ({
  id: PAYMENT_ID,
  entity: 'payment',
  amount: AMOUNT,
  currency: 'INR',
  status: 'captured',
  order_id: ORDER_ID,
  method: 'card',
  email: 'buyer@example.com',
  contact: '+919999999999',
  error_code: null,
  error_description: null,
  created_at: 1762600000,
  ...overrides
});

describe('Signature verification (unit)', () => {
  test("agrees with the official Razorpay SDK's verification", () => {
    const signature = sign(ORDER_ID, PAYMENT_ID);
    const sdkResult = validatePaymentVerification({ order_id: ORDER_ID, payment_id: PAYMENT_ID }, signature, FAKE_KEY_SECRET);

    assert.equal(sdkResult, true);
    assert.equal(isValidSignature(`${ORDER_ID}|${PAYMENT_ID}`, signature, FAKE_KEY_SECRET), true);
  });

  test('rejects a signature made with a different secret', () => {
    const forged = sign(ORDER_ID, PAYMENT_ID, 'attacker_guess');
    assert.equal(isValidSignature(`${ORDER_ID}|${PAYMENT_ID}`, forged, FAKE_KEY_SECRET), false);
  });

  test('rejects a signature for a different payment id', () => {
    const otherPayment = sign(ORDER_ID, 'pay_Other');
    assert.equal(isValidSignature(`${ORDER_ID}|${PAYMENT_ID}`, otherPayment, FAKE_KEY_SECRET), false);
  });

  test('rejects wrong lengths, non-strings and a missing secret without throwing', () => {
    const payload = `${ORDER_ID}|${PAYMENT_ID}`;
    assert.equal(isValidSignature(payload, 'abc', FAKE_KEY_SECRET), false);
    assert.equal(isValidSignature(payload, '', FAKE_KEY_SECRET), false);
    assert.equal(isValidSignature(payload, undefined, FAKE_KEY_SECRET), false);
    assert.equal(isValidSignature(payload, sign(ORDER_ID, PAYMENT_ID), undefined), false);
  });
});

describe('Payment verification and status', () => {
  let mongod;
  let server;
  let baseUrl;
  let fetchCalls;
  let attempts;
  let fetchBehaviour;
  const originalEnv = {};
  const originalTransition = Payment.transition;

  const verify = (body) =>
    fetch(`${baseUrl}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const status = (token) => fetch(`${baseUrl}/api/payments/${token}/status`);

  const createPendingPayment = (overrides = {}) =>
    Payment.create({
      reference: `RVP-TEST-${crypto.randomBytes(4).toString('hex')}`,
      statusToken: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      product: { id: 'placeholder-product-a', name: '[TEST] Placeholder Product A', unitPricePaise: 10000, isPlaceholder: true },
      quantity: 2,
      amountPaise: AMOUNT,
      status: PAYMENT_STATUS.PENDING,
      razorpayOrderId: ORDER_ID,
      orderCreatedAt: new Date(),
      ...overrides
    });

  const callbackFor = (payment, overrides = {}) => ({
    statusToken: payment.statusToken,
    razorpay_order_id: ORDER_ID,
    razorpay_payment_id: PAYMENT_ID,
    razorpay_signature: sign(ORDER_ID, PAYMENT_ID),
    ...overrides
  });

  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Payment.init();
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
    env.RAZORPAY_KEY_ID = FAKE_KEY_ID;
    env.RAZORPAY_KEY_SECRET = FAKE_KEY_SECRET;
    fetchCalls = 0;
    attempts = [attempt()];
    fetchBehaviour = async () => ({ entity: 'collection', count: attempts.length, items: attempts });
    setTestRazorpayClient({
      orders: {
        fetchPayments: (orderId) => {
          fetchCalls += 1;
          assert.equal(orderId, ORDER_ID);
          return fetchBehaviour();
        }
      }
    });
    await Payment.deleteMany({});
    for (const limiter of [paymentVerifyRateLimiter, paymentStatusRateLimiter]) {
      await limiter.resetKey('127.0.0.1');
      await limiter.resetKey('::ffff:127.0.0.1');
    }
  });

  afterEach(() => {
    Payment.transition = originalTransition;
  });

  describe('POST /api/payments/verify', () => {
    test('valid signature and captured payment -> PAID', async () => {
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment));
      const body = await res.json();
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 200);
      assert.equal(body.data.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.razorpayPaymentId, PAYMENT_ID);
      assert.equal(stored.confirmedVia, 'checkout');
      assert.equal(stored.verification.signatureVerified, true);
      assert.equal(stored.verification.paymentId, PAYMENT_ID);
      assert.equal(stored.customer.email, 'buyer@example.com');
      assert.ok(stored.paidAt);
    });

    test('valid signature but only authorized (not captured) -> stays PENDING', async () => {
      attempts = [attempt({ status: 'authorized' })];
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment));
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('invalid signature -> 400, status unchanged, Razorpay not consulted', async () => {
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment, { razorpay_signature: sign(ORDER_ID, PAYMENT_ID, 'wrong_secret') }));
      const body = await res.json();
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 400);
      assert.equal(body.error.code, 'SIGNATURE_INVALID');
      assert.equal(stored.status, PAYMENT_STATUS.PENDING); // not FAILED: a forged callback must not fail a real payment
      assert.equal(stored.verification.signatureVerified, false);
      assert.equal(fetchCalls, 0);
    });

    test("rejects a genuine signature from a different order (replaying someone else's payment)", async () => {
      const payment = await createPendingPayment();
      const otherOrder = 'order_SomeoneElses';

      const res = await verify(
        callbackFor(payment, { razorpay_order_id: otherOrder, razorpay_signature: sign(otherOrder, PAYMENT_ID) })
      );

      assert.equal(res.status, 400);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('ignores a status or amount sent by the browser', async () => {
      const payment = await createPendingPayment();

      const res = await verify({
        ...callbackFor(payment, { razorpay_signature: 'a'.repeat(64) }),
        status: PAYMENT_STATUS.PAID,
        amountPaise: 1
      });

      assert.equal(res.status, 400);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('rejects malformed fields with 422', async () => {
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment, { razorpay_signature: 'not-hex' }));

      assert.equal(res.status, 422);
    });

    test('unknown status token -> 404', async () => {
      const res = await verify(callbackFor({ statusToken: crypto.randomUUID() }));

      assert.equal(res.status, 404);
    });

    test('a repeated verification is harmless and does not ask Razorpay again', async () => {
      const payment = await createPendingPayment();

      const first = await verify(callbackFor(payment));
      const second = await verify(callbackFor(payment));
      const secondBody = await second.json();

      assert.equal(first.status, 200);
      assert.equal(second.status, 200);
      assert.equal(secondBody.data.status, PAYMENT_STATUS.PAID);
      assert.equal(fetchCalls, 1); // PAID is final, so there is nothing left to check
    });

    test('concurrent verifications produce exactly one PAID transition', async () => {
      const payment = await createPendingPayment();
      let transitionsToPaid = 0;
      Payment.transition = async function (...args) {
        const result = await originalTransition.apply(this, args);
        if (args[1] === PAYMENT_STATUS.PAID && result) transitionsToPaid += 1;
        return result;
      };

      const responses = await Promise.all(Array.from({ length: 5 }, () => verify(callbackFor(payment))));
      const bodies = await Promise.all(responses.map((res) => res.json()));

      assert.equal(transitionsToPaid, 1);
      assert.ok(bodies.every((body) => body.data.status === PAYMENT_STATUS.PAID));
    });

    test('captured amount that differs from our record -> not PAID, flagged for review', async () => {
      attempts = [attempt({ amount: 100 })];
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment));
      const body = await res.json();
      const stored = await Payment.findById(payment._id);

      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);
      assert.equal(stored.status, PAYMENT_STATUS.PENDING);
      assert.equal(stored.review.required, true);
      assert.ok(stored.review.reason.includes(PAYMENT_ID));
    });

    test('Razorpay unreachable -> 202, stays PENDING, then recovers via the status endpoint', async () => {
      fetchBehaviour = async () => {
        throw new TypeError("Cannot read properties of undefined (reading 'status')");
      };
      const payment = await createPendingPayment();

      const res = await verify(callbackFor(payment));
      const body = await res.json();
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 202);
      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);
      assert.equal(stored.verification.signatureVerified, true);

      fetchBehaviour = async () => ({ items: attempts }); // Razorpay is back
      const recovered = await (await status(payment.statusToken)).json();

      assert.equal(recovered.data.status, PAYMENT_STATUS.PAID);
      assert.equal((await Payment.findById(payment._id)).confirmedVia, 'reconciliation');
    });

    test('database failure while marking PAID -> 500, then recovers via the status endpoint', async () => {
      const payment = await createPendingPayment();
      Payment.transition = async () => {
        throw new Error('database unavailable');
      };

      const res = await verify(callbackFor(payment));
      assert.equal(res.status, 500);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);

      Payment.transition = originalTransition; // database is back
      const recovered = await (await status(payment.statusToken)).json();

      assert.equal(recovered.data.status, PAYMENT_STATUS.PAID);
    });

    test('refused with 503 when credentials are missing', async () => {
      const payment = await createPendingPayment();
      env.RAZORPAY_KEY_SECRET = undefined;

      const res = await verify(callbackFor(payment));

      assert.equal(res.status, 503);
    });
  });

  describe('GET /api/payments/:statusToken/status', () => {
    test('the customer closed the browser after paying: status check finds the payment', async () => {
      const payment = await createPendingPayment(); // no callback ever arrived

      const res = await status(payment.statusToken);
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.status, PAYMENT_STATUS.PAID);
      assert.equal(res.headers.get('cache-control'), 'no-store');
    });

    test('no payment attempts yet -> stays PENDING (a missing callback is not a failure)', async () => {
      attempts = [];
      const payment = await createPendingPayment();

      const body = await (await status(payment.statusToken)).json();

      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);
    });

    test('latest attempt failed -> FAILED with the reason', async () => {
      attempts = [attempt({ status: 'failed', error_code: 'BAD_REQUEST_ERROR', error_description: 'Card declined by bank' })];
      const payment = await createPendingPayment();

      const body = await (await status(payment.statusToken)).json();

      assert.equal(body.data.status, PAYMENT_STATUS.FAILED);
      assert.equal(body.data.failure.description, 'Card declined by bank');
    });

    test('a failed attempt followed by a successful retry -> PAID', async () => {
      const payment = await createPendingPayment({ status: PAYMENT_STATUS.FAILED });
      attempts = [
        attempt({ id: 'pay_First', status: 'failed', created_at: 1762600000 }),
        attempt({ id: 'pay_Second', status: 'captured', created_at: 1762600100 })
      ];

      const body = await (await status(payment.statusToken)).json();
      const stored = await Payment.findById(payment._id);

      assert.equal(body.data.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.razorpayPaymentId, 'pay_Second');
    });

    test('asks Razorpay at most once per interval, however often it is polled', async () => {
      attempts = [];
      const payment = await createPendingPayment();

      await Promise.all(Array.from({ length: 5 }, () => status(payment.statusToken)));
      await status(payment.statusToken);

      assert.equal(fetchCalls, 1);
    });

    test('a final status is returned without contacting Razorpay', async () => {
      const payment = await createPendingPayment({ status: PAYMENT_STATUS.PAID, paidAt: new Date() });

      const body = await (await status(payment.statusToken)).json();

      assert.equal(body.data.status, PAYMENT_STATUS.PAID);
      assert.equal(fetchCalls, 0);
    });

    test('Razorpay unreachable -> answers with the stored status instead of an error', async () => {
      fetchBehaviour = async () => {
        throw { statusCode: 500, error: { code: 'SERVER_ERROR', description: 'down' } };
      };
      const payment = await createPendingPayment();

      const res = await status(payment.statusToken);
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.status, PAYMENT_STATUS.PENDING);
    });

    test('exposes no customer details, Razorpay ids or internal fields', async () => {
      const payment = await createPendingPayment();

      const text = await (await status(payment.statusToken)).text();

      for (const hidden of ['buyer@example.com', '+919999999999', ORDER_ID, PAYMENT_ID, 'idempotencyKey', '_id', 'statusToken']) {
        assert.ok(!text.includes(hidden), `response must not include ${hidden}`);
      }
    });

    test('unknown or malformed token -> 404', async () => {
      assert.equal((await status(crypto.randomUUID())).status, 404);
      assert.equal((await status('not-a-token')).status, 404);
    });
  });
});
