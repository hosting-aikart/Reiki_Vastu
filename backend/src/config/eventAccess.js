// ─────────────────────────────────────────────────────────────
// What a customer receives after a VERIFIED, PAID event registration.
//
// Kept on the server on purpose: these links are never part of the website's
// code, so they cannot be found by reading the page source or by opening a
// payment page manually. The payment status endpoint includes them only once
// the payment is PAID (confirmed with Razorpay's signature, webhook or a
// direct check with Razorpay).
//
// Each event can have its own group link, set in the admin panel
// (Admin → Events). Events without one use DEFAULT_EVENT_WHATSAPP_GROUP_URL.
// Products never get a group link.
// ─────────────────────────────────────────────────────────────

import { DEFAULT_EVENT_WHATSAPP_GROUP_URL } from '@reiki-vastu/shared/events.js';
import { PAYMENT_STATUS } from '../models/Payment.js';
import { findCatalogEntry } from './products.js';

/** The joining details for a payment, or null unless it is a PAID event registration. */
export function eventAccessFor(payment) {
  if (payment?.status !== PAYMENT_STATUS.PAID) return null;
  const entry = findCatalogEntry(payment.product?.id);
  if (!entry?.isEvent) return null;
  return { whatsappGroupUrl: entry.whatsappGroupUrl || DEFAULT_EVENT_WHATSAPP_GROUP_URL };
}

export default { eventAccessFor };
