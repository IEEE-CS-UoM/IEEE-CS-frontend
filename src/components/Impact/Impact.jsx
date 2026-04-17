import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { benefitList } from '../../data/content';
import SectionTitle from '../SectionTitle/SectionTitle';
import './Impact.css';

const Impact = () => {
  const benefitsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.benefits__num', 
        { x: (i, el) => (1 - parseFloat(el.getAttribute('data-speed'))) },
        { x: 0, scrollTrigger: { trigger: '.benefits__list', start: 'top bottom', scrub: 1.1 } }
      );
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
            <li className="benefits__item" key={idx}>
              <span className="benefits__num" data-speed={benefit.speed}>{benefit.num}</span>
              <p className="benefits__p">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Impact;
