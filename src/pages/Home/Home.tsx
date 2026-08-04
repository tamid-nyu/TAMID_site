import { startTransition, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useScrollAnimation } from '@hooks';
import { CallToAction, Footer, LogoCloud, LogoGallery, type Logo } from '@components';

import './Home.css';
import '../OurMission/OurMission.css';

const HERO_GALLERY_IMAGES = ['/home-gallery/tamid-gallery-1.JPG'] as const;
const HOME_PAGE_SPEAKER_LOGOS = [
  { name: 'Goldman Sachs', src: '/speaker-logos/goldman-sachs-logo.png' },
  { name: 'JPMorgan Chase', src: '/speaker-logos/jpmorgan-logo.jpg' },
  { name: 'Morgan Stanley', src: '/speaker-logos/morgan-stanley-logo.jpg' },
  { name: 'Blackstone', src: '/speaker-logos/blackstone-logo.png' },
  { name: 'BentallGreenOak', src: '/speaker-logos/bentall-green-oak.png' },
  { name: 'Sequoia Capital', src: '/speaker-logos/sequoia-logo.png' },
  { name: 'McKinsey & Company', src: '/speaker-logos/mckinsey-logo.jpg' },
  { name: 'Ackman-Ziff', src: '/speaker-logos/ackman-ziff-logo.jpg' },
  { name: 'Axom Partners', src: '/speaker-logos/axom-partners-logo.jpg' },
  { name: 'Bank of America', src: '/speaker-logos/bank-of-america-logo.png' },
  { name: 'Carter Pierce', src: '/speaker-logos/carter-pierce-logo.png' },
  { name: 'Cushman & Wakefield', src: '/speaker-logos/cushman-and-wakefield-logo.png' },
  { name: 'Declaration Partners', src: '/speaker-logos/declaration-partners-logo.jpg' },
  { name: 'Deutsche Bank', src: '/speaker-logos/deutsche-bank-logo.png' },
  { name: 'Eden Global Partners', src: '/speaker-logos/eden-global-partners-logo.jpeg' },
  { name: 'FTI Consulting', src: '/speaker-logos/FTI-consulting-logo.png' },
  { name: 'HSBC', src: '/speaker-logos/HSBC-logo.png' },
  { name: 'IBM', src: '/speaker-logos/IBM-logo.png' },
  { name: 'KKR', src: '/speaker-logos/KKR-logo.png' },
  { name: 'Cantor Fitzgerald', src: '/speaker-logos/cantor-fitzgerald-logo.png' },
  { name: 'Palantir', src: '/speaker-logos/palantir-logo.png' },
  { name: 'UBS', src: '/speaker-logos/UBS-logo.png' },
  { name: 'Warby Parker', src: '/speaker-logos/warby-parker.png' },
];
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

const TRACK_CARDS = [
  {
    key: 'fund',
    label: 'Investment Fund',
    title: 'Investment Fund',
    description:
      'A student-run equity research desk. Analysts own sector coverage, build long and short theses, and compete in a national simulated-fund competition.',
    href: '/tracks/fund',
  },
  {
    key: 'consulting',
    label: 'Consulting',
    title: 'Consulting',
    description:
      'Small teams take on semester-long, pro-bono engagements with early-stage Israeli startups, spanning market research, competitive analysis, US market-entry, and go-to-market strategy.',
    href: '/tracks/consulting',
  },
  {
    key: 'quant',
    label: 'Quant',
    title: 'Quant',
    description:
      'A quantitative and algorithmic strategy track. Members work the full research lifecycle, sourcing data, generating signals, and backtesting systematic ideas with Python-based modeling.',
    href: '/tracks/quant',
  },
] as const;

