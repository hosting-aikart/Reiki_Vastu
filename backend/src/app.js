import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

export const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true
  })
);

// Cookie parsing
app.use(cookieParser(env.COOKIE_SECRET));

// Body parsing with strict size limit (prevents large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
