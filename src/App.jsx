import { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Impact from './components/Impact/Impact';
import Team from './components/Team/Team';
import Event from './components/Event/Event';
import EventDetail, { getEventByPath } from './components/EventDetail/EventDetail';
import Footer from './components/Footer/Footer';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import HeroIntro from './components/HeroIntro/HeroIntro';
import Navbar from './components/Navbar/Navbar';
import { gsap, ScrollTrigger } from './lib/gsap';
import { releaseIntro } from './lib/intro';
import './App.css';

function App() {
  const detailEvent = getEventByPath(window.location.pathname);
  const shouldSkipIntro = !detailEvent && window.location.hash === '#events';

  useEffect(() => {
    if (shouldSkipIntro) releaseIntro();

    const lenis = new Lenis({
      duration: 0.75,
      smoothWheel: true,
      touchMultiplier: 0.9,
      wheelMultiplier: 0.95,
    });
    window.__lenis = lenis;

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    const refreshSoon = () => requestAnimationFrame(refresh);

    if (document.readyState === 'complete') {
      refreshSoon();
    } else {
      window.addEventListener('load', refreshSoon, { once: true });
    }

    window.addEventListener('pageshow', refreshSoon);
    window.addEventListener('resize', refreshSoon);
    document.fonts?.ready.then(refreshSoon);

    const t = setTimeout(refreshSoon, 800);

    if (shouldSkipIntro) {
      requestAnimationFrame(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) lenis.scrollTo(eventsSection, { immediate: true, offset: -20 });
      });
    }

    return () => {
      clearTimeout(t);
      window.removeEventListener('pageshow', refreshSoon);
      window.removeEventListener('resize', refreshSoon);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [shouldSkipIntro]);

  return (
    <>
      {!detailEvent && !shouldSkipIntro && <HeroIntro />}
      <div className="wrapp">
      <ParticlesBackground
        quantity={260}
        staticity={24}
        magnetRadius={200}
        ease={0.085}
        colorPalette={['#ff7a1a', '#fda205', '#ffd27a', '#fff0c9']}
      />
      <Navbar />
      {detailEvent ? (
        <EventDetail event={detailEvent} />
      ) : (
        <>
          <Hero />
          <main className="main">
            <About />
            <Event />
            <Impact />
            <Team />
          </main>
        </>
      )}
      <Footer />
      </div>
    </>
  );
}

export default App;
