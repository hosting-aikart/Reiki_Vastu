// ─────────────────────────────────────────────────────────────
// Events (workshops) that are built into the website.
//
// More events are added from the admin panel (Admin → Events); those are
// stored in the database and merged with this list. This file only holds the
// events that existed before the admin panel could manage them.
//
// Read by the frontend (event pages) and the backend (prices and whether
// registration is still open). Prices are integer paise, as for products.
//
// `startsAt` / `endsAt` are ISO timestamps with the India offset (+05:30).
// Once `endsAt` has passed the event is shown under "Past Events" and can no
// longer be booked. Icons are lucide-react icon names.
// ─────────────────────────────────────────────────────────────

/** The WhatsApp group a customer is asked to join after paying for an event. */
export const DEFAULT_EVENT_WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/DqemdOTzw1HKqycAOr3m0u';

export const EVENT_DEFAULTS = {
  organizer: 'Reiki And Vaastu World',
  established: 'Since 1995',
  contacts: ['8446656677', '9423424596'],
  offerLabel: 'Special Offer',
  modeDetail: 'Live Workshop',
  // Decorative artwork used when an event has no photo of its own
  art: {
    heroMain: {
      src: '/images/events/hero-woman-healing.jpg',
      width: 472,
      height: 632,
      alt: 'A woman with eyes closed, hands on her heart, glowing with gentle healing light'
    },
    heroSide: { src: '/images/events/hero-chakra-yogi.jpg', width: 360, height: 312, alt: '' },
    aboutArt: { src: '/images/events/workshop-lotus-pond.jpg', width: 440, height: 465, alt: '' }
  }
};

export const STATIC_EVENTS = [
  {
    id: 'online-reiki-level-1-workshop-2026-11',
    title: 'Online Reiki 1st Level Workshop',
    organizer: 'Reiki And Vaastu World',
    established: 'Since 1995',
    anniversary: 'Celebrating 31 Years of Reiki Journey',
    anniversaryYears: 31,
    // The event title split for the large hero lettering:
    // "Online" (small script) / "Reiki" (large) / "1st Level Workshop" (ribbon).
    heroTitle: { kicker: 'Online', main: 'Reiki', ribbon: '1st Level Workshop' },
    tagline: 'Learn, Heal & Transform with the Healing Energy of Reiki',
    startsAt: '2026-11-22T18:00:00+05:30',
    endsAt: '2026-11-22T20:30:00+05:30',
    schedule: {
      date: '22 November 2026',
      day: 'Sunday',
      time: '6:00 PM – 8:30 PM',
      mode: 'Online',
      modeDetail: 'Live Workshop',
      isOnline: true
    },
    description: [
      'Experience the power of Reiki healing through our Online Reiki 1st Level Workshop. Learn the fundamentals of Reiki, discover your inner healing potential, and understand how to use gentle healing energy for yourself and others.',
      'This special anniversary workshop offers an opportunity to begin your Reiki journey with guidance and learn simple techniques that encourage relaxation, emotional balance, self-awareness, and holistic well-being.'
    ],
    benefits: [
      { title: 'Reiki Level 1 Attunement', icon: 'Sparkles' },
      { title: 'Self-Healing & Healing Others', icon: 'HandHeart' },
      { title: 'Stress Relief & Emotional Balance', icon: 'Brain' },
      { title: 'Builds Confidence & Positive Thinking', icon: 'TrendingUp' },
      { title: 'Improves Relationships & Family Harmony', icon: 'Users' },
      { title: 'Supports Better Health, Happiness & Inner Peace', icon: 'HeartPulse' }
    ],
    whatToExpect: [
      { title: 'Simple & Effective Meditation Techniques', icon: 'Flower2' },
      { title: 'Hands-On Learning & Practice', icon: 'Hand' },
      { title: 'Reiki Attunement from an Experienced Guide', icon: 'Sun' },
      { title: 'A Peaceful & Healing Experience', icon: 'Heart' }
    ],
    pricePaise: 49900,
    originalPricePaise: 310000,
    offerLabel: 'Special Anniversary Offer',
    registrationOpen: true,
    contacts: ['8446656677', '9423424596'],
    image: {
      src: '/images/events/reiki-level-1-workshop.jpg',
      width: 350,
      height: 438,
      alt: 'Poster for the Online Reiki 1st Level Workshop by Reiki And Vaastu World on 22 November 2026, 6:00 PM to 8:30 PM, special anniversary offer ₹499'
    },
    // `heroMain` is shown beside the title, `heroSide` under the anniversary
    // badge, `aboutArt` beside "About the Workshop" (the last two are decorative).
    art: EVENT_DEFAULTS.art
  }
];

/** True once the event's end time has passed. */
export function isEventOver(event, now = new Date()) {
  const end = new Date(event?.endsAt || event?.startsAt || 0);
  return Number.isNaN(end.getTime()) ? false : end <= now;
}

/** One-line summary used as the event's subtitle in payments and emails. */
export function eventSubtitle(event) {
  const s = event.schedule || {};
  const when = [s.date, s.time ? `(${s.time})` : ''].filter(Boolean).join(' ');
  return [`${s.mode || 'Live'} ${s.modeDetail || 'Workshop'}`.trim(), when].filter(Boolean).join(' • ');
}
