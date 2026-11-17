import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS as BUILT_IN_PRODUCTS, formatPaise } from '@reiki-vastu/shared/products.js';
import { STATIC_EVENTS } from '@reiki-vastu/shared/events.js';
import { getCatalog } from '../api/catalogClient';
import { getProductImages } from '../data/productImages';
import { STATIC_COURSES } from '../data/courses';
import { toDisplayEvent, splitEvents } from '../data/events';
import { resolveMediaUrl } from './media';

// ─────────────────────────────────────────────────────────────
// The website's products, events and courses.
//
// Starts with the built-in items (so pages render immediately), then applies
// what the admin panel added, changed or deleted (GET /api/catalog):
//   - same id as a built-in item -> its fields replace the built-in ones
//   - new id                     -> added after the built-in items
//   - deleted                    -> not shown
// ─────────────────────────────────────────────────────────────

// How long the event popup waits for the latest event list before using the
// built-in one (the backend can take a while to wake up).
const READY_TIMEOUT_MS = 3500;

function merge(builtIns, overlays = []) {
  const byId = new Map((overlays || []).map((item) => [item.id, item]));
  const merged = [];
  for (const base of builtIns) {
    const overlay = byId.get(base.id);
    byId.delete(base.id);
    if (overlay?.deleted) continue;
    merged.push(overlay ? { ...base, ...overlay } : base);
  }
  for (const overlay of byId.values()) {
    if (!overlay.deleted && overlay.title) merged.push(overlay);
  }
  return merged;
}

const BY_PRICE_FIRST = (a, b) => (a.pricePaise == null) - (b.pricePaise == null);

function toShopProduct(product) {
  // Photos saved in the admin panel, else the photos in public/Products_images
  const images = (Array.isArray(product.images) ? product.images : getProductImages(product))
    .map(resolveMediaUrl)
    .filter(Boolean);
  const pricePaise = Number.isFinite(product.pricePaise) ? product.pricePaise : null;
  return {
    maxQuantity: 5,
    ...product,
    pricePaise,
    images,
    image: images[0] || null,
    price: formatPaise(pricePaise),
    originalPrice: Number.isFinite(product.originalPricePaise) ? formatPaise(product.originalPricePaise) : null,
    available: product.available !== false && pricePaise != null,
    alt: product.alt || `${product.title}${product.badge ? ` ${product.badge.toLowerCase()}` : ''} from Reiki and Vaastu World`
  };
}

function toCourse(course) {
  const images = (course.images?.length ? course.images : course.image ? [course.image] : [])
    .map(resolveMediaUrl)
    .filter(Boolean);
  return { ...course, images, image: images[0] || null };
}

export function buildCatalog(overlays, now = new Date()) {
  const products = merge(
    BUILT_IN_PRODUCTS.filter((product) => !product.isEvent),
    overlays?.products
  )
    .map(toShopProduct)
    .sort(BY_PRICE_FIRST);

  const events = merge(STATIC_EVENTS, overlays?.events).map((event) => toDisplayEvent(event, now));
  const { upcoming, past } = splitEvents(events);

  const courses = merge(STATIC_COURSES, overlays?.courses).map(toCourse);

  // Anything that can be paid for, by id (products and events)
  const payable = new Map();
  for (const product of products) payable.set(product.id, product);
  for (const event of events) {
    payable.set(event.id, {
      ...event,
      isEvent: true,
      maxQuantity: 1,
      image: event.image?.src || null,
      alt: event.image?.alt || `${event.title} poster`
    });
  }

  return {
    products,
    events,
    upcomingEvents: upcoming,
    pastEvents: past,
    courses,
    findItem: (id) => payable.get(id) || null,
    findCourse: (id) => courses.find((course) => course.id === id) || null
  };
}

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [overlays, setOverlays] = useState(null);
  // True once the latest catalog has arrived (or the wait has timed out)
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const res = await getCatalog();
    if (res.success) setOverlays(res.data);
    setReady(true);
    return res.success;
  }, []);

  useEffect(() => {
    refresh();
    const timer = setTimeout(() => setReady(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [refresh]);

  const catalog = useMemo(() => buildCatalog(overlays), [overlays]);
  const value = useMemo(() => ({ ...catalog, ready, loaded: overlays !== null, refresh }), [catalog, ready, overlays, refresh]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return value;
}
