// ─────────────────────────────────────────────────────────────
// The backend's view of everything that can be paid for: products and events.
//
// Built from shared/products.js (the website's built-in products and events),
// then updated from the database:
//   1. ProductPrice  – price changes made in the older "Pricing" screen
//   2. CatalogItem   – products and events added or edited in the admin panel
//
// This module is the only place the server looks up a price: the browser
// sends a product id and quantity, never an amount.
//
// ⚠️ Built-in prices are PROVISIONAL until the business confirms them
// (PRICES_CONFIRMED). Payments are Test Mode only in any case.
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';
import { PRODUCTS as SHARED_PRODUCTS, PRODUCT_CURRENCY, PRICES_CONFIRMED } from '@reiki-vastu/shared/products.js';
import { isEventOver } from '@reiki-vastu/shared/events.js';
import ProductPrice from '../models/ProductPrice.js';
import CatalogItem from '../models/CatalogItem.js';

export const CURRENCY = PRODUCT_CURRENCY;
export { PRICES_CONFIRMED };

/** Razorpay rejects orders below INR 1.00. */
export const MIN_ORDER_PAISE = 100;

/** Upper limit for any product, applied by request validation. */
export const MAX_QUANTITY = 10;

const isValidPrice = (paise) => Number.isInteger(paise) && paise >= MIN_ORDER_PAISE;

function baseEntry(product) {
  const forSale = product.available && product.pricePaise != null;
  return {
    id: product.id,
    name: product.title,
    description: product.subtitle,
    image: product.image,
    isEvent: Boolean(product.isEvent),
    endsAt: product.endsAt || null,
    unitPricePaise: product.pricePaise ?? null,
    originalPricePaise: product.originalPricePaise ?? null,
    defaultUnitPricePaise: product.pricePaise ?? null,
    defaultOriginalPricePaise: product.originalPricePaise ?? null,
    // A product without a confirmed price (pricePaise: null) can never be sold,
    // until an administrator sets a price for it in the admin panel.
    defaultAvailable: forSale,
    maxQuantity: product.maxQuantity,
    available: forSale,
    isPlaceholder: false,
    isBuiltIn: true,
    deleted: false,
    whatsappGroupUrl: null,
    updatedAt: null
  };
}

// The built-in catalog, never modified (used to rebuild and to reset prices)
const BASE_PRODUCTS = SHARED_PRODUCTS.map(baseEntry);

// A bad catalog edit should stop the server, not reach a customer.
for (const product of BASE_PRODUCTS) {
  const priceOnRequest = product.unitPricePaise === null;
  if (!priceOnRequest && !isValidPrice(product.unitPricePaise)) {
    throw new Error(`Invalid pricePaise for product "${product.id}": must be null (coming soon) or an integer of at least ${MIN_ORDER_PAISE}.`);
  }
  if (!Number.isInteger(product.maxQuantity) || product.maxQuantity < 1 || product.maxQuantity > MAX_QUANTITY) {
    throw new Error(`Invalid maxQuantity for product "${product.id}": must be an integer from 1 to ${MAX_QUANTITY}.`);
  }
}
if (new Set(BASE_PRODUCTS.map((product) => product.id)).size !== BASE_PRODUCTS.length) {
  throw new Error('Product ids in shared/products.js must be unique.');
}

/**
 * The live catalog. Always the same array (other modules keep a reference to
 * it); its contents are replaced each time it is refreshed from the database.
 * Deleted items stay in it with `deleted: true` so old payments still resolve,
 * but findProduct() never returns them.
 */
export const PRODUCTS = BASE_PRODUCTS.map((product) => ({ ...product }));

export function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId && !product.deleted) || null;
}

/** Like findProduct, but also finds deleted items (for payments made before the deletion). */
export function findCatalogEntry(productId) {
  return PRODUCTS.find((product) => product.id === productId) || null;
}

