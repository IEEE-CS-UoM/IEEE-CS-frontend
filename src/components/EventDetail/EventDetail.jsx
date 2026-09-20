import { events } from '../../data/content';
import './EventDetail.css';

const EventDetail = ({ event }) => {
  const detail = event.detail;

  return (
    <main className="event-detail">
      <section className="event-detail__hero">
        <a className="event-detail__back" href="/#events">Back to home</a>
        <div className="event-detail__hero-grid">
          <div className="event-detail__copy">
            <span className="event-detail__category">{event.category}</span>
            <h1>{event.title}</h1>
            <p>{event.desc}</p>
          </div>
          <div className="event-detail__image-wrap">
            <img src={detail.mainImage || event.img} alt={event.title} />
          </div>
        </div>
      </section>

      <section className="event-detail__content">
        <div className="event-detail__article">
          <h2>About the event</h2>
          {detail.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {detail.meta && (
            <div className="event-detail__meta">
              {detail.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          )}
        </div>

        <aside className="event-detail__highlights">
          <h2>Highlights</h2>
          <ul>
            {detail.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="event-detail__gallery-section">
        <div className="event-detail__gallery-head">
          <span>Gallery</span>
          <p>Replace these placeholder files in the matching event folder when your final images are ready.</p>
        </div>
        <div className="event-detail__gallery">
          {detail.gallery.map((image, index) => (
            <img key={image} src={image} alt={`${event.title} gallery ${index + 1}`} />
          ))}
        </div>
      </section>
    </main>
  );
};

export const getEventByPath = (path) => {
  const match = path.match(/^\/([^/]+)\/?$/);
  if (!match) return null;
  return events.find((event) => event.slug === match[1] && event.detail) || null;
};

export default EventDetail;
