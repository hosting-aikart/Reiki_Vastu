// ─────────────────────────────────────────────────────────────
// DEVELOPMENT PLACEHOLDER CATALOG. NOT REAL PRODUCTS OR PRICES.
//
// These entries exist only to exercise the Razorpay Test Mode flow.
// To go live with real products, replace this array with information
// supplied by the business.
//
// This file is the only authority on price. The browser sends a
// product id and quantity; the amount is always calculated here.
//
// Money is stored as integer paise (₹100.00 = 10000), which avoids
// decimal rounding errors and matches what Razorpay expects.
// Keep `id` stable once payment records refer to it.
// ─────────────────────────────────────────────────────────────

export const CURRENCY = 'INR';

/** Razorpay rejects orders below INR 1.00. */
export const MIN_ORDER_PAISE = 100;

/** Upper limit for any product, applied by request validation. */
export const MAX_QUANTITY = 10;

export const PRODUCTS = [
  {
    id: 'placeholder-product-a',
    name: '[TEST] Placeholder Product A',
    description: 'Development placeholder. Not a real product.',
    unitPricePaise: 10000, // ₹100.00 dummy price
    maxQuantity: 5,
    available: true,
    isPlaceholder: true
  },
  {
    id: 'placeholder-product-b',
    name: '[TEST] Placeholder Product B',
    description: 'Development placeholder. Not a real product.',
    unitPricePaise: 25050, // ₹250.50 dummy price (shows paise handling)
    maxQuantity: 3,
    available: true,
    isPlaceholder: true
  },
  {
    id: 'placeholder-product-c',
    name: '[TEST] Placeholder Product C (Unavailable)',
    description: 'Development placeholder used to test the unavailable state.',
    unitPricePaise: 5000, // ₹50.00 dummy price
    maxQuantity: 5,
    available: false,
    isPlaceholder: true
  }
];

// A bad catalog edit should stop the server, not reach a customer.
for (const product of PRODUCTS) {
  if (!Number.isInteger(product.unitPricePaise) || product.unitPricePaise < MIN_ORDER_PAISE) {
    throw new Error(`Invalid unitPricePaise for product "${product.id}": must be an integer of at least ${MIN_ORDER_PAISE}.`);
  }
  if (!Number.isInteger(product.maxQuantity) || product.maxQuantity < 1 || product.maxQuantity > MAX_QUANTITY) {
    throw new Error(`Invalid maxQuantity for product "${product.id}": must be an integer from 1 to ${MAX_QUANTITY}.`);
  }
}

export function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId) || null;
}

export default {
  CURRENCY,
  MIN_ORDER_PAISE,
  MAX_QUANTITY,
  PRODUCTS,
  findProduct
};
