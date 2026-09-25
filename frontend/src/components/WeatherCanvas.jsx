import React, { useEffect, useRef } from 'react';

export default function WeatherCanvas({ particleType = 'sunbeams' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(particleType);
    };

    const initParticles = (type) => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;

      switch (type) {
        case 'rain': {
          const count = Math.min(120, Math.floor(width / 12));
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              length: Math.random() * 20 + 15,
              speed: Math.random() * 8 + 12,
              opacity: Math.random() * 0.4 + 0.3,
              color: '#a5b4fc'
            });
          }
          break;
        }
        case 'snow': {
          const count = Math.min(90, Math.floor(width / 15));
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 3 + 1,
              speed: Math.random() * 1.5 + 0.8,
              sway: Math.random() * 2 - 1,
              swaySpeed: Math.random() * 0.02 + 0.01,
              swayOffset: Math.random() * Math.PI * 2,
              opacity: Math.random() * 0.6 + 0.3
            });
          }
          break;
        }
        case 'sunbeams': {
          const count = 18;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 80 + 30,
              targetRadius: Math.random() * 90 + 40,
              growSpeed: Math.random() * 0.02 + 0.005,
              phase: Math.random() * Math.PI * 2,
              opacity: Math.random() * 0.15 + 0.05
            });
          }
          break;
        }
        case 'mist': {
          const count = 16;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 160 + 80,
              speedX: (Math.random() - 0.5) * 0.4,
              speedY: (Math.random() - 0.5) * 0.2,
              opacity: Math.random() * 0.08 + 0.03
            });
          }
          break;
        }
        case 'storm': {
          const count = Math.min(150, Math.floor(width / 10));
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              length: Math.random() * 28 + 18,
              speed: Math.random() * 14 + 18,
              opacity: Math.random() * 0.5 + 0.35,
              slant: Math.random() * 4 + 3,
              color: '#c084fc'
            });
          }
          break;
        }
        case 'floating_orbs':
        default: {
          const count = 25;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 24 + 8,
              speedX: (Math.random() - 0.5) * 0.6,
              speedY: (Math.random() - 0.5) * 0.6,
              opacity: Math.random() * 0.25 + 0.1,
              color: ['#38bdf8', '#2dd4bf', '#818cf8'][Math.floor(Math.random() * 3)]
            });
          }
          break;
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (particleType === 'rain') {
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.5;
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 1;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });
      } else if (particleType === 'storm') {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.slant, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= p.slant;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * (width + 200);
          }
        });

        // Thunder flash
        if (Math.random() < 0.006) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(0, 0, width, height);
        }
      } else if (particleType === 'snow') {
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(p.swayOffset) * 15, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speed;
          p.swayOffset += p.swaySpeed;
          if (p.y > height + 5) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        });
      } else if (particleType === 'mist') {
        particles.forEach((p) => {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          gradient.addColorStop(0, `rgba(203, 213, 225, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(203, 213, 225, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;
        });
      } else if (particleType === 'sunbeams') {
        particles.forEach((p) => {
          p.phase += p.growSpeed;
          const currentRadius = p.radius + Math.sin(p.phase) * 20;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
          gradient.addColorStop(0, `rgba(251, 191, 36, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // floating_orbs
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > width) p.speedX *= -1;
          if (p.y < 0 || p.y > height) p.speedY *= -1;
        });
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleType]);

  return <canvas ref={canvasRef} id="weather-canvas" className="fixed inset-0 pointer-events-none z-[1]" />;
}
