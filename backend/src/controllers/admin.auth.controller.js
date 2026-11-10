import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// In production the frontend and API may be on different sites (e.g. two
// onrender.com subdomains), and browsers only send a cookie to a different
// site if it is SameSite=None (which in turn requires Secure / HTTPS).
// State-changing admin requests send JSON, which triggers a CORS preflight,
// so origins outside CORS_ORIGIN still cannot use the cookie.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax'
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email address or password.'
        }
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'This administrator account has been disabled.'
        }
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email address or password.'
        }
      });
    }

    // Generate signed JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Set secure httpOnly cookie
    res.cookie(COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_MAX_AGE
    });

    // Update last login timestamp asynchronously
    admin.lastLoginAt = new Date();
    await admin.save();

    logger.info(`Admin logged in: ${admin.email}`);

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLoginAt: admin.lastLoginAt
        },
        token // Provided for non-cookie fallback clients (e.g. CLI, tests)
      },
      message: 'Logged in successfully.'
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS); // must match the options used to set it

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

export async function getMe(req, res) {
  const admin = req.admin;
  res.status(200).json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt
      }
    }
  });
}

export default {
  login,
  logout,
  getMe
};
