import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import env from '../src/config/env.js';
import app from '../src/app.js';
import Payment, { PAYMENT_STATUS } from '../src/models/Payment.js';
import WebhookEvent from '../src/models/WebhookEvent.js';
import { paymentOrderRateLimiter } from '../src/middleware/rateLimiters.js';
import { setTestRazorpayClient } from '../src/services/razorpay.service.js';
import { setTestTransporter } from '../src/services/email.service.js';

// Every email the code tries to send lands here; tests must never reach a real SMTP server
const sentEmails = [];
const FAKE_TRANSPORT = { sendMail: async (message) => { sentEmails.push(message); return { messageId: 'test' }; } };

const WEBHOOK_SECRET = 'fake_webhook_secret_never_exposed';
const KEY_SECRET = 'fake_key_secret_never_exposed';
const ORDER_ID = 'order_WebhookOrder01';
const PAYMENT_ID = 'pay_WebhookPay01';
const AMOUNT = 20000;
const CUSTOMER = {
  name: 'Asha Patil',
  phone: '9822012345',
  email: 'asha@example.com',
  address: { line1: '12 Walcut Compound, Camp Road', line2: '', city: 'Amravati', state: 'Maharashtra', pincode: '444601' }
};

const hmac = (body, secret = WEBHOOK_SECRET) => crypto.createHmac('sha256', secret).update(body).digest('hex');

// Shaped like Razorpay's documented webhook payload
const eventBody = (event, paymentOverrides = {}) => ({
  entity: 'event',
  account_id: 'acc_Test123',
  event,
  contains: ['payment'],
  payload: {
    payment: {
      entity: {
        id: PAYMENT_ID,
        entity: 'payment',
        amount: AMOUNT,
        currency: 'INR',
        status: event === 'payment.failed' ? 'failed' : 'captured',
        order_id: ORDER_ID,
        method: 'card',
        captured: event !== 'payment.failed',
        email: 'buyer@example.com',
        contact: '+919999999999',
        error_code: event === 'payment.failed' ? 'BAD_REQUEST_ERROR' : null,
        error_description: event === 'payment.failed' ? 'Payment declined by bank' : null,
        created_at: 1762600000,
        ...paymentOverrides
      }
    }
  },
  created_at: 1762600005
});

