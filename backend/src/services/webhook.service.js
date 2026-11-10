import crypto from 'crypto';
import env from '../config/env.js';
import Payment from '../models/Payment.js';
import WebhookEvent from '../models/WebhookEvent.js';
import { applyRazorpayPayments } from './paymentConfirmation.service.js';
import { isValidSignature } from '../utils/razorpaySignature.js';
import logger from '../utils/logger.js';

const DUPLICATE_KEY_ERROR = 11000;

// The events this site acts on. Anything else is acknowledged and ignored.
const HANDLED_EVENTS = ['payment.captured', 'payment.failed', 'order.paid'];

/**
 * An outcome that maps to an HTTP status. 4xx tells Razorpay "this will never
 * succeed"; 5xx tells it "try again later", which it does for up to 24 hours.
 */
export class WebhookError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'WebhookError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function isWebhookConfigured() {
  return Boolean(env.RAZORPAY_WEBHOOK_SECRET);
}

function parseEvent(rawBody) {
  try {
    const body = JSON.parse(rawBody.toString('utf8'));
    if (typeof body?.event !== 'string') throw new Error('missing event');
    return body;
  } catch {
    throw new WebhookError(400, 'WEBHOOK_MALFORMED', 'Malformed webhook payload.');
  }
}

async function recordEvent(fields) {
  try {
    await WebhookEvent.create(fields);
  } catch (err) {
    // A concurrent delivery of the same event recorded it first: that's fine
    if (err.code !== DUPLICATE_KEY_ERROR) throw err;
  }
}

/**
 * Handles one webhook delivery.
 *
 * Order of work matters:
 * 1. Verify the signature over the exact raw bytes received.
 * 2. Skip the event if it was already handled.
 * 3. Apply it to the payment. This is idempotent (atomic conditional
 *    transitions), so even a duplicate that slips past step 2 is harmless.
 * 4. Only then record it as handled.
 *
 * Recording before applying would be wrong: a crash between the two would
 * leave the event marked as handled, and Razorpay's retry would be skipped,
 * losing the update for good.
 *
 * Returns { outcome: 'processed' | 'ignored' | 'duplicate', reason? }.
 */
export async function handleWebhook({ rawBody, signature, eventId }) {
  if (!isWebhookConfigured()) {
    // 5xx so Razorpay keeps retrying until the secret is configured
    logger.error('Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.');
    throw new WebhookError(503, 'WEBHOOK_UNCONFIGURED', 'Webhook processing is not configured.');
  }

  if (!Buffer.isBuffer(rawBody) || !isValidSignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET)) {
    logger.warn('Rejected webhook with a missing or invalid signature.');
    throw new WebhookError(400, 'WEBHOOK_SIGNATURE_INVALID', 'Invalid webhook signature.');
  }

  const body = parseEvent(rawBody);

  // Razorpay sends this header with every delivery. If it were ever missing, the
  // hash of the signed body still identifies a redelivery of the same event.
  const dedupeId = eventId || `sha256:${crypto.createHash('sha256').update(rawBody).digest('hex')}`;

  if (await WebhookEvent.exists({ eventId: dedupeId })) {
    logger.info(`Duplicate webhook ${dedupeId} [${body.event}] skipped.`);
    return { outcome: 'duplicate' };
  }

  const paymentEntity = body.payload?.payment?.entity || null;
  const orderId = paymentEntity?.order_id || body.payload?.order?.entity?.id || null;
  const base = {
    eventId: dedupeId,
    event: body.event,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentEntity?.id || null
  };

  if (!HANDLED_EVENTS.includes(body.event)) {
    await recordEvent({ ...base, outcome: 'ignored', reason: 'Event type not handled' });
    return { outcome: 'ignored', reason: 'Event type not handled' };
  }

  if (!paymentEntity || !orderId) {
    await recordEvent({ ...base, outcome: 'ignored', reason: 'No payment entity in payload' });
    return { outcome: 'ignored', reason: 'No payment entity in payload' };
  }

  const payment = await Payment.findOne({ razorpayOrderId: orderId });
  if (!payment) {
    // e.g. a payment made from another integration on the same Razorpay account
    await recordEvent({ ...base, outcome: 'ignored', reason: 'No matching payment record' });
    return { outcome: 'ignored', reason: 'No matching payment record' };
  }

  // The entity came in a body signed by Razorpay, so it can be trusted as-is.
  // applyRazorpayPayments still checks amount, currency and order before PAID.
  const updated = await applyRazorpayPayments(payment, [paymentEntity], 'webhook');

  await recordEvent({ ...base, outcome: 'processed' });
  logger.info(`Webhook ${dedupeId} [${body.event}] processed for ${payment.reference}: now ${updated?.status}.`);

  return { outcome: 'processed' };
}

export default {
  handleWebhook,
  isWebhookConfigured,
  WebhookError
};
