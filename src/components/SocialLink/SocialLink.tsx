import React from 'react';
import './SocialLink.css';

interface SocialLinkProps {
  href: string;
  platform: 'linkedin' | 'instagram';
  name: string;
  handle: string;
  iconSrc: string;
  alt: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  platform,
  name,
  handle,
  iconSrc,
  alt,
}) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`social-link ${platform}`}>
      <div className="social-icon-placeholder">
        <img src={iconSrc} alt={alt} className="social-icon" />
      </div>
      <div className="social-text">
        <span className="social-name">{name}</span>
        <span className="social-handle">{handle}</span>
      </div>
    </a>
  );
};
