import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { adminLoginRateLimiter } from '../middleware/rateLimiters.js';
import {
  adminLoginSchema,
  updateEnquiryStatusSchema,
  addEnquiryNoteSchema,
  setFollowUpDateSchema,
  moderateTestimonialSchema
} from '../validators/admin.schema.js';
import authController from '../controllers/admin.auth.controller.js';
import overviewController from '../controllers/admin.overview.controller.js';
import enquiryController from '../controllers/admin.enquiry.controller.js';
import testimonialController from '../controllers/admin.testimonial.controller.js';

const router = Router();

// ── Auth Endpoints ──────────────────────────────────────────
router.post('/auth/login', adminLoginRateLimiter, validate(adminLoginSchema), authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', requireAdmin, authController.getMe);

// ── Overview / Dashboard Metrics ────────────────────────────
router.get('/overview/stats', requireAdmin, overviewController.getOverviewStats);

// ── Enquiry Management ──────────────────────────────────────
router.get('/enquiries', requireAdmin, enquiryController.listEnquiries);
router.get('/enquiries/:id', requireAdmin, enquiryController.getEnquiryById);
router.patch(
  '/enquiries/:id/status',
  requireAdmin,
  validate(updateEnquiryStatusSchema),
  enquiryController.updateEnquiryStatus
);
router.post(
  '/enquiries/:id/notes',
  requireAdmin,
  validate(addEnquiryNoteSchema),
  enquiryController.addEnquiryNote
);
router.patch(
  '/enquiries/:id/followup',
  requireAdmin,
  validate(setFollowUpDateSchema),
  enquiryController.setFollowUpDate
);
router.delete('/enquiries/:id', requireAdmin, enquiryController.deleteEnquiry);

// ── Testimonial Moderation ──────────────────────────────────
router.get('/testimonials', requireAdmin, testimonialController.listTestimonials);
router.patch(
  '/testimonials/:id/status',
  requireAdmin,
  validate(moderateTestimonialSchema),
  testimonialController.moderateTestimonial
);
router.patch('/testimonials/:id/featured', requireAdmin, testimonialController.toggleFeatured);
router.delete('/testimonials/:id', requireAdmin, testimonialController.deleteTestimonial);

export default router;
