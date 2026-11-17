// ─────────────────────────────────────────────────────────────
// Product catalog: the single source of truth for products and prices.
//
// The frontend reads this for display, and the backend reads the SAME data to
// calculate what to charge. The browser only ever sends a product id and a
// quantity; the server never accepts a price from it.
//
// Prices are integer paise (₹1,199.00 = 119900), matching what Razorpay expects.
// A product whose price is not announced yet has pricePaise: null (shown as
// "Coming Soon") and cannot be bought.
// Keep `id` stable once orders refer to it: add a new product instead of renaming.
//
// ⚠️ PROVISIONAL PRICES: not yet confirmed by the business. Confirm every
// pricePaise before switching Razorpay to Live Mode, then set
// PRICES_CONFIRMED to true.
//
// Delivery charges and GST: not decided yet. For now the price is the total
// charged (all-inclusive).
// ─────────────────────────────────────────────────────────────

import { STATIC_EVENTS, isEventOver, eventSubtitle } from './events.js';

export const PRICES_CONFIRMED = false;

export const PRODUCT_CURRENCY = 'INR';

// ─────────────────────────────────────────────────────────────
// Product images
//
// All product photos live in frontend/public/Products_images, named
// "<imageName> view <n>.jpeg" (for example "Amethyst view 1.jpeg").
// View 1 is the main image used on product cards. The website finds every
// view of a product automatically (see frontend/vite.config.js), so to
// replace a photo, overwrite the file with the same name; to add a photo,
// add the next "view <n>.jpeg". No code change is needed for either.
// ─────────────────────────────────────────────────────────────

export const PRODUCT_IMAGES_DIR = '/Products_images';

/**
 * URL of one view of a product's photo. Spaces are encoded; "+" is kept as is,
 * because some static servers don't decode "%2B" back to "+".
 */
export function productImageUrl(imageName, view = 1) {
  const file = encodeURIComponent(`${imageName} view ${view}.jpeg`).replace(/%2B/g, '+');
  return `${PRODUCT_IMAGES_DIR}/${file}`;
}

// ─────────────────────────────────────────────────────────────
// Catalogue
//
// Descriptions only state what the client's product photos show (stone,
// 8 mm beads, Buddha charm, elastic cord; the anklet's specifications).
// Traditional crystal associations are presented as beliefs, not results.
//
// Prices confirmed by the client on 15 Nov 2026.
// pricePaise: null = price not announced yet. The product is shown with
// "Coming Soon" and cannot be bought until a price is set here or in the
// admin panel (Admin → Products).
// ─────────────────────────────────────────────────────────────

const BRACELET_SPECS = (stones) => [
  { label: 'Stone', value: stones },
  { label: 'Bead size', value: '8 mm' },
  { label: 'Charm', value: 'Buddha charm' },
  { label: 'Bracelet type', value: 'Elastic (stretchable) cord' }
];

