import { Router } from 'express';
import { submitEnquiry } from '../controllers/enquiry.controller.js';
import { enquirySchema } from '../validators/enquiry.schema.js';
import { validate } from '../middleware/validate.js';
import { honeypot } from '../middleware/honeypot.js';
import { enquiryRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post(
  '/',
  enquiryRateLimiter,
  honeypot,
  validate(enquirySchema),
  submitEnquiry
);

export default router;
