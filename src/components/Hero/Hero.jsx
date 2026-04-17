import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import './Hero.css';

const Hero = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    if (window.Splitting) {
      window.Splitting();
    }

    const ctx = gsap.context(() => {
      const gTl = gsap.timeline();
      gTl.from(".title .char", { duration: 1, opacity: 0, yPercent: 130, stagger: 0.06, ease: "back.out" });
      gTl.from(".header__marq", { duration: 2, opacity: 0, yPercent: 100, ease: "expo.out" }, "-=1.5");

      gsap.to('.title_paralax', {
        scrollTrigger: { trigger: headerRef.current, start: 'top top', scrub: 1.1 },
        yPercent: -150
      });
      gsap.to('.stroke', {
        scrollTrigger: { trigger: headerRef.current, start: 'top top', scrub: 1.1 },
        xPercent: 50
      });
      gsap.to('.header__marq-wrapp', {
        scrollTrigger: { trigger: headerRef.current, start: 'top top', scrub: 1.1 },
        xPercent: -50
      });
      gsap.to('.header__marq-star img', {
        scrollTrigger: { trigger: headerRef.current, start: 'top top', scrub: 1.1 },
        rotate: -720
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header className="header" id="home" ref={headerRef}>
      <h1 className="title" data-splitting>
        <span className="title_paralax">IEEE CS&nbsp;</span>
        <span className="stroke">UoM Chapter</span>
      </h1>
      <div className="header__marq">
        <div className="header__marq-wrapp">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="header__marq-txt">
              Empowering Tech Leaders
              <span className="header__marq-star">
                <img src="/img/star.svg" alt="" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;

