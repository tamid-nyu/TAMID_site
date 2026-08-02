import { forwardRef } from 'react';
import './SubpageHero.css';

interface SubpageHeroProps {
  actions?: React.ReactNode;
  backgroundImageAlt?: string;
  backgroundImageSrc: string;
  className?: string;
  eyebrow?: React.ReactNode;
  imagePosition?: string;
  lead?: React.ReactNode;
  title: React.ReactNode;
  visible?: boolean;
}

export const SubpageHero = forwardRef<HTMLElement, SubpageHeroProps>(
  (
    {
      actions,
      backgroundImageAlt = '',
      backgroundImageSrc,
      className = '',
      eyebrow,
      imagePosition = 'center',
      lead,
      title,
      visible = false,
    },
    ref
  ) => {
    return (
      <section ref={ref} className={`subpage-hero ${visible ? 'visible' : ''} ${className}`.trim()}>
        <div className="subpage-hero__background" aria-hidden="true">
          <img
            src={backgroundImageSrc}
            alt={backgroundImageAlt}
            className="subpage-hero__image"
            style={{ objectPosition: imagePosition }}
          />
        </div>

        <div className="subpage-hero__shell">
          <div className="subpage-hero__copy">
            {eyebrow ? <span className="subpage-hero__eyebrow">{eyebrow}</span> : null}
            <h1 className="subpage-hero__title">{title}</h1>
            {lead ? <p className="subpage-hero__lead">{lead}</p> : null}
            {actions ? <div className="subpage-hero__actions">{actions}</div> : null}
          </div>
        </div>
      </section>
    );
  }
);

SubpageHero.displayName = 'SubpageHero';
