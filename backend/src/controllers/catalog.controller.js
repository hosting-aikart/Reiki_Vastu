import mongoose from 'mongoose';
import { COURSES } from '@reiki-vastu/shared';
import { PRODUCTS as SHARED_PRODUCTS } from '@reiki-vastu/shared/products.js';
import CatalogItem, { CATALOG_KINDS } from '../models/CatalogItem.js';
import Media from '../models/Media.js';
import ProductPrice from '../models/ProductPrice.js';
import Payment, { PAYMENT_STATUS } from '../models/Payment.js';
import { DATA_SCHEMAS, eventPrivateSchema, itemIdSchema } from '../validators/catalog.schema.js';
import logger from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// Products, events and courses added or edited in the admin panel.
// The website merges these with its built-in items (see CatalogItem).
// ─────────────────────────────────────────────────────────────

// Built-in ids per kind. Products and events share one id space, because
// both are paid for by id.
const BUILT_IN_IDS = {
  product: new Set(SHARED_PRODUCTS.filter((p) => !p.isEvent).map((p) => p.id)),
  event: new Set(SHARED_PRODUCTS.filter((p) => p.isEvent).map((p) => p.id)),
  course: new Set(COURSES.map((c) => c.key))
};

const MEDIA_URL = /\/api\/media\/([a-f0-9]{24})/g;

function fail(res, status, code, message, fields) {
  return res.status(status).json({ success: false, error: { code, message, ...(fields ? { fields } : {}) } });
}

function zodFields(error, prefix) {
  const fields = {};
  for (const issue of error.issues) {
    const name = [prefix, ...issue.path].join('.');
    if (!fields[name]) fields[name] = issue.message;
  }
  return fields;
}

/** Ids of uploaded images an item refers to. */
function mediaIdsIn(value) {
  const ids = new Set();
  for (const match of JSON.stringify(value ?? {}).matchAll(MEDIA_URL)) ids.add(match[1]);
  return [...ids];
}

const isEmptyData = (data) => !data || Object.keys(data).length === 0;

function toAdminItem(doc) {
  return {
    itemId: doc.itemId,
    kind: doc.kind,
    data: doc.data || {},
    privateData: doc.privateData || {},
    deleted: Boolean(doc.deleted),
    isBuiltIn: BUILT_IN_IDS[doc.kind]?.has(doc.itemId) || false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    updatedBy: doc.updatedBy || null
  };
}

function readKind(req, res) {
  const { kind } = req.params;
  if (!CATALOG_KINDS.includes(kind)) {
    fail(res, 404, 'NOT_FOUND', 'Unknown catalog section.');
    return null;
  }
  return kind;
}

function readItemId(req, res) {
  const parsed = itemIdSchema.safeParse(req.params.itemId);
  if (!parsed.success) {
    fail(res, 422, 'VALIDATION_ERROR', parsed.error.issues[0].message, { itemId: parsed.error.issues[0].message });
    return null;
  }
  return parsed.data;
}

/** Removes uploads no longer used by any item (after an image was removed from one). */
async function removeUnusedMedia(candidateIds) {
  for (const id of candidateIds) {
    const stillUsed = await CatalogItem.exists({ mediaIds: new mongoose.Types.ObjectId(id) });
    if (!stillUsed) await Media.deleteOne({ _id: id });
  }
}

// ── Public ──────────────────────────────────────────────────

/**
 * GET /api/catalog
 * Everything the admin panel changed, for the website to merge with its
 * built-in items. Never includes private fields (e.g. WhatsApp group links).
 */
