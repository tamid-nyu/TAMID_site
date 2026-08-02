/**
 *
 * A reusable placeholder component for pages that are under development.
 *
 */

import './ConstructionNotice.css';

interface ConstructionNoticeProps {
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const ConstructionNotice = ({
  message = 'This page is currently under construction. Stay tuned for updates.',
  buttonText = 'Get Involved',
  buttonLink = '/contact',
}: ConstructionNoticeProps) => {
  return (
    <div className="construction-container">
      <h2>{message}</h2>
      <div className="construction-buttons">
        <a href={buttonLink} className="construction-btn">
          {buttonText}
        </a>
      </div>
    </div>
  );
};
