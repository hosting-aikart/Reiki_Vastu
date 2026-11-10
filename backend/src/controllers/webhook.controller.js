import { handleWebhook, WebhookError } from '../services/webhook.service.js';
import logger from '../utils/logger.js';

/**
 * POST /api/payments/webhook, called by Razorpay's servers, not by browsers.
 *
 * Razorpay waits 5 seconds for a 2xx. Anything else (or a timeout) counts as
 * a failure and the event is sent again later.
 */
export async function receiveWebhook(req, res) {
  try {
    const result = await handleWebhook({
      rawBody: req.body, // a Buffer: see the express.raw() mount in app.js
      signature: req.get('x-razorpay-signature'),
      eventId: req.get('x-razorpay-event-id')
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof WebhookError) {
      return res.status(err.statusCode).json({
        success: false,
        error: { code: err.code, message: err.message }
      });
    }

    // Unexpected, e.g. database unavailable: 500 so Razorpay retries
    logger.error('Webhook processing failed; Razorpay will retry:', err);
    res.status(500).json({
      success: false,
      error: { code: 'WEBHOOK_PROCESSING_FAILED', message: 'Webhook processing failed.' }
    });
  }
}

export default {
  receiveWebhook
};
