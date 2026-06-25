import { useEffect, useRef, useState } from 'react';
import { releaseIntro } from '../../lib/intro';
import './HeroIntro.css';

// Lines the particles assemble into. Uppercase + two lines keeps it legible as
// a particle field and mirrors the Hero title ("IEEE Computer Society" / "UoM Chapter").
const LINES = ['IEEE COMPUTER SOCIETY', 'UoM CHAPTER'];

const PALETTE = ['#ff7a1a', '#fda205', '#ffd27a', '#fff0c9'];

// Timeline (ms)
const FORM_DUR = 1400; // particles ease onto their target
const STAGGER = 600; // spread of per-particle start delays during forming
const HOLD = 520; // word holds, fully assembled
const SPREAD_DUR = 1500; // particles fly outward + fade, gate fades out

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const HeroIntro = () => {
  const canvasRef = useRef(null);
  const backdropRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      releaseIntro();
      setDone(true);
      return undefined;
    }

    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      releaseIntro();
      setDone(true);
      return undefined;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;
    let particles = [];
    let released = false;
    let spreadStart = 0;
    const startTime = performance.now();

    // ---- scroll lock (Lenis is created in App's effect, which runs after this
    // child effect, so retry stop() for a few frames until it exists) ----
    document.documentElement.classList.add('intro-lock');
    let stopTries = 0;
    const tryStopLenis = () => {
      if (window.__lenis) {
        window.__lenis.stop();
      } else if (stopTries < 30) {
        stopTries += 1;
        requestAnimationFrame(tryStopLenis);
      }
    };
    tryStopLenis();

    const unlockScroll = () => {
      document.documentElement.classList.remove('intro-lock');
      window.__lenis?.start();
    };

    // ---- sample target points to match the real hero title exactly ----
    // We trace the actual on-screen title lines (position + font + size) so the
    // particles assemble precisely where the revealed <h1> will sit. Falls back
    // to a self-sized two-line render if the title isn't in the DOM yet.
    const sampleTargets = () => {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      octx.fillStyle = '#fff';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';

      const lineEls = [
        document.querySelector('.title .title_paralax'),
        document.querySelector('.title .stroke'),
      ].filter((el) => el && el.getBoundingClientRect().width > 0);

      if (lineEls.length === 2) {
        lineEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          octx.font = `${cs.fontWeight || 800} ${cs.fontSize} ${cs.fontFamily}`;
          if ('letterSpacing' in octx) {
            octx.letterSpacing =
              cs.letterSpacing && cs.letterSpacing !== 'normal' ? cs.letterSpacing : '0px';
          }
          // CSS uppercases via text-transform; the DOM text is mixed-case.
          const text = (el.textContent || '').toUpperCase();
          octx.fillText(text, r.left + r.width / 2, r.top + r.height / 2);
        });
      } else {
        const maxW = Math.min(width * 0.88, 980);
        let fontSize = width < 700
          ? Math.min(width * 0.11, 60)    // mobile: size relative to width
          : Math.min(height * 0.15, 150);
        octx.font = `800 ${fontSize}px 'Space Grotesk', sans-serif`;
        const widest = Math.max(...LINES.map((l) => octx.measureText(l).width));
        if (widest > maxW) fontSize *= maxW / widest;
        octx.font = `800 ${fontSize}px 'Space Grotesk', sans-serif`;
        const lineH = fontSize * 1.16;
        const startY = height / 2 - (lineH * LINES.length) / 2 + lineH / 2;
        LINES.forEach((l, i) => octx.fillText(l.toUpperCase(), width / 2, startY + i * lineH));
      }

      const { data } = octx.getImageData(0, 0, width, height);
      const gap = width < 700 ? 3 : 4; // tighter sampling on mobile for clarity
      const pts = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (data[(y * width + x) * 4 + 3] > 128) pts.push({ x, y });
        }
      }
      // shuffle so capping keeps an even spread, not a top-left bias
      for (let i = pts.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      const cap = width < 700 ? 1800 : 2200;
      return pts.slice(0, cap);
    };

    const buildParticles = () => {
      const targets = sampleTargets();
      particles = targets.map((t) => ({
        sx: Math.random() * width, // scattered origin
        sy: Math.random() * height,
        tx: t.x,
        ty: t.y,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        delay: Math.random() * STAGGER,
        alpha: 0,
        radius: width < 700
          ? Math.random() * 1.6 + 1.0   // larger dots on mobile for clarity
          : Math.random() * 1.3 + 0.5,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
      particles.forEach((p) => {
        p.x = p.sx;
        p.y = p.sy;
      });
    };

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const cx = () => width / 2;
    const cy = () => height / 2;

    const frame = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // trigger the spread once the word has held
      if (!released && elapsed >= STAGGER + FORM_DUR + HOLD) {
        released = true;
        spreadStart = now;
        releaseIntro(); // hero title reveal begins now, in sync with the spread
        unlockScroll();
        backdrop.classList.add('hero-intro__backdrop--out');
      }

      let spreadT = 0;
      if (released) spreadT = clamp((now - spreadStart) / SPREAD_DUR, 0, 1);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (!released) {
          // forming: ease scattered origin -> target with per-particle delay
          const t = clamp((elapsed - p.delay) / FORM_DUR, 0, 1);
          const e = easeOutCubic(t);
          p.x = p.sx + (p.tx - p.sx) * e;
          p.y = p.sy + (p.ty - p.sy) * e;
          p.alpha = clamp(t * 1.4, 0, 1);
        } else {
          // spreading: kick outward from centre, drift off, fade into the bg
          if (p.vx === 0 && p.vy === 0) {
            const dx = p.x - cx();
            const dy = p.y - cy();
            const d = Math.hypot(dx, dy) || 1;
            const speed = 1.6 + Math.random() * 3.4;
            p.vx = (dx / d) * speed + (Math.random() - 0.5) * 1.2;
            p.vy = (dy / d) * speed + (Math.random() - 0.5) * 1.2;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = (1 - easeOutCubic(spreadT)) * 0.95;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = clamp(p.alpha, 0, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (released && spreadT >= 1) {
        setDone(true); // unmount overlay; ambient ParticlesBackground takes over
        return;
      }
      rafId = requestAnimationFrame(frame);
    };

    // fonts must be ready or the sampled glyph shape is wrong; cap the wait so
    // a stalled fonts.ready can never trap the gate.
    let begun = false;
    const begin = () => {
      if (begun) return;
      begun = true;
      setSize();
      rafId = requestAnimationFrame(frame);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(begin);
      setTimeout(begin, 1500);
    } else {
      begin();
    }

    return () => {
      cancelAnimationFrame(rafId);
      unlockScroll();
      releaseIntro(); // safety: never leave the hero gated
    };
  }, []);

  if (done) return null;

  return (
    <div className="hero-intro" aria-hidden="true">
      <div className="hero-intro__backdrop" ref={backdropRef} />
      <canvas className="hero-intro__canvas" ref={canvasRef} />
    </div>
  );
};

export default HeroIntro;