const HomeHero = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });

  const [currentImage, setCurrentImage] = useState(1);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<number[]>([1, 2]);
  const firstHeroImageSrc = HERO_GALLERY_IMAGES[0];

  useEffect(() => {
    if (HERO_GALLERY_IMAGES.length <= 1) return;
    const interval = setInterval(() => {
      startTransition(() => {
        setCurrentImage((prev) => (prev >= HERO_GALLERY_IMAGES.length ? 1 : prev + 1));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (imageNumber: number) => {
    setCurrentImage(imageNumber);
  };

  useEffect(() => {
    startTransition(() => {
      setLoadedGalleryImages((previous) =>
        previous.includes(currentImage) ? previous : [...previous, currentImage]
      );
    });
  }, [currentImage]);

  return (
    <div
      ref={heroAnimation.elementRef}
      className={`hero-section slide-up ${heroAnimation.isVisible ? 'visible' : ''}`}
    >
      <div className="rotating-gallery-background">
        <div className="gallery-image-container">
          {HERO_GALLERY_IMAGES.map((imageSrc, index) => {
            const imageNumber = index + 1;
            const shouldLoadImage = loadedGalleryImages.includes(imageNumber);
            const isActiveImage = currentImage === imageNumber;
            const isPriorityImage = imageNumber === 1;
            const displaySrc = isPriorityImage
              ? firstHeroImageSrc
              : shouldLoadImage
                ? imageSrc
                : undefined;

            return (
              <div
                key={imageSrc}
                className={`gallery-image ${isActiveImage ? 'active' : ''}`}
                data-image={imageNumber}
              >
                {displaySrc ? (
                  <img
                    src={displaySrc}
                    alt=""
                    loading={isPriorityImage ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={isPriorityImage ? 'high' : 'low'}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="gallery-overlay"></div>
      </div>

      <div className="hero-shell">
        <div className="hero-content">
          <div className="hero-copy">
            <h1 className="main-title">TAMID at NYU</h1>
            <p className="hero-triad">
              Consult <span className="triad-sep">·</span> Invest{' '}
              <span className="triad-sep">·</span> Intern Abroad
            </p>
            <p className="hero-description">
              TAMID Group at NYU develops undergraduates’ professional skills through hands-on work
              with the Israeli economy across four programs: Investment Fund, Consulting, Quant, and
              Israel Fellowship.
            </p>

            {HERO_GALLERY_IMAGES.length > 1 && (
              <div className="gallery-navigation" aria-label="Hero gallery navigation">
                {HERO_GALLERY_IMAGES.map((imageSrc, index) => {
                  const imageNumber = index + 1;

                  return (
                    <button
                      key={imageSrc}
                      type="button"
                      className={`nav-dot ${currentImage === imageNumber ? 'active' : ''}`}
                      data-target={imageNumber}
                      onClick={() => handleDotClick(imageNumber)}
                      aria-label={`Show hero image ${imageNumber}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* TODO(human): finalize this logo strip's framing/copy. These are firm logos
            kept as a neutral "where our members go / partner firms" cloud; do NOT
            present as TAMID-specific speaker claims. */}
        <div className="hero-gallery-ribbon">
          <LogoGallery logos={HOME_PAGE_SPEAKER_LOGOS} variant="hero-ribbon" />
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  const storiesAnimation = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  const logoCloudAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  return (
    <div className="page-container">
      <HomeHero />

      <div className="our-mission-page">
        <section
          ref={storiesAnimation.elementRef}
          className={`home-tracks ${storiesAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="home-tracks__header">
            <h2>Three tracks, one hands-on experience.</h2>
          </div>

          <div className="home-tracks__grid">
            {TRACK_CARDS.map((track) => (
              <Link key={track.key} to={track.href} className="home-track-card">
                <h3 className="home-track-card__title">{track.title}</h3>
                <p className="home-track-card__body">{track.description}</p>
                <span className="home-track-card__cta">Explore the track &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        <section
          ref={storiesAnimation.elementRef}
          className={`home-israel ${storiesAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="home-israel__copy">
            <h2>Learning through the Israeli economy.</h2>
            <p>
              We develop undergraduates’ professional skills through hands-on work with the Israeli
              economy, from consulting for early-stage startups to pitching public companies that do
              business in Israel. Members gain practical experience, work directly with founders and
              companies, and build relationships that carry into their careers.
            </p>
            <Link to="/tracks/fellowship" className="home-israel__link">
              Explore the Israel Fellowship &rarr;
            </Link>
          </div>
        </section>

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
          bodyText="Each semester we select a cohort of top-performing undergraduate students. Applications open at the beginning of each semester. If you are somebody who embodies merit, excellence, and intelligence, we encourage you to apply!"
          primaryButtonText="Apply"
          primaryButtonHref="/apply"
        />
      </div>

      <Footer />
    </div>
  );
};
