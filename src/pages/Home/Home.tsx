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
const HERO_GALLERY_IMAGES = [
  '/home-gallery/sjba-gallery-1.JPG',
  '/home-gallery/sjba-gallery-2.JPG',
  '/home-gallery/sjba-gallery-3.JPG',
  '/home-gallery/sjba-gallery-4.JPG',
] as const;
const HERO_GALLERY_PLACEHOLDER = '/home-gallery/sjba-gallery-1-placeholder.jpg';
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
    label: 'Speaker Events',
    title: 'Leaders in finance, consulting, and technology.',
    copy: "SJBA's guest speakers span across finance, consulting, investing, and technology, giving members direct access to industry leaders.",
  },
  {
    label: 'Career Building',
    title: 'Jumpstart your career.',
    copy: 'Explore career paths, connect with mentors, build skills, and unlock opportunities. Our network spans top firms across the business world.',
  },
  {
    label: 'Professional Network',
    title: 'A Jewish community open to all.',
    copy: 'Our community is grounded in shared values and mutual support, and is open to all interested NYU students regardless of background or identity.',
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
              <span className="title-line-1">Jewish community</span>
              <span className="title-connector">for the next generation at</span>
              <span className="title-line-2">NYU Stern</span>
            </h1>
            <p className="hero-description">
              SJBA fosters a community of ambitious students, distinguished speakers, and a
              professional network built on shared values.
            </p>

            <div
              ref={speakersAnimation.elementRef}
              className={`link-section scale-in ${speakersAnimation.isVisible ? 'visible' : ''}`}
            >
              <LinkButtonPrimary variant="home" to="/events">
                Explore Speakers
              </LinkButtonPrimary>
              <LinkButtonSecondary variant="home" to="/our-mission" showArrow>
                The SJBA Mission
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

      <section className="home-section proof-section" aria-label="SJBA professional value">
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
            <h2 className="section-title">The Jewish impact on the business world</h2>
            <div className="section-content">
              <p>
                The Jewish community has played a pivotal role in shaping modern business and
                finance. From pioneering investment banking to revolutionary entrepreneurship,
                Jewish professionals have left an indelible mark on industries worldwide. At SJBA,
                we celebrate this rich heritage while building the next generation of Jewish
                business leaders.
              </p>
              <p>
                Our organization provides a platform for networking, mentorship, and professional
                development within NYU's vibrant Jewish community. Through exclusive events, speaker
                series, and industry connections, we help members understand their cultural legacy
                while preparing them for successful careers in finance, consulting, technology, and
                beyond.
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
