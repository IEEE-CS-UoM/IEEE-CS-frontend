import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { footerLetters } from '../../data/content';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.footer__div span', footerRef.current);

      gsap.fromTo(letters, 
        {
          y: (i, el) => {
            const speed = Number(el.getAttribute('data-speed')) || 0;
            return -speed * 0.28;
          },
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
            end: 'bottom bottom',
            scrub: 1.1,
            invalidateOnRefresh: true,
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" id="footer" ref={footerRef}>
      <div className="footer__div">
        {footerLetters.map((obj, idx) => (
          <span data-speed={obj.speed} key={idx}>{obj.char}</span>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
