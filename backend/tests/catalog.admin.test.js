import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import env from '../src/config/env.js';
import app from '../src/app.js';
import Admin from '../src/models/Admin.js';
import CatalogItem from '../src/models/CatalogItem.js';
import Media from '../src/models/Media.js';
import Payment, { PAYMENT_STATUS } from '../src/models/Payment.js';
import { paymentOrderRateLimiter, paymentStatusRateLimiter } from '../src/middleware/rateLimiters.js';
import { setTestRazorpayClient } from '../src/services/razorpay.service.js';
import { DEFAULT_EVENT_WHATSAPP_GROUP_URL } from '@reiki-vastu/shared/events.js';

// Smallest valid files of each type (only the first bytes are checked)
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32)]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(32)]);

const CUSTOMER = {
  name: 'Asha Patil',
  phone: '9822012345',
  email: 'asha@example.com',
  address: { line1: '12 Walcut Compound', line2: 'Camp Area', city: 'Amravati', state: 'Maharashtra', pincode: '444601' }
};

// An event registration: contact and registration details, no delivery address
const REGISTRANT = {
  name: 'Asha Patil',
  phone: '9822012345',
  email: 'asha@example.com',
  registration: { city: 'Amravati', state: 'Maharashtra', age: 34, gender: 'female', message: 'First Reiki course' }
};

const productData = (overrides = {}) => ({
  title: 'Black Tourmaline',
  subtitle: 'Black Tourmaline Bracelet • 8 mm Beads',
  badge: 'Crystal Bracelet',
  description: 'A bracelet of black tourmaline beads.',
  longDescription: 'Longer text.',
  specifications: [{ label: 'Stone', value: 'Black tourmaline' }],
  pricePaise: 69900,
  originalPricePaise: 129900,
  maxQuantity: 3,
  available: true,
  images: ['/Products_images/Amethyst%20view%201.jpeg'],
  ...overrides
});

const future = (days) => new Date(Date.now() + days * 86400000).toISOString();

const eventData = (overrides = {}) => ({
  title: 'Reiki 2nd Level Workshop',
  tagline: 'Go deeper with Reiki',
  startsAt: future(10),
  endsAt: future(10.1),
  schedule: { date: '1 January 2027', day: 'Friday', time: '6:00 PM – 8:30 PM', mode: 'Online', modeDetail: 'Live Workshop' },
  description: ['About the workshop.'],
  benefits: [{ title: 'Level 2 attunement', icon: 'Sparkles' }],
  pricePaise: 99900,
  originalPricePaise: 310000,
  offerLabel: 'Early Bird Offer',
  contacts: ['8446656677'],
  image: { src: '/images/events/reiki-level-1-workshop.jpg', width: 350, height: 438, alt: 'Poster' },
  ...overrides
});