const PRODUCT_LIST = [
  {
    id: "rose-quartz",
    imageName: "Rose quartz",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Rose Quartz",
    subtitle: "Rose Quartz Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of soft pink rose quartz beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm pale pink rose quartz beads strung on an elastic cord, with a single Buddha charm. In crystal traditions, rose quartz is associated with love, compassion and emotional calm.",
    specifications: BRACELET_SPECS("Rose quartz")
  },
  {
    id: "amethyst",
    imageName: "Amethyst",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Amethyst",
    subtitle: "Amethyst Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of purple amethyst beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm purple amethyst beads strung on an elastic cord, with a single Buddha charm. In crystal traditions, amethyst is associated with calm, meditation and spiritual practice.",
    specifications: BRACELET_SPECS("Amethyst")
  },
  {
    id: "clear-quartz",
    imageName: "Clear Quartz",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Clear Quartz",
    subtitle: "Clear Quartz Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of transparent clear quartz beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm transparent clear quartz beads strung on an elastic cord, with a single Buddha charm. In crystal traditions, clear quartz is associated with clarity and focus.",
    specifications: BRACELET_SPECS("Clear quartz")
  },
  {
    id: "green-aventurine",
    imageName: "Green Aventurine",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Green Aventurine",
    subtitle: "Green Aventurine Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of green aventurine beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm green aventurine beads strung on an elastic cord, with a single Buddha charm. In crystal traditions, green aventurine is associated with opportunity, growth and optimism.",
    specifications: BRACELET_SPECS("Green aventurine")
  },
  {
    id: "tiger-eye",
    imageName: "Tiger eye",
    pricePaise: null,
    originalPricePaise: null,
    title: "Tiger Eye",
    subtitle: "Tiger Eye Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of golden-brown tiger eye beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm tiger eye beads, which show golden-brown bands, strung on an elastic cord with a single Buddha charm. In crystal traditions, tiger eye is associated with courage, focus and confidence.",
    specifications: BRACELET_SPECS("Tiger eye")
  },
  {
    id: "carnelian",
    imageName: "Carnelian",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Carnelian",
    subtitle: "Carnelian Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of orange-red carnelian beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm carnelian beads in shades from warm orange to deep red, strung on an elastic cord with a single Buddha charm. In crystal traditions, carnelian is associated with motivation, confidence and creativity.",
    specifications: BRACELET_SPECS("Carnelian")
  },
  {
    id: "selenite",
    imageName: "Selenite",
    pricePaise: 69900,
    originalPricePaise: 129900,
    title: "Selenite",
    subtitle: "Selenite Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of milky-white selenite beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm milky-white selenite beads with a soft silky sheen, strung on an elastic cord with a single Buddha charm. Selenite is a soft stone that is sensitive to water, so keep the bracelet dry. In crystal traditions, selenite is associated with cleansing and calm.",
    specifications: [...BRACELET_SPECS("Selenite"), { label: 'Care', value: 'Keep away from water' }]
  },
  {
    id: "lava-stone",
    imageName: "Lava stone",
    pricePaise: 59900,
    originalPricePaise: 119900,
    title: "Lava Stone",
    subtitle: "Lava Stone Bracelet • Porous Black Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of black, porous lava stone beads with a Buddha charm.",
    longDescription: "This bracelet is made with black lava stone beads, which have a natural porous texture, strung on an elastic cord with a single Buddha charm. In crystal traditions, lava stone is associated with grounding and strength.",
    specifications: [
      { label: 'Stone', value: 'Lava stone' },
      { label: 'Charm', value: 'Buddha charm' },
      { label: 'Bracelet type', value: 'Elastic (stretchable) cord' }
    ]
  },
  {
    id: "firoza-turquoise",
    imageName: "Firoza",
    pricePaise: 79900,
    originalPricePaise: 149900,
    title: "Firoza (Turquoise)",
    subtitle: "Firoza Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of blue-green firoza (turquoise) beads with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm blue-green firoza (turquoise) beads with dark matrix lines, so each bead's pattern is slightly different. The beads are strung on an elastic cord with a single Buddha charm. In crystal traditions, firoza is associated with protection and good fortune.",
    specifications: BRACELET_SPECS("Firoza (turquoise)")
  },
  {
    id: "labradorite",
    imageName: "Labradorite",
    pricePaise: null,
    originalPricePaise: null,
    title: "Labradorite",
    subtitle: "Labradorite Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of grey labradorite beads with a blue flash, with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm grey labradorite beads that show a play of blue colour in the light (labradorescence), strung on an elastic cord with a single Buddha charm. In crystal traditions, labradorite is associated with intuition and transformation.",
    specifications: BRACELET_SPECS("Labradorite")
  },
  {
    id: "lapis-lazuli",
    imageName: "Lapiz lazuli",
    pricePaise: 74900,
    originalPricePaise: 144900,
    title: "Lapis Lazuli",
    subtitle: "Lapis Lazuli Bracelet • 8 mm Beads",
    badge: "Crystal Bracelet",
    description: "A bracelet of deep blue lapis lazuli beads with golden flecks, with a Buddha charm.",
    longDescription: "This bracelet is made with 8 mm deep blue lapis lazuli beads with golden flecks, strung on an elastic cord with a single Buddha charm. In crystal traditions, lapis lazuli is associated with wisdom, truth and clear communication.",
    specifications: BRACELET_SPECS("Lapis lazuli")
  },
  {
    id: "rose-quartz-amethyst",
    imageName: "Rose quartz and Amethyst Combination",
    pricePaise: 79900,
    originalPricePaise: 140000,
    title: "Rose Quartz + Amethyst",
    subtitle: "Combination Bracelet • 8 mm Beads",
    badge: "Combination Bracelet",
    description: "A bracelet of alternating rose quartz and amethyst beads with a Buddha charm.",
    longDescription: "This bracelet combines 8 mm pink rose quartz and purple amethyst beads in an alternating pattern, strung on an elastic cord with a single Buddha charm. In crystal traditions, rose quartz is associated with love and compassion, and amethyst with calm.",
    specifications: [
      ...BRACELET_SPECS("Rose quartz and amethyst"),
      { label: 'Pattern', value: 'Alternating beads' }
    ]
  },
  {
    id: "tiger-eye-citrine",
    imageName: "Tiger eye and citrine",
    pricePaise: 79900,
    originalPricePaise: 140000,
    title: "Tiger Eye + Citrine",
    subtitle: "Combination Bracelet • 8 mm Beads",
    badge: "Combination Bracelet",
    description: "A bracelet of alternating tiger eye and citrine beads with a Buddha charm.",
    longDescription: "This bracelet combines 8 mm golden-brown tiger eye and yellow citrine beads in an alternating pattern, strung on an elastic cord with a single Buddha charm. In crystal traditions, tiger eye is associated with courage and focus, and citrine with abundance and positivity.",
    specifications: [
      ...BRACELET_SPECS("Tiger eye and citrine"),
      { label: 'Pattern', value: 'Alternating beads' }
    ]
  },
  {
    id: "tiger-eye-pyrite-green-aventurine",
    imageName: "Tiger eye and Pyrite and green aventurine combination",
    pricePaise: 89900,
    originalPricePaise: 149900,
    title: "Tiger Eye + Pyrite + Green Aventurine",
    subtitle: "Combination Bracelet • 8 mm Beads",
    badge: "Combination Bracelet",
    description: "A bracelet of tiger eye, pyrite and green aventurine beads with a Buddha charm.",
    longDescription: "This bracelet combines tiger eye, metallic pyrite and green aventurine beads (about 8 mm) in a repeating sequence, strung on an elastic cord with a single Buddha charm. In crystal traditions, these stones are associated with confidence, prosperity and growth.",
    specifications: [
      { label: 'Stones', value: 'Tiger eye, pyrite and green aventurine' },
      { label: 'Bead size', value: '8 mm (approx.)' },
      { label: 'Pattern', value: 'Repeating sequence: tiger eye, pyrite, green aventurine' },
      { label: 'Charm', value: 'Buddha charm' },
      { label: 'Bracelet type', value: 'Elastic (stretchable) cord' }
    ]
  },
  {
    id: "pyrite-anklet",
    imageName: "Pyrite Anklet",
    pricePaise: 39900,
    originalPricePaise: 99900,
    title: "Pyrite Anklet",
    subtitle: "Faceted Pyrite Beads • Adjustable Length",
    badge: "Anklet",
    description: "A fine anklet of small diamond-cut pyrite beads with an adjustable chain.",
    longDescription: "This anklet is made with small diamond-cut (faceted) pyrite beads of about 2–3 mm, which have a metallic golden shine. It closes with a lobster clasp and has a chain extender to adjust the length. In crystal traditions, pyrite is associated with prosperity and confidence.",
    specifications: [
      { label: 'Gemstone', value: 'Pyrite' },
      { label: 'Bead shape', value: 'Diamond-cut (faceted)' },
      { label: 'Bead size', value: '2–3 mm (approx.)' },
      { label: 'Length', value: 'Adjustable, with chain extender' },
      { label: 'Closure', value: 'Lobster clasp' }
    ]
  }
];

