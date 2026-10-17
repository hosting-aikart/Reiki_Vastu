import { generateReference } from '../utils/reference.js';

/**
 * Honeypot middleware to silently intercept bot submissions.
 * Legitimate users never see or populate the hidden 'website' field.
 */
export function honeypot(req, res, next) {
  if (req.body && req.body.website) {
    // Return fake success response to deceive bots
    return res.status(201).json({
      success: true,
      data: {
        reference: generateReference('BOT'),
        type: req.body.type || 'contact',
        status: 'new'
      },
      message: 'Your request has been received.'
    });
  }
  next();
}

export default honeypot;
