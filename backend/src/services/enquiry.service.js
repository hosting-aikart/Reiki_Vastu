import Enquiry from '../models/Enquiry.js';
import { generateReference } from '../utils/reference.js';
import { sendAdminEnquiryNotification } from './email.service.js';
import logger from '../utils/logger.js';

export async function createEnquiry(payload, meta = {}) {
  const reference = generateReference('RVW');

  const enquiry = new Enquiry({
    reference,
    type: payload.type,
    name: payload.name,
    phone: payload.phone,
    email: payload.email || null,
    location: payload.location,
    serviceKey: payload.serviceKey || null,
    courseId: payload.courseId || null,
    preferredDate: payload.preferredDate || null,
    preferredSlot: payload.preferredSlot || null,
    message: payload.message || '',
    meta: {
      sourcePage: payload.sourcePage || meta.sourcePage || '',
      userAgent: meta.userAgent || '',
      ipHash: meta.ipHash || ''
    }
  });

  const saved = await enquiry.save();

  logger.info(`New enquiry recorded: ${saved.reference} [${saved.type}]`);

  // Asynchronously trigger notification email without blocking response
  sendAdminEnquiryNotification(saved)
    .then(async (result) => {
      if (result.sent) {
        await Enquiry.updateOne(
          { _id: saved._id },
          { $set: { 'notification.adminEmailSent': true } }
        );
      } else if (result.error) {
        await Enquiry.updateOne(
          { _id: saved._id },
          { $set: { 'notification.lastError': result.error } }
        );
      }
    })
    .catch((err) => {
      logger.error('Error in background email notification:', err);
    });

  return saved;
}

export default {
  createEnquiry
};
