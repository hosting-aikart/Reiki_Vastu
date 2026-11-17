// ─────────────────────────────────────────────────────────────
// The website's built-in courses: card details (used on the home page and
// the courses page) joined with the course page content (courseDetails.js).
//
// Courses can also be added, edited or deleted in the admin panel
// (Admin → Courses); see src/catalog/CatalogContext.jsx for how the two are
// merged. Icons are lucide-react icon names (see src/catalog/icons.js).
// `images` are shown one after another on the course page; the first one is
// also the card image.
// ─────────────────────────────────────────────────────────────

import { COURSE_DETAILS } from './courseDetails';

const COURSE_CARDS = [
  // Row 1
  {
    id: 'meditation',
    title: 'Meditation',
    subtitle: 'Inner Peace • Mindfulness • Self Growth',
    description: 'Cultivate deep mindfulness, emotional calm, and thoughtless awareness through guided meditation practices.',
    alt: 'Meditation course – guided mindfulness and inner peace practice',
    image: '/images/Meditation.webp',
    icon: 'Heart'
  },
  {
    id: 'reiki',
    title: 'Reiki',
    subtitle: 'Healing Energy • Balance • Well-being',
    description: 'Channel universal life-force energy with traditional Usui Reiki attunements for self-healing and chakra balance.',
    alt: 'Reiki healing course – universal life force energy and chakra balancing',
    image: '/images/Reiki.webp',
    icon: 'Sparkles'
  },
  {
    id: 'vaastu',
    title: 'Vaastu',
    subtitle: 'Harmonious Spaces • Prosperity • Positivity',
    description: 'Align homes and workplaces with the five natural elements and directional energies for lasting harmony.',
    alt: 'Vaastu Shastra course – spatial harmony and directional balance for homes and offices',
    image: '/images/vastu.webp',
    // Alternate views, shown one after another on the course page
    images: [
      '/images/vastu.webp',
      '/images/vastu-office.webp',
      '/images/vastu-compass.webp',
      '/images/vastu-farmhouse.webp'
    ],
    imageFit: 'contain',
    imagePosition: 'center center',
    imageBg: '#f3e5d0',
    icon: 'Home'
  },
  {
    id: 'feng-shui',
    title: 'Feng-Shui',
    subtitle: 'Flow of Energy • Balance • Abundance',
    description: 'Harmonize environmental Chi flow and balance Yin-Yang energies to attract peace and abundance.',
    alt: 'Feng-Shui course – harmonizing Chi energy and five elements in living spaces',
    image: '/images/Feng Shui.webp',
    imageFit: 'contain',
    imagePosition: 'center center',
    imageBg: '#f4ead8',
    icon: 'Sun'
  },

  // Row 2
  {
    id: 'dowsing',
    title: 'Dowsing',
    subtitle: 'Energy Detection • Subtle Vibrations',
    description: 'Master pendulum radiesthesia to detect subtle earth energies, geopathic stress, and intuitive guidance.',
    alt: 'Dowsing course – pendulum radiesthesia and subtle energy detection',
    image: '/images/Dowsing.webp',
    imagePosition: 'center 62%',
    icon: 'Compass'
  },
  {
    id: 'lama-fera',
    title: 'Lama-Fera',
    subtitle: 'Spiritual Healing • Enlightenment • Transformation',
    description: 'Experience ancient Tibetan Buddhist high-frequency healing to clear negative auras and deep blockages.',
    alt: 'Lama-Fera course – Tibetan Buddhist high-frequency spiritual healing',
    image: '/images/Lama Fera.webp',
    imagePosition: 'center center',
    icon: 'Award'
  },
  {
    id: 'crystal-therapy',
    title: 'Crystal Therapy',
    subtitle: 'Energy Cleansing • Emotional Healing',
    description: 'Harness the natural crystalline vibrations of stones to cleanse chakras and restore emotional balance.',
    alt: 'Crystal Therapy course – healing gemstones and chakra energy alignment',
    image: '/images/crystal-therapy.webp',
    imagePosition: 'center center',
    icon: 'Gem'
  },
  {
    id: 'pyramid',
    title: 'Pyramid Therapy',
    subtitle: 'Positivity • Manifestation • Growth',
    description: 'Utilize bio-cosmic pyramid geometry to amplify positive vibrations, relieve stress, and correct Vaastu defects.',
    alt: 'Pyramid Therapy course – geometric energy for positivity and Vaastu rectification',
    image: '/images/pyramid-therapy.webp',
    imageFit: 'contain',
    imagePosition: 'center center',
    imageBg: '#ffffff',
    icon: 'Layers'
  },

  // Row 3
  {
    id: 'numerology',
    title: 'Numerology',
    subtitle: 'Decode Numbers • Understand Life • Find Purpose',
    description: 'Decode the vibrational power of birth dates and names to uncover life purpose, timing, and auspicious remedies.',
    alt: 'Numerology course – decoding numbers, birth dates, and life path insights',
    image: '/images/Numerology.webp',
    icon: 'Hash'
  },
  {
    id: 'astrology',
    title: 'Astrology',
    subtitle: 'Guidance • Self-Discovery • Life Clarity',
    description: 'Explore Vedic Jyotish natal charts, planetary transits, and practical remedies for career and life clarity.',
    alt: 'Vedic Astrology course – birth chart analysis, planetary wisdom, and life guidance',
    image: '/images/Astrology.webp',
    icon: 'Compass'
  },
  {
    id: 'rudraksha',
    title: 'Rudraksha',
    subtitle: 'Spiritual Protection • Focus • Positivity',
    description: 'Learn the science of Mukhi Rudraksha beads for spiritual protection, focus, and planetary harmony.',
    alt: 'Rudraksha therapy course – Mukhi beads for spiritual protection and focus',
    image: '/images/Rudraksha.webp',
    icon: 'Shield'
  },
  {
    id: 'pranic-healing',
    title: 'Pranic Healing',
    subtitle: 'Life Energy • Healing • Vitality',
    description: 'Practice no-touch bio-plasmic energy cleansing and energizing techniques to accelerate physical and emotional recovery.',
    alt: 'Pranic Healing course – no-touch life energy cleansing and vitality restoration',
    image: '/images/Pranic Healing.webp',
    icon: 'Droplets'
  }
];

export const STATIC_COURSES = COURSE_CARDS.map((card) => ({
  ...COURSE_DETAILS[card.id],
  ...card,
  images: card.images || (card.image ? [card.image] : [])
}));

export const STATIC_COURSE_IDS = new Set(STATIC_COURSES.map((course) => course.id));
