import mongoose from 'mongoose';
import Media from '../models/Media.js';
import logger from '../utils/logger.js';

// Uploads that no saved product / course / event uses are removed after this long
const UNUSED_UPLOAD_TTL_MS = 24 * 60 * 60 * 1000;

/** The image type from the file's first bytes; the browser's Content-Type is not trusted. */
function detectImageType(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
}

const toDimension = (value) => {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0 && n <= 10000 ? n : null;
};

/**
 * POST /api/admin/media  (body: the image file itself; ?width=&height= optional)
 * Returns the address to use in a product, course or event.
 */
export async function uploadMedia(req, res, next) {
  try {
    const buffer = Buffer.isBuffer(req.body) ? req.body : null;
    const contentType = buffer ? detectImageType(buffer) : null;
    if (!contentType) {
      return res.status(415).json({
        success: false,
        error: { code: 'UNSUPPORTED_IMAGE', message: 'Please upload a JPEG, PNG or WebP image.' }
      });
    }

    // Clean up earlier uploads that were never used (e.g. a form was cancelled)
    Media.deleteMany({ attached: false, createdAt: { $lt: new Date(Date.now() - UNUSED_UPLOAD_TTL_MS) } }).catch((err) =>
      logger.warn('Could not remove unused uploads:', err)
    );

    const media = await Media.create({
      data: buffer,
      contentType,
      size: buffer.length,
      width: toDimension(req.query.width),
      height: toDimension(req.query.height),
      uploadedBy: req.admin?.email || null
    });

    res.status(201).json({
      success: true,
      data: { id: String(media._id), url: `/api/media/${media._id}`, width: media.width, height: media.height }
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/media/:id: the uploaded image. Its address never changes, so it is cached for a year. */
export async function serveMedia(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).end();

    const media = await Media.findById(id, { data: 1, contentType: 1, size: 1 }).lean();
    if (!media) return res.status(404).end();

    res.set({
      'Content-Type': media.contentType,
      'Content-Length': String(media.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
      // The website (another domain) displays these images
      'Cross-Origin-Resource-Policy': 'cross-origin'
    });
    res.status(200).end(Buffer.from(media.data.buffer ?? media.data));
  } catch (err) {
    next(err);
  }
}

export default { uploadMedia, serveMedia };
