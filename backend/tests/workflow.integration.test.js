import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import Enquiry from '../src/models/Enquiry.js';
import Testimonial from '../src/models/Testimonial.js';
import { createEnquiry } from '../src/services/enquiry.service.js';
import { createTestimonial } from '../src/services/testimonial.service.js';
import * as emailService from '../src/services/email.service.js';
import env from '../src/config/env.js';

describe('Workflow & Reliability Requirements', () => {
  let originalSaveEnquiry;
  let originalSaveTestimonial;
  let originalUpdateEnquiry;
  let originalUpdateTestimonial;
  let originalDashboardUrl;
  let originalAdminEmail;

  beforeEach(() => {
    originalSaveEnquiry = Enquiry.prototype.save;
    originalSaveTestimonial = Testimonial.prototype.save;
    originalUpdateEnquiry = Enquiry.updateOne;
    originalUpdateTestimonial = Testimonial.updateOne;
    originalDashboardUrl = env.ADMIN_DASHBOARD_URL;
    originalAdminEmail = env.ADMIN_NOTIFICATION_EMAIL;
  });

  afterEach(() => {
    Enquiry.prototype.save = originalSaveEnquiry;
    Testimonial.prototype.save = originalSaveTestimonial;
    Enquiry.updateOne = originalUpdateEnquiry;
    Testimonial.updateOne = originalUpdateTestimonial;
    env.ADMIN_DASHBOARD_URL = originalDashboardUrl;
    env.ADMIN_NOTIFICATION_EMAIL = originalAdminEmail;
    emailService.setTestTransporter(null);
  });

  test('Order of operations: Persists enquiry in DB first, then attempts notification', async () => {
    let dbPersisted = false;
    let emailAttemptedAfterDb = false;

    Enquiry.prototype.save = async function () {
      dbPersisted = true;
      this._id = '670f5e1b2f8a1e0011111111';
      return this;
    };

    Enquiry.updateOne = async () => ({ acknowledged: true });

    emailService.setTestTransporter({
      sendMail: async () => {
        if (dbPersisted) {
          emailAttemptedAfterDb = true;
        }
        return { messageId: 'ok' };
      }
    });

    const payload = {
      type: 'contact',
      name: 'Prakash Rao',
      phone: '9822012345',
      location: 'amravati',
      message: 'Need information on upcoming workshops.'
    };

    const saved = await createEnquiry(payload);

    assert.equal(dbPersisted, true, 'Enquiry must be saved to DB');
    assert.equal(saved.name, 'Prakash Rao');
    assert.ok(saved.reference.startsWith('RVW-'));

    // Wait microtask for background notification dispatch
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(emailAttemptedAfterDb, true, 'Email notification must only be attempted after DB save');
  });

  test('Email failure does not roll back or fail the enquiry submission', async () => {
    let updateRecordedError = false;

    Enquiry.prototype.save = async function () {
      this._id = '670f5e1b2f8a1e0022222222';
      return this;
    };

    Enquiry.updateOne = async (filter, update) => {
      if (update.$set?.['notification.lastError']) {
        updateRecordedError = true;
      }
      return { acknowledged: true };
    };

    // Simulate failing SMTP server
    emailService.setTestTransporter({
      sendMail: async () => {
        throw new Error('Connection refused: 127.0.0.1:587');
      }
    });

    const payload = {
      type: 'consultation',
      name: 'Sunita Joshi',
      phone: '9822054321',
      location: 'nagpur',
      serviceKey: 'residential_vaastu_audit',
      preferredDate: '2026-10-28',
      preferredSlot: '10:00'
    };

    // The call must succeed and return the saved enquiry!
    const saved = await createEnquiry(payload);
    assert.ok(saved, 'Enquiry submission must succeed despite email failure');
    assert.equal(saved.name, 'Sunita Joshi');

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(updateRecordedError, true, 'Failure reason must be recorded on the record without throwing to user');
  });

  test('Database failure halts workflow and prevents email notification', async () => {
    let emailAttempted = false;

    // Simulate database constraint/network failure
    Enquiry.prototype.save = async function () {
      throw new Error('MongoNetworkError: failed to connect to server');
    };

    emailService.setTestTransporter({
      sendMail: async () => {
        emailAttempted = true;
        return { messageId: 'should_not_happen' };
      }
    });

    const payload = {
      type: 'contact',
      name: 'Failed Submission',
      phone: '9999999999',
      location: 'amravati'
    };

    await assert.rejects(
      async () => {
        await createEnquiry(payload);
      },
      (err) => {
        assert.ok(err.message.includes('MongoNetworkError'));
        return true;
      }
    );

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(emailAttempted, false, 'No email must be sent if database persistence fails');
  });

  test('Order of operations for Testimonials: Persists as pending in DB first, then attempts notification', async () => {
    let dbPersisted = false;
    let emailAttempted = false;

    Testimonial.prototype.save = async function () {
      dbPersisted = true;
      this._id = '670f5e1b2f8a1e0033333333';
      return this;
    };

    Testimonial.updateOne = async () => ({ acknowledged: true });

    emailService.setTestTransporter({
      sendMail: async () => {
        emailAttempted = true;
        return { messageId: 'ok' };
      }
    });

    const payload = {
      name: 'Arun Mehta',
      city: 'Amravati',
      serviceKey: 'reiki_healing_session',
      rating: 5,
      story: 'Deep peace and vitality restored after attending the healing session.'
    };

    const saved = await createTestimonial(payload);

    assert.equal(dbPersisted, true);
    assert.equal(saved.status, 'pending', 'Must default to pending status for moderation');
    assert.equal(saved.name, 'Arun Mehta');

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(emailAttempted, true);
  });

  test('Email failure on testimonial does not fail the testimonial submission', async () => {
    let errorLogged = false;

    Testimonial.prototype.save = async function () {
      this._id = '670f5e1b2f8a1e0044444444';
      return this;
    };

    Testimonial.updateOne = async (filter, update) => {
      if (update.$set?.['notification.lastError']) {
        errorLogged = true;
      }
      return { acknowledged: true };
    };

    emailService.setTestTransporter({
      sendMail: async () => {
        throw new Error('SMTP Authentication failed');
      }
    });

    const payload = {
      name: 'Rekha Patil',
      city: 'Nagpur',
      serviceKey: 'reiki_healing_session',
      rating: 4,
      story: 'Very calming atmosphere and professional guidance.'
    };

    // Submitting testimonial must resolve with saved record
    const saved = await createTestimonial(payload);
    assert.ok(saved);
    assert.equal(saved.status, 'pending');

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorLogged, true, 'Email error recorded in DB without affecting submission outcome');
  });

  test('Missing email configuration allows enquiries and testimonials to persist without errors', async () => {
    // Unconfigure email
    env.ADMIN_NOTIFICATION_EMAIL = undefined;
    emailService.setTestTransporter(null);

    Enquiry.prototype.save = async function () {
      this._id = '670f5e1b2f8a1e0055555555';
      return this;
    };

    Testimonial.prototype.save = async function () {
      this._id = '670f5e1b2f8a1e0066666666';
      return this;
    };

    const enquiry = await createEnquiry({
      type: 'contact',
      name: 'No Email Config User',
      phone: '9876543210',
      location: 'online'
    });
    assert.ok(enquiry);
    assert.equal(enquiry.name, 'No Email Config User');

    const testimonial = await createTestimonial({
      name: 'No Email Config Testimonial',
      city: 'Pune',
      serviceKey: 'reiki_healing_session',
      rating: 5,
      story: 'Wonderful experience with online distance reiki healing.'
    });
    assert.ok(testimonial);
    assert.equal(testimonial.name, 'No Email Config Testimonial');
  });
});
