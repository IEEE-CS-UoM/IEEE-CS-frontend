import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { onIntroRelease } from '../../lib/intro';
import './Hero.css';

const Hero = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const introTlRef = { current: null };

    const ctx = gsap.context(() => {
      // The title itself is revealed by the particle intro forming its shape;
      // only the marquee subtext still gets a post-release reveal.
      gsap.set('.header__marq', { opacity: 0, yPercent: 100 });

      const gTl = gsap.timeline({ paused: true });
      gTl.to(".header__marq", { duration: 2, opacity: 1, yPercent: 0, ease: "expo.out" });
      introTlRef.current = gTl;

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

    const off = onIntroRelease(() => introTlRef.current?.play());

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <header className="header" id="home" ref={headerRef}>
      <h1 className="title">
        <span className="title_paralax">IEEE Computer Society</span>
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

