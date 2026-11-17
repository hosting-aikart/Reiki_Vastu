import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// What the admin panel may save for a product, event or course.
// Unknown fields are dropped. Text is shown on the website as plain text
// (React escapes it), so no HTML can be injected through these fields.
// ─────────────────────────────────────────────────────────────

/** Lowercase words joined by hyphens, e.g. "rose-quartz" or "reiki-level-2-2027-01". */
export const ITEM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const itemIdSchema = z
  .string()
  .trim()
  .min(2, 'The id must be at least 2 characters')
  .max(80, 'The id cannot exceed 80 characters')
  .regex(ITEM_ID_PATTERN, 'Use only lowercase letters, numbers and hyphens');

// Images are either part of the website (/images/..., /Products_images/...),
// uploaded through the admin panel (/api/media/<id>), or an https:// address.
const IMAGE_URL = /^(\/(images|Products_images|logo)\/[^\s"'<>]+|\/api\/media\/[a-f0-9]{24}|https:\/\/[^\s"'<>]+)$/;

const imageUrl = z.string().trim().max(500).regex(IMAGE_URL, 'Invalid image address');

const text = (max, label = 'This field') => z.string().trim().max(max, `${label} cannot exceed ${max} characters`);
const optionalText = (max, label) => text(max, label).optional().default('');
const iconName = z.string().trim().max(40).regex(/^[A-Za-z0-9]*$/).optional().default('');

const paise = z
  .number({ invalid_type_error: 'Price must be a number' })
  .int('Price must be whole paise')
  .min(100, 'Price must be at least ₹1')
  .max(50000000, 'Price cannot exceed ₹5,00,000');

const imageObject = z.object({
  src: imageUrl,
  width: z.number().int().min(1).max(10000).nullable().optional(),
  height: z.number().int().min(1).max(10000).nullable().optional(),
  alt: optionalText(300, 'Image description')
});

const labelledIcon = (key) =>
  z.object({ [key]: text(160).min(1), icon: iconName });

// ── Products ────────────────────────────────────────────────
export const productDataSchema = z.object({
  title: text(120, 'Name').min(2, 'Please enter the product name'),
  subtitle: optionalText(160, 'Subtitle'),
  badge: optionalText(60, 'Badge'),
  description: optionalText(600, 'Short description'),
  longDescription: optionalText(5000, 'Full description'),
  specifications: z
    .array(z.object({ label: text(60).min(1), value: text(240).min(1) }))
    .max(30)
    .optional()
    .default([]),
  pricePaise: paise.nullable(),
  originalPricePaise: paise.nullable().optional().default(null),
  maxQuantity: z.number().int().min(1).max(10).optional().default(5),
  available: z.boolean().optional().default(true),
  images: z.array(imageUrl).max(30, 'A product can have at most 30 photos').optional().default([])
});

// ── Events ──────────────────────────────────────────────────
const isoDateTime = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Please enter a valid date and time');

export const eventDataSchema = z
  .object({
    title: text(140, 'Title').min(3, 'Please enter the event title'),
    organizer: optionalText(80),
    established: optionalText(60),
    anniversary: optionalText(120),
    anniversaryYears: z.number().int().min(1).max(200).nullable().optional().default(null),
    heroTitle: z
      .object({ kicker: optionalText(40), main: optionalText(40), ribbon: optionalText(80) })
      .optional()
      .default({}),
    tagline: optionalText(240, 'Tagline'),
    startsAt: isoDateTime,
    endsAt: isoDateTime,
    schedule: z.object({
      date: text(60),
      day: optionalText(20),
      time: optionalText(60),
      mode: optionalText(40),
      modeDetail: optionalText(80),
      venue: optionalText(240, 'Venue'),
      isOnline: z.boolean().optional().default(true)
    }),
    description: z.array(text(3000).min(1)).max(12).optional().default([]),
    benefits: z.array(labelledIcon('title')).max(24).optional().default([]),
    whatToExpect: z.array(labelledIcon('title')).max(24).optional().default([]),
    pricePaise: paise.nullable(),
    originalPricePaise: paise.nullable().optional().default(null),
    offerLabel: optionalText(80),
    registrationOpen: z.boolean().optional().default(true),
    contacts: z.array(z.string().trim().regex(/^[0-9+\s-]{7,16}$/, 'Invalid phone number')).max(5).optional().default([]),
    image: imageObject.nullable().optional().default(null),
    art: z
      .object({
        heroMain: imageObject.optional(),
        heroSide: imageObject.optional(),
        aboutArt: imageObject.optional()
      })
      .optional()
      .default({})
  })
  .refine((data) => Date.parse(data.endsAt) > Date.parse(data.startsAt), {
    message: 'The end time must be after the start time',
    path: ['endsAt']
  });

export const eventPrivateSchema = z
  .object({
    whatsappGroupUrl: z
      .string()
      .trim()
      .max(200)
      .regex(/^(https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)?$/, 'Use a WhatsApp group invite link (https://chat.whatsapp.com/...)')
      .optional()
      .default('')
  })
  .optional()
  .default({});

// ── Courses ─────────────────────────────────────────────────
const titledText = z.object({ title: optionalText(160), text: optionalText(4000), icon: iconName });

export const courseDataSchema = z.object({
  title: text(80, 'Name').min(2, 'Please enter the course name'),
  subtitle: optionalText(160, 'Subtitle'),
  description: optionalText(600, 'Short description'),
  alt: optionalText(300),
  images: z.array(imageUrl).max(30, 'A course can have at most 30 photos').optional().default([]),
  imageFit: z.enum(['cover', 'contain']).optional().default('cover'),
  imagePosition: optionalText(40),
  imageBg: optionalText(40),
  icon: iconName,
  eyebrow: z.array(text(40).min(1)).max(6).optional().default([]),
  tagline: optionalText(200, 'Tagline'),
  intro: optionalText(1200, 'Introduction'),
  what: titledText.optional().default({}),
  use: z
    .object({
      title: optionalText(160),
      text: optionalText(4000),
      cta: optionalText(80),
      items: z.array(labelledIcon('label')).max(12).optional().default([])
    })
    .optional()
    .default({}),
  philosophy: titledText.optional().default({}),
  benefits: z
    .object({
      title: optionalText(160),
      subtitle: optionalText(400),
      items: z.array(labelledIcon('label')).max(24).optional().default([])
    })
    .optional()
    .default({}),
  // Extra sections of the built-in courses (steps, columns, ...). They are
  // kept as they are; the admin form does not edit them.
  extras: z.array(z.record(z.any())).max(20).optional().default([]),
  journey: z
    .object({ title: optionalText(160), text: optionalText(1200), rainbow: z.boolean().optional() })
    .optional()
    .default({})
});

export const DATA_SCHEMAS = {
  product: productDataSchema,
  event: eventDataSchema,
  course: courseDataSchema
};

export default {
  ITEM_ID_PATTERN,
  itemIdSchema,
  productDataSchema,
  eventDataSchema,
  eventPrivateSchema,
  courseDataSchema,
  DATA_SCHEMAS
};
