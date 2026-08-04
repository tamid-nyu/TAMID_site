import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@hooks';
import { SocialLink } from '@components';
import { STATUS_PAGE_URL } from '@constants';
import './Footer.css';

export const Footer = () => {
  const footerAnimation = useScrollAnimation({ threshold: 0.02 });

  return (
    <footer
      ref={footerAnimation.elementRef}
      className={`footer-section fade-in ${footerAnimation.isVisible ? 'visible' : ''}`}
    >
      <div className="footer-shell">
        <div className="footer-content">
          <div className="footer-lead">
            <div className="footer-intro">
              <h2>Connect with TAMID Group at NYU.</h2>
              <p>Follow club updates and keep the conversation going.</p>
            </div>

            <div className="footer-social">
              <div className="footer-social-links">
                <SocialLink
                  href="https://www.linkedin.com/company/tamidgroup/"
                  platform="linkedin"
                  name="LinkedIn"
                  handle="@tamid"
                  iconSrc="/icons/linkedin-logo.png"
                  alt="LinkedIn"
                />
                <SocialLink
                  href="https://www.instagram.com/nyutamid/"
                  platform="instagram"
                  name="Instagram"
                  handle="@nyutamid"
                  iconSrc="/icons/instagram-logo.png"
                  alt="Instagram"
                />
              </div>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Tracks</h3>
              <Link to="/tracks">Tracks</Link>
            </div>

            <div className="footer-column">
              <h3>Apply</h3>
              <Link to="/apply">Apply</Link>
            </div>

            <div className="footer-column">
              <h3>About Us</h3>
              <Link to="/our-board">Executive Board</Link>
              <Link to="/our-members">General Members</Link>
            </div>

            <div className="footer-column">
              <h3>Connect</h3>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-address">
            <span className="footer-meta-label">New York, NY</span>
            <p>
              TAMID Group at NYU
              <br />
              {/* TODO(human): TAMID physical address placeholder */}
              [Address placeholder]
              <br />
              New York, NY USA
            </p>
          </div>

          <div className="footer-copyright">
            <p>
              Copyright © {new Date().getFullYear()} TAMID Group at NYU.
              <br />
              All rights reserved.
            </p>
            <a
              className="footer-status-link"
              href={STATUS_PAGE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Service Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
