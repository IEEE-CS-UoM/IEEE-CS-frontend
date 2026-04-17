import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import './SectionTitle.css';

const SectionTitle = ({ normalText, strokeText, align = 'center' }) => {
  const squareRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (squareRef.current) {
        gsap.fromTo(squareRef.current, 
          { rotation: 720 },
          { 
            rotation: 0, 
            duration: 3,
            scrollTrigger: {
              trigger: squareRef.current,
              start: 'top bottom',
              scrub: 1.1,
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <h2 className={`section-title ${align === 'left' ? 'align-left' : ''}`}>
      {normalText}<span className="stroke">{strokeText}</span>
      <span className="section-title__square" ref={squareRef}></span>
    </h2>
  );
};

export default SectionTitle;
