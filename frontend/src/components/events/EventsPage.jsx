import React, { useEffect } from 'react';
import { getUpcomingEvents } from '../../data/events';
import EventDetail from './EventDetail';
import './EventsPage.css';

export default function EventsPage() {
  const events = getUpcomingEvents();

  useEffect(() => {
    document.title = 'Upcoming Events | Reiki and Vaastu World';
  }, []);

  return (
    <div className="ev-page">
      <h1 className="ev-visually-hidden">Upcoming Events</h1>

      {events.length > 0 ? (
        events.map((event) => <EventDetail key={event.id} event={event} />)
      ) : (
        <div className="ev-container ev-empty">
          <img src="/logo/lotus_pure.png" alt="" aria-hidden="true" />
          <h2>New workshops coming soon</h2>
          <p>
            For details of our next batch, call <a href="tel:8446656677">8446656677</a> /{' '}
            <a href="tel:9423424596">9423424596</a>.
          </p>
        </div>
      )}
    </div>
  );
}
