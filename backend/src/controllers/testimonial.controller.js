import testimonialService from '../services/testimonial.service.js';

export async function submitTestimonial(req, res, next) {
  try {
    await testimonialService.createTestimonial(req.body);

    res.status(201).json({
      success: true,
      message: 'Thank you for sharing your experience! Your story will be featured after verification.'
    });
  } catch (err) {
    next(err);
  }
}

export async function listTestimonials(req, res, next) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const testimonials = await testimonialService.getApprovedTestimonials(limit);

    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    next(err);
  }
}

export default {
  submitTestimonial,
  listTestimonials
};
