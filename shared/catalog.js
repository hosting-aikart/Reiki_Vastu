// ─────────────────────────────────────────────────────────────
// Single source of truth for form options shared by the
// frontend (dropdown labels) and backend (validation enums).
//
// Forms SUBMIT the stable `key`; they DISPLAY the `label`.
// Never rename a key once data exists — add a new one instead.
// ─────────────────────────────────────────────────────────────

/** Centres / meeting modes. */
export const LOCATIONS = [
  { key: 'amravati', label: 'Amravati Center (Walcut Compound)', modeLabel: 'In-Person (Amravati Center)' },
  { key: 'nagpur', label: 'Nagpur Center (Mahal)', modeLabel: 'In-Person (Nagpur Center)' },
  { key: 'online', label: 'Online Video Consultation', modeLabel: 'Online Video Call (Zoom / Meet)' }
];

/** Services selectable in the "Book Personal Consultation" form. */
export const CONSULTATION_SERVICES = [
  { key: 'residential_vaastu_audit', label: 'Residential Home Vaastu Audit' },
  { key: 'commercial_vaastu_audit', label: 'Commercial / Factory Vaastu Audit' },
  { key: 'astrology_kundali', label: 'Vedic Astrology & Kundali Analysis' },
  { key: 'reiki_healing_session', label: 'Reiki Healing Session' },
  { key: 'reiki_attunement', label: 'Reiki Master Course Attunement' },
  { key: 'lama_fera_cleansing', label: 'Tibetan Lama-Fera Cleansing Session' },
  { key: 'numerology_name_correction', label: 'Chaldean Numerology & Name Correction' },
  { key: 'acupressure_pain_relief', label: 'Scientific Acupressure Pain Relief' }
];

/** Preferred time slots (24h key, IST). */
export const TIME_SLOTS = [
  { key: '10:00', label: '10:00 AM (Morning)' },
  { key: '12:30', label: '12:30 PM (Afternoon)' },
  { key: '16:30', label: '04:30 PM (Evening)' },
  { key: '18:30', label: '06:30 PM (Late Evening)' }
];

/**
 * Courses. IDs MUST match `COURSES_15[].id` in
 * frontend/src/components/CoursesGrid.jsx and keys in data/courseDetails.js.
 */
export const COURSES = [
  { key: 'meditation', label: 'Meditation' },
  { key: 'reiki', label: 'Reiki' },
  { key: 'vaastu', label: 'Vaastu' },
  { key: 'feng-shui', label: 'Feng-Shui' },
  { key: 'dowsing', label: 'Dowsing' },
  { key: 'lama-fera', label: 'Lama-Fera' },
  { key: 'accupressure', label: 'Accupressure' },
  { key: 'crystal-therapy', label: 'Crystal Therapy' },
  { key: 'pyramid', label: 'Pyramid' },
  { key: 'numerology', label: 'Numerology' },
  { key: 'astrology', label: 'Astrology' },
  { key: 'rudraksha', label: 'Rudraksha' },
  { key: 'pranic-healing', label: 'Pranic Healing' },
  { key: 'gems-with-reiki', label: 'Gems with Reiki' },
  { key: 'color-therapy', label: 'Color Therapy' }
];

/** Experiences selectable in the "Share Your Story" form. */
export const STORY_SERVICES = [
  { key: 'reiki_healing_session', label: 'Reiki Healing Session' },
  { key: 'residential_vaastu_audit', label: 'Residential Vaastu Audit' },
  { key: 'commercial_vaastu_audit', label: 'Commercial Vaastu Audit' },
  { key: 'astrology_kundali', label: 'Kundali & Astrology Reading' },
  { key: 'lama_fera_cleansing', label: 'Lama-Fera Cleansing' },
  { key: 'reiki_course_l1_l2', label: 'Reiki Level 1 & 2 Course' }
];

export const RATINGS = [
  { key: 5, label: '★★★★★ (5/5 Outstanding)' },
  { key: 4, label: '★★★★☆ (4/5 Very Good)' },
  { key: 3, label: '★★★☆☆ (3/5 Good)' },
  { key: 2, label: '★★☆☆☆ (2/5 Fair)' },
  { key: 1, label: '★☆☆☆☆ (1/5 Poor)' }
];

/** Days the centres are closed (0 = Sunday). Matches the footer opening hours. */
export const CLOSED_WEEKDAYS = [0];

/** How far ahead a consultation can be requested. */
export const BOOKING_WINDOW_DAYS = 90;

export const BUSINESS_TIMEZONE = 'Asia/Kolkata';

// ── Helpers ─────────────────────────────────────────────────

export const keysOf = (list) => list.map((item) => item.key);

export const labelFor = (list, key) => list.find((item) => item.key === key)?.label ?? key;

/** Today's date in IST as 'YYYY-MM-DD'. */
export function todayInBusinessTz(now = new Date()) {
  // en-CA formats as YYYY-MM-DD
  return now.toLocaleDateString('en-CA', { timeZone: BUSINESS_TIMEZONE });
}

/** Add whole days to a 'YYYY-MM-DD' string (timezone-safe). */
export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Day of week (0 = Sunday) for a 'YYYY-MM-DD' string. */
export function weekdayOf(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

/**
 * Validates a preferred consultation date.
 * @returns {string|null} an error message, or null when the date is acceptable.
 */
export function validatePreferredDate(dateStr, now = new Date()) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return 'Select a valid date';
  }
  const parsed = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateStr) {
    return 'Select a valid date';
  }
  const today = todayInBusinessTz(now);
  if (dateStr < today) return 'Preferred date cannot be in the past';
  if (dateStr > addDays(today, BOOKING_WINDOW_DAYS)) {
    return `Preferred date must be within the next ${BOOKING_WINDOW_DAYS} days`;
  }
  if (CLOSED_WEEKDAYS.includes(weekdayOf(dateStr))) {
    return 'Our centres are closed on Sundays. Please choose another day';
  }
  return null;
}
