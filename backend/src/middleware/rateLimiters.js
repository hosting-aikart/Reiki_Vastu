import rateLimit from 'express-rate-limit';

export const enquiryRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 submissions per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many submissions. Please wait a few minutes before trying again.'
      }
    });
  }
});

export const testimonialRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many submissions. Please wait an hour before submitting another testimonial.'
      }
    });
  }
});


export const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many login attempts. Please wait 15 minutes before trying again.'
      }
    });
  }
});

export default {
  enquiryRateLimiter,
  testimonialRateLimiter,
  adminLoginRateLimiter
};