export async function getPublicCatalog(req, res, next) {
  try {
    const [items, prices] = await Promise.all([
      CatalogItem.find({}, { privateData: 0, mediaIds: 0 }).sort({ createdAt: 1 }).lean(),
      ProductPrice.find().lean()
    ]);

    const result = { products: [], events: [], courses: [] };
    const listFor = { product: result.products, event: result.events, course: result.courses };
    const saved = new Set();

    for (const item of items) {
      saved.add(`${item.kind}:${item.itemId}`);
      listFor[item.kind]?.push({
        ...(item.data || {}),
        id: item.itemId,
        deleted: Boolean(item.deleted),
        isNew: !BUILT_IN_IDS[item.kind]?.has(item.itemId),
        createdAt: item.createdAt
      });
    }

    // Price changes from the older pricing screen, for items not saved since
    for (const price of prices) {
      const kind = BUILT_IN_IDS.event.has(price.productId) ? 'event' : 'product';
      if (saved.has(`${kind}:${price.productId}`) || !BUILT_IN_IDS[kind].has(price.productId)) continue;
      const fields = {
        id: price.productId,
        pricePaise: price.unitPricePaise,
        originalPricePaise: price.originalPricePaise
      };
      if (kind === 'event') fields.registrationOpen = price.available;
      else fields.available = price.available;
      listFor[kind].push(fields);
    }

    res.set('Cache-Control', 'no-cache');
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// ── Admin ───────────────────────────────────────────────────

/** GET /api/admin/catalog/:kind */
export async function listCatalogItems(req, res, next) {
  try {
    const kind = readKind(req, res);
    if (!kind) return;
    const docs = await CatalogItem.find({ kind }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ success: true, data: { items: docs.map(toAdminItem) } });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/catalog/:kind/:itemId
 * Body: { data, privateData?, isNew? }. Saves the item's full details.
 * `isNew: true` refuses to overwrite an existing item with the same id.
 */
export async function saveCatalogItem(req, res, next) {
  try {
    const kind = readKind(req, res);
    if (!kind) return;
    const itemId = readItemId(req, res);
    if (!itemId) return;

    const parsedData = DATA_SCHEMAS[kind].safeParse(req.body?.data);
    if (!parsedData.success) {
      return fail(res, 422, 'VALIDATION_ERROR', 'Validation failed. Please review your entries.', zodFields(parsedData.error, 'data'));
    }

    let privateData = {};
    if (kind === 'event') {
      const parsedPrivate = eventPrivateSchema.safeParse(req.body?.privateData);
      if (!parsedPrivate.success) {
        return fail(res, 422, 'VALIDATION_ERROR', 'Validation failed. Please review your entries.', zodFields(parsedPrivate.error, 'privateData'));
      }
      privateData = parsedPrivate.data;
    }

    // Products and events are paid for by id, so an id can only belong to one of them
    if (kind !== 'course') {
      const other = kind === 'product' ? 'event' : 'product';
      const takenByOther =
        BUILT_IN_IDS[other].has(itemId) || (await CatalogItem.exists({ kind: other, itemId }));
      if (takenByOther) {
        return fail(res, 409, 'ID_TAKEN', `The id "${itemId}" is already used by a ${other}. Please choose another.`, { itemId: 'This id is already in use' });
      }
    }

    const existing = await CatalogItem.findOne({ kind, itemId });
    if (req.body?.isNew === true && (existing || BUILT_IN_IDS[kind].has(itemId))) {
      return fail(res, 409, 'ID_TAKEN', `A ${kind} with the id "${itemId}" already exists. Please choose another.`, { itemId: 'This id is already in use' });
    }

    const newMediaIds = mediaIdsIn(parsedData.data);
    const oldMediaIds = existing ? existing.mediaIds.map(String) : [];

    const saved = await CatalogItem.findOneAndUpdate(
      { kind, itemId },
      {
        $set: {
          data: parsedData.data,
          privateData,
          mediaIds: newMediaIds,
          updatedBy: req.admin?.email || null
        },
        $setOnInsert: { deleted: false }
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (newMediaIds.length) {
      await Media.updateMany({ _id: { $in: newMediaIds } }, { $set: { attached: true } });
    }
    await removeUnusedMedia(oldMediaIds.filter((id) => !newMediaIds.includes(id)));

    logger.info(`Admin ${req.admin?.email || ''} saved ${kind} "${itemId}"`);
    res.status(200).json({ success: true, message: 'Saved', data: { item: toAdminItem(saved.toObject()) } });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/catalog/:kind/:itemId
 * Hides the item from the website. Its details (and, for events, the list of
 * people who registered) are kept, and it can be restored.
 */
export async function deleteCatalogItem(req, res, next) {
  try {
    const kind = readKind(req, res);
    if (!kind) return;
    const itemId = readItemId(req, res);
    if (!itemId) return;

    const existing = await CatalogItem.findOne({ kind, itemId });
    if (!existing && !BUILT_IN_IDS[kind].has(itemId)) {
      return fail(res, 404, 'NOT_FOUND', 'This item does not exist.');
    }

    const saved = await CatalogItem.findOneAndUpdate(
      { kind, itemId },
      { $set: { deleted: true, updatedBy: req.admin?.email || null }, $setOnInsert: { data: {}, privateData: {} } },
      { upsert: true, new: true }
    );

    logger.info(`Admin ${req.admin?.email || ''} deleted ${kind} "${itemId}"`);
    res.status(200).json({ success: true, message: 'Deleted', data: { item: toAdminItem(saved.toObject()) } });
  } catch (err) {
    next(err);
  }
}

/** POST /api/admin/catalog/:kind/:itemId/restore */
export async function restoreCatalogItem(req, res, next) {
  try {
    const kind = readKind(req, res);
    if (!kind) return;
    const itemId = readItemId(req, res);
    if (!itemId) return;

    const existing = await CatalogItem.findOne({ kind, itemId });
    if (!existing) return fail(res, 404, 'NOT_FOUND', 'This item does not exist.');

    // A built-in item that was deleted without ever being edited: removing the
    // record brings back the original.
    if (isEmptyData(existing.data) && BUILT_IN_IDS[kind].has(itemId)) {
      await CatalogItem.deleteOne({ _id: existing._id });
      return res.status(200).json({ success: true, message: 'Restored', data: { item: null } });
    }

    existing.deleted = false;
    existing.updatedBy = req.admin?.email || null;
    await existing.save();
    res.status(200).json({ success: true, message: 'Restored', data: { item: toAdminItem(existing.toObject()) } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/catalog/:kind/:itemId/reset
 * Throws away the admin's changes to a built-in item, going back to the
 * website's original details.
 */
export async function resetCatalogItem(req, res, next) {
  try {
    const kind = readKind(req, res);
    if (!kind) return;
    const itemId = readItemId(req, res);
    if (!itemId) return;
    if (!BUILT_IN_IDS[kind].has(itemId)) {
      return fail(res, 409, 'NOT_BUILT_IN', 'Only built-in items can be reset to their original details.');
    }

    const existing = await CatalogItem.findOne({ kind, itemId });
    if (existing) {
      await CatalogItem.deleteOne({ _id: existing._id });
      await removeUnusedMedia(existing.mediaIds.map(String));
    }
    if (kind !== 'course') await ProductPrice.deleteOne({ productId: itemId });

    res.status(200).json({ success: true, message: 'Reset to the original details', data: { item: null } });
  } catch (err) {
    next(err);
  }
}

// ── Event registrations ─────────────────────────────────────

/** GET /api/admin/events/registrations/summary → per event: paid registrations and amount */
export async function getEventRegistrationSummary(req, res, next) {
  try {
    const rows = await Payment.aggregate([
      {
        $group: {
          _id: '$product.id',
          paid: { $sum: { $cond: [{ $eq: ['$status', PAYMENT_STATUS.PAID] }, 1, 0] } },
          attempts: { $sum: 1 },
          amountPaise: { $sum: { $cond: [{ $eq: ['$status', PAYMENT_STATUS.PAID] }, '$amountPaise', 0] } },
          lastPaidAt: { $max: '$paidAt' }
        }
      }
    ]);
    const summary = {};
    for (const row of rows) {
      summary[row._id] = { paid: row.paid, attempts: row.attempts, amountPaise: row.amountPaise, lastPaidAt: row.lastPaidAt };
    }
    res.status(200).json({ success: true, data: { summary } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/admin/events/:itemId/registrations → everyone who registered (or tried to) */
export async function listEventRegistrations(req, res, next) {
  try {
    const itemId = readItemId(req, res);
    if (!itemId) return;

    const payments = await Payment.find({ 'product.id': itemId }).sort({ createdAt: -1 }).limit(2000).lean();
    const registrations = payments.map((p) => ({
      id: String(p._id),
      reference: p.reference,
      status: p.status,
      quantity: p.quantity,
      amountPaise: p.amountPaise,
      customer: p.customer,
      razorpayPaymentId: p.razorpayPaymentId || null,
      createdAt: p.createdAt,
      paidAt: p.paidAt,
      failure: p.failure?.description || null
    }));

    res.status(200).json({ success: true, data: { registrations } });
  } catch (err) {
    next(err);
  }
}

export default {
  getPublicCatalog,
  listCatalogItems,
  saveCatalogItem,
  deleteCatalogItem,
  restoreCatalogItem,
  resetCatalogItem,
  getEventRegistrationSummary,
  listEventRegistrations
};
