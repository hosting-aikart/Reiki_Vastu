import React from 'react';
import { ArrowRight, CalendarDays, Clock, Laptop, MessageCircle, Phone } from 'lucide-react';
import { formatRupees, whatsappRegistrationLink } from '../../data/events';

/* ── Small shared pieces ─────────────────────────────────────────── */

function RegisterButton({ event, variant = 'crimson', label = 'Register Now' }) {
  return (
    <a
      href={whatsappRegistrationLink(event)}
      target="_blank"
      rel="noopener noreferrer"
      className={`ev-btn ev-btn--${variant}`}
      aria-label={`${label} for the ${event.title} on WhatsApp (opens in a new tab)`}
    >
      {variant === 'crimson' && <MessageCircle size={17} aria-hidden="true" />}
      {label}
      <ArrowRight size={17} aria-hidden="true" className="ev-btn-arrow" />
    </a>
  );
}

/** Thin gold rule with a lotus in the middle:  ──── ✿ ──── */
function LotusRule({ className = '' }) {
  return (
    <span className={`ev-lotus-rule ${className}`} aria-hidden="true">
      <span className="ev-lotus-rule-line" />
      <img src="/logo/lotus_pure.webp" alt="" />
      <span className="ev-lotus-rule-line" />
    </span>
  );
}

/** Section title flanked by long gold rules, e.g. ─────── What to Expect ─────── */
function RuledHeading({ id, children }) {
  return (
    <div className="ev-ruled-heading">
      <span className="ev-ruled-line" aria-hidden="true" />
      <h3 id={id} className="ev-script-heading">{children}</h3>
      <span className="ev-ruled-line" aria-hidden="true" />
    </div>
  );
}

function PhoneLinks({ numbers }) {
  return (
    <span className="ev-phones">
      {numbers.map((number, i) => (
        <React.Fragment key={number}>
          {i > 0 && <span aria-hidden="true">/</span>}
          <a href={`tel:${number}`} aria-label={`Call ${number}`}>
            {number}
          </a>
        </React.Fragment>
      ))}
    </span>
  );
}

/* ── Sections ────────────────────────────────────────────────────── */

function EventHero({ event, headingId }) {
  const { heroTitle, art } = event;
  return (
    <section className="ev-hero">
      <div className="ev-container ev-hero-grid">
        <figure className="ev-hero-portrait">
          <img src={art.heroMain.src} alt={art.heroMain.alt} width={art.heroMain.width} height={art.heroMain.height} />
        </figure>

        <div className="ev-hero-center">
          <img className="ev-hero-lotus" src="/logo/lotus_pure.webp" alt="" aria-hidden="true" />
          <p className="ev-hero-org">{event.organizer}</p>
          <p className="ev-hero-since">
            <span className="ev-hero-since-line" aria-hidden="true" />
            {event.established}
            <span className="ev-hero-since-line" aria-hidden="true" />
          </p>

          <h2 id={headingId} className="ev-hero-title">
            <span className="ev-hero-kicker">{heroTitle.kicker}</span>{' '}
            <span className="ev-hero-main">{heroTitle.main}</span>{' '}
            <span className="ev-hero-ribbon">{heroTitle.ribbon}</span>
          </h2>

          <p className="ev-hero-tagline">{event.tagline}</p>
          <LotusRule />

          <div className="ev-hero-actions">
            <RegisterButton event={event} />
            <a href={`tel:${event.contacts[0]}`} className="ev-btn ev-btn--outline">
              <Phone size={16} aria-hidden="true" /> Call {event.contacts[0]}
            </a>
          </div>
        </div>

        <div className="ev-hero-side">
          <div className="ev-medallion" role="img" aria-label={event.anniversary}>
            <span className="ev-medallion-top">Celebrating</span>
            <span className="ev-medallion-num">{event.anniversaryYears}</span>
            <span className="ev-medallion-bottom">Years of Reiki Journey</span>
          </div>
          <img
            className="ev-hero-yogi"
            src={art.heroSide.src}
            alt=""
            aria-hidden="true"
            width={art.heroSide.width}
            height={art.heroSide.height}
          />
        </div>
      </div>
    </section>
  );
}

