import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid administrator email address')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(
    ['new', 'in_progress', 'contacted', 'confirmed', 'completed', 'cancelled', 'spam'],
    { errorMap: () => ({ message: 'Invalid enquiry status' }) }
  )
});

export const addEnquiryNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, 'Note content must be at least 2 characters')
    .max(1000, 'Note content cannot exceed 1000 characters')
});

export const setFollowUpDateSchema = z.object({
  followUpDate: z
    .string()
    .nullable()
    .refine(
      (val) => val === null || !isNaN(Date.parse(val)),
      'Invalid date format for follow-up'
    )
});

export const moderateTestimonialSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    errorMap: () => ({ message: 'Status must be pending, approved, or rejected' })
  }),
  adminNote: z.string().max(500, 'Admin note cannot exceed 500 characters').optional().nullable(),
  featured: z.boolean().optional()
});

export default {
  adminLoginSchema,
  updateEnquiryStatusSchema,
  addEnquiryNoteSchema,
  setFollowUpDateSchema,
  moderateTestimonialSchema
};
