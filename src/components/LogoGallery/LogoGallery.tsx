import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import './LogoGallery.css';

export interface Logo {
  name: string;
  src: string;
  hasImage?: boolean;
}

interface LogoGalleryProps {
  direction?: 'left' | 'right';
  logos: Logo[];
  variant?: 'default' | 'hero-ribbon';
  eyebrow?: string;
}

const MARQUEE_SPEED_PX_PER_SECOND = 52;

export const LogoGallery = ({
  direction = 'left',
  logos,
  variant = 'default',
  eyebrow,
}: LogoGalleryProps) => {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [firstSetWidth, setFirstSetWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateIsMobileScreen = (event?: MediaQueryListEvent) => {
      setIsMobileScreen(event?.matches ?? mediaQuery.matches);
    };

    updateIsMobileScreen();

    mediaQuery.addEventListener('change', updateIsMobileScreen);

    return () => mediaQuery.removeEventListener('change', updateIsMobileScreen);
  }, []);

  useEffect(() => {
    if (isMobileScreen && isPaused) {
      setIsPaused(false);
    }
  }, [isMobileScreen, isPaused]);

  useEffect(() => {
    const element = firstSetRef.current;

    if (!element) return undefined;

    const measure = () => {
      setFirstSetWidth(element.getBoundingClientRect().width);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [logos]);

  useEffect(() => {
    if (!firstSetWidth) return;

    x.set(direction === 'left' ? 0 : -firstSetWidth);
  }, [direction, firstSetWidth, x]);

  useEffect(() => {
    animationRef.current?.stop();

    if (shouldReduceMotion || (isPaused && !isMobileScreen) || !firstSetWidth) return undefined;

    const start = direction === 'left' ? 0 : -firstSetWidth;
    const end = direction === 'left' ? -firstSetWidth : 0;
    const current = x.get();
    const distanceRemaining =
      direction === 'left' ? Math.abs(end - current) : Math.abs(current - end);
    const duration =
      distanceRemaining > 0
        ? distanceRemaining / MARQUEE_SPEED_PX_PER_SECOND
        : firstSetWidth / MARQUEE_SPEED_PX_PER_SECOND;

    if (distanceRemaining <= 1) {
      x.set(start);
    }

    animationRef.current = animate(x, end, {
      ease: 'linear',
      duration: duration > 0 ? duration : firstSetWidth / MARQUEE_SPEED_PX_PER_SECOND,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });

    return () => animationRef.current?.stop();
  }, [direction, firstSetWidth, isMobileScreen, isPaused, shouldReduceMotion, x]);

  const handlePause = () => {
    if (isMobileScreen) return;
    setIsPaused(true);
  };

  const handleResume = () => {
    if (isMobileScreen) return;
    setIsPaused(false);
  };

  const renderLogo = (logo: Logo, key: string) => (
    <div
      key={key}
      className="logo-item"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
    >
      {logo.hasImage !== false ? (
        <>
          <img
            src={logo.src}
            alt={logo.name}
            className="company-logo"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) {
                target.style.display = 'none';
                fallback.style.display = 'block';
              }
            }}
          />
          <span className="logo-fallback" style={{ display: 'none' }}>
            {logo.name}
          </span>
        </>
      ) : (
        <span className="logo-text">{logo.name}</span>
      )}
    </div>
  );

  return (
    <div className={`logo-gallery-container logo-gallery-container-${variant}`}>
      {eyebrow ? <p className="logo-gallery-eyebrow">{eyebrow}</p> : null}
      <div className="logo-gallery-viewport">
        <motion.div ref={trackRef} className="logo-gallery" style={{ x }}>
          <div className="logo-gallery-set" ref={firstSetRef}>
            {logos.map((logo, index) => renderLogo(logo, `set1-${index}`))}
          </div>
          <div className="logo-gallery-set" aria-hidden="true">
            {logos.map((logo, index) => renderLogo(logo, `set2-${index}`))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
