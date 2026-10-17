import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  formatISTDateTime,
  buildEnquiryEmailData,
  buildTestimonialEmailData,
  sendAdminEnquiryNotification,
  sendAdminTestimonialNotification,
  setTestTransporter
} from '../src/services/email.service.js';
import env, { isEmailConfigured } from '../src/config/env.js';

describe('Email Notification Service', () => {
  let originalDashboardUrl;
  let originalAdminEmail;

  beforeEach(() => {
    originalDashboardUrl = env.ADMIN_DASHBOARD_URL;
    originalAdminEmail = env.ADMIN_NOTIFICATION_EMAIL;
  });

  afterEach(() => {
    env.ADMIN_DASHBOARD_URL = originalDashboardUrl;
    env.ADMIN_NOTIFICATION_EMAIL = originalAdminEmail;
    setTestTransporter(null);
  });

  describe('1. HTML Sanitization and Escaping', () => {
    test('strictly escapes HTML special characters to prevent executable HTML or XSS injection', () => {
      const maliciousInput = '<script>alert("pwned")</script> & "quotes" \'apostrophe\' <img src=x onerror=alert(1)>';
      const escaped = escapeHtml(maliciousInput);

      assert.ok(!escaped.includes('<script>'), 'Must not contain unescaped script tag');
      assert.ok(!escaped.includes('<img'), 'Must not contain unescaped img tag');
      assert.ok(escaped.includes('&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt;'));
      assert.ok(escaped.includes('&amp;'));
      assert.ok(escaped.includes('&#039;apostrophe&#039;'));
    });

    test('handles null, undefined, and non-string values gracefully', () => {
      assert.equal(escapeHtml(null), '');
      assert.equal(escapeHtml(undefined), '');
      assert.equal(escapeHtml(12345), '12345');
    });
  });

  describe('2. IST Timezone Formatting', () => {
    test('formats timestamp in Asia/Kolkata timezone with IST label', () => {
      const fixedDate = new Date('2026-10-16T12:00:00.000Z');
      const formatted = formatISTDateTime(fixedDate);

      assert.ok(formatted.includes('IST (Asia/Kolkata)'), 'Should explicitly label IST timezone');
      // 12:00 UTC is 17:30 IST
      assert.ok(formatted.includes('5:30') || formatted.includes('17:30'), 'Should calculate correct IST hour offset');
    });
  });

  describe('3. Enquiry Notification Content Composition', () => {
    test('generates accurate content for a Contact Enquiry', () => {
      env.ADMIN_DASHBOARD_URL = 'http://localhost:5173';

      const enquiry = {
        reference: 'RVW-20261016-1234',
        type: 'contact',
        name: 'Rohan Deshmukh',
        phone: '9876543210',
        email: 'rohan@example.com',
        location: 'nagpur',
        message: 'Interested in learning more about your healing sessions.',
        createdAt: new Date('2026-10-16T10:00:00Z')
      };

      const { subject, html, text } = buildEnquiryEmailData(enquiry);

      assert.ok(subject.includes('RVW-20261016-1234'), 'Subject should contain reference');
      assert.ok(subject.includes('Rohan Deshmukh'), 'Subject should contain submitter name');
      assert.ok(text.includes('General Contact Enquiry'), 'Text should display enquiry type');
      assert.ok(text.includes('9876543210'), 'Text should include phone number');
      assert.ok(text.includes('rohan@example.com'), 'Text should include email');
      assert.ok(text.includes('Nagpur Center (Mahal)'), 'Text should resolve location label');
      assert.ok(text.includes('Interested in learning more'), 'Text should include user message');
      assert.ok(text.includes('http://localhost:5173/admin'), 'Text should include admin dashboard link when configured');
      assert.ok(html.includes('http://localhost:5173/admin'), 'HTML should include admin dashboard button when configured');
    });

    test('generates accurate content for a Consultation Request with service and slot', () => {
      env.ADMIN_DASHBOARD_URL = undefined;

      const consultation = {
        reference: 'RVW-20261016-5678',
        type: 'consultation',
        name: 'Sunita Sharma',
        phone: '9123456780',
        email: null,
        location: 'amravati',
        serviceKey: 'residential_vaastu_audit',
        preferredDate: '2026-10-25',
        preferredSlot: '10:00',
        message: 'Looking for home audit in Walcut Compound area.',
        createdAt: new Date('2026-10-16T11:00:00Z')
      };

      const { subject, html, text } = buildEnquiryEmailData(consultation);

      assert.ok(subject.includes('CONSULTATION'), 'Subject should indicate consultation');
      assert.ok(text.includes('Residential Home Vaastu Audit'), 'Text should resolve consultation service label');
      assert.ok(text.includes('2026-10-25'), 'Text should show preferred date');
      assert.ok(text.includes('10:00 AM (Morning)'), 'Text should show preferred slot label');
      assert.ok(!text.includes('Admin Dashboard:'), 'Text should omit dashboard link when not configured');
      assert.ok(!html.includes('Open Admin Dashboard'), 'HTML should omit dashboard link when not configured');
    });

    test('generates accurate content for a Course Enrolment Enquiry', () => {
      const courseEnquiry = {
        reference: 'RVW-20261016-9999',
        type: 'course',
        name: 'Amit Verma',
        phone: '9888877777',
        email: 'amit@example.com',
        location: 'online',
        courseId: 'reiki',
        preferredDate: '2026-11-01',
        preferredSlot: '16:30',
        message: 'Need syllabus details for Reiki Level 1 & 2',
        createdAt: new Date('2026-10-16T12:00:00Z')
      };

      const { subject, text } = buildEnquiryEmailData(courseEnquiry);

      assert.ok(subject.includes('COURSE'), 'Subject should indicate course enrolment');
      assert.ok(text.includes('Course Interested: Reiki'), 'Text should show resolved course label');
      assert.ok(text.includes('Online Video Consultation'), 'Text should resolve online location');
    });

    test('safely encodes untrusted enquiry contents in HTML output', () => {
      const xssEnquiry = {
        reference: 'RVW-XSS-001',
        type: 'contact',
        name: '<b onmouseover=alert(1)>Hacker</b>',
        phone: '9999999999',
        email: 'hacker@test.com',
        location: 'amravati',
        message: '<script>document.cookie</script>',
        createdAt: new Date()
      };

      const { html } = buildEnquiryEmailData(xssEnquiry);

      assert.ok(!html.includes('<script>'), 'HTML must not include unescaped script tag');
      assert.ok(!html.includes('<b onmouseover'), 'HTML must not include unescaped bold tag with event handler');
      assert.ok(html.includes('&lt;script&gt;document.cookie&lt;/script&gt;'));
      assert.ok(html.includes('&lt;b onmouseover=alert(1)&gt;Hacker&lt;/b&gt;'));
    });
  });

  describe('4. Testimonial Notification Content Composition', () => {
    test('generates accurate content and clearly flags PENDING MODERATION', () => {
      env.ADMIN_DASHBOARD_URL = 'http://localhost:5173';

      const testimonial = {
        _id: '670f5e1b2f8a1e0012345678',
        name: 'Pooja Kulkarni',
        city: 'Pune',
        serviceKey: 'reiki_healing_session',
        rating: 5,
        story: 'Experiencing remarkable relief from chronic fatigue after 3 healing sessions with Dr. Naresh.',
        status: 'pending',
        createdAt: new Date('2026-10-16T09:30:00Z')
      };

      const { subject, html, text } = buildTestimonialEmailData(testimonial);

      assert.ok(subject.includes('Pending Moderation'), 'Subject must state pending moderation');
      assert.ok(subject.includes('Pooja Kulkarni (Pune)'), 'Subject must include author and city');
      assert.ok(text.includes('PENDING MODERATION'), 'Text must prominently display PENDING MODERATION');
      assert.ok(text.includes('NOT been automatically approved'), 'Text must emphasize that approval is required');
      assert.ok(text.includes('★★★★★ (5/5)'), 'Text must show star rating');
      assert.ok(text.includes('Reiki Healing Session'), 'Text must resolve service label');
      assert.ok(text.includes('Pooja Kulkarni'), 'Text must include submitter name');
      assert.ok(text.includes('Pune'), 'Text must include submitter city');
      assert.ok(text.includes('http://localhost:5173/admin'), 'Text must include dashboard link when configured');
      assert.ok(html.includes('PENDING MODERATION'), 'HTML must display pending badge');
      assert.ok(html.includes('http://localhost:5173/admin'), 'HTML must include dashboard button');
    });

    test('safely encodes untrusted testimonial contents in HTML output', () => {
      const xssTestimonial = {
        _id: '670f5e1b2f8a1e0099999999',
        name: '<script>evil()</script>',
        city: '<img src=x onerror=evil()>',
        serviceKey: 'reiki_healing_session',
        rating: 4,
        story: '<svg onload=alert(1)>Miracle healing!</svg>',
        status: 'pending',
        createdAt: new Date()
      };

      const { html } = buildTestimonialEmailData(xssTestimonial);

      assert.ok(!html.includes('<script>evil()</script>'), 'Must not render unescaped script tag');
      assert.ok(!html.includes('<img src=x'), 'Must not render unescaped img tag');
      assert.ok(!html.includes('<svg onload'), 'Must not render unescaped svg tag');
      assert.ok(html.includes('&lt;script&gt;evil()&lt;/script&gt;'));
      assert.ok(html.includes('&lt;svg onload=alert(1)&gt;Miracle healing!&lt;/svg&gt;'));
    });
  });

  describe('5. Missing / Placeholder SMTP Configuration Tolerance', () => {
    test('skips dispatch safely without throwing when recipient is missing or placeholder host is used', async () => {
      env.ADMIN_NOTIFICATION_EMAIL = undefined;
      setTestTransporter(null);

      const enquiry = {
        reference: 'RVW-TEST-001',
        type: 'contact',
        name: 'Test Visitor',
        phone: '9876543210',
        location: 'amravati'
      };

      const result = await sendAdminEnquiryNotification(enquiry);
      assert.deepEqual(result, { sent: false, skipped: true });
    });

    test('isEmailConfigured correctly detects unconfigured or example placeholder settings', () => {
      // In development placeholder mode, host is 'smtp.example.com'
      const configured = isEmailConfigured();
      assert.equal(configured, false, 'Default placeholder smtp.example.com must evaluate to false');
    });
  });

  describe('6. Mocked Email Dispatch and Failure Isolation', () => {
    test('successfully dispatches enquiry notification with mock transporter', async () => {
      env.ADMIN_NOTIFICATION_EMAIL = 'owner@reikivaastuworld.com';

      let sentMailArgs = null;
      const mockTransporter = {
        sendMail: async (args) => {
          sentMailArgs = args;
          return { messageId: 'msg-12345' };
        }
      };

      setTestTransporter(mockTransporter);

      const enquiry = {
        reference: 'RVW-MOCK-001',
        type: 'consultation',
        name: 'Kavita Joshi',
        phone: '9876501234',
        email: 'kavita@example.com',
        location: 'amravati',
        serviceKey: 'residential_vaastu_audit',
        preferredDate: '2026-10-30',
        preferredSlot: '12:30',
        message: 'Looking forward to consultation.'
      };

      const result = await sendAdminEnquiryNotification(enquiry);

      assert.deepEqual(result, { sent: true });
      assert.ok(sentMailArgs !== null);
      assert.equal(sentMailArgs.to, 'owner@reikivaastuworld.com');
      assert.ok(sentMailArgs.subject.includes('RVW-MOCK-001'));
      assert.ok(sentMailArgs.text.includes('Kavita Joshi'));
      assert.ok(sentMailArgs.html.includes('Kavita Joshi'));
    });

    test('successfully dispatches testimonial notification with mock transporter', async () => {
      env.ADMIN_NOTIFICATION_EMAIL = 'owner@reikivaastuworld.com';

      let sentMailArgs = null;
      const mockTransporter = {
        sendMail: async (args) => {
          sentMailArgs = args;
          return { messageId: 'msg-test-67890' };
        }
      };

      setTestTransporter(mockTransporter);

      const testimonial = {
        _id: '670f5e1b2f8a1e00aabbccdd',
        name: 'Ganesh Shinde',
        city: 'Nagpur',
        serviceKey: 'residential_vaastu_audit',
        rating: 5,
        story: 'Exceptional guidance on commercial vaastu.',
        status: 'pending'
      };

      const result = await sendAdminTestimonialNotification(testimonial);

      assert.deepEqual(result, { sent: true });
      assert.ok(sentMailArgs !== null);
      assert.equal(sentMailArgs.to, 'owner@reikivaastuworld.com');
      assert.ok(sentMailArgs.subject.includes('Pending Moderation'));
      assert.ok(sentMailArgs.text.includes('Ganesh Shinde'));
      assert.ok(sentMailArgs.text.includes('Nagpur'));
    });

    test('safely catches and isolates SMTP connection/provider error without throwing', async () => {
      env.ADMIN_NOTIFICATION_EMAIL = 'owner@reikivaastuworld.com';

      const mockFailingTransporter = {
        sendMail: async () => {
          throw new Error('ETIMEDOUT: Connection to smtp.provider.com:587 timed out');
        }
      };

      setTestTransporter(mockFailingTransporter);

      const enquiry = {
        reference: 'RVW-FAIL-001',
        type: 'contact',
        name: 'Test Fail',
        phone: '9876543210',
        location: 'amravati'
      };

      const result = await sendAdminEnquiryNotification(enquiry);

      assert.equal(result.sent, false);
      assert.ok(result.error.includes('ETIMEDOUT'), 'Should return safe error message');
    });
  });
});
