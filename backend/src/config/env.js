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
  SMTP_FROM: z.string().default('"Reiki & Vaastu World" <notifications@reikivaastuworld.com>')
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

export default env;
