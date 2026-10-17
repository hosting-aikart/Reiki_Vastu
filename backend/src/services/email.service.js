import nodemailer from 'nodemailer';
import env, { isEmailConfigured } from '../config/env.js';
import logger from '../utils/logger.js';
import {
  labelFor,
  CONSULTATION_SERVICES,
  COURSES,
  LOCATIONS,
  STORY_SERVICES,
  TIME_SLOTS,
  BUSINESS_TIMEZONE
} from '@reiki-vastu/shared';

let activeTransporter = null;
let hasReportedUnconfigured = false;

/**
 * Escapes unsafe characters for HTML rendering to prevent HTML injection / XSS.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a Date object in IST timezone.
 */
export function formatISTDateTime(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.toLocaleString('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short'
  })} IST (${BUSINESS_TIMEZONE})`;
}

/**
 * Initializes or returns the cached nodemailer transporter.
 */
export function getTransporter() {
  if (activeTransporter) {
    return activeTransporter;
  }

  if (!isEmailConfigured()) {
    if (!hasReportedUnconfigured) {
      logger.info('Email notification transport is disabled or not configured. Submissions will be persisted without email dispatch.');
      hasReportedUnconfigured = true;
    }
    return null;
  }

  try {
    activeTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
    return activeTransporter;
  } catch (err) {
    logger.error('Failed to initialize nodemailer transporter:', err);
    return null;
  }
}

/**
 * For testing purposes: allows injecting a custom mock transporter.
 */
export function setTestTransporter(mockTransporter) {
  activeTransporter = mockTransporter;
}

/**
 * Builds HTML wrapper with the Reiki & Vaastu World visual styling.
 */
function buildEmailTemplate({ title, badge, contentRows, messageSection, dashboardUrl }) {
  const rowsHtml = contentRows
    .map(
      (row) => `
        <tr>
          <td style="padding: 9px 12px; font-weight: 600; color: #475569; width: 35%; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${escapeHtml(row.label)}</td>
          <td style="padding: 9px 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${row.isHtml ? row.value : escapeHtml(row.value)}</td>
        </tr>`
    )
    .join('');

  const messageHtml = messageSection
    ? `
      <div style="margin-top: 20px; padding: 14px 16px; background: #f8fafc; border-left: 4px solid #c59b27; border-radius: 4px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(messageSection.title)}</p>
        <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(messageSection.content)}</p>
      </div>`
    : '';

  const dashboardBtnHtml = dashboardUrl
    ? `
      <div style="margin-top: 24px; text-align: center;">
        <a href="${escapeHtml(dashboardUrl)}" style="display: inline-block; background: #0f172a; color: #f8fafc; padding: 11px 22px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; letter-spacing: 0.3px;">Open Admin Dashboard &rarr;</a>
      </div>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <!-- Header -->
    <div style="background: #0f172a; padding: 22px 24px; border-bottom: 3px solid #c59b27;">
      <p style="margin: 0 0 4px 0; color: #c59b27; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Reiki &amp; Vaastu World</p>
      <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">${escapeHtml(title)}</h1>
      ${badge ? `<span style="display: inline-block; margin-top: 8px; padding: 3px 9px; font-size: 11px; font-weight: 700; border-radius: 4px; background: ${badge.bgColor || '#334155'}; color: ${badge.textColor || '#ffffff'};">${escapeHtml(badge.text)}</span>` : ''}
    </div>

    <!-- Body -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      ${messageHtml}
      ${dashboardBtnHtml}
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
      <p style="margin: 0;">This is an automated notification from the Reiki &amp; Vaastu World website engine.</p>
      <p style="margin: 4px 0 0 0;">Persistence source of truth: MongoDB Atlas &bull; Timezone: Asia/Kolkata (IST)</p>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Builds notification subject and payload for an Enquiry submission.
 */
