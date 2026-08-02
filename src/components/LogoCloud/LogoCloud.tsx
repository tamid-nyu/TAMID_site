import { useEffect, useRef } from 'react';
import { useIsMobile } from '@hooks';
import type { Logo } from '../LogoGallery';
import './LogoCloud.css';

interface LogoCloudProps {
  body?: React.ReactNode;
  className?: string;
  eyebrow?: React.ReactNode;
  logos: Logo[];
  title: React.ReactNode;
  visible?: boolean;
}

interface LogoBody {
  dragging: boolean;
  height: number;
  hidden: boolean;
  pointerId: number | null;
  throwVelocityX: number;
  throwVelocityY: number;
  thrown: boolean;
  velocityX: number;
  velocityY: number;
  width: number;
  x: number;
  y: number;
}

const DRIFT_SPEED_MIN = 12;
const DRIFT_SPEED_MAX = 22;
const THROW_DAMPING = 0.986;
const DRAG_VELOCITY_SCALE = 0.012;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const createRandomDrift = () => {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(DRIFT_SPEED_MIN, DRIFT_SPEED_MAX);

  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
};

export const LogoCloud = ({
  body,
  className = '',
  eyebrow,
  logos,
  title,
  visible = false,
}: LogoCloudProps) => {
  const isMobile = useIsMobile();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const logoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bodiesRef = useRef<LogoBody[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const frameSizeRef = useRef({ width: 0, height: 0 });
  const lastTimestampRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initializeBodies = ({ preserveExisting = false } = {}) => {
      const frame = frameRef.current;
      if (!frame) return;

      const frameRect = frame.getBoundingClientRect();
      const frameWidth = frameRect.width;
      const frameHeight = frameRect.height;
      const previousFrameSize = frameSizeRef.current;

      bodiesRef.current = logos.map((_, index) => {
        const element = logoRefs.current[index];
        const rect = element?.getBoundingClientRect();
        const width = rect?.width ?? 140;
        const height = rect?.height ?? 76;
        const existingBody = preserveExisting ? bodiesRef.current[index] : undefined;
        const drift = createRandomDrift();

        const body: LogoBody = {
          dragging: existingBody?.dragging ?? false,
          height,
          hidden: existingBody?.hidden ?? false,
          pointerId: existingBody?.pointerId ?? null,
          throwVelocityX: existingBody?.throwVelocityX ?? 0,
          throwVelocityY: existingBody?.throwVelocityY ?? 0,
          thrown: existingBody?.thrown ?? false,
          velocityX: existingBody?.velocityX ?? drift.x,
          velocityY: existingBody?.velocityY ?? drift.y,
          width,
          x: existingBody
            ? Math.max(-width, Math.min(existingBody.x, frameWidth))
            : randomBetween(-width * 0.25, Math.max(frameWidth - width * 0.75, 1)),
          y: existingBody
            ? Math.max(-height, Math.min(existingBody.y, frameHeight))
            : randomBetween(-height * 0.2, Math.max(frameHeight - height * 0.8, 1)),
        };

        if (existingBody && previousFrameSize.width > 0 && frameWidth !== previousFrameSize.width) {
          body.x = Math.max(
            -width,
            Math.min(existingBody.x * (frameWidth / previousFrameSize.width), frameWidth)
          );
        }

        if (element) {
          element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        }

        return body;
      });

      frameSizeRef.current = {
        width: frameWidth,
        height: frameHeight,
      };
    };

    const isInsideFrame = (body: LogoBody, frameWidth: number, frameHeight: number) =>
      body.x + body.width > 0 &&
      body.x < frameWidth &&
      body.y + body.height > 0 &&
      body.y < frameHeight;

    const getRespawnEdge = (exitedEdge: 'top' | 'right' | 'bottom' | 'left') => {
      const candidateEdges = ['top', 'right', 'bottom', 'left'].filter(
        (edge) => edge !== exitedEdge
      ) as Array<'top' | 'right' | 'bottom' | 'left'>;

      return candidateEdges[Math.floor(Math.random() * candidateEdges.length)] ?? 'left';
    };

    const respawnBody = (
      body: LogoBody,
      frameWidth: number,
      frameHeight: number,
      exitedEdge: 'top' | 'right' | 'bottom' | 'left'
    ) => {
      const nextEdge = getRespawnEdge(exitedEdge);
      const drift = createRandomDrift();
      const speed = body.thrown
        ? Math.max(Math.hypot(body.throwVelocityX, body.throwVelocityY), 160)
        : Math.hypot(drift.x, drift.y);

      if (nextEdge === 'left') {
        body.x = -body.width;
        body.y = randomBetween(0, Math.max(frameHeight - body.height, 0));
        body.velocityX = Math.max(Math.abs(drift.x), DRIFT_SPEED_MIN);
        body.velocityY = drift.y;
        body.throwVelocityX = Math.max(speed, 160);
        body.throwVelocityY = drift.y * 8;
      } else if (nextEdge === 'right') {
        body.x = frameWidth;
        body.y = randomBetween(0, Math.max(frameHeight - body.height, 0));
        body.velocityX = -Math.max(Math.abs(drift.x), DRIFT_SPEED_MIN);
        body.velocityY = drift.y;
        body.throwVelocityX = -Math.max(speed, 160);
        body.throwVelocityY = drift.y * 8;
      } else if (nextEdge === 'top') {
        body.x = randomBetween(0, Math.max(frameWidth - body.width, 0));
        body.y = -body.height;
        body.velocityX = drift.x;
        body.velocityY = Math.max(Math.abs(drift.y), DRIFT_SPEED_MIN);
        body.throwVelocityX = drift.x * 8;
        body.throwVelocityY = Math.max(speed, 160);
      } else {
        body.x = randomBetween(0, Math.max(frameWidth - body.width, 0));
        body.y = frameHeight;
        body.velocityX = drift.x;
        body.velocityY = -Math.max(Math.abs(drift.y), DRIFT_SPEED_MIN);
        body.throwVelocityX = drift.x * 8;
        body.throwVelocityY = -Math.max(speed, 160);
      }

      body.hidden = true;
    };

    const step = (timestamp: number) => {
      const frame = frameRef.current;
      if (!frame) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.033);
      lastTimestampRef.current = timestamp;

      const frameRect = frame.getBoundingClientRect();
      const frameWidth = frameRect.width;
      const frameHeight = frameRect.height;

      bodiesRef.current.forEach((body, index) => {
        const element = logoRefs.current[index];
        if (!body || !element) return;

        const rect = element.getBoundingClientRect();
        body.width = rect.width;
        body.height = rect.height;

        if (body.dragging) {
          body.hidden = false;
          element.style.opacity = '1';
          element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
          return;
        }

        if (body.thrown) {
          body.x += body.throwVelocityX * deltaSeconds;
          body.y += body.throwVelocityY * deltaSeconds;
          body.throwVelocityX *= THROW_DAMPING;
          body.throwVelocityY *= THROW_DAMPING;

          if (Math.abs(body.throwVelocityX) < 24 && Math.abs(body.throwVelocityY) < 24) {
            body.thrown = false;
            const drift = createRandomDrift();
            body.velocityX = drift.x;
            body.velocityY = drift.y;
          }
        } else if (!reducedMotionRef.current) {
          body.x += body.velocityX * deltaSeconds;
          body.y += body.velocityY * deltaSeconds;
        }

        if (body.x > frameWidth) {
          respawnBody(body, frameWidth, frameHeight, 'right');
        } else if (body.x + body.width < 0) {
          respawnBody(body, frameWidth, frameHeight, 'left');
        } else if (body.y > frameHeight) {
          respawnBody(body, frameWidth, frameHeight, 'bottom');
        } else if (body.y + body.height < 0) {
          respawnBody(body, frameWidth, frameHeight, 'top');
        }

        if (body.hidden && isInsideFrame(body, frameWidth, frameHeight)) {
          body.hidden = false;
        }

        element.style.opacity = body.hidden ? '0' : '1';
        element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
      });

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      initializeBodies({ preserveExisting: true });
      lastTimestampRef.current = null;
    };

    initializeBodies();
    animationFrameRef.current = window.requestAnimationFrame(step);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [logos]);

  const handlePointerDown = (index: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile) return;

    const frame = frameRef.current;
    const element = logoRefs.current[index];
    const body = bodiesRef.current[index];
    if (!frame || !element || !body) return;

    const frameRect = frame.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    body.dragging = true;
    body.pointerId = event.pointerId;
    body.thrown = false;
    body.throwVelocityX = 0;
    body.throwVelocityY = 0;
    body.x = elementRect.left - frameRect.left;
    body.y = elementRect.top - frameRect.top;

    const startOffsetX = event.clientX - body.x;
    const startOffsetY = event.clientY - body.y;
    let lastClientX = event.clientX;
    let lastClientY = event.clientY;
    let lastTime = performance.now();

    element.setPointerCapture(event.pointerId);
    element.classList.add('logo-cloud__logo--dragging');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!body.dragging || body.pointerId !== moveEvent.pointerId) return;

      const now = performance.now();
      const frameBounds = frame.getBoundingClientRect();
      const nextX = moveEvent.clientX - startOffsetX;
      const nextY = moveEvent.clientY - startOffsetY;

      body.x = Math.max(0, Math.min(nextX, frameBounds.width - body.width));
      body.y = Math.max(0, Math.min(nextY, frameBounds.height - body.height));

      const elapsed = Math.max(now - lastTime, 16);
      body.throwVelocityX =
        ((moveEvent.clientX - lastClientX) / elapsed) * 1000 * DRAG_VELOCITY_SCALE;
      body.throwVelocityY =
        ((moveEvent.clientY - lastClientY) / elapsed) * 1000 * DRAG_VELOCITY_SCALE;

      lastClientX = moveEvent.clientX;
      lastClientY = moveEvent.clientY;
      lastTime = now;

      element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
    };

    const endDrag = (pointerEvent: PointerEvent) => {
      if (body.pointerId !== pointerEvent.pointerId) return;

      body.dragging = false;
      body.pointerId = null;
      body.thrown = true;
      element.classList.remove('logo-cloud__logo--dragging');
      element.releasePointerCapture(pointerEvent.pointerId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };

  return (
    <section className={`logo-cloud ${visible ? 'visible' : ''} ${className}`.trim()}>
      <div ref={frameRef} className="logo-cloud__frame">
        <div className="logo-cloud__copy">
          {eyebrow ? <span className="logo-cloud__eyebrow">{eyebrow}</span> : null}
          <h2 className="logo-cloud__title">{title}</h2>
          {body ? <p className="logo-cloud__body">{body}</p> : null}
        </div>

        <div className="logo-cloud__logos" aria-hidden="true">
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              ref={(element) => {
                logoRefs.current[index] = element;
              }}
              className="logo-cloud__logo"
              onPointerDown={isMobile ? undefined : (event) => handlePointerDown(index, event)}
            >
              {logo.hasImage !== false ? (
                <>
                  <img
                    src={logo.src}
                    alt=""
                    className="logo-cloud__image"
                    onError={(event) => {
                      const target = event.currentTarget;
                      const fallback = target.nextElementSibling as HTMLElement | null;
                      target.style.display = 'none';
                      if (fallback) fallback.style.display = 'inline-flex';
                    }}
                  />
                  <span className="logo-cloud__fallback" style={{ display: 'none' }}>
                    {logo.name}
                  </span>
                </>
              ) : (
                <span className="logo-cloud__text">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
