import { startTransition, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { dataService } from '@api';
import type { Event } from '@types';
import { useCurrentTime, useProgressiveImage, useScrollAnimation } from '@hooks';
import {
  Footer,
  FloatingPopup,
  LinkButtonPrimary,
  LinkButtonSecondary,
  LogoGallery,
  NewsletterSignup,
} from '@components';
import {
  getEventThumbnailUrl,
  formatEventDateOnly,
  formatEventTimeOnly,
  getCurrentSiteDateKey,
} from '@utils';

import './Home.css';

const LAST_DISMISSED_DATE_STORAGE_KEY = 'homeNextEventPopup:lastDismissedDate';
const HERO_GALLERY_IMAGES = ['/home-gallery/tamid-gallery-1.JPG'] as const;
const HERO_GALLERY_PLACEHOLDER = '/home-gallery/tamid-gallery-1-placeholder.jpg';
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
const HOME_PROOF_POINTS = [
  {
    label: 'Consulting & Investing',
    title: 'Hands-on work, real experience.',
    copy: 'Members consult for Israeli startups and run equity research through our Investment Fund, building practical skills on real engagements — not just in the classroom.',
  },
  {
    label: 'Career Building',
    title: 'Jumpstart your career.',
    copy: 'Explore career paths, build skills through our four programs, and unlock opportunities. Our members go on to leading firms across the business world.',
  },
  {
    label: 'Open to All',
    title: 'Apolitical, areligious, open to all.',
    copy: 'TAMID Group at NYU is a nonprofit student organization open to any undergraduate interested in professional development, regardless of background or identity.',
  },
] as const;

const HomeHero = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const speakersAnimation = useScrollAnimation({ threshold: 0.3 });

  const [currentImage, setCurrentImage] = useState(1);
  const [loadedGalleryImages, setLoadedGalleryImages] = useState<number[]>([1, 2]);
  const firstHeroImageSrc = HERO_GALLERY_IMAGES[0];
  const { currentSrc: progressiveHeroImageSrc, isFullLoaded: isHeroImageLoaded } =
    useProgressiveImage(HERO_GALLERY_PLACEHOLDER, firstHeroImageSrc);

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        setCurrentImage((prev) => (prev >= 4 ? 1 : prev + 1));
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
              ? (progressiveHeroImageSrc ?? HERO_GALLERY_PLACEHOLDER)
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
                    className={imageNumber === 1 && !isHeroImageLoaded ? 'is-placeholder' : ''}
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
            <h1 className="main-title">
              <span className="title-line-1">Bridging NYU</span>
              <span className="title-connector">and the</span>
              <span className="title-line-2">Israeli economy</span>
            </h1>
            <p className="hero-description">
              TAMID Group at NYU develops undergraduates’ professional skills through hands-on work
              with the Israeli economy across four programs: Education, Consulting, Investment Fund,
              and Israel Fellowship.
            </p>

            <div
              ref={speakersAnimation.elementRef}
              className={`link-section scale-in ${speakersAnimation.isVisible ? 'visible' : ''}`}
            >
              <LinkButtonPrimary variant="home" to="/events">
                Explore Speakers
              </LinkButtonPrimary>
              <LinkButtonSecondary variant="home" to="/our-mission" showArrow>
                The TAMID Mission
              </LinkButtonSecondary>
            </div>

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

const HomeNextEventPopup = () => {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [lastDismissedDate, setLastDismissedDate] = useState<string | null>(null);
  const [isDismissalStateReady, setIsDismissalStateReady] = useState(false);
  const now = useCurrentTime();

  const nextEventThumbnail = useMemo(() => {
    if (!nextEvent?.flyerFile) return undefined;
    return getEventThumbnailUrl(nextEvent.flyerFile, nextEvent.updatedAt);
  }, [nextEvent]);
  const currentDateKey = useMemo(() => getCurrentSiteDateKey(now), [now]);
  const nextEventDateLabel = useMemo(() => {
    if (!nextEvent) return '';
    return formatEventDateOnly(nextEvent.startTime);
  }, [nextEvent]);
  const nextEventTimeLabel = useMemo(() => {
    if (!nextEvent) return '';
    return formatEventTimeOnly(nextEvent.startTime, nextEvent.endTime);
  }, [nextEvent]);

  useEffect(() => {
    try {
      const persistedLastDismissedDate = localStorage.getItem(LAST_DISMISSED_DATE_STORAGE_KEY);
      setLastDismissedDate(persistedLastDismissedDate);
    } catch (error) {
      console.error('Unable to access popup dismissal state:', error);
    } finally {
      setIsDismissalStateReady(true);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchNextEvent = async () => {
      try {
        const events = await dataService.events.getUpcoming(1);
        if (!isCancelled) {
          startTransition(() => {
            setNextEvent(events[0] ?? null);
          });
        }
      } catch (error) {
        console.error('Failed to fetch events for home popup:', error);
      }
    };

    void fetchNextEvent();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePopupClose = () => {
    setLastDismissedDate(currentDateKey);
    try {
      localStorage.setItem(LAST_DISMISSED_DATE_STORAGE_KEY, currentDateKey);
    } catch (error) {
      console.error('Unable to persist popup dismissal state:', error);
    }
  };

  return (
    <FloatingPopup
      isOpen={Boolean(isDismissalStateReady && nextEvent && lastDismissedDate !== currentDateKey)}
      onClose={handlePopupClose}
      eyebrow="Upcoming Event"
      title={nextEvent?.title ?? ''}
      subtitle={nextEvent?.company ?? undefined}
      thumbnailSrc={nextEventThumbnail}
      thumbnailAlt={nextEvent ? `${nextEvent.title} flyer thumbnail` : 'Event flyer thumbnail'}
      ariaLabel="Next upcoming event"
    >
      {nextEvent && (
        <div className="home-next-event-popup-meta">
          <div className="home-next-event-popup-details">
            <p className="home-next-event-popup-row">
              <img src="/icons/calendar.svg" alt="" className="home-next-event-popup-icon" />
              <span className="home-next-event-popup-value">{nextEventDateLabel}</span>
            </p>
            <p className="home-next-event-popup-row">
              <img src="/icons/clock.svg" alt="" className="home-next-event-popup-icon" />
              <span className="home-next-event-popup-value">{nextEventTimeLabel}</span>
            </p>
            <p className="home-next-event-popup-row">
              <img src="/icons/location-pin.svg" alt="" className="home-next-event-popup-icon" />
              <span className="home-next-event-popup-value">
                {nextEvent.location ?? 'Location TBA'}
              </span>
            </p>
          </div>
          <Link
            to={`/events#event-${encodeURIComponent(nextEvent.id)}`}
            className="home-next-event-popup-cta home-next-event-popup-cta-inline"
            onClick={handlePopupClose}
          >
            <span>View Details</span>
            <img
              src="/icons/arrow-top-right.png"
              alt=""
              className="home-next-event-popup-cta-arrow"
            />
          </Link>
        </div>
      )}
    </FloatingPopup>
  );
};

export const Home = () => {
  return (
    <div className="page-container">
      <HomeHero />

      <section className="home-section proof-section" aria-label="TAMID professional value">
        {HOME_PROOF_POINTS.map((item) => (
          <article key={item.label} className="proof-item">
            <span className="proof-label">{item.label}</span>
            <h2 className="proof-title">{item.title}</h2>
            <p className="proof-copy">{item.copy}</p>
          </article>
        ))}
      </section>

      <section className="home-section split-content-container">
        <div className="content-section">
          <div className="text-container">
            <h2 className="section-title">Where innovation meets experience</h2>
            <div className="section-content">
              <p>
                Israel’s economy is home to one of the world’s most dynamic startup ecosystems, and
                TAMID Group at NYU gives students a direct line into it. Members consult for Israeli
                startups, research public companies, and learn how real businesses are built,
                funded, and scaled.
              </p>
              <p>
                Through our four programs — Education, Consulting, Investment Fund, and Israel
                Fellowship — we turn classroom concepts into hands-on experience. Members build
                practical skills, work alongside founders and companies, and prepare for careers in
                finance, consulting, technology, and beyond.
              </p>
            </div>
          </div>
        </div>

        <NewsletterSignup />
      </section>

      <HomeNextEventPopup />
      <Footer />
    </div>
  );
};
