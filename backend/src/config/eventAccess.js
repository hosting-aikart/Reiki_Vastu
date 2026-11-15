// ─────────────────────────────────────────────────────────────
// What a customer receives after a VERIFIED, PAID event registration.
//
// Kept on the server on purpose: these links are never part of the website's
// code, so they cannot be found by reading the page source or by opening a
// payment page manually. The payment status endpoint includes them only once
// the payment is PAID (confirmed with Razorpay's signature, webhook or a
// direct check with Razorpay).
//
// Keyed by the event's product id in shared/products.js.
// ─────────────────────────────────────────────────────────────

import { PAYMENT_STATUS } from '../models/Payment.js';

export const EVENT_ACCESS = {
  'online-reiki-level-1-workshop-2026-11': {
    whatsappGroupUrl: 'https://chat.whatsapp.com/F665o8jO1Xz6tbfTEckuqE'
  }
};

/** The joining details for a payment, or null unless it is a PAID event registration. */
export function eventAccessFor(payment) {
  if (payment?.status !== PAYMENT_STATUS.PAID) return null;
  const access = EVENT_ACCESS[payment.product?.id];
  return access ? { whatsappGroupUrl: access.whatsappGroupUrl } : null;
}

export default { EVENT_ACCESS, eventAccessFor };
