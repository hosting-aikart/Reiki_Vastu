import { Router } from 'express';
import {
  submitTestimonial,
  listTestimonials
} from '../controllers/testimonial.controller.js';
import { testimonialSchema } from '../validators/testimonial.schema.js';
import { validate } from '../middleware/validate.js';
import { honeypot } from '../middleware/honeypot.js';
import { testimonialRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/', listTestimonials);

router.post(
  '/',
  testimonialRateLimiter,
  honeypot,
  validate(testimonialSchema),
  submitTestimonial
);

export default router;
