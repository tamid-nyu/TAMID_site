import { NavLink, useLocation } from 'react-router-dom';
import './NavButton.css';

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
  onClick?: () => void;
}

export const NavButton = ({
  to,
  children,
  variant = 'default',
  className = '',
  onClick,
}: NavButtonProps) => {
  const location = useLocation();
  const destination =
    location.pathname === to
      ? {
          pathname: to,
          search: location.search,
          hash: location.hash,
        }
      : to;

  return (
    <NavLink
      to={destination}
      className={({ isActive }) =>
        `nav-button nav-button--${variant} ${isActive ? 'is-active' : ''} ${className}`.trim()
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};
