import {
  Sparkles,
  HandHeart,
  Brain,
  TrendingUp,
  Users,
  HeartPulse,
  Flower2,
  Hand,
  Sun,
  Heart
} from 'lucide-react';

/**
 * Events shown on the Upcoming Events page (/upcoming-events).
 *
 * To add an event, append another object with the same shape. `startsAt` and
 * `endsAt` are ISO timestamps with the India offset (+05:30); once `endsAt`
 * has passed the event is no longer listed as upcoming.
 */
export const EVENTS = [
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
      { title: 'Reiki Level 1 Attunement', icon: Sparkles },
      { title: 'Self-Healing & Healing Others', icon: HandHeart },
      { title: 'Stress Relief & Emotional Balance', icon: Brain },
      { title: 'Builds Confidence & Positive Thinking', icon: TrendingUp },
      { title: 'Improves Relationships & Family Harmony', icon: Users },
      { title: 'Supports Better Health, Happiness & Inner Peace', icon: HeartPulse }
    ],
    whatToExpect: [
      { title: 'Simple & Effective Meditation Techniques', icon: Flower2 },
      { title: 'Hands-On Learning & Practice', icon: Hand },
      { title: 'Reiki Attunement from an Experienced Guide', icon: Sun },
      { title: 'A Peaceful & Healing Experience', icon: Heart }
    ],
    pricing: {
      currency: 'INR',
      actualFee: 3100,
      offerFee: 499,
      offerLabel: 'Special Anniversary Offer'
    },
    contacts: ['8446656677', '9423424596'],
    image: {
      src: '/images/events/reiki-level-1-workshop.jpg',
      width: 350,
      height: 438,
      alt: 'Poster for the Online Reiki 1st Level Workshop by Reiki And Vaastu World on 22 November 2026, 6:00 PM to 8:30 PM, special anniversary offer ₹499'
    },
    // Artwork for the event page. `heroMain` is shown beside the title,
    // `heroSide` under the anniversary badge, `aboutArt` beside "About the Workshop".
    // heroSide and aboutArt are decorative (empty alt).
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
  }
];

/** Events that have not finished yet, soonest first. */
export function getUpcomingEvents(now = new Date()) {
  return EVENTS.filter((event) => new Date(event.endsAt) > now).sort(
    (a, b) => new Date(a.startsAt) - new Date(b.startsAt)
  );
}

/** ₹ amount in Indian digit grouping, e.g. 3100 -> "₹3,100". */
export const formatRupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;

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
