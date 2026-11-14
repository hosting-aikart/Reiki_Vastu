import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import env from '../src/config/env.js';
import app from '../src/app.js';
import Admin from '../src/models/Admin.js';
import Payment, { PAYMENT_STATUS } from '../src/models/Payment.js';
import { paymentOrderRateLimiter, paymentStatusRateLimiter, paymentVerifyRateLimiter } from '../src/middleware/rateLimiters.js';
import { setTestRazorpayClient } from '../src/services/razorpay.service.js';
import { setTestTransporter, buildPaymentEmailData } from '../src/services/email.service.js';
import { applyRazorpayPayments } from '../src/services/paymentConfirmation.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDER_ID = 'order_AdminOrder001';
const AMOUNT = 239800;
const CUSTOMER = {
  name: 'Asha Patil',
  phone: '9822012345',
  email: 'asha@example.com',
  address: { line1: '12 Walcut Compound, Camp Road', line2: 'Near Shiv Temple, Camp Area', city: 'Amravati', state: 'Maharashtra', pincode: '444601' }
};

const sentEmails = [];
let sendMailBehaviour;
const FAKE_TRANSPORT = { sendMail: (message) => sendMailBehaviour(message) };

const waitFor = async (check, timeoutMs = 2000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return false;
};

const capturedAttempt = (overrides = {}) => ({
  id: 'pay_Admin001',
  entity: 'payment',
  amount: AMOUNT,
  currency: 'INR',
  status: 'captured',
  order_id: ORDER_ID,
  email: 'rzp.buyer@example.com',
  contact: '+919999999999',
  created_at: 1762600000,
  ...overrides
});