/** An event in the shape of a product, so it can be paid for like one. */
export function eventAsProduct(event) {
  return {
    id: event.id,
    isEvent: true,
    pricePaise: event.pricePaise ?? null,
    originalPricePaise: event.originalPricePaise ?? null,
    maxQuantity: 1,
    available: event.registrationOpen !== false && event.pricePaise != null && !isEventOver(event),
    title: event.title,
    subtitle: eventSubtitle(event),
    badge: event.offerLabel || 'Workshop',
    description: event.tagline || event.title,
    image: event.image?.src || null,
    alt: `${event.title} poster`,
    endsAt: event.endsAt
  };
}

// Products with a price are listed first, then the "Coming Soon" ones
const BY_PRICE_FIRST = (a, b) => (a.pricePaise == null) - (b.pricePaise == null);

export const PRODUCTS = [
  ...[...PRODUCT_LIST].sort(BY_PRICE_FIRST).map((product) => ({
    maxQuantity: 5,
    available: product.pricePaise != null,
    ...product,
    image: productImageUrl(product.imageName, 1),
    alt: `${product.title} ${product.badge.toLowerCase()} from Reiki and Vaastu World`
  })),
  // Events are sold like products (one registration per order). Their details
  // live in shared/events.js.
  ...STATIC_EVENTS.map(eventAsProduct)
];

export const findProductById = (id) => PRODUCTS.find((product) => product.id === id) || null;

const rupeeFormatter = (fractionDigits) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: PRODUCT_CURRENCY,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });

export const PRICE_ON_REQUEST_LABEL = 'Coming Soon';

/** 119900 -> "₹1,199"; 25050 -> "₹250.50"; null -> "Coming Soon". Display only. */
export function formatPaise(paise) {
  if (!Number.isFinite(paise)) return PRICE_ON_REQUEST_LABEL;
  return rupeeFormatter(paise % 100 === 0 ? 0 : 2).format(paise / 100);
}
