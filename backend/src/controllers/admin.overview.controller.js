import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';

export async function getOverviewStats(req, res, next) {
  try {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      resolvedEnquiries,
      pendingFollowUps,
      pendingTestimonials,
      totalTestimonials,
      approvedTestimonials,
      recentEnquiries
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'in_progress' }),
      Enquiry.countDocuments({ status: { $in: ['confirmed', 'completed'] } }),
      Enquiry.countDocuments({
        followUpDate: { $ne: null, $lte: todayEnd },
        status: { $nin: ['completed', 'cancelled', 'spam'] }
      }),
      Testimonial.countDocuments({ status: 'pending' }),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ status: 'approved' }),
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('reference name type location status createdAt')
        .lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          inProgress: inProgressEnquiries,
          resolved: resolvedEnquiries,
          pendingFollowUps
        },
        testimonials: {
          total: totalTestimonials,
          pending: pendingTestimonials,
          approved: approvedTestimonials
        },
        recentActivity: recentEnquiries
      }
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getOverviewStats
};