describe('Admin payments, owner email, production checks and frontend contract', () => {
  let mongod;
  let server;
  let baseUrl;
  let adminToken;
  let razorpayAttempts;
  const originalEnv = {};

  const createPayment = (overrides = {}) =>
    Payment.create({
      reference: `RVP-TEST-${crypto.randomBytes(4).toString('hex')}`,
      statusToken: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      product: { id: 'black-obsidian', name: 'Black Obsidian', unitPricePaise: 119900, isPlaceholder: false },
      quantity: 2,
      amountPaise: AMOUNT,
      status: PAYMENT_STATUS.PENDING,
      razorpayOrderId: ORDER_ID,
      orderCreatedAt: new Date(),
      customer: CUSTOMER,
      ...overrides
    });

  const adminGet = (url, token = adminToken) =>
    fetch(`${baseUrl}${url}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

  before(async () => {
    setTestTransporter(FAKE_TRANSPORT);
    originalEnv.adminEmail = env.ADMIN_NOTIFICATION_EMAIL;
    originalEnv.keyId = env.RAZORPAY_KEY_ID;
    originalEnv.keySecret = env.RAZORPAY_KEY_SECRET;
    env.ADMIN_NOTIFICATION_EMAIL = 'owner@example.com';

    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Payment.init();
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;

    const admin = await Admin.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('not-a-real-password', 4)
    });
    adminToken = jwt.sign({ id: admin._id.toString() }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  after(async () => {
    setTestTransporter(null);
    setTestRazorpayClient(null);
    env.ADMIN_NOTIFICATION_EMAIL = originalEnv.adminEmail;
    env.RAZORPAY_KEY_ID = originalEnv.keyId;
    env.RAZORPAY_KEY_SECRET = originalEnv.keySecret;
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    env.RAZORPAY_KEY_ID = 'rzp_test_fakeKeyId';
    env.RAZORPAY_KEY_SECRET = 'fake_key_secret_never_exposed';
    sentEmails.length = 0;
    sendMailBehaviour = async (message) => {
      sentEmails.push(message);
      return { messageId: 'test' };
    };
    razorpayAttempts = [capturedAttempt()];
    setTestRazorpayClient({
      orders: {
        create: async (params) => ({ id: `order_${crypto.randomBytes(6).toString('hex')}`, amount: params.amount, currency: params.currency }),
        fetchPayments: async () => ({ items: razorpayAttempts })
      }
    });
    await Payment.deleteMany({});
    for (const limiter of [paymentOrderRateLimiter, paymentStatusRateLimiter, paymentVerifyRateLimiter]) {
      await limiter.resetKey('127.0.0.1');
      await limiter.resetKey('::ffff:127.0.0.1');
    }
  });

  describe('GET /api/admin/payments', () => {
    test('requires an administrator', async () => {
      assert.equal((await adminGet('/api/admin/payments', null)).status, 401);
      assert.equal((await adminGet('/api/admin/payments', 'not-a-valid-token')).status, 401);
    });

    test('lists payments with delivery details and status counts', async () => {
      await createPayment({ status: PAYMENT_STATUS.PAID, paidAt: new Date() });
      await createPayment({ razorpayOrderId: 'order_Second' });

      const res = await adminGet('/api/admin/payments');
      const { data } = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.payments.length, 2);
      assert.deepEqual(data.payments[0].customer.address, CUSTOMER.address);
      assert.equal(data.counts.PAID, 1);
      assert.equal(data.counts.PENDING, 1);
      assert.equal(data.pagination.total, 2);
    });

    test('includes the live location for delivery', async () => {
      await createPayment({ customer: { ...CUSTOMER, location: { latitude: 20.9374, longitude: 77.7796, accuracyMeters: 18 } } });

      const { data } = await (await adminGet('/api/admin/payments')).json();

      assert.equal(data.payments[0].customer.location.latitude, 20.9374);
    });

    test('never returns the status token or idempotency key', async () => {
      const payment = await createPayment();

      const text = await (await adminGet('/api/admin/payments')).text();

      assert.ok(!text.includes(payment.statusToken));
      assert.ok(!text.includes(payment.idempotencyKey));
    });

    test('filters by status', async () => {
      await createPayment({ status: PAYMENT_STATUS.PAID, paidAt: new Date() });
      await createPayment({ razorpayOrderId: 'order_Pending' });

      const { data } = await (await adminGet('/api/admin/payments?status=PAID')).json();

      assert.equal(data.payments.length, 1);
      assert.equal(data.payments[0].status, PAYMENT_STATUS.PAID);
    });

    test('rejects operator injection and unknown statuses in the filter', async () => {
      assert.equal((await adminGet('/api/admin/payments?status[$ne]=PAID')).status, 422);
      assert.equal((await adminGet('/api/admin/payments?status=REFUNDED')).status, 422);
    });

    test('searches by customer name, phone or reference, treating input as plain text', async () => {
      const payment = await createPayment();
      await createPayment({ razorpayOrderId: 'order_Other', customer: { ...CUSTOMER, name: 'Someone Else', phone: '9000000000', email: 'someone@example.com' } });

      const byName = await (await adminGet('/api/admin/payments?search=asha')).json();
      const byRef = await (await adminGet(`/api/admin/payments?search=${payment.reference}`)).json();
      const regexChars = await (await adminGet('/api/admin/payments?search=.*')).json();

      assert.equal(byName.data.payments.length, 1);
      assert.equal(byRef.data.payments.length, 1);
      assert.equal(regexChars.data.payments.length, 0); // ".*" is searched literally, not as "match everything"
    });
  });

  describe('POST /api/admin/payments/:id/recheck', () => {
    const recheck = (id, token = adminToken) =>
      fetch(`${baseUrl}/api/admin/payments/${id}/recheck`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

    test('requires an administrator', async () => {
      const payment = await createPayment();
      assert.equal((await recheck(payment._id, null)).status, 401);
    });

    test('confirms a PENDING payment that Razorpay captured', async () => {
      const payment = await createPayment();

      const res = await recheck(payment._id);
      const body = await res.json();

      assert.equal(res.status, 200);
      assert.equal(body.data.payment.status, PAYMENT_STATUS.PAID);
      assert.equal(body.data.payment.confirmedVia, 'reconciliation');
    });

    test('answers 502 when Razorpay is unreachable, leaving the payment unchanged', async () => {
      const payment = await createPayment();
      setTestRazorpayClient({
        orders: {
          fetchPayments: async () => {
            throw new TypeError("Cannot read properties of undefined (reading 'status')");
          }
        }
      });

      const res = await recheck(payment._id);

      assert.equal(res.status, 502);
      assert.equal((await Payment.findById(payment._id)).status, PAYMENT_STATUS.PENDING);
    });

    test('unknown or malformed id -> 404', async () => {
      assert.equal((await recheck(new mongoose.Types.ObjectId())).status, 404);
      assert.equal((await recheck('not-an-id')).status, 404);
    });
  });

  describe('Owner email when a payment is confirmed', () => {
    test('is sent once, even when several confirmations race', async () => {
      const payment = await createPayment();

      await Promise.all(Array.from({ length: 5 }, () => applyRazorpayPayments(payment, razorpayAttempts, 'webhook')));
      await waitFor(async () => (await Payment.findById(payment._id)).notification.adminEmailSent);

      assert.equal(sentEmails.length, 1);
      assert.equal(sentEmails[0].to, 'owner@example.com');
      assert.ok(sentEmails[0].subject.includes(payment.reference));
      assert.ok(sentEmails[0].text.includes('Walcut Compound'));
      assert.equal((await Payment.findById(payment._id)).notification.adminEmailSent, true);
    });

    test('is not sent for a payment that is not PAID', async () => {
      const payment = await createPayment();

      await applyRazorpayPayments(payment, [capturedAttempt({ status: 'failed' })], 'webhook');
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.equal(sentEmails.length, 0);
    });

    test('an email failure does not undo PAID and is recorded for administrators', async () => {
      sendMailBehaviour = async () => {
        throw new Error('SMTP connection refused');
      };
      const payment = await createPayment();

      const updated = await applyRazorpayPayments(payment, razorpayAttempts, 'webhook');
      await waitFor(async () => (await Payment.findById(payment._id)).notification.lastError);
      const stored = await Payment.findById(payment._id);

      assert.equal(updated.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.status, PAYMENT_STATUS.PAID);
      assert.equal(stored.notification.adminEmailSent, false);
      assert.equal(stored.notification.lastError, 'SMTP connection refused');
    });

    test('escapes what customers typed, so it cannot inject HTML into the email', () => {
      const { html } = buildPaymentEmailData({
        reference: 'RVP-TEST',
        amountPaise: AMOUNT,
        quantity: 1,
        product: { name: 'Black Obsidian' },
        customer: {
          ...CUSTOMER,
          name: '<img src=x onerror=alert(1)>',
          address: { ...CUSTOMER.address, line1: '<script>alert(1)</script>' }
        }
      });

      assert.ok(!html.includes('<script>'));
      assert.ok(!html.includes('<img src=x'));
      assert.ok(html.includes('&lt;script&gt;'));
    });

    test('includes a Google Maps link when a live location was shared', () => {
      const { html, text } = buildPaymentEmailData({
        reference: 'RVP-TEST',
        amountPaise: AMOUNT,
        quantity: 1,
        product: { name: 'Black Obsidian' },
        customer: { ...CUSTOMER, location: { latitude: 20.9374, longitude: 77.7796, accuracyMeters: 18 } }
      });

      assert.ok(html.includes('https://www.google.com/maps?q=20.937400,77.779600'));
      assert.ok(text.includes('Live location: https://www.google.com/maps?q=20.937400,77.779600'));
      assert.ok(html.includes('about 18 m'));
    });

    test('has no location line when none was shared', () => {
      const { text } = buildPaymentEmailData({
        reference: 'RVP-TEST',
        amountPaise: AMOUNT,
        quantity: 1,
        product: { name: 'Black Obsidian' },
        customer: CUSTOMER
      });

      assert.ok(!text.includes('Live location'));
    });

    test('says TEST MODE while using a test key', () => {
      const { subject, text } = buildPaymentEmailData({
        reference: 'RVP-TEST',
        amountPaise: AMOUNT,
        quantity: 2,
        product: { name: 'Black Obsidian' },
        customer: CUSTOMER
      });

      assert.ok(subject.includes('TEST MODE'));
      assert.ok(subject.includes('₹2,398'));
      assert.ok(text.includes('NO REAL MONEY'));
    });
  });

  describe('Production secret check', () => {
    const startInProduction = (extraEnv) =>
      spawnSync(process.execPath, ['--input-type=module', '-e', "await import('./src/config/env.js'); console.log('started');"], {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, NODE_ENV: 'production', ...extraEnv },
        encoding: 'utf8'
      });

    const strong = crypto.randomBytes(48).toString('hex');

    test('refuses to start with the built-in development secrets', () => {
      const result = startInProduction({
        JWT_SECRET: 'reiki-vastu-secret-jwt-key-for-dev-change-in-production-2026',
        COOKIE_SECRET: strong
      });

      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes('JWT_SECRET'));
    });

    test('refuses to start with a short secret', () => {
      const result = startInProduction({ JWT_SECRET: strong, COOKIE_SECRET: 'short' });

      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes('COOKIE_SECRET'));
    });

    test('starts with long private secrets', () => {
      const result = startInProduction({ JWT_SECRET: strong, COOKIE_SECRET: crypto.randomBytes(48).toString('hex') });

      assert.equal(result.status, 0, result.stderr);
      assert.ok(result.stdout.includes('started'));
    });
  });

  describe('Frontend contract: the real browser client against the real API', () => {
    let client;

    before(async () => {
      // Load frontend/src/api/paymentClient.js exactly as written, pointing it at this test server
      const source = fs.readFileSync(path.resolve(__dirname, '../../frontend/src/api/paymentClient.js'), 'utf8');
      const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rv-client-')), 'paymentClient.mjs');
      fs.writeFileSync(file, source.replaceAll('import.meta.env.VITE_API_URL', JSON.stringify(baseUrl)));
      client = await import(pathToFileURL(file).href);
    });

    afterEach(async () => {
      await Payment.deleteMany({});
    });

    test('getProducts returns the catalog', async () => {
      const res = await client.getProducts();

      assert.equal(res.success, true);
      assert.ok(res.data.products.some((p) => p.id === 'black-obsidian'));
    });

    test('createPaymentOrder sends the delivery details the server requires', async () => {
      const res = await client.createPaymentOrder({
        productId: 'black-obsidian',
        quantity: 2,
        idempotencyKey: crypto.randomUUID(),
        customer: CUSTOMER
      });
      const stored = await Payment.findOne({ reference: res.data?.reference }).lean();

      assert.equal(res.success, true, JSON.stringify(res));
      assert.equal(res.data.amountPaise, AMOUNT);
      assert.equal(stored.customer.address.pincode, CUSTOMER.address.pincode);
    });

    test('createPaymentOrder reports field errors in the shape the checkout form reads', async () => {
      const res = await client.createPaymentOrder({
        productId: 'black-obsidian',
        quantity: 1,
        idempotencyKey: crypto.randomUUID(),
        customer: { ...CUSTOMER, address: { ...CUSTOMER.address, pincode: '123' } }
      });

      assert.equal(res.success, false);
      assert.equal(res.code, 'VALIDATION_ERROR');
      assert.ok(res.fields['customer.address.pincode']);
    });

    test('verifyPayment and getPaymentStatus work end to end', async () => {
      const order = await client.createPaymentOrder({
        productId: 'black-obsidian',
        quantity: 2,
        idempotencyKey: crypto.randomUUID(),
        customer: CUSTOMER
      });
      const { razorpayOrderId, statusToken } = order.data;
      razorpayAttempts = [capturedAttempt({ order_id: razorpayOrderId })];
      const signature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|pay_Admin001`)
        .digest('hex');

      const verified = await client.verifyPayment({
        statusToken,
        checkoutResponse: { razorpay_order_id: razorpayOrderId, razorpay_payment_id: 'pay_Admin001', razorpay_signature: signature }
      });
      const status = await client.getPaymentStatus(statusToken);

      assert.equal(verified.success, true, JSON.stringify(verified));
      assert.equal(verified.data.status, PAYMENT_STATUS.PAID);
      assert.equal(status.data.status, PAYMENT_STATUS.PAID);
      assert.equal(sentEmails.length, 1);
    });
  });
});
