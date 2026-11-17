import mongoose from 'mongoose';

/**
 * An image uploaded from the admin panel (product, course or event photo).
 *
 * Stored in the database rather than on disk, because the hosting platform's
 * disk is wiped on every deploy. Images are resized in the browser before
 * upload, so each one is typically a few hundred KB.
 */
const mediaSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true, enum: ['image/jpeg', 'image/png', 'image/webp'] },
    size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    // False until a saved product / course / event refers to it. Uploads that
    // are never used (e.g. the admin cancelled the form) are removed later.
    attached: { type: Boolean, default: false },
    uploadedBy: { type: String, default: null }
  },
  { timestamps: true }
);

mediaSchema.index({ attached: 1, createdAt: 1 });

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
