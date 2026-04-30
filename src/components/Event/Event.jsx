import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import SectionTitle from '../SectionTitle/SectionTitle';
import { events } from '../../data/content';
import './Event.css';

const N = events.length;

const Event = () => {
  const sectionRef = useRef(null);
  const stageRef   = useRef(null);
  const stRef      = useRef(null);
  const cardRefs   = useRef([]);
  const imgRefs    = useRef([]);
  const panelRefs  = useRef([]);
  const dotRefs    = useRef([]);

  const handleDotClick = (i) => {
    if (!stRef.current) return;
    const { start, end } = stRef.current;
    const raw = start + (i / (N - 1)) * (end - start);
    const target = i === N - 1 ? raw - 2 : raw;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.2 });
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRefs.current[0], { opacity: 1, y: 0 });
      gsap.set(panelRefs.current.slice(1), { opacity: 0, y: 28 });
      gsap.set(cardRefs.current[0], { yPercent: 0 });
      gsap.set(cardRefs.current.slice(1), { yPercent: 100 });
      gsap.set(cardRefs.current, { scale: 1 });

      const square = sectionRef.current.querySelector('.section-title__square');
      if (square) {
        gsap.fromTo(square,
          { rotation: 0 },
          {
            rotation: 720,
            ease: 'none',
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: `+=${(N - 1) * window.innerHeight * 0.65}`,
              scrub: 0.8,
            },
          }
        );
      }

      const tl = gsap.timeline({ paused: true });

      for (let i = 0; i < N - 1; i++) {

        tl.to(panelRefs.current[i],
          { opacity: 0, y: -28, ease: 'none', duration: 0.4 },
          i
        );
   
        tl.to(panelRefs.current[i + 1],
          { opacity: 1, y: 0, ease: 'none', duration: 0.4 },
          i + 0.6
        );

        tl.to(cardRefs.current[i + 1],
          { yPercent: 0, ease: 'none', duration: 1 },
          i
        );

        tl.to(cardRefs.current[i],
          { scale: 0.88, ease: 'none', duration: 1 },
          i
        );
      }
      stRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: `+=${(N - 1) * window.innerHeight * 0.65}`,
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => {
          const active = Math.round(self.progress * (N - 1));
          dotRefs.current.forEach((dot, i) => {
            if (dot) dot.classList.toggle('active', i === active);
          });
        },
      });
      window.__eventsST = stRef.current;
    }, sectionRef);

    return () => {
      ctx.revert();
      stRef.current = null;
      window.__eventsST = null;
    };
  }, []);

  return (
    <section className="events" id="events" ref={sectionRef}>
      <div className="events__stage" ref={stageRef}>


        <div className="events__header">
          <SectionTitle normalText="our" strokeText=" events" noAnimation />
        </div>

        <div className="events__body">

          {/* image gallery */}
          <div className="events__gallery">
            {events.map((ev, i) => (
              <div
                key={i}
                className="events__card"
                ref={el => { cardRefs.current[i] = el; }}
                style={{ zIndex: i + 1 }}
              >
                <div className="events__card-frame">
                  <div
                    className="events__card-img"
                    ref={el => { imgRefs.current[i] = el; }}
                  >
                    <img src={ev.img} alt={ev.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="events__right">
            <div className="events__panels">
              {events.map((ev, i) => (
                <div
                  key={i}
                  className="events__panel"
                  ref={el => { panelRefs.current[i] = el; }}
                >
                  <span className="events__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="events__name">{ev.title}</h3>
                  <p className="events__desc">{ev.desc}</p>
                </div>
              ))}
            </div>

            <div className="events__dots">
              {events.map((_, i) => (
                <button
                  key={i}
                  className={`events__dot${i === 0 ? ' active' : ''}`}
                  ref={el => { dotRefs.current[i] = el; }}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Go to event ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Event;
