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

import mongoose from 'mongoose';
import { PRODUCTS as SHARED_PRODUCTS, PRODUCT_CURRENCY, PRICES_CONFIRMED } from '@reiki-vastu/shared/products.js';
import ProductPrice from '../models/ProductPrice.js';

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
  image: product.image,
  unitPricePaise: product.pricePaise,
  originalPricePaise: product.originalPricePaise ?? null,
  defaultUnitPricePaise: product.pricePaise,
  defaultOriginalPricePaise: product.originalPricePaise ?? null,
  defaultAvailable: product.available,
  maxQuantity: product.maxQuantity,
  available: product.available,
  isPlaceholder: false,
  updatedAt: null
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

export function applyProductOverride(productId, override) {
  const product = findProduct(productId);
  if (!product) return null;
  if (typeof override.unitPricePaise === 'number') {
    product.unitPricePaise = override.unitPricePaise;
  }
  if (override.originalPricePaise !== undefined) {
    product.originalPricePaise = override.originalPricePaise;
  }
  if (typeof override.available === 'boolean') {
    product.available = override.available;
  }
  product.updatedAt = override.updatedAt || new Date();
  return product;
}

export function resetProductToDefault(productId) {
  const product = findProduct(productId);
  if (!product) return null;
  product.unitPricePaise = product.defaultUnitPricePaise;
  product.originalPricePaise = product.defaultOriginalPricePaise;
  product.available = product.defaultAvailable;
  product.updatedAt = null;
  return product;
}

export async function syncProductPricesFromDB() {
  if (mongoose.connection.readyState !== 1) return PRODUCTS;
  try {
    const overrides = await ProductPrice.find().lean();
    for (const override of overrides) {
      applyProductOverride(override.productId, override);
    }
  } catch {
    // Fallback to in-memory catalog if DB read fails transiently
  }
  return PRODUCTS;
}

export default {
  CURRENCY,
  PRICES_CONFIRMED,
  MIN_ORDER_PAISE,
  MAX_QUANTITY,
  PRODUCTS,
  findProduct,
  applyProductOverride,
  resetProductToDefault,
  syncProductPricesFromDB
};
