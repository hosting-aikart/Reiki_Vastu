import { Router } from 'express';
import { createOrder, getStatus, verifyPayment } from '../controllers/payment.controller.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/payment.schema.js';
import { validate } from '../middleware/validate.js';
import {
  paymentOrderRateLimiter,
  paymentStatusRateLimiter,
  paymentVerifyRateLimiter
} from '../middleware/rateLimiters.js';

const router = Router();

router.post('/orders', paymentOrderRateLimiter, validate(createOrderSchema), createOrder);
router.post('/verify', paymentVerifyRateLimiter, validate(verifyPaymentSchema), verifyPayment);
router.get('/:statusToken/status', paymentStatusRateLimiter, getStatus);

export default router;
