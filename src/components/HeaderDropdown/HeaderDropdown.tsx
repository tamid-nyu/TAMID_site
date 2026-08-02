import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import './HeaderDropdown.css';

interface DropdownItem {
  label: string;
  to: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  activeRoutes?: string[];
  menuId?: string;
  onClose?: () => void;
}

export const Dropdown = ({
  label,
  items,
  activeRoutes,
  menuId = `${label.toLowerCase().replace(/\s+/g, '-')}-dropdown-menu`,
  onClose,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile(1024);
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const matchedRoutes = activeRoutes ?? items.map((item) => item.to);
  const isActive = matchedRoutes.includes(location.pathname);

  const menuEase = [0.22, 1, 0.36, 1] as const;

  const menuVariants: Variants = {
    closed: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(6px)' },
    open: shouldReduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0.12, ease: 'linear', when: 'beforeChildren' as const },
        }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.2,
            ease: menuEase,
            when: 'beforeChildren' as const,
            staggerChildren: 0.035,
          },
        },
  };

  const itemVariants: Variants = {
    closed: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -9 },
    open: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          x: 0,
          transition: { duration: 0.17, ease: menuEase },
        },
  };

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleDocumentClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    closeDropdown();
    onClose?.();
  };

  if (isMobile) {
    return (
      <>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive: linkIsActive }) =>
              `nav-button nav-button--default ${linkIsActive ? 'is-active' : ''}`.trim()
            }
            onClick={handleLinkClick}
          >
            {item.label}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        className={`nav-button nav-button--default dropdown-trigger ${isActive ? 'is-active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((previousState) => !previousState)}
        onFocus={() => setIsOpen(true)}
      >
        {label}
        <motion.span
          className="dropdown-arrow"
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 180 : 0, y: isOpen ? 1 : 0 }}
          transition={{ duration: 0.22, ease: menuEase }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="dropdown-menu-shell">
            <motion.div
              className="dropdown-menu is-open"
              id={menuId}
              role="menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {items.map((item) => (
                <motion.div key={item.to} variants={itemVariants}>
                  <NavLink
                    to={item.to}
                    className={({ isActive: linkIsActive }) =>
                      `dropdown-item ${linkIsActive ? 'is-active' : ''}`.trim()
                    }
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
