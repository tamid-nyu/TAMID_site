import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer, CallToAction, SubpageHero, ArrowIcon } from '@components';
import { useScrollAnimation } from '@hooks';
import { dataService } from '@api';
import { getBoardMemberThumbnailUrl } from '@utils';
import type { BoardMember } from '@types';
import './TrackLeadership.css';

interface TrackLeader {
  name: string;
  role: string;
  classYear: number;
  photo?: string; // file in public/track-leadership/; initials show until one is added
}

interface TrackLeadershipGroup {
  track: string;
  trackHref: string;
  directorPositions: string[]; // matched against the admin panel's Board positions, shown in this order
  summary: string;
  leaders: TrackLeader[];
}

// Fall 2026. Update each semester from the Internal roster (Track: Fund SEA, Consulting PM / APM).
const TRACK_LEADERSHIP: TrackLeadershipGroup[] = [
  {
    track: 'Investment Fund',
    trackHref: '/tracks/fund',
    directorPositions: ['Director of Fund'],
    summary:
      'Senior Equity Analysts lead the Fund’s research teams, guiding members through coverage, valuation, and pitches.',
    leaders: [
      {
        name: 'Logan Silverman',
        role: 'Senior Equity Analyst',
        classYear: 2028,
        photo: 'logan-silverman.jpg',
      },
      {
        name: 'Jayson Schiller',
        role: 'Senior Equity Analyst',
        classYear: 2028,
        photo: 'jayson-schiller.jpg',
      },
      {
        name: 'Aaron Heumann',
        role: 'Senior Equity Analyst',
        classYear: 2029,
        photo: 'aaron-heumann.jpg',
      },
      { name: 'Ami Kent', role: 'Senior Equity Analyst', classYear: 2029, photo: 'ami-kent.jpg' },
      {
        name: 'Josh Zinkin',
        role: 'Senior Equity Analyst',
        classYear: 2029,
        photo: 'josh-zinkin.jpg',
      },
    ],
  },
  {
    track: 'Consulting',
    trackHref: '/tracks/consulting',
    directorPositions: ['Director of Consulting'],
    summary:
      'Project Managers and Assistant Project Managers run each client engagement, from scoping through final recommendations.',
    leaders: [
      { name: 'Henry Wang', role: 'Project Manager', classYear: 2028, photo: 'henry-wang.jpg' },
      { name: 'Uma Bisal', role: 'Project Manager', classYear: 2029 },
      {
        name: 'Sasha Liberman',
        role: 'Assistant Project Manager',
        classYear: 2027,
        photo: 'sasha-liberman.jpg',
      },
      { name: 'Anaysha Khandelwal', role: 'Assistant Project Manager', classYear: 2028 },
    ],
  },
  {
    track: 'Quant',
    trackHref: '/tracks/quant',
    directorPositions: ['Director of Quant', 'Director of Quant Education'],
    summary:
      'Quant leadership guides members through data-driven research and systematic strategy development, from signals to backtests.',
    leaders: [
      {
        name: 'Vartan Yildiz',
        role: 'Senior Quant Analyst',
        classYear: 2028,
        photo: 'vartan-yildiz.jpg',
      },
    ],
  },
];