describe('Razorpay webhook', () => {
  let mongod;
  let server;
  let baseUrl;
  const originalEnv = {};
  const originalTransition = Payment.transition;
  const originalCreateEvent = WebhookEvent.create;

  /** Sends exactly these bytes, signed (by default) over exactly these bytes. */
  const deliver = (rawBody, { signature = hmac(rawBody), eventId = `evt_${crypto.randomUUID()}`, headers = {} } = {}) =>
    fetch(`${baseUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature ? { 'X-Razorpay-Signature': signature } : {}),
        ...(eventId ? { 'X-Razorpay-Event-Id': eventId } : {}),
        ...headers
      },
      body: rawBody
    });

  const deliverEvent = (event, options = {}) =>
    deliver(JSON.stringify(eventBody(event, options.payment)), options);

  const createPendingPayment = (overrides = {}) =>
    Payment.create({
      reference: `RVP-TEST-${crypto.randomBytes(4).toString('hex')}`,
      statusToken: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      product: { id: 'black-obsidian', name: 'Black Obsidian', unitPricePaise: 10000, isPlaceholder: false },
      quantity: 2,
      amountPaise: AMOUNT,
      status: PAYMENT_STATUS.PENDING,
      razorpayOrderId: ORDER_ID,
      orderCreatedAt: new Date(),
      customer: CUSTOMER,
      ...overrides
    });

  before(async () => {
    setTestTransporter(FAKE_TRANSPORT);
    originalEnv.adminEmail = env.ADMIN_NOTIFICATION_EMAIL;
    env.ADMIN_NOTIFICATION_EMAIL = 'owner@example.com';
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Payment.init();
    await WebhookEvent.init();
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    originalEnv.webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
    originalEnv.keyId = env.RAZORPAY_KEY_ID;
    originalEnv.keySecret = env.RAZORPAY_KEY_SECRET;
  });

  after(async () => {
    setTestTransporter(null);
    env.ADMIN_NOTIFICATION_EMAIL = originalEnv.adminEmail;
    env.RAZORPAY_WEBHOOK_SECRET = originalEnv.webhookSecret;
    env.RAZORPAY_KEY_ID = originalEnv.keyId;
    env.RAZORPAY_KEY_SECRET = originalEnv.keySecret;
    setTestRazorpayClient(null);
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
    env.RAZORPAY_KEY_ID = 'rzp_test_fakeKeyId';
    env.RAZORPAY_KEY_SECRET = KEY_SECRET;
    // Webhooks must never need the Razorpay API; any call fails the test
    setTestRazorpayClient({
      orders: {
        create: () => assert.fail('webhook must not call Razorpay'),
        fetchPayments: () => assert.fail('webhook must not call Razorpay')
      }
    });
    await Payment.deleteMany({});
    await WebhookEvent.deleteMany({});
  });

  afterEach(() => {
    Payment.transition = originalTransition;
    WebhookEvent.create = originalCreateEvent;
  });

  describe('Successful events', () => {
    test('payment.captured -> PAID, confirmed via webhook, event recorded', async () => {
      const payment = await createPendingPayment();

      const res = await deliverEvent('payment.captured', { eventId: 'evt_captured_1' });
      const body = await res.json();
      const stored = await Payment.findById(payment._id);
      const recorded = await WebhookEvent.findOne({ eventId: 'evt_captured_1' });

      assert.equal(res.status, 200);
      assert.equal(body.data.outcome, 'processed');
      assert.equal(stored.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.confirmedVia, 'webhook');
      assert.equal(stored.razorpayPaymentId, PAYMENT_ID);
      assert.equal(stored.razorpayCustomer.email, 'buyer@example.com');
      assert.equal(recorded.outcome, 'processed');
      assert.equal(recorded.event, 'payment.captured');
    });

    test('order.paid -> PAID', async () => {
      const payment = await createPendingPayment();
      const body = eventBody('order.paid');
      body.contains = ['payment', 'order'];
      body.payload.order = { entity: { id: ORDER_ID, entity: 'order', amount: AMOUNT, amount_paid: AMOUNT, status: 'paid' } };

      const res = await deliver(JSON.stringify(body));

      assert.equal(res.status, 200);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID);
    });

    test('payment.failed -> FAILED with the reason', async () => {
      const payment = await createPendingPayment();

      const res = await deliverEvent('payment.failed');
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 200);
      assert.equal(stored.status, PAYMENT_STATUS.FAILED);
      assert.equal(stored.failure.description, 'Payment declined by bank');
    });

    test('a failure, then a successful retry -> PAID', async () => {
      const payment = await createPendingPayment();

      await deliverEvent('payment.failed', { payment: { id: 'pay_Attempt1' } });
      await deliverEvent('payment.captured', { payment: { id: 'pay_Attempt2' } });
      const stored = await Payment.findById(payment._id);

      assert.equal(stored.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.razorpayPaymentId, 'pay_Attempt2');
    });

    test('out of order: a late payment.failed cannot undo PAID', async () => {
      const payment = await createPendingPayment();

      await deliverEvent('payment.captured');
      const res = await deliverEvent('payment.failed', { payment: { id: 'pay_EarlierAttempt' } });
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 200);
      assert.equal(stored.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.razorpayPaymentId, PAYMENT_ID);
    });

    test('captured amount that differs from our record -> not PAID, flagged for review', async () => {
      const payment = await createPendingPayment();

      const res = await deliverEvent('payment.captured', { payment: { amount: 100 } });
      const stored = await Payment.findById(payment._id);

      assert.equal(res.status, 200);
      assert.equal(stored.status, PAYMENT_STATUS.PENDING);
      assert.equal(stored.review.required, true);
    });
  });

  describe('Duplicate deliveries (idempotency)', () => {
    test('the same event delivered twice is applied once', async () => {
      const payment = await createPendingPayment();
      let transitions = 0;
      Payment.transition = async function (...args) {
        transitions += 1;
        return originalTransition.apply(this, args);
      };

      const first = await deliverEvent('payment.captured', { eventId: 'evt_dup' });
      const second = await deliverEvent('payment.captured', { eventId: 'evt_dup' });
      const secondBody = await second.json();

      assert.equal(first.status, 200);
      assert.equal(second.status, 200); // 2xx, so Razorpay stops retrying
      assert.equal(secondBody.data.outcome, 'duplicate');
      assert.equal(transitions, 1);
      assert.equal(await WebhookEvent.countDocuments({ eventId: 'evt_dup' }), 1);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID);
    });

    test('concurrent duplicate deliveries leave one event record and a PAID payment', async () => {
      const payment = await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'));

      const responses = await Promise.all(Array.from({ length: 5 }, () => deliver(raw, { eventId: 'evt_race' })));

      assert.ok(responses.every((res) => res.status === 200));
      assert.equal(await WebhookEvent.countDocuments({ eventId: 'evt_race' }), 1);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID);
    });

    test('a different event for an already-PAID payment changes nothing', async () => {
      const payment = await createPendingPayment();

      await deliverEvent('payment.captured', { eventId: 'evt_a' });
      const paidAt = (await Payment.findById(payment._id)).paidAt;
      await deliverEvent('order.paid', { eventId: 'evt_b' });

      assert.deepEqual((await Payment.findById(payment._id)).paidAt, paidAt);
    });

    test('without an event id header, the same body is still recognised as a repeat', async () => {
      await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'));

      await deliver(raw, { eventId: null });
      const second = await (await deliver(raw, { eventId: null })).json();

      assert.equal(second.data.outcome, 'duplicate');
    });
  });

  describe('Signature verification', () => {
    test('invalid signature -> 400, nothing changes, nothing recorded', async () => {
      const payment = await createPendingPayment();

      const res = await deliver(JSON.stringify(eventBody('payment.captured')), { signature: 'f'.repeat(64) });

      assert.equal(res.status, 400);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
      assert.equal(await WebhookEvent.countDocuments(), 0);
    });

    test('missing signature -> 400', async () => {
      await createPendingPayment();

      const res = await deliver(JSON.stringify(eventBody('payment.captured')), { signature: null });

      assert.equal(res.status, 400);
    });

    test('signed with the API key secret instead of the webhook secret -> 400', async () => {
      const payment = await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'));

      const res = await deliver(raw, { signature: hmac(raw, KEY_SECRET) });

      assert.equal(res.status, 400);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('verifies the exact raw bytes: unusual spacing is accepted when signed as sent', async () => {
      const payment = await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'), null, 4) + '\n'; // not how JSON.stringify would re-serialise it

      const res = await deliver(raw); // signed over these exact bytes

      assert.equal(res.status, 200);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID);
    });

    test('a signature over a re-serialised copy does not match the bytes actually sent', async () => {
      await createPendingPayment();
      const sent = JSON.stringify(eventBody('payment.captured'), null, 2);
      const reserialised = JSON.stringify(JSON.parse(sent));

      const res = await deliver(sent, { signature: hmac(reserialised) });

      assert.equal(res.status, 400);
    });

    test('tampering with the amount after signing -> 400', async () => {
      const payment = await createPendingPayment();
      const signed = JSON.stringify(eventBody('payment.captured'));
      const tampered = signed.replace(`"amount":${AMOUNT}`, '"amount":100');

      const res = await deliver(tampered, { signature: hmac(signed) });

      assert.equal(res.status, 400);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });
  });

  describe('Other cases', () => {
    test('webhook secret not configured -> 503 so Razorpay retries later', async () => {
      env.RAZORPAY_WEBHOOK_SECRET = undefined;

      const res = await deliverEvent('payment.captured');

      assert.equal(res.status, 503);
    });

    test('validly signed but malformed JSON -> 400', async () => {
      const res = await deliver('{not json');

      assert.equal(res.status, 400);
    });

    test('unknown order -> 200 and recorded as ignored', async () => {
      const res = await deliverEvent('payment.captured', { payment: { order_id: 'order_NotOurs' }, eventId: 'evt_other' });
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.outcome, 'ignored');
      assert.equal((await WebhookEvent.findOne({ eventId: 'evt_other' })).outcome, 'ignored');
    });

    test('unhandled event type -> 200 and ignored', async () => {
      const payment = await createPendingPayment();

      const res = await deliverEvent('refund.created');
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.outcome, 'ignored');
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('database failure -> 500, event not recorded, and the retry succeeds', async () => {
      const payment = await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'));
      Payment.transition = async () => {
        throw new Error('database unavailable');
      };

      const failed = await deliver(raw, { eventId: 'evt_retry' });
      assert.equal(failed.status, 500);
      assert.equal(await WebhookEvent.countDocuments({ eventId: 'evt_retry' }), 0);

      Payment.transition = originalTransition; // database is back; Razorpay retries
      const retried = await deliver(raw, { eventId: 'evt_retry' });

      assert.equal(retried.status, 200);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID);
    });

    test('a failure while recording the event -> 500; the retry is applied safely', async () => {
      const payment = await createPendingPayment();
      const raw = JSON.stringify(eventBody('payment.captured'));
      WebhookEvent.create = async () => {
        throw new Error('database unavailable');
      };

      const failed = await deliver(raw, { eventId: 'evt_record' });
      assert.equal(failed.status, 500);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PAID); // the update itself succeeded

      WebhookEvent.create = originalCreateEvent;
      const retried = await deliver(raw, { eventId: 'evt_record' });

      assert.equal(retried.status, 200);
      assert.equal(await WebhookEvent.countDocuments({ eventId: 'evt_record' }), 1);
    });

    test('rejects an oversized body with 413', async () => {
      const res = await deliver('x'.repeat(200 * 1024));

      assert.equal(res.status, 413);
    });

    test('never echoes the webhook secret', async () => {
      await createPendingPayment();

      const text = await (await deliverEvent('payment.captured')).text();

      assert.ok(!text.includes(WEBHOOK_SECRET));
    });

    test('other JSON routes still parse JSON bodies', async () => {
      await paymentOrderRateLimiter.resetKey('127.0.0.1');
      await paymentOrderRateLimiter.resetKey('::ffff:127.0.0.1');

      const res = await fetch(`${baseUrl}/api/payments/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'black-obsidian', quantity: 0, idempotencyKey: crypto.randomUUID() })
      });
      const body = await res.json();

      assert.equal(res.status, 422);
      assert.ok(body.error.fields.quantity); // body was parsed, so the field-level error is reported
    });
  });
});
