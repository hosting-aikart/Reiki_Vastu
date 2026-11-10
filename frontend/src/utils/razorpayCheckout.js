/**
 * Helpers for Razorpay Standard Checkout.
 *
 * Checkout must be loaded from Razorpay's own server, never bundled or
 * self-hosted: it is the secure form where the customer types card or UPI
 * details, and those details go straight to Razorpay, not through our code.
 */

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let loadingPromise = null;

/**
 * Loads checkout.js once, on the pages that need it, instead of on every page.
 * Resolves with the window.Razorpay constructor.
 */
export function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHECKOUT_SCRIPT_URL;
      script.async = true;

      const fail = () => {
        // Forget the failed attempt so a later click can try again
        loadingPromise = null;
        script.remove();
        reject(new Error('Razorpay Checkout could not be loaded.'));
      };

      script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : fail());
      script.onerror = fail;
      document.body.appendChild(script);
    });
  }

  return loadingPromise;
}

/**
 * A random version 4 UUID identifying one checkout attempt. The server uses it
 * to recognise a repeated request and return the same order.
 *
 * crypto.randomUUID only exists on HTTPS and localhost, hence the fallback.
 */
export function generateIdempotencyKey() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const inrFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

/** Formats paise for display only (25050 -> "₹250.50"). Never used to decide what to charge. */
export function formatPaise(paise) {
  return inrFormatter.format(paise / 100);
}
