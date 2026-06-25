import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { benefitList } from '../../data/content';
import SectionTitle from '../SectionTitle/SectionTitle';
import './Impact.css';

const icons = {
  code: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M2 20h20" />
      <path d="M9.5 9 7 11.5 9.5 14" />
      <path d="m14.5 9 2.5 2.5L14.5 14" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m11 17 2 2a1 1 0 0 0 1.4-1.4" />
      <path d="m14 16 2.5 2.5a1 1 0 0 0 1.4-1.4l-4.5-4.6" />
      <path d="m18 13 1.5 1.5a1 1 0 0 0 1.4-1.4L16 8l-2 1-2.5-2.5a2 2 0 0 0-2.8 0L3.5 12" />
      <path d="m8 8 3.5 3.5" />
      <path d="m4 14 3 3" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17.5" cy="9.5" r="2.3" />
      <path d="M14.5 19a4.5 4.5 0 0 1 7-3.7" />
    </svg>
  ),
  leadership: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 21h12" />
      <path d="M4 21h16l-2-5H6Z" />
      <path d="M12 16V5" />
      <path d="M12 5h6l-2 2.5L18 10h-6" />
    </svg>
  ),
};

const Impact = () => {
  const benefitsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.benefits__card', {
        y: 70,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.benefits__list',
          start: 'top 80%',
        },
      });

      gsap.from('.benefits__icon', {
        scale: 0,
        rotate: -120,
        duration: 0.9,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.benefits__list',
          start: 'top 80%',
        },
      });
    }, benefitsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="benefits" id="benefits" ref={benefitsRef}>
      <div className="content">
        <SectionTitle normalText="chapter" strokeText=" impact" />
        <p className="benefits__lead">
          At the IEEE Computer Society Student Chapter of the University of Moratuwa, we focus on helping students grow as confident
          technologists through practical exposure, teamwork, and leadership.
        </p>

        <ul className="benefits__list">
          {benefitList.map((benefit, idx) => (
            <li className="benefits__card" key={idx}>
              <div className="benefits__icon">{icons[benefit.icon]}</div>
              <div className="benefits__body">
                <span className="benefits__num">{benefit.num}</span>
                <h3 className="benefits__title">{benefit.title}</h3>
                <p className="benefits__p">{benefit.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Impact;
