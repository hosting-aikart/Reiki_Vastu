import Enquiry from '../models/Enquiry.js';
import logger from '../utils/logger.js';

export async function listEnquiries(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }

    if (req.query.location && req.query.location !== 'all') {
      filter.location = req.query.location;
    }

    if (req.query.search) {
      const q = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { reference: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        enquiries,
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

export async function getEnquiryById(req, res, next) {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Enquiry not found.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: { enquiry }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEnquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Enquiry not found.'
        }
      });
    }

    const previousStatus = enquiry.status;
    enquiry.status = status;

    if (['confirmed', 'completed'].includes(status) && !enquiry.resolvedAt) {
      enquiry.resolvedAt = new Date();
    } else if (['new', 'in_progress', 'contacted'].includes(status)) {
      enquiry.resolvedAt = null;
    }

    await enquiry.save();
    logger.info(`Enquiry [${enquiry.reference}] status changed: ${previousStatus} -> ${status} by ${req.admin.name}`);

    res.status(200).json({
      success: true,
      data: { enquiry },
      message: `Status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
}

export async function addEnquiryNote(req, res, next) {
  try {
    const { content } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Enquiry not found.'
        }
      });
    }

    enquiry.notes.push({
      content,
      authorName: req.admin.name,
      createdAt: new Date()
    });

    await enquiry.save();

    res.status(200).json({
      success: true,
      data: { enquiry },
      message: 'Internal note added.'
    });
  } catch (err) {
    next(err);
  }
}

export async function setFollowUpDate(req, res, next) {
  try {
    const { followUpDate } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Enquiry not found.'
        }
      });
    }

    enquiry.followUpDate = followUpDate ? new Date(followUpDate) : null;
    await enquiry.save();

    res.status(200).json({
      success: true,
      data: { enquiry },
      message: followUpDate ? 'Follow-up date scheduled.' : 'Follow-up date cleared.'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteEnquiry(req, res, next) {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Enquiry not found.'
        }
      });
    }

    logger.info(`Enquiry [${deleted.reference}] deleted by ${req.admin.name}`);

    res.status(200).json({
      success: true,
      message: `Enquiry ${deleted.reference} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
}

export default {
  listEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  setFollowUpDate,
  deleteEnquiry
};
