import Testimonial from '../models/Testimonial.js';
import logger from '../utils/logger.js';
import { sendAdminTestimonialNotification } from './email.service.js';

export async function createTestimonial(payload) {
  const testimonial = new Testimonial({
    name: payload.name,
    city: payload.city,
    serviceKey: payload.serviceKey,
    rating: payload.rating,
    story: payload.story,
    status: 'pending' // Requires moderation
  });

  const saved = await testimonial.save();
  logger.info(`New testimonial submitted for review (ID: ${saved._id})`);

  // Asynchronously trigger notification email without blocking response
  sendAdminTestimonialNotification(saved)
    .then(async (result) => {
      if (result.sent) {
        await Testimonial.updateOne(
          { _id: saved._id },
          { $set: { 'notification.adminEmailSent': true } }
        );
      } else if (result.error) {
        await Testimonial.updateOne(
          { _id: saved._id },
          { $set: { 'notification.lastError': result.error } }
        );
      }
    })
    .catch((err) => {
      logger.error('Error in background email notification for testimonial:', err);
    });

  return saved;
}

export async function getApprovedTestimonials(limit = 20) {
  return Testimonial.find({ status: 'approved' })
    .select('name city serviceKey rating story featured createdAt')
    .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
}

export default {
  createTestimonial,
  getApprovedTestimonials
};
