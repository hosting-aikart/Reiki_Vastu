import React from 'react';
import { Sparkles } from 'lucide-react';

export const SACRED_PRODUCTS = [
  {
    id: 'black-obsidian',
    title: 'Black Obsidian',
    subtitle: 'Protection • Grounding • Aura Shield',
    price: '₹1,199',
    originalPrice: '₹1,599',
    badge: 'Best Seller',
    rating: '4.9',
    reviewsCount: 128,
    beadSize: '8 mm AAA Natural Volcanic Glass Beads',
    wristSize: 'Stretchable Free Size (6.5" – 8.0")',
    chakra: 'Root Chakra (Muladhara)',
    energization: 'Vedic Mantra & Usui Reiki Master Attuned',
    description: 'Absorbs negative energy, psychic smog, and emotional stress while grounding root chakra stability.',
    longDescription:
      'Handcrafted from 100% natural volcanic Black Obsidian beads, this sacred bracelet acts as an energetic shield against negativity, evil eye (Nazar), emotional draining, and environmental stress. Each bracelet is personally cleansed and energized with Vedic mantras and Reiki symbols by Dr. Naresh Chhabdiya prior to dispatch.',
    benefits: [
      'Forms a powerful protective aura shield against negative vibrations and psychic smog',
      'Grounds scattered energy through the Root Chakra (Muladhara) for deep stability',
      'Helps release emotional blockages, fear, and overthinking during stressful periods',
      'Ideal for professionals, healers, and individuals exposed to heavy public environments'
    ],
    howToWear:
      'Wear on your left wrist (receiving hand) to absorb protective grounding energy, or on your right wrist to project strength and ward off negativity.',
    image: '/Products/Black obsidian.png',
    alt: 'Energized Black Obsidian crystal bracelet for protection and grounding'
  },
  {
    id: 'clear-quartz',
    title: 'Clear Quartz',
    subtitle: 'Master Healer • Clarity • Amplification',
    price: '₹1,299',
    originalPrice: '₹1,699',
    badge: 'Master Healer',
    rating: '4.9',
    reviewsCount: 94,
    beadSize: '8 mm AAA Pure Himalayan Quartz Beads',
    wristSize: 'Stretchable Free Size (6.5" – 8.0")',
    chakra: 'Crown Chakra (Sahasrara) & All 7 Chakras',
    energization: 'Vedic Mantra & Usui Reiki Master Attuned',
    description: 'Amplifies healing intentions, clears mental fog, and harmonizes all seven chakras with pure light.',
    longDescription:
      'Revered across ancient traditions as the "Master Healer," Clear Quartz amplifies pure prana, sharpens concentration, and aligns all seven chakras. Personally consecrated at Reiki and Vaastu World to hold your highest healing and manifestation intentions.',
    benefits: [
      'Amplifies positive intentions, prayers, and the energy of surrounding stones',
      'Clears mental fog, enhances memory, focus, and decision-making clarity',
      'Harmonizes all seven chakras and strengthens the subtle bio-energetic aura',
      'Supports deep meditation, spiritual awakening, and restorative sleep'
    ],
    howToWear:
      'Best worn on the left wrist during meditation, study, or daily work to invite clarity and high-frequency prana.',
    image: '/Products/Clear Quartz.png',
    alt: 'Energized Clear Quartz crystal bracelet for clarity and chakra healing'
  },
  {
    id: 'green-aventurine',
    title: 'Green Aventurine',
    subtitle: 'Prosperity • Abundance • Heart Harmony',
    price: '₹1,149',
    originalPrice: '₹1,499',
    badge: 'Abundance Stone',
    rating: '4.8',
    reviewsCount: 112,
    beadSize: '8 mm AAA Natural Green Aventurine Beads',
    wristSize: 'Stretchable Free Size (6.5" – 8.0")',
    chakra: 'Heart Chakra (Anahata)',
    energization: 'Vedic Kuber & Reiki Abundance Attuned',
    description: 'The Stone of Opportunity—attracts luck, financial growth, and soothing emotional balance.',
    longDescription:
      'Known worldwide as the "Stone of Opportunity," Green Aventurine resonates deeply with the Heart Chakra to attract career breakthroughs, business prosperity, and emotional calm. Energized with Reiki and Vedic prosperity rituals for steady growth.',
    benefits: [
      'Attracts new career opportunities, business prosperity, and financial flow',
      'Opens and soothes the Heart Chakra (Anahata) for emotional harmony',
      'Encourages optimism, confidence, and decisive leadership in new ventures',
      'Balances electromagnetic stress from daily computer and mobile usage'
    ],
    howToWear:
      'Wear on your left wrist to welcome abundance, luck, and harmonious relationships into your life.',
    image: '/Products/Green aventurine.png',
    alt: 'Energized Green Aventurine crystal bracelet for prosperity and abundance'
  },
  {
    id: 'lava-stone',
    title: 'Lava Stone',
    subtitle: 'Strength • Courage • Root Stability',
    price: '₹999',
    originalPrice: '₹1,399',
    badge: 'Grounding & Calm',
    rating: '4.8',
    reviewsCount: 86,
    beadSize: '8 mm Natural Basalt Lava Beads',
    wristSize: 'Stretchable Free Size (6.5" – 8.0")',
    chakra: 'Root Chakra (Muladhara)',
    energization: 'Vedic Prana & Reiki Grounding Attuned',
    description: 'Born from the fiery core of the earth to ignite inner strength, calm anxiety, and anchor vitality.',
    longDescription:
      'Formed from solidified molten earth energy, natural Lava Stone combines the raw grounding power of Mother Earth with the fire of courage. Its porous surface also allows you to apply a drop of essential oil for all-day aromatherapy and emotional balance.',
    benefits: [
      'Ignites inner courage, willpower, and physical stamina during life transitions',
      'Calms restlessness, anxiety, and nervous tension by anchoring Root Chakra energy',
      'Naturally porous beads can hold soothing essential oils (sandalwood, lavender, frankincense)',
      'Promotes emotional resilience and steady grounded focus'
    ],
    howToWear:
      'Wear daily on either wrist; add a single drop of pure essential oil to 1–2 lava beads for continuous aromatic calm.',
    image: '/Products/Lawa stone.png',
    alt: 'Energized Lava Stone bracelet for strength, courage, and grounding'
  },
  {
    id: 'selenite',
    title: 'Selenite',
    subtitle: 'Aura Cleansing • Peace • Higher Vibration',
    price: '₹1,249',
    originalPrice: '₹1,649',
    badge: 'Sacred Purity',
    rating: '4.9',
    reviewsCount: 105,
    beadSize: '8 mm AAA Satin Spar Selenite Beads',
    wristSize: 'Stretchable Free Size (6.5" – 8.0")',
    chakra: 'Crown (Sahasrara) & Third Eye (Ajna)',
    energization: 'Lama-Fera & Reiki High-Frequency Attuned',
    description: 'Purifies energy fields, cleanses surrounding crystals, and invites serene spiritual awareness.',
    longDescription:
      'Named after Selene, the ancient goddess of the Moon, luminous Selenite carries one of the purest, highest vibrations in the mineral kingdom. It continuously cleanses your aura, dispels stagnant energy, and elevates your space with tranquil peace.',
    benefits: [
      'Continuously purifies the personal aura and clears stagnant or heavy energy',
      'Self-cleansing sacred crystal that also recharges other healing stones nearby',
      'Activates the Crown and Third Eye chakras for deep intuition and peaceful sleep',
      'Brings instant serenity, mental stillness, and spiritual protection'
    ],
    howToWear:
      'Wear on the left wrist during meditation, healing sessions, or daily routines; keep away from prolonged water immersion.',
    image: '/Products/selenite.png',
    alt: 'Energized Selenite crystal bracelet for aura cleansing and peace'
  }
];

