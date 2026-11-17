import mongoose from 'mongoose';

export const CATALOG_KINDS = Object.freeze(['product', 'event', 'course']);

/**
 * Website content managed from the admin panel: products, events and courses.
 *
 * The website ships with built-in products, events and courses (shared/*.js,
 * frontend/src/data). A CatalogItem either changes one of those (same itemId)
 * or adds a new one. `data` holds the item's full details as the admin last
 * saved them. Deleting only sets `deleted`, so the history (for example who
 * registered for a past event) is never lost and an item can be restored.
 */
const catalogItemSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, enum: CATALOG_KINDS },
    itemId: { type: String, required: true, trim: true, maxlength: 100 },
    data: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    // Never sent to the public website (e.g. an event's WhatsApp group link,
    // which is only revealed after a verified payment)
    privateData: { type: mongoose.Schema.Types.Mixed, default: {} },
    deleted: { type: Boolean, default: false },
    // Uploaded images this item uses, so unused uploads can be cleaned up
    mediaIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    updatedBy: { type: String, default: null }
  },
  { timestamps: true, minimize: false }
);

catalogItemSchema.index({ kind: 1, itemId: 1 }, { unique: true });
catalogItemSchema.index({ mediaIds: 1 });

const CatalogItem = mongoose.models.CatalogItem || mongoose.model('CatalogItem', catalogItemSchema);

export default CatalogItem;
