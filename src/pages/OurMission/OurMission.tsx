import {
  CallToAction,
  Footer,
  LogoCloud,
  SubpageHero,
  ZigzagView,
  type Logo,
  type ZigzagViewItem,
} from '@components';
import { useScrollAnimation } from '@hooks';
import './OurMission.css';

const ALUMNI_LOGOS: Logo[] = [
  { name: 'Capital One', src: '/alumni-logos/capital-one-logo.png' },
  { name: 'Deutsche Bank', src: '/alumni-logos/deutsche-bank-logo.png' },
  { name: 'FTI Consulting', src: '/alumni-logos/fti-consluting-logo.png' },
  { name: 'Goldman Sachs', src: '/alumni-logos/goldman-sachs-logo.png' },
  { name: 'JPMorgan Chase', src: '/alumni-logos/jpmorgan-logo.png' },
  { name: 'Lazard', src: '/alumni-logos/lazard-logo.svg' },
  { name: 'Lincoln International', src: '/alumni-logos/lincoln-international-logo.png' },
  { name: 'Morgan Stanley', src: '/alumni-logos/morgan-stanley-logo.jpg' },
  { name: 'Palantir', src: '/alumni-logos/palantir-logo.png' },
  { name: 'UBS', src: '/alumni-logos/ubs-logo.png' },
  { name: 'Wells Fargo', src: '/alumni-logos/wells-fargo-logo.png' },
] as const;

const MISSION_STORIES: ZigzagViewItem[] = [
  {
    key: 'leadership-pipeline',
    eyebrow: 'Community',
    title: 'A bridge between generations.',
    description:
      'Our goal is to bridge generations – allowing students to learn directly from those who have built, led, and given back, while creating a pipeline of future leaders equipped to do the same. Our community consists of hundreds of students across all schools within NYU.',
    image: '/mission-gallery/networking-blurb.png',
    alt: 'SJBA members networking',
  },
  {
    key: 'speaker-series',
    eyebrow: 'Spotlight',
    title: 'Leadership and impact, up close.',
    description:
      "Reflecting our strong focus on leadership and impact, our speaker series – SJBA Spotlight – has included Fortune 500 CEOs, partners at distinguished firms like Goldman Sachs and Blackstone, U.S. ambassadors, professional athletes, and notable entrepreneurs. Despite our large following, our conversations feel intimate and engaging. We want our members to hear from those who've stood where they stand now and know what it takes to go further.",
    image: '/mission-gallery/speakers-blurb.png',
    alt: 'SJBA speaker event',
  },
];

export const OurMission = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.18 });
  const overviewAnimation = useScrollAnimation({
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });
  const storiesAnimation = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  const logoCloudAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  return (
    <>
      <div className="page-container our-mission-page">
        <SubpageHero
          ref={heroAnimation.elementRef}
          visible={heroAnimation.isVisible}
          backgroundImageSrc="/mission-gallery/stern-building.jpg"
          backgroundImageAlt="NYU Stern building"
          title="Our Mission"
          lead="The Stern Jewish Business Association is one of the most active and substantive student organizations at the NYU Stern School of Business, open to all who are supportive of the Jewish community and values, regardless of faith."
        />

        <section
          ref={overviewAnimation.elementRef}
          className={`our-mission-overview ${overviewAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="our-mission-overview__intro">
            <h2>Stern's value-driven Jewish community.</h2>
          </div>

          <div className="our-mission-overview__detail">
            <p className="our-mission-overview__lead">
              SJBA was founded in the wake of the October 7th terrorist attacks in Israel to combat
              the surge of antisemitism on campus. Since then, we have connected with industry
              leaders, intellectuals, and value creators to inspire students on campus.
            </p>
          </div>
        </section>

        <ZigzagView
          ref={storiesAnimation.elementRef}
          className="our-mission-stories"
          visible={storiesAnimation.isVisible}
          items={MISSION_STORIES}
        />

        <div ref={logoCloudAnimation.elementRef} className="our-mission-logo-cloud">
          <LogoCloud
            visible={logoCloudAnimation.isVisible}
            logos={ALUMNI_LOGOS}
            title="Where Our Members End Up"
            body="Our members move into leading firms across finance, consulting, technology, and investing, carrying forward the values cultivated at SJBA."
          />
        </div>

        <CallToAction
          title="Join Our Community"
          bodyText="SJBA is open to all students who are supportive of the Jewish community and values. Connect with like-minded peers, attend our speaker series, and build meaningful relationships that last beyond graduation."
          primaryButtonText="Contact Us"
          primaryButtonHref="/contact"
          secondaryButtonText="Attend Our Events"
          secondaryButtonHref="/events"
        />
      </div>

      <Footer />
    </>
  );
};
