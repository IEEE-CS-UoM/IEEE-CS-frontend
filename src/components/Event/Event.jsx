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

  // thumbnail strip + sliding frame
  const thumbsRef  = useRef(null);
  const sliderRef  = useRef(null);
  const activeRef  = useRef(0);

  // slide the frame continuously between thumbnails and light each one by
  // how close the frame currently sits over it (pos is a float index 0..N-1)
  const layoutSlider = (pos = activeRef.current) => {
    const slider = sliderRef.current;
    if (!slider || N < 1) return;
    const f = Math.max(0, Math.min(N - 1, pos));
    const i0 = Math.floor(f);
    const i1 = Math.min(i0 + 1, N - 1);
    const t = f - i0;
    const a = dotRefs.current[i0];
    const b = dotRefs.current[i1];
    if (!a || !b) return;

    const left = a.offsetLeft + (b.offsetLeft - a.offsetLeft) * t;
    const width = a.offsetWidth + (b.offsetWidth - a.offsetWidth) * t;
    const height = a.offsetHeight + (b.offsetHeight - a.offsetHeight) * t;
    slider.style.width = `${width + 8}px`;
    slider.style.height = `${height + 8}px`;
    slider.style.transform = `translateX(${left - 4}px)`;

    dotRefs.current.forEach((thumb, i) => {
      if (!thumb) return;
      const lit = Math.max(0, 1 - Math.abs(i - f));
      thumb.style.opacity = `${0.35 + lit * 0.65}`;
      thumb.style.filter = `grayscale(${(1 - lit) * 0.4})`;
    });
  };

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
    let snapTimer;
    const snapToNearest = (st) => {
      if (!st || st.progress <= 0.001 || st.progress >= 0.999) return;
      const k = Math.round(st.progress * (N - 1));
      const targetProgress = k / (N - 1);
      activeRef.current = k;
      layoutSlider(k);
      if (Math.abs(targetProgress - st.progress) < 0.003) return;
      let target = st.start + targetProgress * (st.end - st.start);
      if (k === N - 1) target -= 2;
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 0.35 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
    };

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
              start: 'top bottom',
              end: `+=${window.innerHeight * (1 + (N - 1) * 0.65)}`,
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
          const f = self.progress * (N - 1);
          activeRef.current = f;
          layoutSlider(f);
          // re-arm the settle timer; fires once scroll + scrub go quiet
          clearTimeout(snapTimer);
          snapTimer = setTimeout(() => snapToNearest(self), 140);
        },
        onRefresh: () => layoutSlider(activeRef.current),
      });
      window.__eventsST = stRef.current;

      // initial placement of the frame over the first thumbnail
      layoutSlider(0);
    }, sectionRef);

    const onResize = () => layoutSlider();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(snapTimer);
      window.removeEventListener('resize', onResize);
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
          </div>

        </div>

        {/* thumbnail strip — moving frame snaps to the selected event */}
        <div className="events__thumbs" ref={thumbsRef}>
          <div className="events__thumb-slider" ref={sliderRef} aria-hidden="true" />
          {events.map((ev, i) => (
            <button
              key={i}
              className={`events__thumb${i === 0 ? ' active' : ''}`}
              ref={el => { dotRefs.current[i] = el; }}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to event ${i + 1}: ${ev.title}`}
            >
              <img src={ev.img} alt={ev.title} />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Event;
