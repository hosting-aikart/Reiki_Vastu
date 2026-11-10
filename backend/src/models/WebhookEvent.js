import mongoose from 'mongoose';

// Razorpay retries a failed delivery for up to 24 hours, so 30 days comfortably
// covers any duplicate that could still arrive. MongoDB deletes older records itself.
const RETENTION_SECONDS = 30 * 24 * 60 * 60;

/**
 * One record per webhook event we have finished handling. Razorpay delivers
 * "at least once", so the same event can arrive more than once; this ledger
 * lets us recognise a repeat and skip it.
 */
const webhookEventSchema = new mongoose.Schema({
  // From the x-razorpay-event-id header, which Razorpay documents as unique per event
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  event: { type: String, required: true }, // e.g. payment.captured
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  outcome: {
    type: String,
    required: true,
    enum: ['processed', 'ignored']
  },
  reason: { type: String, default: null }, // why it was ignored, if it was
  processedAt: {
    type: Date,
    default: Date.now,
    expires: RETENTION_SECONDS
  }
});

export const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
export default WebhookEvent;
