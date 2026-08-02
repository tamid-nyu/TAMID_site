import './CallToAction.css';
import { useScrollAnimation } from '@hooks';
import { InlineLink } from '@components/InlineLink';

interface CallToActionProps {
  title: string;
  bodyText?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export const CallToAction = ({
  title,
  bodyText,
  primaryButtonText = 'Get Involved',
  primaryButtonHref = '/contact',
  secondaryButtonText = 'Attend Our Events',
  secondaryButtonHref = '/events',
}: CallToActionProps) => {
  const animation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  });
  const isInternalPath = (href?: string) => Boolean(href?.startsWith('/'));

  return (
    <section
      ref={animation.elementRef}
      className={`call-to-action-section ${animation.isVisible ? 'visible' : ''}`}
    >
      <div className="call-to-action-shell">
        <div className="call-to-action-content">
          <h2>{title}</h2>
          {bodyText && <p className="call-to-action-body">{bodyText}</p>}
          <div className="call-to-action-buttons">
            <InlineLink
              className="call-to-action-link"
              {...(isInternalPath(primaryButtonHref)
                ? { to: primaryButtonHref }
                : { href: primaryButtonHref })}
            >
              {primaryButtonText}
            </InlineLink>
            <InlineLink
              className="call-to-action-link"
              {...(isInternalPath(secondaryButtonHref)
                ? { to: secondaryButtonHref }
                : { href: secondaryButtonHref })}
            >
              {secondaryButtonText}
            </InlineLink>
          </div>
        </div>
      </div>
    </section>
  );
};
