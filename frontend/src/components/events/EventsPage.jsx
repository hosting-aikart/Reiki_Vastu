import React, { useEffect, useState } from 'react';
import { getUpcomingEvents } from '../../data/events';
import { getProducts } from '../../api/paymentClient';
import EventDetail from './EventDetail';
import './EventsPage.css';

export default function EventsPage({ onRegister }) {
  const baseEvents = getUpcomingEvents();
  const [liveCatalog, setLiveCatalog] = useState({});

  useEffect(() => {
    document.title = 'Upcoming Events | Reiki and Vaastu World';
    let active = true;
    getProducts().then((res) => {
      if (!active || !res.success) return;
      const map = {};
      for (const item of res.data?.products || []) {
        map[item.id] = item;
      }
      setLiveCatalog(map);
    });
    return () => {
      active = false;
    };
  }, []);

  const events = baseEvents.map((event) => {
    const live = liveCatalog[event.id];
    if (!live) return event;
    return {
      ...event,
      pricing: {
        ...event.pricing,
        offerFee: Math.round(live.unitPricePaise / 100),
        actualFee:
          live.originalPricePaise != null
            ? Math.round(live.originalPricePaise / 100)
            : event.pricing.actualFee
      }
    };
  });

  return (
    <div className="ev-page">
      <h1 className="ev-visually-hidden">Upcoming Events</h1>

      {events.length > 0 ? (
        events.map((event) => (
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
    </div>
  );
}
