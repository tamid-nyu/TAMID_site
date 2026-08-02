import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardMember } from '../../types';
import { getBoardMemberImageUrl } from '../../utils';
import './BoardMemberModal.css';

interface BoardMemberModalProps {
  member: BoardMember | null;
  isOpen: boolean;
  onClose: () => void;
  onImageError: (memberName: string) => void;
  shouldShowPlaceholder: (member: BoardMember) => boolean;
}

export const BoardMemberModal: React.FC<BoardMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onImageError,
  shouldShowPlaceholder,
}) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [scrollIndicator, setScrollIndicator] = useState({
    isVisible: false,
    thumbHeight: 0,
    thumbOffset: 0,
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';

        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  const updateScrollIndicator = useCallback(() => {
    const element = bodyRef.current;
    if (!element) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = element;
    const hasOverflow = scrollHeight > clientHeight + 1;

    if (!hasOverflow) {
      setScrollIndicator((previous) =>
        previous.isVisible ? { isVisible: false, thumbHeight: 0, thumbOffset: 0 } : previous
      );
      return;
    }

    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 56);
    const maxThumbOffset = Math.max(clientHeight - thumbHeight, 0);
    const maxScrollTop = Math.max(scrollHeight - clientHeight, 1);
    const thumbOffset = (scrollTop / maxScrollTop) * maxThumbOffset;

    setScrollIndicator({
      isVisible: true,
      thumbHeight,
      thumbOffset,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateScrollIndicator();

    const handleResize = () => {
      updateScrollIndicator();
    };

    window.addEventListener('resize', handleResize);

    if ('fonts' in document) {
      void document.fonts.ready.then(() => {
        updateScrollIndicator();
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, member, updateScrollIndicator]);

  if (!isOpen || !member) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="board-member-modal-name"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close member profile"
        >
          <span className="modal-close-icon" aria-hidden="true"></span>
        </button>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-name-row">
              <div className="modal-identity">
                <div className="modal-name-heading">
                  <h2 id="board-member-modal-name" className="modal-name">
                    {member.fullName}
                  </h2>
                  <div className="modal-icon-buttons">
                    <a
                      href={`mailto:${member.email}`}
                      className="modal-icon-btn email-icon"
                      title={`Email ${member.fullName}`}
                      aria-label={`Email ${member.fullName}`}
                    >
                      <img src="/icons/email-icon.png" alt="" aria-hidden="true" />
                    </a>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        className="modal-icon-btn linkedin-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${member.fullName} on LinkedIn`}
                        aria-label={`View ${member.fullName} on LinkedIn`}
                      >
                        <img src="/icons/linkedin-logo.png" alt="" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="modal-position">{member.position}</h3>
                <div className="modal-meta">
                  <p className="modal-details">
                    {member.major} <span aria-hidden="true">•</span> {member.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body-frame">
          <div ref={bodyRef} className="modal-body" onScroll={updateScrollIndicator}>
            <div className="modal-content-layout">
              <div className="modal-text-section">
                <div className="modal-section">
                  <h4>About</h4>
                  <p>
                    {member.bio.split('\n').map((line, index, array) => (
                      <span key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="modal-side-column">
                <div className="modal-photo-section">
                  {shouldShowPlaceholder(member) ? (
                    <div className="photo-placeholder large">
                      <span>
                        {member.fullName
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={getBoardMemberImageUrl(member.headshotFile, member.headshotUpdatedAt)}
                      alt={`${member.fullName} headshot`}
                      className="member-headshot large"
                      onError={() => onImageError(member.fullName)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="modal-info-grid">
              <div className="modal-section">
                <h4>Hometown</h4>
                <p>{member.hometown}</p>
              </div>
              <div className="modal-section">
                <h4>Email</h4>
                <p>{member.email}</p>
              </div>
            </div>
          </div>
          {scrollIndicator.isVisible ? (
            <div className="modal-scrollbar" aria-hidden="true">
              <span
                className="modal-scrollbar__thumb"
                style={{
                  height: `${scrollIndicator.thumbHeight}px`,
                  transform: `translateY(${scrollIndicator.thumbOffset}px)`,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
