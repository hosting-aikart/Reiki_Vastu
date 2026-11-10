// ─────────────────────────────────────────────────────────────
// The backend's view of the product catalog.
//
// Products and prices come from shared/products.js, the same file the
// frontend displays. This module is the only place the server looks up a
// price: the browser sends a product id and quantity, never an amount.
//
// ⚠️ Prices there are PROVISIONAL until the business confirms them
// (PRICES_CONFIRMED). Payments are Test Mode only in any case.
// ─────────────────────────────────────────────────────────────

import { PRODUCTS as SHARED_PRODUCTS, PRODUCT_CURRENCY, PRICES_CONFIRMED } from '@reiki-vastu/shared/products.js';

export const CURRENCY = PRODUCT_CURRENCY;
export { PRICES_CONFIRMED };

/** Razorpay rejects orders below INR 1.00. */
export const MIN_ORDER_PAISE = 100;

/** Upper limit for any product, applied by request validation. */
export const MAX_QUANTITY = 10;

export const PRODUCTS = SHARED_PRODUCTS.map((product) => ({
  id: product.id,
  name: product.title,
  description: product.subtitle,
  unitPricePaise: product.pricePaise,
  maxQuantity: product.maxQuantity,
  available: product.available,
  isPlaceholder: false
}));

// A bad catalog edit should stop the server, not reach a customer.
for (const product of PRODUCTS) {
  if (!Number.isInteger(product.unitPricePaise) || product.unitPricePaise < MIN_ORDER_PAISE) {
    throw new Error(`Invalid pricePaise for product "${product.id}": must be an integer of at least ${MIN_ORDER_PAISE}.`);
  }
  if (!Number.isInteger(product.maxQuantity) || product.maxQuantity < 1 || product.maxQuantity > MAX_QUANTITY) {
    throw new Error(`Invalid maxQuantity for product "${product.id}": must be an integer from 1 to ${MAX_QUANTITY}.`);
  }
}
if (new Set(PRODUCTS.map((product) => product.id)).size !== PRODUCTS.length) {
  throw new Error('Product ids in shared/products.js must be unique.');
}

export function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId) || null;
}

export default {
  CURRENCY,
  PRICES_CONFIRMED,
  MIN_ORDER_PAISE,
  MAX_QUANTITY,
  PRODUCTS,
  findProduct
};
