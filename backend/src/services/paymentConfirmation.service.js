import env, { isPaymentConfigured } from '../config/env.js';
import Payment, { PAYMENT_STATUS } from '../models/Payment.js';
import { fetchOrderPayments, RazorpayError } from './razorpay.service.js';
import { PaymentError } from './payment.service.js';
import { isValidCheckoutSignature } from '../utils/razorpaySignature.js';
import logger from '../utils/logger.js';

// How often a single payment may be re-checked with Razorpay via the status endpoint
const RECONCILE_INTERVAL_MS = 10000;

// Nothing Razorpay reports can change these
const FINAL_STATUSES = [PAYMENT_STATUS.PAID, PAYMENT_STATUS.ORDER_FAILED];

/**
 * What anyone holding the status token may see. Deliberately excludes customer
 * contact details, Razorpay ids and internal fields.
 */
export function toPublicStatus(payment) {
  return {
    reference: payment.reference,
    status: payment.status,
    product: {
      id: payment.product.id,
      name: payment.product.name,
      unitPricePaise: payment.product.unitPricePaise,
      isPlaceholder: payment.product.isPlaceholder
    },
    quantity: payment.quantity,
    amountPaise: payment.amountPaise,
    currency: payment.currency,
    paidAt: payment.paidAt,
    failure:
      payment.status === PAYMENT_STATUS.FAILED
        ? { description: payment.failure?.description || null }
        : null
  };
}

async function findByStatusToken(statusToken) {
  const payment = await Payment.findOne({ statusToken });
  if (!payment) {
    throw new PaymentError(404, 'PAYMENT_NOT_FOUND', 'Payment not found.');
  }
  return payment;
}

function matchesRecord(payment, razorpayPayment) {
  return (
    razorpayPayment.order_id === payment.razorpayOrderId &&
    razorpayPayment.amount === payment.amountPaise &&
    razorpayPayment.currency === payment.currency
  );
}

/**
 * Updates our record from Razorpay's list of attempts on the order.
 *
 * - Any captured attempt (with matching amount, currency and order) -> PAID
 * - Otherwise an authorized attempt -> PENDING (money held, capture expected)
 * - Otherwise, if the latest attempt failed -> FAILED
 * - No attempts at all -> unchanged. A missing payment is NOT a failure:
 *   the customer may still be paying, or a UPI approval may still arrive.
 *
 * Every write is an atomic conditional transition, so the callback, status
 * checks and webhooks can all run this concurrently and the result is the same.
 */
export async function applyRazorpayPayments(payment, attempts, confirmedVia) {
  const reload = () => Payment.findById(payment._id);

  const captured = attempts.find((attempt) => attempt.status === 'captured');
  if (captured) {
    if (!matchesRecord(payment, captured)) {
      logger.error(
        `Payment ${payment.reference}: captured payment ${captured.id} does not match the record. Not marking PAID; flagged for review.`
      );
      await Payment.updateOne(
        { _id: payment._id },
        {
          $set: {
            review: {
              required: true,
              reason: `Captured payment ${captured.id} does not match the expected amount, currency or order.`
            }
          }
        }
      );
      return reload();
    }

    const updated = await Payment.transition(payment._id, PAYMENT_STATUS.PAID, {
      razorpayPaymentId: captured.id,
      paidAt: new Date(),
      confirmedVia,
      customer: { email: captured.email || null, contact: captured.contact || null }
    });
    if (updated) {
      logger.info(`Payment confirmed PAID: ${updated.reference} [${captured.id}] via ${confirmedVia}`);
    }
    return updated || reload();
  }

  const authorized = attempts.find((attempt) => attempt.status === 'authorized');
  if (authorized) {
    // A retry was authorized after an earlier failure: back to "waiting for capture"
    const updated = await Payment.transition(payment._id, PAYMENT_STATUS.PENDING, {
      razorpayPaymentId: authorized.id
    });
    return updated || reload();
  }

  const latest = [...attempts].sort((a, b) => b.created_at - a.created_at)[0];
  if (latest?.status === 'failed') {
    const updated = await Payment.transition(payment._id, PAYMENT_STATUS.FAILED, {
      razorpayPaymentId: latest.id,
      failedAt: new Date(),
      failure: { code: latest.error_code || null, description: latest.error_description || null }
    });
    return updated || reload();
  }

  return payment;
}