function applyPriceOverride(product, override) {
  if (typeof override.unitPricePaise === 'number') {
    product.unitPricePaise = override.unitPricePaise;
  }
  if (override.originalPricePaise !== undefined) {
    product.originalPricePaise = override.originalPricePaise;
  }
  if (typeof override.available === 'boolean') {
    product.available = override.available;
  }
  if (product.unitPricePaise === null) {
    product.available = false; // still no price, so still not for sale
  }
  product.updatedAt = override.updatedAt || new Date();
  return product;
}

export function applyProductOverride(productId, override) {
  const product = findProduct(productId);
  if (!product) return null;
  return applyPriceOverride(product, override);
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

/** The payable fields of a product or event saved from the admin panel. */
function entryFromCatalogItem(item, existing) {
  const data = item.data || {};
  const price = isValidPrice(data.pricePaise) ? data.pricePaise : null;
  const isEvent = item.kind === 'event';
  const maxQuantity = isEvent
    ? 1
    : Number.isInteger(data.maxQuantity) && data.maxQuantity >= 1 && data.maxQuantity <= MAX_QUANTITY
      ? data.maxQuantity
      : existing?.maxQuantity || 5;
  const open = isEvent
    ? data.registrationOpen !== false && !isEventOver(data)
    : data.available !== false;

  return {
    ...(existing || {
      defaultUnitPricePaise: null,
      defaultOriginalPricePaise: null,
      defaultAvailable: false,
      isPlaceholder: false,
      isBuiltIn: false
    }),
    id: item.itemId,
    name: data.title || existing?.name || item.itemId,
    description: (isEvent ? data.tagline : data.subtitle) || existing?.description || '',
    image: (isEvent ? data.image?.src : data.images?.[0]) || existing?.image || null,
    isEvent,
    endsAt: isEvent ? data.endsAt || null : null,
    unitPricePaise: price,
    originalPricePaise: isValidPrice(data.originalPricePaise) ? data.originalPricePaise : null,
    maxQuantity,
    available: open && price !== null && !item.deleted,
    deleted: Boolean(item.deleted),
    whatsappGroupUrl: isEvent ? item.privateData?.whatsappGroupUrl || null : null,
    updatedAt: item.updatedAt || null
  };
}

/**
 * Brings PRODUCTS up to date with the database. Called before every price
 * lookup, so a change in the admin panel applies to the very next order.
 */
export async function syncProductPricesFromDB() {
  if (mongoose.connection.readyState !== 1) return PRODUCTS;
  try {
    const [prices, items] = await Promise.all([
      ProductPrice.find().lean(),
      CatalogItem.find({ kind: { $in: ['product', 'event'] } }).sort({ createdAt: 1 }).lean()
    ]);

    const next = BASE_PRODUCTS.map((product) => ({ ...product }));
    const byId = new Map(next.map((product) => [product.id, product]));

    for (const override of prices) {
      const product = byId.get(override.productId);
      if (product) applyPriceOverride(product, override);
    }

    for (const item of items) {
      const existing = byId.get(item.itemId);
      // A built-in item deleted without ever being edited: only hide it
      if (!item.data || Object.keys(item.data).length === 0) {
        if (existing) {
          existing.deleted = Boolean(item.deleted);
          if (existing.deleted) existing.available = false;
        }
        continue;
      }
      // An id can't change kind (a product id is never reused for an event)
      if (existing && existing.isEvent !== (item.kind === 'event')) continue;
      const entry = entryFromCatalogItem(item, existing);
      if (existing) {
        Object.assign(existing, entry);
      } else {
        next.push(entry);
        byId.set(entry.id, entry);
      }
    }

    PRODUCTS.splice(0, PRODUCTS.length, ...next);
  } catch {
    // Fall back to the last known catalog if the database read fails transiently
  }
  return PRODUCTS;
}

/** Same as syncProductPricesFromDB; the catalog now holds more than prices. */
export const syncCatalogFromDB = syncProductPricesFromDB;

export default {
  CURRENCY,
  PRICES_CONFIRMED,
  MIN_ORDER_PAISE,
  MAX_QUANTITY,
  PRODUCTS,
  findProduct,
  findCatalogEntry,
  applyProductOverride,
  resetProductToDefault,
  syncProductPricesFromDB,
  syncCatalogFromDB
};
