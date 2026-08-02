import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, NavButton } from '@components';
import { useIsMobile } from '@hooks';
import './Header.css';

const SETTLED_SCROLL_THRESHOLD = 36;
const OVERLAY_HEADER_ROUTES = new Set([
  '/',
  '/programs',
  '/our-mission',
  '/our-members',
  '/our-board',
  '/events',
]);
const ABOUT_DROPDOWN_ITEMS = [
  { label: 'The TAMID Mission', to: '/our-mission' },
  { label: 'Executive Board', to: '/our-board' },
  { label: 'General Members', to: '/our-members' },
];

export const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile(1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const usesOverlayHeader = OVERLAY_HEADER_ROUTES.has(location.pathname);
  const isSettled = !usesOverlayHeader || isScrolled || isMenuOpen;
  const mobileLogoSrc = isSettled
    ? '/tamid/tamid-logo-clear-no-text.png'
    : '/tamid/tamid-logo-clear-inverted.png';

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > SETTLED_SCROLL_THRESHOLD);
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });

    return () => window.removeEventListener('scroll', syncScrollState);
  }, []);

  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((previousState) => !previousState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`header ${isSettled ? 'header--settled' : 'header--overlay'} ${
        isMenuOpen ? 'menu-open' : ''
      }`}
    >
      <nav className="nav-container" aria-label="Primary">
        <div className="logo">
          <Link to="/" onClick={closeMenu} className="logo-link" aria-label="TAMID home">
            <img
              src="/tamid/tamid-logo-full-inverted.png"
              alt="TAMID Group at NYU Logo"
              className="logo-image logo-image--overlay"
            />
            <img
              src="/tamid/tamid-logo-full.png"
              alt="TAMID Group at NYU Logo"
              className="logo-image logo-image--settled"
            />
            <img
              src={mobileLogoSrc}
              alt="TAMID Group at NYU Logo"
              className="logo-image logo-image--mobile"
            />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="menu-icon" aria-hidden="true"></span>
        </button>

        <div className={`nav-buttons ${isMenuOpen ? 'active' : ''}`} id="primary-navigation">
          <NavButton to="/events" onClick={closeMenu}>
            Events
          </NavButton>
          <NavButton to="/programs" onClick={closeMenu}>
            Programs
          </NavButton>
          <Dropdown
            label="About"
            items={ABOUT_DROPDOWN_ITEMS}
            activeRoutes={ABOUT_DROPDOWN_ITEMS.map((item) => item.to)}
            menuId="about-dropdown-menu"
            onClose={closeMenu}
          />
          <NavButton to="/contact" variant="primary" onClick={closeMenu}>
            Contact
          </NavButton>
        </div>
      </nav>
    </header>
  );
};