/**
 * Asks Razorpay what happened to this payment's order and updates our record.
 * Throws RazorpayError if Razorpay cannot be reached.
 */
export async function reconcilePayment(payment, confirmedVia) {
  if (FINAL_STATUSES.includes(payment.status) || !payment.razorpayOrderId) {
    return payment;
  }
  const attempts = await fetchOrderPayments(payment.razorpayOrderId);
  return applyRazorpayPayments(payment, attempts, confirmedVia);
}

/**
 * Handles the Checkout success callback forwarded by the browser.
 *
 * 1. Check the signature. Only Razorpay, which knows our key secret, can
 *    produce a valid one, so this proves the callback was not fabricated.
 * 2. Ask Razorpay for the order's payments. A valid signature proves the
 *    payment was authenticated, not that the money was captured, so the
 *    PAID decision comes from Razorpay's own record.
 *
 * Returns { payment, confirmationDelayed }. confirmationDelayed is true if the
 * signature was valid but Razorpay could not be reached to confirm capture.
 */
export async function verifyCheckoutPayment({ statusToken, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!isPaymentConfigured()) {
    throw new PaymentError(503, 'PAYMENTS_UNCONFIGURED', 'Online payments are not available at the moment.');
  }

  const payment = await findByStatusToken(statusToken);

  // The signature is checked against OUR stored order id, never the one the browser sent.
  // Comparing them first just gives a clearer log message for a mismatch.
  const valid =
    Boolean(payment.razorpayOrderId) &&
    razorpay_order_id === payment.razorpayOrderId &&
    isValidCheckoutSignature({
      orderId: payment.razorpayOrderId,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      keySecret: env.RAZORPAY_KEY_SECRET
    });

  if (!valid) {
    // Do not mark FAILED: anyone with the status token could otherwise fail a real payment
    logger.warn(`Rejected Checkout callback with an invalid signature for ${payment.reference}.`);
    throw new PaymentError(400, 'SIGNATURE_INVALID', 'Payment verification failed.');
  }

  await Payment.updateOne(
    { _id: payment._id, 'verification.signatureVerified': false },
    {
      $set: {
        'verification.signatureVerified': true,
        'verification.verifiedAt': new Date(),
        'verification.paymentId': razorpay_payment_id
      }
    }
  );

  try {
    const current = await reconcilePayment(payment, 'checkout');
    return { payment: toPublicStatus(current), confirmationDelayed: false };
  } catch (err) {
    if (!(err instanceof RazorpayError)) {
      throw err;
    }
    // The signature was valid, so the payment is probably fine; the status endpoint and webhooks will confirm it
    logger.error(`Could not confirm ${payment.reference} with Razorpay [${err.code}]:`, err);
    const current = await Payment.findById(payment._id);
    return { payment: toPublicStatus(current), confirmationDelayed: true };
  }
}

/**
 * Returns the payment's status, first re-checking with Razorpay if it is not
 * final. This is how a payment recovers when the browser closed before the
 * callback arrived, or when confirmation failed earlier.
 */
export async function getPaymentStatus(statusToken) {
  let payment = await findByStatusToken(statusToken);

  if (!FINAL_STATUSES.includes(payment.status) && payment.razorpayOrderId && isPaymentConfigured()) {
    // Atomically claim the right to check, so frequent polling cannot flood Razorpay
    const claimed = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        $or: [{ lastReconciledAt: null }, { lastReconciledAt: { $lt: new Date(Date.now() - RECONCILE_INTERVAL_MS) } }]
      },
      { $set: { lastReconciledAt: new Date() } },
      { new: true }
    );

    if (claimed) {
      try {
        payment = await reconcilePayment(claimed, 'reconciliation');
      } catch (err) {
        if (!(err instanceof RazorpayError)) {
          throw err;
        }
        logger.warn(`Status check could not reach Razorpay for ${payment.reference} [${err.code}].`);
      }
    }
  }

  return toPublicStatus(payment);
}

export default {
  toPublicStatus,
  applyRazorpayPayments,
  reconcilePayment,
  verifyCheckoutPayment,
  getPaymentStatus
};
