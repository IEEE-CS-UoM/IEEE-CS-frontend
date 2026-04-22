import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import SectionTitle from '../SectionTitle/SectionTitle';
import { teamMembers } from '../../data/content';
import './Team.css';

const Team = () => {
  const sectionRef   = useRef(null);
  const gridRef      = useRef(null);
  const cardsRef     = useRef([]);
  const descRef      = useRef(null);
  const activeMobile = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: '+=560',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        tl.from(card, { opacity: 0, y: 60, ease: 'none', duration: 1 }, i * 0.6);
      });

      gsap.fromTo(descRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 90%',
            end: '+=180',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Desktop hover ──────────────────────────────────────────────────────────
  const handleHover = (idx) => {
    if (window.innerWidth <= 768) return;
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.to(card, { flexGrow: i === idx ? 2.2 : 0.5, duration: 0.5, ease: 'power2.out' });
    });
  };

  const handleLeave = () => {
    if (window.innerWidth <= 768) return;
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.to(card, { flexGrow: 1, duration: 0.5, ease: 'power2.out' });
    });
  };

  // ── Mobile tap: expand within the tapped card's row ────────────────────────
  const handleTap = (idx) => {
    if (window.innerWidth > 768) return;

    const prev = activeMobile.current;
    const row  = Math.floor(idx / 3);

    if (prev !== null) {
      const prevRow = Math.floor(prev / 3);
      for (let j = prevRow * 3; j < prevRow * 3 + 3; j++) {
        const card = cardsRef.current[j];
        if (card) gsap.to(card, { flexGrow: 1, duration: 0.4, ease: 'power2.out' });
      }
    }

    if (prev === idx) {
      activeMobile.current = null;
      return;
    }

    for (let j = row * 3; j < row * 3 + 3; j++) {
      const card = cardsRef.current[j];
      if (card) gsap.to(card, { flexGrow: j === idx ? 2.2 : 0.5, duration: 0.5, ease: 'power2.out' });
    }

    activeMobile.current = idx;
  };

  return (
    <section className="team" id="team" ref={sectionRef}>
      <div className="team__title-wrap">
        <div className="content">
          <SectionTitle normalText="chapter" strokeText=" team" />
        </div>
      </div>

      <div className="content team__body">
        <div className="team__grid" ref={gridRef} onMouseLeave={handleLeave}>
          {[0, 1].map(rowIdx => (
            <div className="team__row" key={rowIdx}>
              {teamMembers.slice(rowIdx * 3, rowIdx * 3 + 3).map((member, colIdx) => {
                const i = rowIdx * 3 + colIdx;
                return (
                  <div
                    key={i}
                    className="team__card"
                    ref={el => { cardsRef.current[i] = el; }}
                    style={{ backgroundColor: member.bg }}
                    onMouseEnter={() => handleHover(i)}
                    onPointerUp={(e) => { if (e.pointerType === 'touch') handleTap(i); }}
                  >
                    <div className="team__card-img">
                      <img src={member.img} alt={member.name} loading="lazy" />
                    </div>
                    <div className="team__card-info">
                      <p className="team__card-name">{member.name}</p>
                      <p className="team__card-role">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="team__desc" ref={descRef}>
          Meet the dedicated leaders driving the IEEE Computer Society Student Branch Chapter
          of the University of Moratuwa forward. With a shared vision and commitment, the
          executive committee works to create meaningful opportunities and impactful experiences
          for the student community.
        </p>
      </div>
    </section>
  );
};

export default Team;