function EventBenefits({ benefits, id }) {
  return (
    <section className="ev-container ev-benefits-wrap" aria-labelledby={id}>
      <div className="ev-benefits-card">
        <div className="ev-pill-heading">
          <span className="ev-pill-line" aria-hidden="true" />
          <h3 id={id} className="ev-pill">Workshop Benefits</h3>
          <span className="ev-pill-line" aria-hidden="true" />
        </div>
        <ul className="ev-benefits">
          {benefits.map(({ title, icon: Icon }) => (
            <li key={title} className="ev-benefit">
              <Icon size={34} strokeWidth={1.4} aria-hidden="true" />
              <span>{title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EventDetailsAndAbout({ event, id }) {
  const { schedule, art } = event;
  const items = [
    { label: 'Date', value: schedule.date, note: schedule.day, icon: CalendarDays },
    { label: 'Time', value: schedule.time, icon: Clock },
    { label: 'Mode', value: schedule.mode, note: schedule.modeDetail, icon: Laptop }
  ];
  return (
    <section className="ev-container ev-about" aria-labelledby={id}>
      <dl className="ev-facts-card">
        {items.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="ev-fact">
            <Icon size={34} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <dt>{label}</dt>
              <dd>
                <strong>{value}</strong>
                {note && <span>({note})</span>}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="ev-about-text">
        <h3 id={id} className="ev-script-heading">About the Workshop</h3>
        <LotusRule className="ev-lotus-rule--left" />
        {event.description.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <RegisterButton event={event} variant="gold" />
      </div>

      <img
        className="ev-about-art"
        loading="lazy"
        src={art.aboutArt.src}
        alt=""
        aria-hidden="true"
        width={art.aboutArt.width}
        height={art.aboutArt.height}
      />
    </section>
  );
}

function EventExpect({ items, id }) {
  return (
    <section className="ev-container ev-expect" aria-labelledby={id}>
      <RuledHeading id={id}>What to Expect</RuledHeading>
      <LotusRule className="ev-lotus-rule--tight" />
      <ul className="ev-expect-grid">
        {items.map(({ title, icon: Icon }) => (
          <li key={title} className="ev-expect-card">
            <span className="ev-expect-icon">
              <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span>{title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EventOffer({ event, id }) {
  const { pricing } = event;
  return (
    <section className="ev-container ev-offer-wrap" aria-labelledby={id}>
      <div className="ev-offer">
        <div className="ev-offer-col ev-offer-actual">
          <span className="ev-offer-label">Actual Fee</span>
          <s aria-label={`Actual fee ${formatRupees(pricing.actualFee)}`}>{formatRupees(pricing.actualFee)}</s>
        </div>
        <span className="ev-offer-divider" aria-hidden="true" />
        <div className="ev-offer-col ev-offer-special">
          <h3 id={id} className="ev-offer-label ev-offer-label--light">{pricing.offerLabel}</h3>
          <strong>{formatRupees(pricing.offerFee)}</strong>
          <span className="ev-offer-save">You save {formatRupees(pricing.actualFee - pricing.offerFee)}</span>
        </div>
        <span className="ev-offer-divider" aria-hidden="true" />
        <div className="ev-offer-col">
          <RegisterButton event={event} variant="gold" />
        </div>
      </div>
      <p className="ev-contact-line">
        <Phone size={16} aria-hidden="true" />
        <span>For Registration and Details Contact:</span>
        <PhoneLinks numbers={event.contacts} />
      </p>
    </section>
  );
}

export default function EventDetail({ event }) {
  const ids = {
    title: `${event.id}-title`,
    benefits: `${event.id}-benefits`,
    about: `${event.id}-about`,
    expect: `${event.id}-expect`,
    offer: `${event.id}-offer`
  };
  return (
    <article className="ev-event" aria-labelledby={ids.title}>
      <EventHero event={event} headingId={ids.title} />
      <EventBenefits benefits={event.benefits} id={ids.benefits} />
      <EventDetailsAndAbout event={event} id={ids.about} />
      {event.whatToExpect?.length > 0 && <EventExpect items={event.whatToExpect} id={ids.expect} />}
      <EventOffer event={event} id={ids.offer} />
    </article>
  );
}
