import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import env, { isEmailConfigured, isResendConfigured } from '../src/config/env.js';
import {
  createResendTransporter,
  getTransporter,
  setTestTransporter,
  sendAdminEnquiryNotification,
  sendAdminPaymentNotification
} from '../src/services/email.service.js';

const FAKE_KEY = 're_fake_key_never_real';
const FROM = 'Reiki & Vaastu World <onboarding@resend.dev>';

const payment = {
  reference: 'RVP-TEST-0001',
  amountPaise: 119900,
  quantity: 1,
  product: { name: 'Black Obsidian' },
  customer: {
    name: 'Asha Patil',
    phone: '9822012345',
    email: 'asha@example.com',
    address: { line1: '12 Walcut Compound', line2: '', city: 'Amravati', state: 'Maharashtra', pincode: '444601' }
  }
};

describe('Resend HTTPS email transport', () => {
  const originalFetch = globalThis.fetch;
  const saved = {};
  let requests;
  let respond;

  beforeEach(() => {
    for (const key of ['RESEND_API_KEY', 'RESEND_FROM', 'ADMIN_NOTIFICATION_EMAIL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']) {
      saved[key] = env[key];
    }
    env.RESEND_API_KEY = FAKE_KEY;
    env.RESEND_FROM = FROM;
    env.ADMIN_NOTIFICATION_EMAIL = 'owner@example.com';
    requests = [];
    respond = async () => new Response(JSON.stringify({ id: 'email_123' }), { status: 200 });
    // No request in this file ever leaves the machine
    globalThis.fetch = async (url, options) => {
      requests.push({ url, options, body: JSON.parse(options.body) });
      return respond();
    };
    setTestTransporter(null);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Object.assign(env, saved);
    setTestTransporter(null);
  });

  test('is used instead of SMTP when RESEND_API_KEY is set', () => {
    env.SMTP_HOST = 'smtp.gmail.com';
    env.SMTP_USER = 'someone@gmail.com';
    env.SMTP_PASS = 'app-password';

    assert.equal(isResendConfigured(), true);
    assert.equal(isEmailConfigured(), true);
    assert.equal(typeof getTransporter().sendMail, 'function');
  });

  test('counts as configured even without any SMTP settings', () => {
    env.SMTP_HOST = undefined;
    env.SMTP_USER = undefined;
    env.SMTP_PASS = undefined;

    assert.equal(isEmailConfigured(), true);
  });

  test('ignores a key that is not a Resend key', () => {
    env.RESEND_API_KEY = 'not-a-resend-key';
    assert.equal(isResendConfigured(), false);
  });

  test('sends the payment email over HTTPS with the Resend sender and an idempotency key', async () => {
    const result = await sendAdminPaymentNotification(payment);
    const [request] = requests;

    assert.deepEqual(result, { sent: true });
    assert.equal(request.url, 'https://api.resend.com/emails');
    assert.equal(request.options.method, 'POST');
    assert.equal(request.options.headers.Authorization, `Bearer ${FAKE_KEY}`);
    assert.equal(request.options.headers['Idempotency-Key'], 'payment-paid-RVP-TEST-0001');
    assert.equal(request.body.from, FROM); // not SMTP_FROM: Resend only accepts its verified sender
    assert.deepEqual(request.body.to, ['owner@example.com']);
    assert.ok(request.body.subject.includes('RVP-TEST-0001'));
    assert.ok(request.body.html.includes('Walcut Compound'));
    assert.ok(request.body.text.includes('Walcut Compound'));
  });

  test('also carries enquiry notifications, without an idempotency key', async () => {
    const result = await sendAdminEnquiryNotification({
      reference: 'RVW-TEST-0001',
      type: 'contact',
      name: 'Prakash Rao',
      phone: '9822012345',
      location: 'amravati',
      message: 'Need information on upcoming workshops.',
      createdAt: new Date()
    });

    assert.deepEqual(result, { sent: true });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].options.headers['Idempotency-Key'], undefined);
  });

  test('a rejection by Resend is reported, not thrown, and includes the reason', async () => {
    respond = async () =>
      new Response(JSON.stringify({ name: 'validation_error', message: 'You can only send testing emails to your own email address' }), { status: 403 });

    const result = await sendAdminPaymentNotification(payment);

    assert.equal(result.sent, false);
    assert.ok(result.error.includes('403'));
    assert.ok(result.error.includes('your own email address'));
  });

  test('a network failure is reported, not thrown', async () => {
    globalThis.fetch = async () => {
      throw new TypeError('fetch failed');
    };

    const result = await sendAdminPaymentNotification(payment);

    assert.deepEqual(result, { sent: false, error: 'Could not reach Resend' });
  });

  test('never puts the API key in an error message', async () => {
    respond = async () => new Response('not json', { status: 500 });

    const result = await sendAdminPaymentNotification(payment);

    assert.equal(result.sent, false);
    assert.ok(!result.error.includes(FAKE_KEY));
  });

  test('createResendTransporter times out instead of hanging', async () => {
    globalThis.fetch = (url, options) =>
      new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'TimeoutError' })));
      });
    const transporter = createResendTransporter(FAKE_KEY, FROM);
    const original = AbortSignal.timeout;
    AbortSignal.timeout = () => original.call(AbortSignal, 20);

    try {
      await assert.rejects(() => transporter.sendMail({ to: 'owner@example.com', subject: 's', text: 't', html: 'h' }), {
        message: 'Resend request timed out'
      });
    } finally {
      AbortSignal.timeout = original;
    }
  });
});
