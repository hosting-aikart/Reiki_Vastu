import { z } from 'zod';
import { STORY_SERVICES, keysOf } from '@reiki-vastu/shared';

export const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(80, 'City cannot exceed 80 characters'),
  serviceKey: z.enum(keysOf(STORY_SERVICES), {
    errorMap: () => ({ message: 'Please select the service you experienced' })
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  story: z
    .string()
    .trim()
    .min(20, 'Please share a bit more detail about your experience (minimum 20 characters)')
    .max(1000, 'Story cannot exceed 1000 characters'),
  website: z.string().optional().default('') // Honeypot field
});

export default testimonialSchema;
