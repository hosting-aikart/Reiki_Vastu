import enquiryService from '../services/enquiry.service.js';

export async function submitEnquiry(req, res, next) {
  try {
    const meta = {
      sourcePage: req.body.sourcePage || req.headers.referer || '',
      userAgent: req.headers['user-agent'] || '',
      ipHash: req.ip || ''
    };

    const saved = await enquiryService.createEnquiry(req.body, meta);

    const message =
      saved.type === 'consultation'
        ? 'Request received! Our team will contact you shortly to confirm your consultation slot.'
        : saved.type === 'course'
        ? 'Course enquiry received! Our coordinator will contact you with batch & curriculum details.'
        : 'Thank you for reaching out! We have received your query and will get back to you shortly.';

    res.status(201).json({
      success: true,
      data: {
        reference: saved.reference,
        type: saved.type,
        status: saved.status
      },
      message
    });
  } catch (err) {
    next(err);
  }
}

export default {
  submitEnquiry
};
