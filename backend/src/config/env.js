import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Explicitly load .env from the backend root directory (works regardless of cwd)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to current working directory if different

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/reiki_vastu'),
  DB_NAME: z.string().default('reiki_vastu'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  // Number of reverse proxies in front of the app (Render: 1). Lets req.ip be the
  // visitor's real address. Leave 0 when not behind a proxy, or visitors could fake it.
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
  JWT_SECRET: z.string().default('reiki-vastu-secret-jwt-key-for-dev-change-in-production-2026'),
  COOKIE_SECRET: z.string().default('reiki-vastu-cookie-secret-key-2026'),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional().or(z.literal('')).transform(v => v || undefined),
  ADMIN_DASHBOARD_URL: z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  SMTP_HOST: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_SECURE: z
    .union([z.boolean(), z.string()])
    .optional()
    .default(false)
    .transform((val) => val === true || val === 'true' || val === '1'),
  SMTP_USER: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  SMTP_PASS: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  SMTP_FROM: z.string().default('"Reiki & Vaastu World" <notifications@reikivaastuworld.com>'),
  // Optional: the site runs without these; only payment operations are refused.
  RAZORPAY_KEY_ID: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  RAZORPAY_KEY_SECRET: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().or(z.literal('')).transform(v => v || undefined)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

/**
 * Checks whether email notification has valid, non-placeholder credentials configured.
 */
export function isEmailConfigured() {
  if (!env.ADMIN_NOTIFICATION_EMAIL || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return false;
  }
  // Ignore dummy/placeholder example domains
  if (
    env.SMTP_HOST.includes('example.com') ||
    env.SMTP_USER.includes('example.com')
  ) {
    return false;
  }
  return true;
}

/**
 * Checks whether the Razorpay API credentials are present.
 */
export function isPaymentConfigured() {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

/**
 * Checks for a Razorpay Test Mode key. This project must never process live
 * payments, so anything without the test prefix is refused.
 */
export function isPaymentTestMode() {
  return Boolean(env.RAZORPAY_KEY_ID?.startsWith('rzp_test_'));
}

export default env;
