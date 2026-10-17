import logger from '../utils/logger.js';
import env from '../config/env.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error at ${req.method} ${req.originalUrl}:`, err);

  // Payload too large
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'The submitted request payload exceeds the allowed limit.'
      }
    });
  }

  // Malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Malformed JSON payload.'
      }
    });
  }

  const statusCode = err.statusCode || 500;
  const isProduction = env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: isProduction && statusCode === 500
        ? 'Server error occurred. Please try again or call our center directly.'
        : err.message || 'An unexpected error occurred.'
    }
  });
}

export default errorHandler;
