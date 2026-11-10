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

export const paymentOrderRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // each attempt calls Razorpay, so limit how fast one IP can trigger that
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many payment attempts. Please wait a few minutes before trying again.'
      }
    });
  }
});

export const paymentVerifyRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // limits guessing signatures and how often one IP can trigger Razorpay lookups
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many verification attempts. Please wait a few minutes before trying again.'
      }
    });
  }
});

export const paymentStatusRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 150, // enough for a status page polling every few seconds
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many status checks. Please wait a moment and refresh.'
      }
    });
  }
});

export default {
  enquiryRateLimiter,
  testimonialRateLimiter,
  adminLoginRateLimiter,
  paymentOrderRateLimiter,
  paymentVerifyRateLimiter,
  paymentStatusRateLimiter
};
