import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import adminRoutes from './routes/admin.routes.js';
import productRoutes from './routes/product.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { receiveWebhook } from './controllers/webhook.controller.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

export const app = express();

// Behind a hosting proxy every request arrives from the proxy's address. Trusting
// the configured number of hops makes req.ip (used by rate limits) the visitor's own.
app.set('trust proxy', env.TRUST_PROXY);

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
// Browsers send the origin as lowercase scheme://host with no trailing slash,
// so entries are normalised the same way. Stray quotes, spaces, capitals or a
// trailing "/" pasted into the hosting dashboard would otherwise never match.
export function normalizeOrigin(origin) {
  return origin.trim().replace(/^["']+|["']+$/g, '').trim().replace(/\/+$/, '').toLowerCase();
}

// The site's own production domains are always allowed, so the live site keeps
// working even if CORS_ORIGIN on the host is missing or mistyped.
export const PRODUCTION_ORIGINS = [
  'https://www.reikiandvaastuworld.com',
  'https://reikiandvaastuworld.com'
];

export const allowedOrigins = [
  ...new Set([
    ...env.CORS_ORIGIN.split(',').map(normalizeOrigin).filter(Boolean),
    ...PRODUCTION_ORIGINS
  ])
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin)) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true
  })
);

// Cookie parsing
app.use(cookieParser(env.COOKIE_SECRET));

// Razorpay webhook. Mounted BEFORE express.json() on purpose: the signature is
// computed over the exact bytes Razorpay sent, so the body must stay a raw
// Buffer. Parsing it and re-serialising with JSON.stringify could change
// spacing or key order, and the signature would no longer match.
app.post(
  '/api/payments/webhook',
  express.raw({ type: () => true, limit: '100kb' }),
  receiveWebhook
);

// Body parsing with strict size limit (prevents large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

// Catch-all 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
