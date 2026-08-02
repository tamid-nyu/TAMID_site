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
    key: 'four-programs',
    eyebrow: 'Programs',
    title: 'Four programs, one hands-on experience.',
    description:
      'TAMID members build real professional skills across four programs. Education delivers an experiential business curriculum and exposure to the Israeli startup ecosystem. Consulting places students on pro-bono engagements with Israeli startups. The Investment Fund runs equity research and a national simulated-fund competition. And the Israel Fellowship sends members to a summer program in Israel.',
    image: '/mission-gallery/networking-blurb.png',
    alt: 'TAMID Group at NYU members collaborating',
  },
  {
    key: 'israeli-economy',
    eyebrow: 'Israel Focus',
    title: 'Learning through the Israeli economy.',
    description:
      'We develop undergraduates’ professional skills through hands-on work with the Israeli economy — from consulting for early-stage startups to researching public companies. Members gain practical experience, work directly with founders and companies, and build relationships that carry into their careers.',
    image: '/mission-gallery/speakers-blurb.png',
    alt: 'TAMID Group at NYU members at an event',
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
          backgroundImageAlt="NYU building"
          title="Our Mission"
          lead="TAMID Group at NYU is a nonprofit, apolitical, and areligious student organization that develops undergraduates’ professional skills through hands-on work with the Israeli economy."
        />

        <section
          ref={overviewAnimation.elementRef}
          className={`our-mission-overview ${overviewAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="our-mission-overview__intro">
            <h2>Building professional skills, hands-on.</h2>
          </div>

          <div className="our-mission-overview__detail">
            <p className="our-mission-overview__lead">
              TAMID Group at NYU is part of a national, nonprofit network of student chapters. We
              are apolitical and areligious, and open to any undergraduate who wants to develop real
              professional skills through direct, hands-on work with the Israeli economy.
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
            body="Our members move into leading firms across finance, consulting, technology, and investing, carrying forward the skills they build at TAMID."
          />
        </div>

        <CallToAction
          title="Join TAMID"
          bodyText="TAMID Group at NYU is open to any undergraduate who wants hands-on professional experience with the Israeli economy. Join our programs, work directly with startups and companies, and build skills and relationships that last beyond graduation."
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
