import { z } from 'zod';
import { MAX_QUANTITY } from '../config/products.js';

/**
 * Deliberately contains no amount or price field. Zod removes unknown fields,
 * so anything of that kind sent by the browser never reaches the service.
 */
export const createOrderSchema = z.object({
  productId: z
    .string({ required_error: 'Product is required', invalid_type_error: 'Product is required' })
    .trim()
    .min(1, 'Product is required')
    .max(100, 'Product is invalid'),
  quantity: z
    .number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(MAX_QUANTITY, `Quantity cannot exceed ${MAX_QUANTITY}`),
  idempotencyKey: z
    .string({ required_error: 'Idempotency key is required', invalid_type_error: 'Idempotency key is invalid' })
    .uuid('Idempotency key is invalid')
});

/**
 * The three values Checkout's success handler receives, plus our status token.
 * Field names match Razorpay's so the browser can forward the response as-is.
 * There is no status field: whether the payment succeeded is decided by the server.
 */
export const verifyPaymentSchema = z.object({
  statusToken: z.string().uuid('Payment reference is invalid'),
  razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]{1,40}$/, 'Order id is invalid'),
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]{1,40}$/, 'Payment id is invalid'),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/, 'Signature is invalid')
});

export const statusTokenSchema = z.string().uuid();

export default {
  createOrderSchema,
  verifyPaymentSchema,
  statusTokenSchema
};
