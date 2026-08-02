import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Footer,
  LoadingSpinner,
  ErrorDisplay,
  BoardMemberModal,
  CallToAction,
  SubpageHero,
  ArrowIcon,
} from '@components';
import { useScrollAnimation } from '@hooks';
import { dataService } from '@api';
import { getBoardMemberImageUrl, getBoardMemberThumbnailUrl } from '@utils';
import type { BoardMember } from '@types';
import './OurBoard.css';

interface BoardMemberNameProps {
  fullName: string;
}

const BoardMemberName = ({ fullName }: BoardMemberNameProps) => {
  const nameParts = fullName.trim().split(/\s+/);
  const hasMultipleParts = nameParts.length > 1;
  const firstLine = hasMultipleParts ? nameParts.slice(0, -1).join(' ') : fullName;
  const secondLine = hasMultipleParts ? (nameParts[nameParts.length - 1] ?? '') : '\u00A0';

  return (
    <span className="member-name-text" aria-label={fullName}>
      <span className="member-name-line">{firstLine}</span>
      <span className="member-name-line">{secondLine}</span>
    </span>
  );
};

export const OurBoard = () => {
  const heroAnimation = useScrollAnimation({
    threshold: 0.18,
  });
  const boardAnimation = useScrollAnimation({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [forceVisible, setForceVisible] = useState(false);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  const preloadBoardMemberImage = useCallback(
    (member: BoardMember) =>
      new Promise<boolean>((resolve) => {
        if (!member.headshotFile) {
          resolve(false);
          return;
        }

        const fullSrc = getBoardMemberImageUrl(member.headshotFile, member.headshotUpdatedAt);

        if (preloadedImagesRef.current.has(fullSrc)) {
          resolve(true);
          return;
        }

        const img = new Image();
        img.decoding = 'async';

        const finalize = () => {
          preloadedImagesRef.current.add(fullSrc);
          resolve(true);
        };

        img.onload = () => {
          if (typeof img.decode === 'function') {
            void img.decode().then(finalize).catch(finalize);
            return;
          }

          finalize();
        };

        img.onerror = () => {
          resolve(false);
        };

        img.src = fullSrc;
      }),
    []
  );

  const fetchBoardMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const members = await dataService.boardMembers.getAll();
      setBoardMembers(members);

      const preloadResults = await Promise.all(
        members.map(async (member) => ({
          memberName: member.fullName,
          loaded: await preloadBoardMemberImage(member),
        }))
      );

      const failedMembers = preloadResults
        .filter((result) => !result.loaded)
        .map((result) => result.memberName)
        .filter(Boolean);

      if (failedMembers.length > 0) {
        setImageErrors((previous) => new Set([...previous, ...failedMembers]));
      }
    } catch (error) {
      console.error('Failed to fetch board members:', error);
      let errorMessage = 'Failed to load board members. Please try again later.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [preloadBoardMemberImage]);

  // Fetch board members data
  useEffect(() => {
    void fetchBoardMembers();
  }, [fetchBoardMembers]);

  // Fallback mechanism for mobile - ensure animations trigger after a delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceVisible(true);
    }, 1000); // Show animations after 1 second if they haven't triggered naturally

    return () => clearTimeout(timeout);
  }, []);

  const handleImageError = useCallback((memberName: string) => {
    if (!memberName) return;
    setImageErrors((prev) => new Set(prev).add(memberName));
  }, []);

  const shouldShowPlaceholder = useCallback(
    (member: BoardMember) => {
      return !member.headshotFile || imageErrors.has(member.fullName);
    },
    [imageErrors]
  );

  const openModal = (member: BoardMember) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <>
      <div className="page-container board-page">
        <SubpageHero
          ref={heroAnimation.elementRef}
          visible={heroAnimation.isVisible}
          backgroundImageSrc="/board-gallery/board-gallery-1.jpg"
          backgroundImageAlt="SJBA members gathered at an event"
          imagePosition="center 42%"
          title="Executive Board"
          lead="Meet the students leading SJBA this academic year."
        />

        <section
          id="board-directory"
          ref={boardAnimation.elementRef}
          className={`board-directory ${boardAnimation.isVisible || forceVisible ? 'visible' : ''}`}
          aria-labelledby="board-directory-title"
        >
          {isLoading ? (
            <div className="board-directory__status">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="board-directory__status">
              <ErrorDisplay error={error} onRetry={() => void fetchBoardMembers()} />
            </div>
          ) : (
            <div
              className={`board-grid stagger-children ${boardAnimation.isVisible || forceVisible ? 'visible' : ''}`}
              role="list"
            >
              {boardMembers
                .filter((member) => member && member.fullName)
                .map((member) => (
                  <article
                    key={member.id}
                    className="board-member-card stagger-item"
                    role="listitem"
                  >
                    <button
                      type="button"
                      className="board-member-trigger"
                      onClick={() => openModal(member)}
                      aria-label={`Open ${member.fullName}'s board profile`}
                    >
                      <div className="member-top-row">
                        <p className="member-position">{member.position}</p>
                        <span className="member-open-indicator" aria-hidden="true">
                          <ArrowIcon className="member-open-indicator__icon" />
                        </span>
                      </div>

                      <div className="member-photo">
                        {shouldShowPlaceholder(member) ? (
                          <div className="photo-placeholder">
                            <span>
                              {member.fullName
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={getBoardMemberThumbnailUrl(
                              member.headshotFile,
                              member.headshotUpdatedAt
                            )}
                            alt={`${member.fullName} headshot`}
                            className="member-headshot"
                            onError={() => handleImageError(member.fullName)}
                          />
                        )}
                      </div>

                      <div className="member-info">
                        <div className="member-header">
                          <div className="member-name-row">
                            <h3 className="member-name">
                              <BoardMemberName fullName={member.fullName} />
                            </h3>
                            <div
                              className="member-actions"
                              aria-label={`${member.fullName} contact actions`}
                            >
                              <a
                                href={`mailto:${member.email}`}
                                className="member-action-link"
                                title={`Email ${member.fullName}`}
                              >
                                <img src="/icons/email-icon.png" alt="" aria-hidden="true" />
                              </a>
                              {member.linkedinUrl && (
                                <a
                                  href={member.linkedinUrl}
                                  className="member-action-link"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`View ${member.fullName} on LinkedIn`}
                                >
                                  <img src="/icons/linkedin-logo.png" alt="" aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="member-details">
                          <span className="member-details-year">{member.year}</span>
                          <span className="member-details-major">{member.major}</span>
                        </p>
                      </div>
                    </button>
                  </article>
                ))}
            </div>
          )}
        </section>

        <CallToAction
          title="Interested in Joining Our Board?"
          bodyText="SJBA is always looking for passionate students who want to make a difference in the Jewish community at NYU Stern. Board positions become available each academic year through our application process."
          primaryButtonText="Get Involved"
          primaryButtonHref="/contact"
          secondaryButtonText="Attend SJBA Events"
          secondaryButtonHref="/events"
        />
      </div>

      <BoardMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={closeModal}
        onImageError={handleImageError}
        shouldShowPlaceholder={shouldShowPlaceholder}
      />

      <Footer />
    </>
  );
};
