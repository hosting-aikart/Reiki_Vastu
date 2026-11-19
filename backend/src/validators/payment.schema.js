import { z } from 'zod';
import { MAX_QUANTITY } from '../config/products.js';

const contactFields = {
  name: z.string({ required_error: 'Please enter your full name' }).trim().min(2, 'Please enter your full name').max(80, 'Name cannot exceed 80 characters'),
  phone: z.string({ required_error: 'Please enter a valid 10-digit mobile number' }).trim().regex(/^(\+91|0)?[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string({ required_error: 'Please enter a valid email address' }).trim().toLowerCase().email('Please enter a valid email address').max(120)
};

/** A product order: contact details and a complete delivery address. */
export const deliveryCustomerSchema = z.object({
  ...contactFields,
  // A complete delivery address is compulsory for every order
  address: z.object(
    {
      line1: z.string({ required_error: 'Please enter your flat / house number and building' }).trim().min(3, 'Please enter your flat / house number and building').max(200),
      line2: z.string({ required_error: 'Please enter your street, area or locality' }).trim().min(3, 'Please enter your street, area or locality').max(200),
      landmark: z.string().trim().max(120, 'Landmark cannot exceed 120 characters').optional().default(''),
      city: z.string({ required_error: 'Please enter your city' }).trim().min(2, 'Please enter your city').max(80),
      state: z.string({ required_error: 'Please enter your state' }).trim().min(2, 'Please enter your state').max(80),
      pincode: z.string({ required_error: 'Please enter a valid 6-digit PIN code' }).trim().regex(/^[1-9]\d{5}$/, 'Please enter a valid 6-digit PIN code')
    },
    { required_error: 'Delivery address is required', invalid_type_error: 'Delivery address is required' }
  )
});

export const GENDERS = ['female', 'male', 'other', ''];

/** An event registration: contact details and registration details (no delivery address). */
export const eventCustomerSchema = z.object({
  ...contactFields,
  registration: z.object(
    {
      city: z.string({ required_error: 'Please enter your city' }).trim().min(2, 'Please enter your city').max(80),
      state: z.string({ required_error: 'Please enter your state' }).trim().min(2, 'Please enter your state').max(80),
      age: z
        .union([z.number(), z.string().trim()])
        .optional()
        .transform((v) => (v === '' || v === undefined || v === null ? null : Number(v)))
        .refine((v) => v === null || (Number.isInteger(v) && v >= 5 && v <= 110), 'Please enter a valid age'),
      gender: z.enum(['female', 'male', 'other', ''], { errorMap: () => ({ message: 'Please choose a valid option' }) }).optional().default(''),
      experience: z.string().trim().max(120).optional().default(''),
      message: z.string().trim().max(500, 'Message cannot exceed 500 characters').optional().default('')
    },
    { required_error: 'Registration details are required', invalid_type_error: 'Registration details are required' }
  )
});

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
    .uuid('Idempotency key is invalid'),
  // Checked against the product type in the payment service: products need a
  // delivery address (deliveryCustomerSchema), events need registration
  // details (eventCustomerSchema).
  customer: z
    .object({}, { required_error: 'Your details are required', invalid_type_error: 'Your details are required' })
    .passthrough()
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
  deliveryCustomerSchema,
  eventCustomerSchema,
  verifyPaymentSchema,
  statusTokenSchema
};
