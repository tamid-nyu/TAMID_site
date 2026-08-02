import { Link } from 'react-router-dom';
import { ArrowIcon } from '@components/ArrowIcon';
import './InlineLink.css';

interface InlineLinkProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  rel?: string;
  target?: string;
  to?: string;
  useArrow?: boolean;
}

export const InlineLink = ({
  children,
  className = '',
  href,
  rel,
  target,
  to,
  useArrow = true,
}: InlineLinkProps) => {
  const classes = `inline-link ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {useArrow && <ArrowIcon className="inline-link__arrow" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} target={target} rel={rel} className={classes}>
      {content}
    </a>
  );
};
