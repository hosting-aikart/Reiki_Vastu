/**
 * Lightweight logger utility with PII sanitization (phone, email).
 */
function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2');
}

function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  return `${user.slice(0, 2)}***@${domain}`;
}

export function sanitizeCredentials(text) {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/gi, '$1******$2');
}

export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${sanitizeCredentials(msg)}`, meta);
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${sanitizeCredentials(msg)}`, meta);
  },
  error: (msg, err) => {
    const errMsg = err?.message || err || '';
    console.error(`[ERROR] ${new Date().toISOString()} - ${sanitizeCredentials(msg)}`, sanitizeCredentials(String(errMsg)));
  },
  maskPhone,
  maskEmail,
  sanitizeCredentials
};

export default logger;
