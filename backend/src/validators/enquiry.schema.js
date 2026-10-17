import { z } from 'zod';
import {
  LOCATIONS,
  CONSULTATION_SERVICES,
  TIME_SLOTS,
  COURSES,
  keysOf,
  validatePreferredDate
} from '@reiki-vastu/shared';

const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;

const baseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid 10-digit mobile number'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val.toLowerCase() : null)),
  location: z.enum(keysOf(LOCATIONS), {
    errorMap: () => ({ message: 'Please select a valid center or online location' })
  }),
  sourcePage: z.string().optional().default(''),
  website: z.string().optional().default('') // Honeypot field
});

const consultationSchema = baseSchema.extend({
  type: z.literal('consultation'),
  serviceKey: z.enum(keysOf(CONSULTATION_SERVICES), {
    errorMap: () => ({ message: 'Please select a valid consultation service' })
  }),
  preferredDate: z.string().superRefine((val, ctx) => {
    const errorMsg = validatePreferredDate(val);
    if (errorMsg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg
      });
    }
  }),
  preferredSlot: z.enum(keysOf(TIME_SLOTS), {
    errorMap: () => ({ message: 'Please select a preferred time slot' })
  }),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional().default('')
});

const courseSchema = baseSchema.extend({
  type: z.literal('course'),
  courseId: z.enum(keysOf(COURSES), {
    errorMap: () => ({ message: 'Please select a valid course' })
  }),
  preferredDate: z.string().optional().nullable(),
  preferredSlot: z.string().optional().nullable(),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional().default('')
});

const contactSchema = baseSchema.extend({
  type: z.literal('contact'),
  message: z
    .string()
    .trim()
    .min(5, 'Please provide details about your enquiry (at least 5 characters)')
    .max(1000, 'Message cannot exceed 1000 characters')
});

export const enquirySchema = z.discriminatedUnion('type', [
  consultationSchema,
  courseSchema,
  contactSchema
]);

export default enquirySchema;
