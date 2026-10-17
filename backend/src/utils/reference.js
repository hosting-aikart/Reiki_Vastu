import crypto from 'crypto';

/**
 * Generates human-friendly reference IDs for enquiries.
 * Format: RVW-YYMMDD-XXXX (e.g. RVW-261015-8K4P)
 */
export function generateReference(prefix = 'RVW') {
  const dateStr = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `${prefix}-${dateStr}-${randomSuffix}`;
}

export default {
  generateReference
};