export function buildEnquiryEmailData(enquiry) {
  const locationLabel = labelFor(LOCATIONS, enquiry.location);
  const formattedDate = formatISTDateTime(enquiry.createdAt || new Date());
  const dashboardUrl = env.ADMIN_DASHBOARD_URL
    ? `${env.ADMIN_DASHBOARD_URL.replace(/\/$/, '')}/admin`
    : null;

  let typeHeading = 'General Contact Enquiry';
  let serviceOrCourseLabel = 'General Inquiry';
  let badgeColor = { bgColor: '#0284c7', textColor: '#ffffff', text: 'NEW ENQUIRY' };

  if (enquiry.type === 'consultation') {
    typeHeading = 'Personal Consultation Request';
    serviceOrCourseLabel = enquiry.serviceKey
      ? labelFor(CONSULTATION_SERVICES, enquiry.serviceKey)
      : 'Consultation';
    badgeColor = { bgColor: '#7c3aed', textColor: '#ffffff', text: 'CONSULTATION BOOKING' };
  } else if (enquiry.type === 'course') {
    typeHeading = 'Course Enrolment Enquiry';
    serviceOrCourseLabel = enquiry.courseId
      ? labelFor(COURSES, enquiry.courseId)
      : 'Course';
    badgeColor = { bgColor: '#b45309', textColor: '#ffffff', text: 'COURSE ENROLMENT' };
  }

  const subject = `[New Lead - ${enquiry.reference}] ${enquiry.type.toUpperCase()}: ${enquiry.name} (${locationLabel})`;

  const contentRows = [
    { label: 'Reference ID', value: enquiry.reference },
    { label: 'Submission Type', value: typeHeading },
    { label: 'Submitted At', value: formattedDate },
    { label: 'Name', value: enquiry.name },
    { label: 'Phone', value: enquiry.phone },
    { label: 'Email', value: enquiry.email || 'Not provided' },
    { label: 'Center / Mode', value: locationLabel }
  ];

  if (enquiry.type === 'consultation') {
    contentRows.push({ label: 'Requested Service', value: serviceOrCourseLabel });
    if (enquiry.preferredDate) {
      contentRows.push({ label: 'Preferred Date', value: enquiry.preferredDate });
    }
    if (enquiry.preferredSlot) {
      const slotLabel = labelFor(TIME_SLOTS, enquiry.preferredSlot);
      contentRows.push({ label: 'Preferred Time Slot', value: slotLabel });
    }
  } else if (enquiry.type === 'course') {
    contentRows.push({ label: 'Course Interested', value: serviceOrCourseLabel });
    if (enquiry.preferredDate) {
      contentRows.push({ label: 'Preferred Date / Batch', value: enquiry.preferredDate });
    }
    if (enquiry.preferredSlot) {
      contentRows.push({ label: 'Preferred Slot', value: enquiry.preferredSlot });
    }
  }

  const messageSection = enquiry.message
    ? { title: 'Visitor Note / Message', content: enquiry.message }
    : null;

  const html = buildEmailTemplate({
    title: `New Lead: ${enquiry.name}`,
    badge: badgeColor,
    contentRows,
    messageSection,
    dashboardUrl
  });

  const textLines = [
    `=== NEW SUBMISSION ON REIKI & VAASTU WORLD ===`,
    `Reference: ${enquiry.reference}`,
    `Type: ${typeHeading}`,
    `Submitted At: ${formattedDate}`,
    ``,
    `--- CONTACT DETAILS ---`,
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || 'Not provided'}`,
    `Location / Center: ${locationLabel}`,
    ``
  ];

  if (enquiry.type === 'consultation') {
    textLines.push(
      `--- CONSULTATION DETAILS ---`,
      `Service: ${serviceOrCourseLabel}`,
      enquiry.preferredDate ? `Preferred Date: ${enquiry.preferredDate}` : null,
      enquiry.preferredSlot ? `Preferred Slot: ${labelFor(TIME_SLOTS, enquiry.preferredSlot)}` : null,
      ``
    );
  } else if (enquiry.type === 'course') {
    textLines.push(
      `--- COURSE DETAILS ---`,
      `Course Interested: ${serviceOrCourseLabel}`,
      enquiry.preferredDate ? `Preferred Date: ${enquiry.preferredDate}` : null,
      enquiry.preferredSlot ? `Preferred Slot: ${enquiry.preferredSlot}` : null,
      ``
    );
  }

  if (enquiry.message) {
    textLines.push(`--- MESSAGE / QUERY ---`, enquiry.message, ``);
  }

  if (dashboardUrl) {
    textLines.push(`Admin Dashboard: ${dashboardUrl}`, ``);
  }

  const text = textLines.filter((l) => l !== null).join('\n');

  return { subject, html, text };
}

/**
 * Builds notification subject and payload for a Testimonial submission.
 */
export function buildTestimonialEmailData(testimonial) {
  const serviceLabel = labelFor(STORY_SERVICES, testimonial.serviceKey);
  const formattedDate = formatISTDateTime(testimonial.createdAt || new Date());
  const dashboardUrl = env.ADMIN_DASHBOARD_URL
    ? `${env.ADMIN_DASHBOARD_URL.replace(/\/$/, '')}/admin`
    : null;

  const stars = '★'.repeat(testimonial.rating || 5) + '☆'.repeat(Math.max(0, 5 - (testimonial.rating || 5)));
  const subject = `[New Testimonial - Pending Moderation] ${testimonial.name} (${testimonial.city})`;

  const contentRows = [
    { label: 'Submission ID', value: String(testimonial._id) },
    { label: 'Submission Type', value: 'Community Testimonial' },
    {
      label: 'Moderation Status',
      value: `<strong style="color: #b45309; background: #fef3c7; padding: 2px 6px; border-radius: 4px;">PENDING MODERATION</strong> (Not visible publicly until approved)`,
      isHtml: true
    },
    { label: 'Submitted At', value: formattedDate },
    { label: 'Author Name', value: testimonial.name },
    { label: 'City / Location', value: testimonial.city },
    { label: 'Service / Experience', value: serviceLabel },
    { label: 'Rating', value: `${stars} (${testimonial.rating}/5)` }
  ];

  const messageSection = {
    title: 'Testimonial Story',
    content: testimonial.story
  };

  const html = buildEmailTemplate({
    title: `New Testimonial: ${testimonial.name}`,
    badge: { bgColor: '#b45309', textColor: '#ffffff', text: 'PENDING MODERATION' },
    contentRows,
    messageSection,
    dashboardUrl
  });

  const textLines = [
    `=== NEW TESTIMONIAL SUBMISSION (PENDING MODERATION) ===`,
    `ID: ${testimonial._id}`,
    `Status: PENDING MODERATION (Requires admin approval in dashboard)`,
    `Submitted At: ${formattedDate}`,
    ``,
    `Author: ${testimonial.name}`,
    `City: ${testimonial.city}`,
    `Service: ${serviceLabel}`,
    `Rating: ${stars} (${testimonial.rating}/5)`,
    ``,
    `--- TESTIMONIAL STORY ---`,
    testimonial.story,
    ``,
    `NOTE: This testimonial has NOT been automatically approved and is not live.`,
    `Please log into the admin dashboard to review and approve or reject it.`
  ];

  if (dashboardUrl) {
    textLines.push(``, `Admin Dashboard: ${dashboardUrl}`);
  }

  const text = textLines.join('\n');

  return { subject, html, text };
}

/**
 * Sends an email notification for a new enquiry to the site administrator.
 *
 * Safe failure guarantee: Returns { sent, skipped?, error? } and never throws.
 */
export async function sendAdminEnquiryNotification(enquiry) {
  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL;
  const transporter = getTransporter();

  if (!adminEmail || !transporter) {
    return { sent: false, skipped: true };
  }

  const { subject, html, text } = buildEnquiryEmailData(enquiry);

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: adminEmail,
      subject,
      text,
      html
    });
    return { sent: true };
  } catch (err) {
    logger.error(`Failed to dispatch enquiry notification for ${enquiry.reference}:`, err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Sends an email notification for a newly submitted testimonial awaiting moderation.
 *
 * Safe failure guarantee: Returns { sent, skipped?, error? } and never throws.
 */
export async function sendAdminTestimonialNotification(testimonial) {
  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL;
  const transporter = getTransporter();

  if (!adminEmail || !transporter) {
    return { sent: false, skipped: true };
  }

  const { subject, html, text } = buildTestimonialEmailData(testimonial);

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: adminEmail,
      subject,
      text,
      html
    });
    return { sent: true };
  } catch (err) {
    logger.error(`Failed to dispatch testimonial notification for ID ${testimonial._id}:`, err.message);
    return { sent: false, error: err.message };
  }
}

export default {
  sendAdminEnquiryNotification,
  sendAdminTestimonialNotification,
  buildEnquiryEmailData,
  buildTestimonialEmailData,
  escapeHtml,
  formatISTDateTime,
  setTestTransporter
};