export default function BusinessNeeds() {
  return (
    <section
      id="products-section"
      style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 50%, #f5f3ff 100%)',
        padding: '70px 0 85px',
        scrollMarginTop: '90px',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
      }}
    >
      <div className="hm-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef2f4',
              border: '1.5px solid #fecaca',
              padding: '5px 16px',
              borderRadius: '50px',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={14} color="#D2042D" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#D2042D',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              PRANA ENERGIZED COLLECTION
            </span>
          </div>

          <h2
            className="ff-redhat"
            style={{
              fontSize: 'clamp(28px, 3.4vw, 40px)',
              fontWeight: 800,
              color: '#3b0a11',
              margin: '0 0 10px'
            }}
          >
            Our Sacred Products
          </h2>
          <p style={{ color: '#5e2732', fontSize: '15px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            100% authentic crystal bracelets and spiritual remedies, personally cleansed and energized with Vedic &amp; Reiki rituals.
          </p>
        </div>

        {/* 5 Products Grid */}
        <div
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '22px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {SACRED_PRODUCTS.map((item) => (
            <article
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: '22px',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(180, 83, 9, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="hover:-translate-y-1.5 hover:shadow-lg"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D2042D';
                e.currentTarget.style.boxShadow = '0 14px 32px rgba(210, 4, 45, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 83, 9, 0.08)';
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1.05',
                  overflow: 'hidden',
                  background: '#faf3e8',
                  position: 'relative'
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease'
                  }}
                />
              </div>

              {/* Product Content */}
              <div
                style={{
                  padding: '16px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <h3
                  className="ff-redhat"
                  style={{
                    fontSize: '17.5px',
                    fontWeight: 800,
                    color: '#3b0a11',
                    margin: '0 0 4px'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#b45309',
                    margin: '0 0 8px',
                    letterSpacing: '0.02em'
                  }}
                >
                  {item.subtitle}
                </p>

                <p
                  style={{
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    color: '#5e2732',
                    margin: '0 0 12px',
                    flex: 1
                  }}
                >
                  {item.description}
                </p>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#D2042D',
                      background: '#fef2f4',
                      border: '1px solid #fecaca',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    ✦ Reiki Energized ✦
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
