import { EVENT_DEFAULTS, isEventOver } from '@reiki-vastu/shared/events.js';
import { iconFor } from '../catalog/icons';
import { resolveMediaUrl } from '../catalog/media';

/**
 * Events (workshops) shown on the Events page and in the announcement popup.
 *
 * The built-in events live in shared/events.js; more are added in the admin
 * panel (Admin → Events). Both are merged in src/catalog/CatalogContext.jsx
 * and turned into the shape the event components use by toDisplayEvent().
 */

const resolveImage = (image, fallback) => {
  const src = resolveMediaUrl(image?.src);
  if (!src) return fallback || null;
  return { ...(fallback || {}), ...image, src, alt: image.alt ?? fallback?.alt ?? '' };
};

const paiseToRupees = (paise) => (Number.isFinite(paise) ? Math.round(paise / 100) : null);

/** An event as stored (built-in or admin-made) -> what the event pages display. */
export function toDisplayEvent(event, now = new Date()) {
  const heroTitle = event.heroTitle || {};
  const hasHeroTitle = Boolean(heroTitle.kicker || heroTitle.main || heroTitle.ribbon);
  const poster = resolveImage(event.image, null);
  const art = event.art || {};

  return {
    ...event,
    organizer: event.organizer || EVENT_DEFAULTS.organizer,
    established: event.established || EVENT_DEFAULTS.established,
    contacts: event.contacts?.length ? event.contacts : EVENT_DEFAULTS.contacts,
    heroTitle: hasHeroTitle ? heroTitle : { kicker: '', main: event.title, ribbon: '' },
    description: event.description || [],
    schedule: { modeDetail: EVENT_DEFAULTS.modeDetail, ...(event.schedule || {}) },
    benefits: (event.benefits || []).map((item) => ({ ...item, icon: iconFor(item.icon) })),
    whatToExpect: (event.whatToExpect || []).map((item) => ({ ...item, icon: iconFor(item.icon) })),
    pricing: {
      currency: 'INR',
      actualFee: paiseToRupees(event.originalPricePaise),
      offerFee: paiseToRupees(event.pricePaise),
      offerLabel: event.offerLabel || EVENT_DEFAULTS.offerLabel
    },
    image: poster,
    art: {
      // Without its own photo, an event shows its poster beside the title
      heroMain: resolveImage(art.heroMain, null) || poster || EVENT_DEFAULTS.art.heroMain,
      heroSide: resolveImage(art.heroSide, EVENT_DEFAULTS.art.heroSide),
      aboutArt: resolveImage(art.aboutArt, EVENT_DEFAULTS.art.aboutArt)
    },
    registrationOpen: event.registrationOpen !== false && event.pricePaise != null,
    isPast: isEventOver(event, now)
  };
}

/** Upcoming first (soonest first), then past events (most recent first). */
export function splitEvents(events) {
  const upcoming = events.filter((e) => !e.isPast).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const past = events.filter((e) => e.isPast).sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
  return { upcoming, past };
}

/** ₹ amount in Indian digit grouping, e.g. 3100 -> "₹3,100". */
export const formatRupees = (amount) => (Number.isFinite(amount) ? `₹${amount.toLocaleString('en-IN')}` : '');

/** wa.me link for an Indian mobile number, with an optional prefilled message. */
export function whatsAppLink(number, message = '') {
  const digits = number.replace(/\D/g, '');
  const international = digits.length === 10 ? `91${digits}` : digits;
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${international}${text}`;
}

/** WhatsApp link to the event's first contact, prefilled with a registration request. */
export function whatsappRegistrationLink(event) {
  const message = `Hello, I would like to register for the ${event.title} on ${event.schedule.date} (${event.schedule.time}).`;
  return whatsAppLink(event.contacts[0], message);
}
