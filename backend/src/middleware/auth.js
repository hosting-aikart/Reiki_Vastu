import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import logger from '../utils/logger.js';

export async function requireAdmin(req, res, next) {
  try {
    // 1. Extract token from httpOnly cookie or Authorization header
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.'
        }
      });
    }

    // 2. Verify signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        success: false,
        error: {
          code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
          message: isExpired
            ? 'Your admin session has expired. Please log in again.'
            : 'Invalid authentication token.'
        }
      });
    }

    // 3. Confirm account is still active in database
    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Administrator account is deactivated or no longer exists.'
        }
      });
    }

    // 4. Attach admin object to request for downstream handlers
    req.admin = admin;
    next();
  } catch (error) {
    logger.error('Error in requireAdmin middleware:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal authorization error.'
      }
    });
  }
}

export default requireAdmin;
