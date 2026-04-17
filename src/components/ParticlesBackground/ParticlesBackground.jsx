import { useEffect, useRef } from 'react';
import './ParticlesBackground.css';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const ParticlesBackground = ({
  className = '',
  quantity = 150,
  size = 1.1,
  color = '#fda205',
  colorPalette,
  staticity = 32,
  ease = 0.08,
  magnetRadius = 220,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const particles = [];
    const palette =
      Array.isArray(colorPalette) && colorPalette.length > 0 ? colorPalette : [color];
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      active: false,
    };

    let width = 0;
    let height = 0;
    let rafId = 0;

    const makeParticle = (x = Math.random() * width, y = Math.random() * height) => ({
      x,
      y,
      driftX: (Math.random() - 0.5) * 0.26,
      driftY: (Math.random() - 0.5) * 0.26,
      alpha: Math.random() * 0.7 + 0.2,
      magnetism: Math.random() * 1.4 + 0.2,
      radius: Math.random() * size + 0.3,
      color: palette[Math.floor(Math.random() * palette.length)],
    });

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      for (let i = 0; i < quantity; i += 1) {
        particles.push(makeParticle());
      }
    };

    const respawnParticle = (particle) => {
      const side = Math.floor(Math.random() * 4);
      const margin = 60;

      if (side === 0) {
        particle.x = -margin;
        particle.y = Math.random() * height;
      } else if (side === 1) {
        particle.x = width + margin;
        particle.y = Math.random() * height;
      } else if (side === 2) {
        particle.x = Math.random() * width;
        particle.y = -margin;
      } else {
        particle.x = Math.random() * width;
        particle.y = height + margin;
      }

      particle.driftX = (Math.random() - 0.5) * 0.26;
      particle.driftY = (Math.random() - 0.5) * 0.26;
      particle.alpha = 0;
      particle.magnetism = Math.random() * 1.4 + 0.2;
      particle.radius = Math.random() * size + 0.3;
      particle.color = palette[Math.floor(Math.random() * palette.length)];
    };

    const updateParticle = (particle) => {
      particle.x += particle.driftX;
      particle.y += particle.driftY;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy) || 1;
        const push = clamp(1 - distance / magnetRadius, 0, 1);

        if (push > 0) {
          const strength = push * particle.magnetism * staticity * 0.001;
          particle.x -= dx * strength;
          particle.y -= dy * strength;
        }
      }

      const edgeDistance = Math.min(particle.x, width - particle.x, particle.y, height - particle.y);
      const fadeTarget = clamp(edgeDistance / 90, 0, 1);
      particle.alpha += (fadeTarget - particle.alpha) * ease;

      const offscreen =
        particle.x < -120 ||
        particle.x > width + 120 ||
        particle.y < -120 ||
        particle.y > height + 120;

      if (offscreen) {
        respawnParticle(particle);
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        updateParticle(particle);

        context.fillStyle = particle.color;
        context.globalAlpha = clamp(particle.alpha, 0, 1);
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    setCanvasSize();
    draw();

    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [color, colorPalette, ease, magnetRadius, quantity, size, staticity]);

  return <canvas ref={canvasRef} className={`particles-bg ${className}`.trim()} aria-hidden="true" />;
};

export default ParticlesBackground;