describe('Admin catalog: products, events, courses and images', () => {
  let mongod;
  let server;
  let baseUrl;
  let token;

  const call = (method, url, body, { auth = true, headers = {} } = {}) =>
    fetch(`${baseUrl}${url}`, {
      method,
      headers: {
        ...(auth ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined && !Buffer.isBuffer(body) ? { 'Content-Type': 'application/json' } : {}),
        ...headers
      },
      body: body === undefined ? undefined : Buffer.isBuffer(body) ? body : JSON.stringify(body)
    });

  const upload = (buffer, type = 'image/png') => call('POST', '/api/admin/media', buffer, { headers: { 'Content-Type': type } });

  const order = (productId, customer = CUSTOMER) =>
    fetch(`${baseUrl}/api/payments/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1, idempotencyKey: crypto.randomUUID(), customer })
    });

  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Promise.all([CatalogItem.init(), Payment.init()]);
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    const admin = await Admin.create({ name: 'Admin', email: 'admin@example.com', passwordHash: await bcrypt.hash('x-password', 4) });
    token = jwt.sign({ id: admin._id.toString() }, env.JWT_SECRET, { expiresIn: '1h' });
    env.RAZORPAY_KEY_ID = 'rzp_test_fakeKeyId';
    env.RAZORPAY_KEY_SECRET = 'fake_key_secret';
    setTestRazorpayClient({
      orders: {
        create: async (params) => ({ id: `order_${crypto.randomBytes(6).toString('hex')}`, amount: params.amount, currency: params.currency }),
        fetchPayments: async () => ({ items: [] })
      }
    });
  });

  after(async () => {
    setTestRazorpayClient(null);
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await Promise.all([CatalogItem.deleteMany({}), Media.deleteMany({}), Payment.deleteMany({})]);
    for (const limiter of [paymentOrderRateLimiter, paymentStatusRateLimiter]) {
      await limiter.resetKey('127.0.0.1');
      await limiter.resetKey('::ffff:127.0.0.1');
    }
  });

  describe('access', () => {
    test('every admin catalog endpoint requires an administrator', async () => {
      const requests = [
        ['GET', '/api/admin/catalog/product'],
        ['PUT', '/api/admin/catalog/product/new-item', { data: productData() }],
        ['DELETE', '/api/admin/catalog/product/rose-quartz'],
        ['POST', '/api/admin/catalog/product/rose-quartz/restore'],
        ['GET', '/api/admin/events/registrations/summary'],
        ['GET', '/api/admin/events/some-event/registrations']
      ];
      for (const [method, url, body] of requests) {
        const res = await call(method, url, body, { auth: false });
        assert.equal(res.status, 401, `${method} ${url}`);
      }
      const res = await upload(PNG, 'image/png').then(() => call('POST', '/api/admin/media', PNG, { auth: false, headers: { 'Content-Type': 'image/png' } }));
      assert.equal(res.status, 401);
    });
  });

  describe('products', () => {
    test('a new product appears on the website and can be ordered at its admin price', async () => {
      const saved = await call('PUT', '/api/admin/catalog/product/black-tourmaline', { data: productData(), isNew: true });
      assert.equal(saved.status, 200);

      const catalog = await (await fetch(`${baseUrl}/api/catalog`)).json();
      const product = catalog.data.products.find((p) => p.id === 'black-tourmaline');
      assert.equal(product.title, 'Black Tourmaline');
      assert.equal(product.isNew, true);

      const res = await order('black-tourmaline');
      const body = await res.json();
      assert.equal(res.status, 201);
      assert.equal(body.data.amountPaise, 69900);
    });

    test('isNew refuses to overwrite an existing product', async () => {
      const res = await call('PUT', '/api/admin/catalog/product/rose-quartz', { data: productData(), isNew: true });
      assert.equal(res.status, 409);
      assert.equal((await res.json()).error.code, 'ID_TAKEN');
    });

    test('editing a built-in product changes its price for new orders', async () => {
      await call('PUT', '/api/admin/catalog/product/rose-quartz', { data: productData({ title: 'Rose Quartz', pricePaise: 55500 }) });
      const body = await (await order('rose-quartz')).json();
      assert.equal(body.data.amountPaise, 55500);
    });

    test('a deleted product disappears and cannot be ordered; restoring brings it back', async () => {
      await call('DELETE', '/api/admin/catalog/product/amethyst');
      const catalog = await (await fetch(`${baseUrl}/api/catalog`)).json();
      assert.ok(catalog.data.products.find((p) => p.id === 'amethyst').deleted);
      assert.equal((await order('amethyst')).status, 404);

      await call('POST', '/api/admin/catalog/product/amethyst/restore');
      assert.equal((await order('amethyst')).status, 201);
    });

    test('validation: bad id, missing name, unsafe image address', async () => {
      assert.equal((await call('PUT', '/api/admin/catalog/product/Bad_Id', { data: productData() })).status, 422);
      const noName = await call('PUT', '/api/admin/catalog/product/x-item', { data: productData({ title: '' }) });
      assert.equal(noName.status, 422);
      const unsafe = await call('PUT', '/api/admin/catalog/product/x-item', { data: productData({ images: ['javascript:alert(1)'] }) });
      assert.equal(unsafe.status, 422);
      assert.ok((await unsafe.json()).error.fields['data.images.0']);
    });

    test('a product id cannot reuse an event id', async () => {
      const res = await call('PUT', '/api/admin/catalog/product/online-reiki-level-1-workshop-2026-11', { data: productData() });
      assert.equal(res.status, 409);
    });
  });

  describe('images', () => {
    test('uploads are checked by content, served publicly, and cleaned up when no longer used', async () => {
      const bad = await upload(Buffer.from('<svg onload=alert(1)>'), 'image/png');
      assert.equal(bad.status, 415);

      const first = (await (await upload(PNG)).json()).data;
      const second = (await (await upload(JPEG, 'image/jpeg')).json()).data;
      assert.match(first.url, /^\/api\/media\/[a-f0-9]{24}$/);

      const served = await fetch(`${baseUrl}${second.url}`);
      assert.equal(served.status, 200);
      assert.equal(served.headers.get('content-type'), 'image/jpeg');
      assert.equal(served.headers.get('cross-origin-resource-policy'), 'cross-origin');

      await call('PUT', '/api/admin/catalog/product/black-tourmaline', { data: productData({ images: [first.url, second.url] }) });
      assert.equal(await Media.countDocuments({ attached: true }), 2);

      // Remove the first photo: its upload is deleted, the other stays
      await call('PUT', '/api/admin/catalog/product/black-tourmaline', { data: productData({ images: [second.url] }) });
      assert.equal(await Media.exists({ _id: first.id }), null);
      assert.ok(await Media.exists({ _id: second.id }));
    });
  });

  describe('events', () => {
    test('a new event can be booked, and paid registrations get the WhatsApp group link', async () => {
      const groupUrl = 'https://chat.whatsapp.com/AbCdEf123';
      await call('PUT', '/api/admin/catalog/event/reiki-level-2-2027', { data: eventData(), privateData: { whatsappGroupUrl: groupUrl }, isNew: true });

      // The group link is never public
      const catalogText = await (await fetch(`${baseUrl}/api/catalog`)).text();
      assert.ok(!catalogText.includes(groupUrl));

      const created = await (await order('reiki-level-2-2027', REGISTRANT)).json();
      assert.equal(created.data.amountPaise, 99900);
      await Payment.updateOne({ reference: created.data.reference }, { $set: { status: PAYMENT_STATUS.PAID, paidAt: new Date() } });

      const status = await (await fetch(`${baseUrl}/api/payments/${created.data.statusToken}/status`)).json();
      assert.equal(status.data.isEvent, true);
      assert.equal(status.data.access.whatsappGroupUrl, groupUrl);

      const regs = await (await call('GET', '/api/admin/events/reiki-level-2-2027/registrations')).json();
      assert.equal(regs.data.registrations.length, 1);
      assert.equal(regs.data.registrations[0].customer.email, REGISTRANT.email);
      assert.equal(regs.data.registrations[0].customer.registration.city, 'Amravati');
      assert.equal(regs.data.registrations[0].customer.registration.age, 34);

      const summary = await (await call('GET', '/api/admin/events/registrations/summary')).json();
      assert.equal(summary.data.summary['reiki-level-2-2027'].paid, 1);
    });

    test('events without their own link use the default group; products get no link', async () => {
      await call('PUT', '/api/admin/catalog/event/meditation-camp-2027', { data: eventData({ title: 'Meditation Camp' }) });
      const eventOrder = await (await order('meditation-camp-2027', REGISTRANT)).json();
      const productOrder = await (await order('rose-quartz')).json();
      await Payment.updateMany({}, { $set: { status: PAYMENT_STATUS.PAID, paidAt: new Date() } });

      const eventStatus = await (await fetch(`${baseUrl}/api/payments/${eventOrder.data.statusToken}/status`)).json();
      const productStatus = await (await fetch(`${baseUrl}/api/payments/${productOrder.data.statusToken}/status`)).json();
      assert.equal(eventStatus.data.access.whatsappGroupUrl, DEFAULT_EVENT_WHATSAPP_GROUP_URL);
      assert.equal(productStatus.data.access, null);
      assert.equal(productStatus.data.isEvent, false);
    });

    test('a past event cannot be booked', async () => {
      await call('PUT', '/api/admin/catalog/event/old-workshop', {
        data: eventData({ startsAt: future(-3), endsAt: future(-2.9) })
      });
      assert.equal((await order('old-workshop', REGISTRANT)).status, 409);
    });

    test('events ask for registration details, products for a delivery address', async () => {
      await call('PUT', '/api/admin/catalog/event/reiki-level-2-2027', { data: eventData() });

      const noCity = await order('reiki-level-2-2027', { ...REGISTRANT, registration: { state: 'Maharashtra' } });
      assert.equal(noCity.status, 422);
      assert.ok((await noCity.json()).error.fields['customer.registration.city']);

      // An address is not a substitute for registration details on an event...
      assert.equal((await order('reiki-level-2-2027', CUSTOMER)).status, 422);
      // ...and registration details are not a delivery address for a product
      const product = await order('rose-quartz', REGISTRANT);
      assert.equal(product.status, 422);
      assert.ok((await product.json()).error.fields['customer.address']);

      assert.equal((await order('reiki-level-2-2027', REGISTRANT)).status, 201);
    });

    test('end time must be after the start time; group link must be a WhatsApp link', async () => {
      const badTimes = await call('PUT', '/api/admin/catalog/event/x-event', { data: eventData({ endsAt: future(1), startsAt: future(2) }) });
      assert.equal(badTimes.status, 422);
      const badLink = await call('PUT', '/api/admin/catalog/event/x-event', { data: eventData(), privateData: { whatsappGroupUrl: 'https://evil.example' } });
      assert.equal(badLink.status, 422);
    });
  });

  describe('courses', () => {
    test('an added course can be enrolled in; a deleted one cannot', async () => {
      await call('PUT', '/api/admin/catalog/course/sound-healing', {
        data: { title: 'Sound Healing', subtitle: 'Vibration • Calm', images: ['/images/Reiki.webp'] },
        isNew: true
      });
      const enquiry = (courseId) =>
        fetch(`${baseUrl}/api/enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'course', courseId, name: 'Asha Patil', phone: '9822012345', location: 'online' })
        });

      assert.equal((await enquiry('sound-healing')).status, 201);
      assert.equal((await enquiry('not-a-course')).status, 422);

      await call('DELETE', '/api/admin/catalog/course/sound-healing');
      assert.equal((await enquiry('sound-healing')).status, 422);
    });
  });
});
