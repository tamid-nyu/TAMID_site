import { Link } from 'react-router-dom';
import './LinkButtonSecondary.css';

interface LinkButtonSecondaryProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  rel?: string;
  showArrow?: boolean;
  showStatusDot?: boolean;
  statusTone?: 'closed' | 'open';
  target?: string;
  to?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: 'home' | 'status';
}

export const LinkButtonSecondary = ({
  children,
  className = '',
  href,
  onClick,
  rel,
  showArrow = false,
  showStatusDot = false,
  statusTone,
  target,
  to,
  type = 'button',
  variant = 'status',
}: LinkButtonSecondaryProps) => {
  const classes = [
    'link-button-secondary',
    `link-button-secondary--${variant}`,
    statusTone ? `link-button-secondary--${statusTone}` : '',
    className,
  ]
    .join(' ')
    .trim();

  const content = (
    <>
      {showStatusDot && statusTone ? (
        <span
          className={`link-button-secondary__status-dot link-button-secondary__status-dot--${statusTone}`}
          aria-hidden="true"
        />
      ) : null}
      <span>{children}</span>
      {showArrow ? (
        <img
          src="/icons/arrow-top-right.png"
          alt=""
          aria-hidden="true"
          className="link-button-secondary__arrow"
        />
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
};
