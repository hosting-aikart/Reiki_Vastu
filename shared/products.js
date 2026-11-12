// ─────────────────────────────────────────────────────────────
// Product catalog: the single source of truth for products and prices.
//
// The frontend reads this for display, and the backend reads the SAME data to
// calculate what to charge. The browser only ever sends a product id and a
// quantity; the server never accepts a price from it.
//
// Prices are integer paise (₹1,199.00 = 119900), matching what Razorpay expects.
// Keep `id` stable once orders refer to it: add a new product instead of renaming.
//
// ⚠️ PROVISIONAL PRICES: not yet confirmed by the business. Confirm every
// pricePaise before switching Razorpay to Live Mode, then set
// PRICES_CONFIRMED to true.
//
// Delivery charges and GST: not decided yet. For now the price is the total
// charged (all-inclusive).
// ─────────────────────────────────────────────────────────────

export const PRICES_CONFIRMED = false;

export const PRODUCT_CURRENCY = 'INR';

export const PRODUCTS = [
  {
    id: "black-obsidian",
    pricePaise: 119900,
    originalPricePaise: 159900,
    maxQuantity: 5,
    available: true,
    title: "Black Obsidian",
    subtitle: "Protection • Grounding • Aura Shield",
    badge: "Best Seller",
    rating: "4.9",
    reviewsCount: 128,
    beadSize: "8 mm AAA Natural Volcanic Glass Beads",
    wristSize: "Stretchable Free Size (6.5\" – 8.0\")",
    chakra: "Root Chakra (Muladhara)",
    energization: "Vedic Mantra & Usui Reiki Master Attuned",
    description: "Absorbs negative energy, psychic smog, and emotional stress while grounding root chakra stability.",
    longDescription: "Handcrafted from 100% natural volcanic Black Obsidian beads, this sacred bracelet acts as an energetic shield against negativity, evil eye (Nazar), emotional draining, and environmental stress. Each bracelet is personally cleansed and energized with Vedic mantras and Reiki symbols by Dr. Naresh Chhabdiya prior to dispatch.",
    benefits: [
      "Forms a powerful protective aura shield against negative vibrations and psychic smog",
      "Grounds scattered energy through the Root Chakra (Muladhara) for deep stability",
      "Helps release emotional blockages, fear, and overthinking during stressful periods",
      "Ideal for professionals, healers, and individuals exposed to heavy public environments"
    ],
    howToWear: "Wear on your left wrist (receiving hand) to absorb protective grounding energy, or on your right wrist to project strength and ward off negativity.",
    image: "/Products/Black obsidian.png",
    alt: "Energized Black Obsidian crystal bracelet for protection and grounding"
  },
  {
    id: "clear-quartz",
    pricePaise: 129900,
    originalPricePaise: 169900,
    maxQuantity: 5,
    available: true,
    title: "Clear Quartz",
    subtitle: "Master Healer • Clarity • Amplification",
    badge: "Master Healer",
    rating: "4.9",
    reviewsCount: 94,
    beadSize: "8 mm AAA Pure Himalayan Quartz Beads",
    wristSize: "Stretchable Free Size (6.5\" – 8.0\")",
    chakra: "Crown Chakra (Sahasrara) & All 7 Chakras",
    energization: "Vedic Mantra & Usui Reiki Master Attuned",
    description: "Amplifies healing intentions, clears mental fog, and harmonizes all seven chakras with pure light.",
    longDescription: "Revered across ancient traditions as the \"Master Healer,\" Clear Quartz amplifies pure prana, sharpens concentration, and aligns all seven chakras. Personally consecrated at Reiki and Vastu World to hold your highest healing and manifestation intentions.",
    benefits: [
      "Amplifies positive intentions, prayers, and the energy of surrounding stones",
      "Clears mental fog, enhances memory, focus, and decision-making clarity",
      "Harmonizes all seven chakras and strengthens the subtle bio-energetic aura",
      "Supports deep meditation, spiritual awakening, and restorative sleep"
    ],
    howToWear: "Best worn on the left wrist during meditation, study, or daily work to invite clarity and high-frequency prana.",
    image: "/Products/Clear Quartz.png",
    alt: "Energized Clear Quartz crystal bracelet for clarity and chakra healing"
  },
  {
    id: "green-aventurine",
    pricePaise: 114900,
    originalPricePaise: 149900,
    maxQuantity: 5,
    available: true,
    title: "Green Aventurine",
    subtitle: "Prosperity • Abundance • Heart Harmony",
    badge: "Abundance Stone",
    rating: "4.8",
    reviewsCount: 112,
    beadSize: "8 mm AAA Natural Green Aventurine Beads",
    wristSize: "Stretchable Free Size (6.5\" – 8.0\")",
    chakra: "Heart Chakra (Anahata)",
    energization: "Vedic Kuber & Reiki Abundance Attuned",
    description: "The Stone of Opportunity—attracts luck, financial growth, and soothing emotional balance.",
    longDescription: "Known worldwide as the \"Stone of Opportunity,\" Green Aventurine resonates deeply with the Heart Chakra to attract career breakthroughs, business prosperity, and emotional calm. Energized with Reiki and Vedic prosperity rituals for steady growth.",
    benefits: [
      "Attracts new career opportunities, business prosperity, and financial flow",
      "Opens and soothes the Heart Chakra (Anahata) for emotional harmony",
      "Encourages optimism, confidence, and decisive leadership in new ventures",
      "Balances electromagnetic stress from daily computer and mobile usage"
    ],
    howToWear: "Wear on your left wrist to welcome abundance, luck, and harmonious relationships into your life.",
    image: "/Products/Green aventurine.png",
    alt: "Energized Green Aventurine crystal bracelet for prosperity and abundance"
  },
  {
    id: "lava-stone",
    pricePaise: 99900,
    originalPricePaise: 139900,
    maxQuantity: 5,
    available: true,
    title: "Lava Stone",
    subtitle: "Strength • Courage • Root Stability",
    badge: "Grounding & Calm",
    rating: "4.8",
    reviewsCount: 86,
    beadSize: "8 mm Natural Basalt Lava Beads",
    wristSize: "Stretchable Free Size (6.5\" – 8.0\")",
    chakra: "Root Chakra (Muladhara)",
    energization: "Vedic Prana & Reiki Grounding Attuned",
    description: "Born from the fiery core of the earth to ignite inner strength, calm anxiety, and anchor vitality.",
    longDescription: "Formed from solidified molten earth energy, natural Lava Stone combines the raw grounding power of Mother Earth with the fire of courage. Its porous surface also allows you to apply a drop of essential oil for all-day aromatherapy and emotional balance.",
    benefits: [
      "Ignites inner courage, willpower, and physical stamina during life transitions",
      "Calms restlessness, anxiety, and nervous tension by anchoring Root Chakra energy",
      "Naturally porous beads can hold soothing essential oils (sandalwood, lavender, frankincense)",
      "Promotes emotional resilience and steady grounded focus"
    ],
    howToWear: "Wear daily on either wrist; add a single drop of pure essential oil to 1–2 lava beads for continuous aromatic calm.",
    image: "/Products/Lawa stone.png",
    alt: "Energized Lava Stone bracelet for strength, courage, and grounding"
  },
  {
    id: "selenite",
    pricePaise: 124900,
    originalPricePaise: 164900,
    maxQuantity: 5,
    available: true,
    title: "Selenite",
    subtitle: "Aura Cleansing • Peace • Higher Vibration",
    badge: "Sacred Purity",
    rating: "4.9",
    reviewsCount: 105,
    beadSize: "8 mm AAA Satin Spar Selenite Beads",
    wristSize: "Stretchable Free Size (6.5\" – 8.0\")",
    chakra: "Crown (Sahasrara) & Third Eye (Ajna)",
    energization: "Lama-Fera & Reiki High-Frequency Attuned",
    description: "Purifies energy fields, cleanses surrounding crystals, and invites serene spiritual awareness.",
    longDescription: "Named after Selene, the ancient goddess of the Moon, luminous Selenite carries one of the purest, highest vibrations in the mineral kingdom. It continuously cleanses your aura, dispels stagnant energy, and elevates your space with tranquil peace.",
    benefits: [
      "Continuously purifies the personal aura and clears stagnant or heavy energy",
      "Self-cleansing sacred crystal that also recharges other healing stones nearby",
      "Activates the Crown and Third Eye chakras for deep intuition and peaceful sleep",
      "Brings instant serenity, mental stillness, and spiritual protection"
    ],
    howToWear: "Wear on the left wrist during meditation, healing sessions, or daily routines; keep away from prolonged water immersion.",
    image: "/Products/selenite.png",
    alt: "Energized Selenite crystal bracelet for aura cleansing and peace"
  }
];

export const findProductById = (id) => PRODUCTS.find((product) => product.id === id) || null;

const rupeeFormatter = (fractionDigits) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: PRODUCT_CURRENCY,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });

/** 119900 -> "₹1,199"; 25050 -> "₹250.50". Display only. */
export function formatPaise(paise) {
  return rupeeFormatter(paise % 100 === 0 ? 0 : 2).format(paise / 100);
}
