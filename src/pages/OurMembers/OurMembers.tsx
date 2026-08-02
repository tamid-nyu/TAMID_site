import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Footer,
  LoadingSpinner,
  ErrorDisplay,
  CallToAction,
  SubpageHero,
  ArrowIcon,
} from '@components';
import { semesterSortKey, semesterLabel } from '@utils';
import { useScrollAnimation } from '@hooks';
import { dataService } from '@api';
import type { Member } from '@types';
import './OurMembers.css';

export const OurMembers = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.18 });
  const overviewAnimation = useScrollAnimation({
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });
  const directoryAnimation = useScrollAnimation({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });
  const directoryHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSemesterIndex, setActiveSemesterIndex] = useState(0);
  const [semesterTitleDirection, setSemesterTitleDirection] = useState<'next' | 'prev'>('next');
  const [scrollIndicator, setScrollIndicator] = useState({
    isVisible: false,
    thumbHeight: 0,
    thumbOffset: 0,
  });

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.members.getAll();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      let errorMessage = 'Failed to load members. Please try again later.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const updateScrollIndicator = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = tableWrapperRef.current;
    if (!element) {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const { clientHeight, scrollHeight, scrollTop } = element;
    const hasOverflow = isDesktop && scrollHeight > clientHeight + 1;

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
    updateScrollIndicator();

    const handleResize = () => {
      updateScrollIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollIndicator, activeSemesterIndex, isLoading, error, members.length]);

  // Group members by semester, sorted newest-first
  const groupedMembers = useMemo(() => {
    const map = new Map<string, Member[]>();
    for (const member of members) {
      const list = map.get(member.semester) ?? [];
      list.push(member);
      map.set(member.semester, list);
    }

    // Sort each group alphabetically by last name, then first name
    for (const list of map.values()) {
      list.sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });
    }

    // Sort semesters newest-first
    const sorted = Array.from(map.entries()).sort(
      ([a], [b]) => semesterSortKey(b) - semesterSortKey(a)
    );

    return sorted;
  }, [members]);

  const canGoPrev = activeSemesterIndex > 0;
  const canGoNext = activeSemesterIndex < groupedMembers.length - 1;
  const activeSemester = groupedMembers[activeSemesterIndex];
  const activeSemesterLabel = activeSemester ? semesterLabel(activeSemester[0]) : '';
  const goToPreviousSemester = () => {
    setSemesterTitleDirection('prev');
    setActiveSemesterIndex((index) => index - 1);
  };
  const goToNextSemester = () => {
    setSemesterTitleDirection('next');
    setActiveSemesterIndex((index) => index + 1);
  };

  return (
    <>
      <div className="page-container members-page">
        <SubpageHero
          ref={heroAnimation.elementRef}
          visible={heroAnimation.isVisible}
          backgroundImageSrc="/members-gallery/members-gallery-1.jpeg"
          backgroundImageAlt="SJBA members at a community event"
          imagePosition="center 42%"
          title="General Members"
          lead="Membership reflects sustained involvement in the SJBA community. Every event remains open to all students, while recognition is reserved for those who show up consistently across the semester."
        />

        <section
          ref={overviewAnimation.elementRef}
          className={`members-overview ${overviewAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="members-overview__intro">
            <span className="members-section-label">Membership Criteria</span>
            <h2>Recognition is earned through steady participation.</h2>
            <p className="members-overview__lead">
              Official membership acknowledges students who consistently invest in SJBA's
              programming, conversations, and broader community life.
            </p>
          </div>

          <div className="members-overview__detail">
            <div className="members-requirements">
              <h3 className="members-requirements__title">Membership requirements</h3>

              <div className="members-criteria-list" aria-label="Membership requirements">
                <article className="members-criteria-item">
                  <p className="members-criteria-item__value" aria-label="4 events required">
                    <span className="members-criteria-item__count">4</span>
                    <span className="members-criteria-item__unit">events</span>
                  </p>
                  <div className="members-criteria-item__intro">
                    <p className="members-criteria-item__label">For returning members</p>
                    <p className="members-criteria-item__body">
                      Continue your engagement and keep active status.
                    </p>
                  </div>
                </article>

                <article className="members-criteria-item">
                  <p className="members-criteria-item__value" aria-label="5 events required">
                    <span className="members-criteria-item__count">5</span>
                    <span className="members-criteria-item__unit">events</span>
                  </p>
                  <div className="members-criteria-item__intro">
                    <p className="members-criteria-item__label">For new members</p>
                    <p className="members-criteria-item__body">
                      Build your initial semester of involvement.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <p className="members-overview__body">
              Membership recognition helps SJBA direct funding and priority access toward students
              who actively contribute to resume reviews, mock interviews, speaker programming, and
              the club's long-term professional community.
            </p>
          </div>
        </section>

        <section
          ref={directoryAnimation.elementRef}
          className={`members-directory ${directoryAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="members-directory__header">
            <h2 id="members-directory-title" ref={directoryHeadingRef}>
              Recognized members by semester
            </h2>
            <p className="members-directory__intro">
              Individuals listed below met the attendance threshold and earned official SJBA
              membership.
            </p>
          </div>

          <div className="members-directory__content">
            {isLoading ? (
              <div className="members-directory__status">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="members-directory__status">
                <ErrorDisplay error={error} onRetry={() => void fetchMembers()} />
              </div>
            ) : groupedMembers.length === 0 ? (
              <p className="members-empty">No recognized members to display yet.</p>
            ) : (
              <>
                {activeSemester && (
                  <div className="members-directory__surface">
                    <div className="members-directory__surface-header">
                      <div
                        className="members-directory__semester-nav"
                        aria-label="Semester navigation"
                      >
                        <button
                          type="button"
                          className="semester-inline-arrow"
                          onClick={goToPreviousSemester}
                          aria-label="Previous semester"
                          disabled={!canGoPrev}
                        >
                          <ArrowIcon className="semester-inline-arrow__icon" direction="left" />
                        </button>

                        <h3>
                          <span
                            key={`${activeSemesterLabel}-${activeSemesterIndex}`}
                            className={`members-directory__semester-title members-directory__semester-title--${semesterTitleDirection}`}
                          >
                            {activeSemesterLabel}
                          </span>
                        </h3>

                        <button
                          type="button"
                          className="semester-inline-arrow"
                          onClick={goToNextSemester}
                          aria-label="Next semester"
                          disabled={!canGoNext}
                        >
                          <ArrowIcon className="semester-inline-arrow__icon" />
                        </button>
                      </div>
                      <div className="members-directory__surface-meta">
                        <p className="members-count">
                          {activeSemester[1].length} member
                          {activeSemester[1].length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="members-table-frame">
                      <div
                        ref={tableWrapperRef}
                        className="members-table-wrapper"
                        onScroll={updateScrollIndicator}
                      >
                        <table className="members-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeSemester[1].map((member) => (
                              <tr key={member.id}>
                                <td className="member-name-cell" data-label="Name">
                                  {member.firstName} {member.lastName}
                                </td>
                                <td className="member-email-cell" data-label="Email">
                                  {member.email ? (
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="member-email-link"
                                    >
                                      {member.email}
                                    </a>
                                  ) : (
                                    <span className="no-email">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {scrollIndicator.isVisible ? (
                        <div className="members-table-scrollbar" aria-hidden="true">
                          <span
                            className="members-table-scrollbar__thumb"
                            style={{
                              height: `${scrollIndicator.thumbHeight}px`,
                              transform: `translateY(${scrollIndicator.thumbOffset}px)`,
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <CallToAction
          title="Want to become a member?"
          primaryButtonText="Browse Upcoming Events"
          primaryButtonHref="/events"
          secondaryButtonText="Contact Us"
          secondaryButtonHref="/contact"
        />
      </div>

      <Footer />
    </>
  );
};
