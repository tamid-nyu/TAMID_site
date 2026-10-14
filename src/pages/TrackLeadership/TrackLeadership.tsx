import { Link } from 'react-router-dom';
import { Footer, CallToAction, SubpageHero, ArrowIcon } from '@components';
import { useScrollAnimation } from '@hooks';
import './TrackLeadership.css';

interface TrackLeader {
  name: string;
  role: string;
  classYear: number;
}

interface TrackLeadershipGroup {
  track: string;
  trackHref: string;
  summary: string;
  leaders: TrackLeader[];
}

// Fall 2026. Update each semester from the Internal roster (Track: Fund SEA, Consulting PM / APM).
const TRACK_LEADERSHIP: TrackLeadershipGroup[] = [
  {
    track: 'Investment Fund',
    trackHref: '/tracks/fund',
    summary:
      'Senior Equity Analysts lead the Fund’s research teams, guiding members through coverage, valuation, and pitches.',
    leaders: [
      { name: 'Logan Silverman', role: 'Senior Equity Analyst', classYear: 2028 },
      { name: 'Jayson Schiller', role: 'Senior Equity Analyst', classYear: 2028 },
      { name: 'Aaron Heumann', role: 'Senior Equity Analyst', classYear: 2029 },
      { name: 'Ami Kent', role: 'Senior Equity Analyst', classYear: 2029 },
      { name: 'Josh Zinkin', role: 'Senior Equity Analyst', classYear: 2029 },
    ],
  },
  {
    track: 'Consulting',
    trackHref: '/tracks/consulting',
    summary:
      'Project Managers and Assistant Project Managers run each client engagement, from scoping through final recommendations.',
    leaders: [
      { name: 'Henry Wang', role: 'Project Manager', classYear: 2028 },
      { name: 'Uma Bisal', role: 'Project Manager', classYear: 2029 },
      { name: 'Sasha Liberman', role: 'Assistant Project Manager', classYear: 2027 },
      { name: 'Anaysha Khandelwal', role: 'Assistant Project Manager', classYear: 2028 },
    ],
  },
];

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
          lead="The students who lead our Investment Fund and Consulting teams day to day."
        />

        <section
          ref={directoryAnimation.elementRef}
          className={`track-leadership ${directoryAnimation.isVisible ? 'visible' : ''}`}
          aria-label="Track leadership by track"
        >
          {TRACK_LEADERSHIP.map((group) => (
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

              <ul className="track-leadership__grid">
                {group.leaders.map((leader) => (
                  <li key={leader.name} className="track-leader-card">
                    <span className="track-leader-card__monogram" aria-hidden="true">
                      {initials(leader.name)}
                    </span>
                    <div className="track-leader-card__body">
                      <p className="track-leader-card__role">{leader.role}</p>
                      <h3 className="track-leader-card__name">{leader.name}</h3>
                      <p className="track-leader-card__year">Class of {leader.classYear}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <CallToAction
          title="Questions About a Track?"
          bodyText="Our Director of Fund and Director of Consulting oversee these teams. Meet them on the Executive Board page, or get in touch with us directly."
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
