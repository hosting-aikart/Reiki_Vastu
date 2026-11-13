import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Clock, Laptop, MessageCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { getUpcomingEvents, formatRupees, whatsappRegistrationLink } from '../../data/events';
import './EventPopup.css';

// Remembered for the browser session, so the popup appears once when the site
// is opened and not again on every page change after the visitor closes it.
const DISMISSED_KEY = 'eventPopupDismissed';

function wasDismissed(eventId) {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === eventId;
  } catch {
    return false;
  }
}

function rememberDismissed(eventId) {
  try {
    sessionStorage.setItem(DISMISSED_KEY, eventId);
  } catch {
    /* storage unavailable (private mode): the popup may show again, which is harmless */
  }
}

/**
 * Announcement popup for the next upcoming event, shown as soon as the site opens.
 * Renders nothing when there is no upcoming event or it was already closed this session.
 */
export default function EventPopup({ onViewDetails }) {
  const [event] = useState(() => getUpcomingEvents()[0] || null);
  const [open, setOpen] = useState(() => Boolean(event) && !wasDismissed(event.id));
  const cardRef = useRef(null);

  const close = () => {
    rememberDismissed(event.id);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const { schedule, pricing } = event;
  const titleId = `${event.id}-popup-title`;

  return (
    <div
      className="modal-overlay evp-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={cardRef} tabIndex={-1} className="evp-card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="modal-close-btn evp-close" onClick={close} aria-label="Close event announcement">
          <X size={20} />
        </button>

        <div className="evp-media">
          <img src={event.image.src} alt={event.image.alt} width={event.image.width} height={event.image.height} />
        </div>

        <div className="evp-body">
          <p className="evp-eyebrow">
            <Sparkles size={13} aria-hidden="true" /> Upcoming Event
          </p>
          <p className="evp-anniversary">{event.anniversary}</p>
          <h2 id={titleId} className="evp-title">{event.title}</h2>
          <p className="evp-tagline">{event.tagline}</p>

          <ul className="evp-facts">
            <li>
              <CalendarDays size={16} aria-hidden="true" />
              <span>{schedule.date} ({schedule.day})</span>
            </li>
            <li>
              <Clock size={16} aria-hidden="true" />
              <span>{schedule.time}</span>
            </li>
            <li>
              <Laptop size={16} aria-hidden="true" />
              <span>{schedule.mode} {schedule.modeDetail}</span>
            </li>
          </ul>

          <div className="evp-price">
            <span className="evp-price-label">{pricing.offerLabel}</span>
            <span className="evp-price-row">
              <strong>{formatRupees(pricing.offerFee)}</strong>
              <s aria-label={`Actual fee ${formatRupees(pricing.actualFee)}`}>{formatRupees(pricing.actualFee)}</s>
            </span>
          </div>

          <div className="evp-actions">
            <a
              href={whatsappRegistrationLink(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="evp-btn evp-btn-primary"
              onClick={close}
              aria-label={`Register Now for the ${event.title} on WhatsApp (opens in a new tab)`}
            >
              <MessageCircle size={17} aria-hidden="true" /> Register Now
            </a>
            <button
              type="button"
              className="evp-btn evp-btn-outline"
              onClick={() => {
                close();
                onViewDetails();
              }}
            >
              View Event Details <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
