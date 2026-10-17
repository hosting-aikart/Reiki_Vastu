import Testimonial from '../models/Testimonial.js';
import logger from '../utils/logger.js';

export async function listTestimonials(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        testimonials,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function moderateTestimonial(req, res, next) {
  try {
    const { status, adminNote, featured } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Testimonial not found.'
        }
      });
    }

    testimonial.status = status;
    testimonial.reviewedBy = req.admin.name;
    testimonial.reviewedAt = new Date();

    if (adminNote !== undefined) {
      testimonial.adminNote = adminNote;
    }

    if (featured !== undefined) {
      testimonial.featured = Boolean(featured);
    }

    await testimonial.save();
    logger.info(`Testimonial [${testimonial._id}] moderated: ${status} by ${req.admin.name}`);

    res.status(200).json({
      success: true,
      data: { testimonial },
      message: `Testimonial status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleFeatured(req, res, next) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Testimonial not found.'
        }
      });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.status(200).json({
      success: true,
      data: { testimonial },
      message: testimonial.featured
        ? 'Testimonial marked as featured.'
        : 'Testimonial removed from featured.'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req, res, next) {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Testimonial not found.'
        }
      });
    }

    logger.info(`Testimonial [${deleted._id}] deleted by ${req.admin.name}`);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

export default {
  listTestimonials,
  moderateTestimonial,
  toggleFeatured,
  deleteTestimonial
};
