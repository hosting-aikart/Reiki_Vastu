import crypto from 'crypto';

/**
 * HMAC-SHA256 of `payload`, keyed with `secret`, as a lowercase hex string.
 * Only someone who knows the secret can produce the right value for a payload.
 */
export function computeSignature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Compares a received signature with the one we compute ourselves.
 *
 * timingSafeEqual takes the same time however many leading characters match.
 * A plain `===` stops at the first difference, so an attacker measuring
 * response times could, in principle, discover a valid signature piece by piece.
 */
export function isValidSignature(payload, receivedSignature, secret) {
  if (typeof receivedSignature !== 'string' || !secret) {
    return false;
  }

  const expected = Buffer.from(computeSignature(payload, secret), 'hex');
  const received = Buffer.from(receivedSignature, 'hex');

  // timingSafeEqual throws on different lengths; a wrong length is simply invalid
  if (received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

/**
 * The Checkout signature, per Razorpay's documented formula:
 * HMAC_SHA256(order_id + "|" + razorpay_payment_id, key_secret)
 */
export function isValidCheckoutSignature({ orderId, paymentId, signature, keySecret }) {
  return isValidSignature(`${orderId}|${paymentId}`, signature, keySecret);
}

export default {
  computeSignature,
  isValidSignature,
  isValidCheckoutSignature
};