// Class standing from graduation year, like the Board page ("Junior"). The academic year ends in May.
const standing = (classYear: number, today = new Date()) => {
  const yearsLeft =
    classYear - (today.getMonth() >= 6 ? today.getFullYear() + 1 : today.getFullYear());
  return ['Senior', 'Junior', 'Sophomore', 'First-Year'][yearsLeft] ?? `Class of ${classYear}`;
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

export const TrackLeadership = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.18 });
  const directoryAnimation = useScrollAnimation({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });
  const [board, setBoard] = useState<BoardMember[]>([]);

  // Directors come from the admin panel's Board list, so their photo and details stay in sync.
  useEffect(() => {
    dataService.boardMembers
      .getAll()
      .then(setBoard)
      .catch((err) => console.error('Failed to fetch board members:', err));
  }, []);

  const directorFor = (position: string) =>
    board.find((member) => member.position.trim().toLowerCase() === position.toLowerCase());

  return (
    <>
      <div className="page-container track-leadership-page">
        <SubpageHero
          ref={heroAnimation.elementRef}
          visible={heroAnimation.isVisible}
          backgroundImageSrc="/board-gallery/nyu-stern.jpg?v=3"
          backgroundImageAlt="The NYU Stern School of Business building"
          imagePosition="center 35%"
          title="Track Leadership"
          lead="The students who lead our Investment Fund, Consulting, and Quant teams day to day."
        />

        <section
          ref={directoryAnimation.elementRef}
          className={`track-leadership ${directoryAnimation.isVisible ? 'visible' : ''}`}
          aria-label="Track leadership by track"
        >
          {TRACK_LEADERSHIP.map((group) => {
            const directors = group.directorPositions
              .map(directorFor)
              .filter((member): member is BoardMember => Boolean(member));
            // The first director leads the section; any others (e.g. Director of Quant Education) form a second tier.
            const [lead, ...deputies] = directors;
            return (
              <div key={group.track} className="track-leadership__group">
                <header className="track-leadership__header">
                  <div>
                    <h2 className="track-leadership__track">{group.track}</h2>
                    <p className="track-leadership__summary">{group.summary}</p>
                  </div>
                  <Link to={group.trackHref} className="track-leadership__track-link">
                    About the track
                    <ArrowIcon className="track-leadership__track-link-icon" />
                  </Link>
                </header>

                {lead && (
                  <div className="track-director-card">
                    {lead.headshotFile ? (
                      <img
                        src={getBoardMemberThumbnailUrl(lead.headshotFile, lead.headshotUpdatedAt)}
                        alt={`${lead.fullName} headshot`}
                        className="track-director-card__photo"
                      />
                    ) : (
                      <span
                        className="track-director-card__photo track-director-card__photo--initials"
                        aria-hidden="true"
                      >
                        {initials(lead.fullName)}
                      </span>
                    )}
                    <div className="track-director-card__body">
                      <p className="track-leader-card__role">{lead.position}</p>
                      <h3 className="track-director-card__name">{lead.fullName}</h3>
                      <p className="track-leader-card__year">
                        {[lead.year, lead.major].filter(Boolean).join(' · ')}
                      </p>
                      <Link to="/our-board" className="track-director-card__link">
                        Executive Board profile
                        <ArrowIcon className="track-leadership__track-link-icon" />
                      </Link>
                    </div>
                  </div>
                )}

                {deputies.length > 0 && (
                  <ul className="track-leadership__grid track-leadership__grid--deputies">
                    {deputies.map((deputy) => (
                      <li key={deputy.id} className="track-leader-card track-leader-card--director">
                        {deputy.headshotFile ? (
                          <img
                            src={getBoardMemberThumbnailUrl(
                              deputy.headshotFile,
                              deputy.headshotUpdatedAt
                            )}
                            alt={`${deputy.fullName} headshot`}
                            className="track-leader-card__photo"
                          />
                        ) : (
                          <span className="track-leader-card__monogram" aria-hidden="true">
                            {initials(deputy.fullName)}
                          </span>
                        )}
                        <div className="track-leader-card__body">
                          <p className="track-leader-card__role">{deputy.position}</p>
                          <h3 className="track-leader-card__name">{deputy.fullName}</h3>
                          <p className="track-leader-card__year">
                            {[deputy.year, deputy.major].filter(Boolean).join(' · ')}
                          </p>
                          <Link to="/our-board" className="track-leader-card__link">
                            Board profile
                            <ArrowIcon className="track-leadership__track-link-icon" />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <ul className="track-leadership__grid">
                  {group.leaders.map((leader) => (
                    <li key={leader.name} className="track-leader-card">
                      {leader.photo ? (
                        <img
                          src={`/track-leadership/${leader.photo}`}
                          alt={`${leader.name} headshot`}
                          className="track-leader-card__photo"
                          loading="lazy"
                        />
                      ) : (
                        <span className="track-leader-card__monogram" aria-hidden="true">
                          {initials(leader.name)}
                        </span>
                      )}
                      <div className="track-leader-card__body">
                        <p className="track-leader-card__role">{leader.role}</p>
                        <h3 className="track-leader-card__name">{leader.name}</h3>
                        <p className="track-leader-card__year">{standing(leader.classYear)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <CallToAction
          title="Questions About a Track?"
          bodyText="Each track is overseen by its directors on our Executive Board. Meet them on the Board page, or get in touch with us directly."
          primaryButtonText="Meet the Board"
          primaryButtonHref="/our-board"
          secondaryButtonText="Get in Touch"
          secondaryButtonHref="/contact"
        />
      </div>

      <Footer />
    </>
  );
};
