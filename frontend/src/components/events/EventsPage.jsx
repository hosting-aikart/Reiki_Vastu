import React, { useEffect } from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { useCatalog } from '../../catalog/CatalogContext';
import EventDetail from './EventDetail';
import './EventsPage.css';

/** A finished event: poster, title and when it took place. */
function PastEventCard({ event }) {
  const { schedule } = event;
  return (
    <li className="ev-past-card">
      {event.image?.src && (
        <div className="ev-past-media">
          <img src={event.image.src} alt={event.image.alt || `${event.title} poster`} loading="lazy" />
        </div>
      )}
      <div className="ev-past-body">
        <span className="ev-past-badge">Completed</span>
        <h3>{event.title}</h3>
        {event.tagline && <p className="ev-past-tagline">{event.tagline}</p>}
        <ul className="ev-past-facts">
          <li><CalendarDays size={15} aria-hidden="true" /> {schedule.date}{schedule.day ? ` (${schedule.day})` : ''}</li>
          {schedule.time && <li><Clock size={15} aria-hidden="true" /> {schedule.time}</li>}
          {(schedule.mode || schedule.venue) && (
            <li><MapPin size={15} aria-hidden="true" /> {[schedule.mode, schedule.venue].filter(Boolean).join(' · ')}</li>
          )}
        </ul>
      </div>
    </li>
  );
}

export default function EventsPage({ onRegister }) {
  const { upcomingEvents, pastEvents } = useCatalog();

  useEffect(() => {
    document.title = 'Events | Reiki and Vaastu World';
  }, []);

  return (
    <div className="ev-page">
      <h1 className="ev-visually-hidden">Upcoming Events</h1>

      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
          <EventDetail key={event.id} event={event} onRegister={onRegister} />
        ))
      ) : (
        <div className="ev-container ev-empty">
          <img src="/logo/lotus_pure.webp" alt="" aria-hidden="true" />
          <h2>New workshops coming soon</h2>
          <p>
            For details of our next batch, call <a href="tel:8446656677">8446656677</a> /{' '}
            <a href="tel:9423424596">9423424596</a>.
          </p>
        </div>
      )}

      {pastEvents.length > 0 && (
        <section className="ev-container ev-past" aria-labelledby="past-events-heading">
          <div className="ev-ruled-heading">
            <span className="ev-ruled-line" aria-hidden="true" />
            <h2 id="past-events-heading" className="ev-script-heading">Past Events</h2>
            <span className="ev-ruled-line" aria-hidden="true" />
          </div>
          <ul className="ev-past-grid">
            {pastEvents.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
