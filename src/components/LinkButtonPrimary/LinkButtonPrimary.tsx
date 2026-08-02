import { Link } from 'react-router-dom';
import './LinkButtonPrimary.css';

interface LinkButtonPrimaryProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  rel?: string;
  target?: string;
  to?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: 'home' | 'subpage';
}

export const LinkButtonPrimary = ({
  children,
  className = '',
  href,
  onClick,
  rel,
  target,
  to,
  type = 'button',
  variant = 'subpage',
}: LinkButtonPrimaryProps) => {
  const classes = `link-button-primary link-button-primary--${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      <img
        src="/icons/arrow-top-right.png"
        alt=""
        aria-hidden="true"
        className="link-button-primary__arrow"
      />
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
