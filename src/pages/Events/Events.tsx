import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowIcon, ErrorDisplay, Footer, LoadingSpinner, SubpageHero } from '@components';
import { dataService } from '@api';
import { useCurrentTime, useScrollAnimation } from '@hooks';
import { SITE_NAME, SITE_URL } from '@seo';
import {
  compareEventStarts,
  formatEventDateOnly,
  formatEventTimeOnly,
  getEventFlyerUrl,
  getEventThumbnailUrl,
  isEventPast,
  semesterLabel,
  semesterSortKey,
} from '@utils';
import type { Event } from '@types';
import './Events.css';

const UPCOMING_EVENTS_LIMIT = 3;
const ARCHIVE_PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 260;
const DESKTOP_SEMESTER_WINDOW_SIZE = 3;
const MOBILE_SEMESTER_WINDOW_SIZE = 2;
const DESKTOP_SEMESTER_MEDIA_QUERY = '(min-width: 1200px)';
const DEFAULT_IMAGE_WIDTH = 960;
const DEFAULT_IMAGE_HEIGHT = 1280;

interface FlyerModalState {
  src: string;
  title: string;
}

interface EventFlyerProps {
  event: Event;
  imageErrors: Set<string>;
  onImageError: (eventId: string) => void;
  onOpen: (event: Event) => void;
  onPreload: (event: Event) => void;
  registerFlyerButton: (eventId: string, element: HTMLButtonElement | null) => void;
}

interface EventCardProps extends EventFlyerProps {
  active?: boolean;
  event: Event;
  expanded?: boolean;
  masked?: boolean;
  now: Date;
  railDirection?: 'down' | 'up';
  registerBodyRef?: (eventId: string, element: HTMLDivElement | null) => void;
  registerCopyRef?: (eventId: string, element: HTMLDivElement | null) => void;
  onToggleExpand?: (eventId: string) => void;
  registerCardRef?: (eventId: string, element: HTMLElement | null) => void;
  variant: 'upcoming' | 'archive';
}

interface ArchiveCacheEntry {
  pages: Map<number, Event[]>;
  totalPages: number;
  total: number;
}

const parsePositiveInteger = (value: string | null, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const mergeUniqueEvents = (eventPages: Event[][]): Event[] => {
  const seenIds = new Set<string>();
  const merged: Event[] = [];

  eventPages.flat().forEach((event) => {
    if (seenIds.has(event.id)) {
      return;
    }

    seenIds.add(event.id);
    merged.push(event);
  });

  return merged;
};

const normalizeEventDescription = (description: string | null): string => {
  if (!description) return '';
  return description.replace(/\\n/g, '\n').trim();
};

export const hasActionableRsvpLink = (rsvpLink: string | null): rsvpLink is string =>
  Boolean(rsvpLink?.trim() && rsvpLink.trim() !== '#');

const getEventJsonLd = (event: Event) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.title,
  startDate: event.startTime,
  ...(event.endTime ? { endDate: event.endTime } : {}),
  ...(event.description ? { description: normalizeEventDescription(event.description) } : {}),
  ...(event.flyerFile ? { image: getEventFlyerUrl(event.flyerFile, event.updatedAt) } : {}),
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  url: `${SITE_URL}/events#event-${encodeURIComponent(event.id)}`,
  location: {
    '@type': 'Place',
    name: event.location ?? 'NYU Stern School of Business',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '44 West 4th Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10012',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

const getArchiveCacheKey = (search: string, semester: string): string =>
  `${search.toLowerCase()}::${semester}`;

const getLoadedArchivePages = (entry: ArchiveCacheEntry): number => {
  let loadedPages = 0;

  for (let page = 1; page <= entry.totalPages; page += 1) {
    if (!entry.pages.has(page)) {
      break;
    }

    loadedPages += 1;
  }

  return loadedPages;
};

const getRootFontSize = (): number => {
  if (typeof window === 'undefined') {
    return 16;
  }

  const computed = window.getComputedStyle(document.documentElement).fontSize;
  const parsed = Number.parseFloat(computed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 16;
};

const getCollapsedArchiveBodyMaxHeight = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const rem = getRootFontSize();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const remCap = (isMobile ? 23 : 29) * rem;
  const viewportOffset = window.innerHeight - (isMobile ? 15 : 17) * rem;
  return Math.min(remCap, viewportOffset);
};

const getCollapsedUpcomingCopyMaxHeight = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const rem = getRootFontSize();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const remCap = (isMobile ? 20 : 24) * rem;
  const viewportOffset = window.innerHeight - (isMobile ? 18 : 22) * rem;
  return Math.min(remCap, viewportOffset);
};

const getHeaderOffset = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);
  const rawOffset = rootStyles.getPropertyValue('--header-offset').trim();
  if (!rawOffset) {
    return 0;
  }

  if (rawOffset.endsWith('rem')) {
    return Number.parseFloat(rawOffset) * getRootFontSize();
  }

  if (rawOffset.endsWith('px')) {
    return Number.parseFloat(rawOffset);
  }

  const parsed = Number.parseFloat(rawOffset);
  return Number.isFinite(parsed) ? parsed : 0;
};

const scrollEventCardIntoView = (targetElement: HTMLElement): void => {
  const headerOffset = getHeaderOffset();
  const viewportHeight = window.innerHeight;
  const elementHeight = targetElement.offsetHeight;
  const absoluteTop = targetElement.getBoundingClientRect().top + window.scrollY;
  const visibleHeight = Math.max(viewportHeight - headerOffset, 0);
  const minimumTopOffset = 16;
  const preferredTopOffset =
    headerOffset + Math.max((visibleHeight - elementHeight) / 2, minimumTopOffset);
  const top = Math.max(absoluteTop - preferredTopOffset, 0);

  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
  window.scrollTo({
    top,
    behavior: 'auto',
  });
};

const EventFlyer = ({
  event,
  imageErrors,
  onImageError,
  onOpen,
  onPreload,
  registerFlyerButton,
}: EventFlyerProps) => {
  const hasImage = Boolean(event.flyerFile) && !imageErrors.has(event.id);
  const thumbnailSrc = getEventThumbnailUrl(event.flyerFile, event.updatedAt);

  if (!hasImage) {
    return (
      <div className="event-card__flyer event-card__flyer--placeholder" aria-hidden="true">
        <div className="event-card__flyer-placeholder">
          <img
            src="/icons/profile-round.svg"
            alt=""
            aria-hidden="true"
            className="event-card__flyer-placeholder-icon"
          />
          <span>Flyer unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <button
      ref={(element) => registerFlyerButton(event.id, element)}
      type="button"
      className="event-card__flyer event-card__flyer-button"
      onClick={() => onOpen(event)}
      onMouseEnter={() => onPreload(event)}
      onFocus={() => onPreload(event)}
      aria-label={`View ${event.title} flyer`}
      data-full-src={getEventFlyerUrl(event.flyerFile, event.updatedAt)}
      data-event-id={event.id}
    >
      <img
        src={thumbnailSrc}
        alt={`${event.title} flyer`}
        className="event-card__flyer-image"
        width={DEFAULT_IMAGE_WIDTH}
        height={DEFAULT_IMAGE_HEIGHT}
        loading="lazy"
        decoding="async"
        onError={() => onImageError(event.id)}
      />
      <span className="event-card__flyer-chip">View Flyer</span>
    </button>
  );
};

const EventCard = ({
  active = false,
  event,
  expanded = false,
  imageErrors,
  masked = false,
  now,
  onImageError,
  onOpen,
  onPreload,
  railDirection = 'down',
  registerBodyRef,
  registerCopyRef,
  onToggleExpand,
  registerCardRef,
  registerFlyerButton,
  variant,
}: EventCardProps) => {
  const description = normalizeEventDescription(event.description);
  const isPastEvent = isEventPast(event, now);
  const isExpandableCard = Boolean(onToggleExpand);

  const handleToggleExpand = useCallback(
    (target: EventTarget | null) => {
      if (!isExpandableCard || !onToggleExpand) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest('a, button, input, textarea, select, label, summary')
      ) {
        return;
      }

      onToggleExpand(event.id);
    },
    [event.id, isExpandableCard, onToggleExpand]
  );

  return (
    <article
      id={`event-${event.id}`}
      ref={(element) => registerCardRef?.(event.id, element)}
      className={`event-card event-card--${variant} ${active ? 'is-active-rail' : ''} ${
        railDirection === 'up' ? 'rail-from-bottom' : 'rail-from-top'
      } ${expanded ? 'is-expanded' : ''} ${masked ? 'has-overflow-mask' : ''} ${
        isExpandableCard ? 'event-card--interactive' : ''
      }`}
      aria-expanded={isExpandableCard ? expanded : undefined}
      onClick={(clickEvent) => handleToggleExpand(clickEvent.target)}
      onKeyDown={(keyboardEvent) => {
        if (!isExpandableCard || (keyboardEvent.key !== 'Enter' && keyboardEvent.key !== ' ')) {
          return;
        }

        keyboardEvent.preventDefault();
        handleToggleExpand(keyboardEvent.target);
      }}
      tabIndex={isExpandableCard ? 0 : undefined}
    >
      <EventFlyer
        event={event}
        imageErrors={imageErrors}
        onImageError={onImageError}
        onOpen={onOpen}
        onPreload={onPreload}
        registerFlyerButton={registerFlyerButton}
      />

      <div ref={(element) => registerBodyRef?.(event.id, element)} className="event-card__body">
        <div ref={(element) => registerCopyRef?.(event.id, element)} className="event-card__copy">
          <div className="event-card__header">
            <h3 className="event-card__title">{event.title}</h3>
            <div className="event-card__meta">
              <span className="event-card__semester">{semesterLabel(event.semester)}</span>
              {event.company ? <span className="event-card__company">{event.company}</span> : null}
            </div>
          </div>

          <dl className="event-card__details">
            <div className="event-card__detail">
              <dt>
                <img src="/icons/calendar.svg" alt="" className="event-card__detail-icon" />
                <span>Date</span>
              </dt>
              <dd>{formatEventDateOnly(event.startTime)}</dd>
            </div>
            <div className="event-card__detail">
              <dt>
                <img src="/icons/clock.svg" alt="" className="event-card__detail-icon" />
                <span>Time</span>
              </dt>
              <dd>{formatEventTimeOnly(event.startTime, event.endTime)}</dd>
            </div>
            {event.location ? (
              <div className="event-card__detail">
                <dt>
                  <img src="/icons/location-pin.svg" alt="" className="event-card__detail-icon" />
                  <span>Location</span>
                </dt>
                <dd>{event.location}</dd>
              </div>
            ) : null}
          </dl>

          {description ? <p className="event-card__description">{description}</p> : null}
        </div>

        <div className="event-card__actions">
          {hasActionableRsvpLink(event.rsvpLink) && !isPastEvent ? (
            <a
              href={event.rsvpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-card__cta"
            >
              <span>RSVP</span>
              <img
                src="/icons/arrow-top-right.png"
                alt=""
                aria-hidden="true"
                className="event-card__cta-arrow"
              />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const Events = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.18 });
  const upcomingAnimation = useScrollAnimation({
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
  });
  const archiveAnimation = useScrollAnimation({
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px',
  });

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const now = useCurrentTime();
  const archiveCutoffRef = useRef(new Date().toISOString());
  const archiveCacheRef = useRef(new Map<string, ArchiveCacheEntry>());
  const archiveRequestTokenRef = useRef(0);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const flyerButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const archiveBodyRefs = useRef(new Map<string, HTMLDivElement>());
  const upcomingCopyRefs = useRef(new Map<string, HTMLDivElement>());
  const eventCardRefs = useRef(new Map<string, HTMLElement>());
  const lastScrollYRef = useRef(0);
  const lastScrolledHashRef = useRef<string | null>(null);
  const lastAutoExpandedHashRef = useRef<string | null>(null);

  const [searchInput, setSearchInput] = useState(() => searchParams.get('search') ?? '');
  const deferredSearchInput = useDeferredValue(searchInput);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [archiveEvents, setArchiveEvents] = useState<Event[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);

  const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);
  const [isArchiveLoading, setIsArchiveLoading] = useState(true);

  const [upcomingError, setUpcomingError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveLoadMoreError, setArchiveLoadMoreError] = useState<string | null>(null);
  const [activeRailEventId, setActiveRailEventId] = useState<string | null>(null);
  const [activeRailDirection, setActiveRailDirection] = useState<'down' | 'up'>('down');
  const [maskedArchiveEventIds, setMaskedArchiveEventIds] = useState<Set<string>>(new Set());
  const [maskedUpcomingEventIds, setMaskedUpcomingEventIds] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [modalFlyer, setModalFlyer] = useState<FlyerModalState | null>(null);
  const [upcomingRetryNonce, setUpcomingRetryNonce] = useState(0);
  const [archiveRetryNonce, setArchiveRetryNonce] = useState(0);
  const [archiveLoadedPages, setArchiveLoadedPages] = useState(0);
  const [semesterWindowStart, setSemesterWindowStart] = useState(0);
  const [semesterWindowSize, setSemesterWindowSize] = useState(() => {
    if (typeof window === 'undefined') {
      return DESKTOP_SEMESTER_WINDOW_SIZE;
    }

    return window.matchMedia(DESKTOP_SEMESTER_MEDIA_QUERY).matches
      ? DESKTOP_SEMESTER_WINDOW_SIZE
      : MOBILE_SEMESTER_WINDOW_SIZE;
  });
  const [expandedUpcomingEventId, setExpandedUpcomingEventId] = useState<string | null>(null);
  const [expandedArchiveEventId, setExpandedArchiveEventId] = useState<string | null>(null);
  const [archivePagination, setArchivePagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const activeSearch = searchParams.get('search')?.trim() ?? '';
  const activeSemester = searchParams.get('semester')?.trim() ?? '';
  const loadedArchivePages = parsePositiveInteger(searchParams.get('page'), 1);
  const maxSemesterWindowStart = Math.max(availableSemesters.length - semesterWindowSize, 0);
  const hasActiveArchiveFilters = activeSearch.length > 0 || activeSemester.length > 0;
  const currentArchiveKey = useMemo(
    () => getArchiveCacheKey(activeSearch, activeSemester),
    [activeSearch, activeSemester]
  );
  const visibleSemesters = useMemo(
    () => availableSemesters.slice(semesterWindowStart, semesterWindowStart + semesterWindowSize),
    [availableSemesters, semesterWindowSize, semesterWindowStart]
  );
  const canGoToPreviousSemesterWindow = semesterWindowStart > 0;
  const canGoToNextSemesterWindow = semesterWindowStart < maxSemesterWindowStart;

  const updateSearchParams = useCallback(
    (
      updates: Record<string, string | null>,
      options: { replace?: boolean; preventScrollReset?: boolean } = {}
    ) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, value);
      });

      setSearchParams(nextParams, {
        replace: options.replace ?? false,
        preventScrollReset: options.preventScrollReset ?? false,
      });
    },
    [searchParams, setSearchParams]
  );

  const preloadFullImage = useCallback(
    (event: Event) => {
      const fullSrc = getEventFlyerUrl(event.flyerFile, event.updatedAt);
      if (!fullSrc || imageErrors.has(event.id) || preloadedImagesRef.current.has(fullSrc)) {
        return;
      }

      const image = new Image();
      image.decoding = 'async';

      const finalize = () => {
        preloadedImagesRef.current.add(fullSrc);
      };

      image.onload = () => {
        if (typeof image.decode === 'function') {
          void image.decode().then(finalize).catch(finalize);
          return;
        }

        finalize();
      };

      image.onerror = () => {
        setImageErrors((previous) => new Set(previous).add(event.id));
      };

      image.src = fullSrc;
    },
    [imageErrors]
  );

  const handleImageError = useCallback((eventId: string) => {
    setImageErrors((previous) => new Set(previous).add(eventId));
  }, []);

  const handleOpenFlyer = useCallback(
    (event: Event) => {
      const fullSrc = getEventFlyerUrl(event.flyerFile, event.updatedAt);
      if (!fullSrc) {
        return;
      }

      preloadFullImage(event);
      setModalFlyer({
        src: fullSrc,
        title: event.title,
      });
    },
    [preloadFullImage]
  );

  const handleArchiveRetry = useCallback(() => {
    archiveCacheRef.current.delete(currentArchiveKey);
    setArchiveRetryNonce((previous) => previous + 1);
  }, [currentArchiveKey]);

  const handleArchiveLoadMoreRetry = useCallback(() => {
    setArchiveRetryNonce((previous) => previous + 1);
  }, []);

  const handleUpcomingRetry = useCallback(() => {
    setUpcomingRetryNonce((previous) => previous + 1);
  }, []);

  const registerFlyerButton = useCallback((eventId: string, element: HTMLButtonElement | null) => {
    if (element) {
      flyerButtonRefs.current.set(eventId, element);
      return;
    }

    flyerButtonRefs.current.delete(eventId);
  }, []);

  const registerEventCardRef = useCallback((eventId: string, element: HTMLElement | null) => {
    if (element) {
      eventCardRefs.current.set(eventId, element);
      return;
    }

    eventCardRefs.current.delete(eventId);
  }, []);

  const registerArchiveBodyRef = useCallback((eventId: string, element: HTMLDivElement | null) => {
    if (element) {
      archiveBodyRefs.current.set(eventId, element);
      return;
    }

    archiveBodyRefs.current.delete(eventId);
  }, []);

  const registerUpcomingCopyRef = useCallback((eventId: string, element: HTMLDivElement | null) => {
    if (element) {
      upcomingCopyRefs.current.set(eventId, element);
      return;
    }

    upcomingCopyRefs.current.delete(eventId);
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = deferredSearchInput.trim();
      if (normalizedSearch === activeSearch) {
        return;
      }

      startTransition(() => {
        updateSearchParams(
          {
            search: normalizedSearch || null,
            page: '1',
          },
          { replace: true }
        );
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeSearch, deferredSearchInput, updateSearchParams]);

  useEffect(() => {
    let isCancelled = false;

    const fetchUpcomingEvents = async () => {
      try {
        setIsUpcomingLoading(true);
        setUpcomingError(null);
        const events = await dataService.events.getUpcoming(UPCOMING_EVENTS_LIMIT);

        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setUpcomingEvents(events.sort(compareEventStarts));
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        let message = 'Failed to load upcoming events.';
        if (error instanceof Error) {
          message = error.message;
        }

        setUpcomingError(message);
      } finally {
        if (!isCancelled) {
          setIsUpcomingLoading(false);
        }
      }
    };

    void fetchUpcomingEvents();

    return () => {
      isCancelled = true;
    };
  }, [upcomingRetryNonce]);

  useEffect(() => {
    const scriptId = 'events-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (upcomingEvents.length === 0) {
      script?.remove();
      return;
    }

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: upcomingEvents.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: getEventJsonLd(event),
      })),
    });

    return () => {
      script?.remove();
    };
  }, [upcomingEvents]);

  useEffect(() => {
    let isCancelled = false;

    const fetchSemesterIndex = async () => {
      try {
        const semesters = await dataService.semesters.getAll();

        if (isCancelled) {
          return;
        }

        const nextSemesters = Array.from(
          new Set(semesters.map((semester) => semester.semesterName).filter(Boolean))
        ).sort((left, right) => semesterSortKey(right) - semesterSortKey(left));

        startTransition(() => {
          setAvailableSemesters(nextSemesters);
        });
      } catch (error) {
        console.error('Failed to build semester filter index:', error);
      }
    };

    void fetchSemesterIndex();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSemester || availableSemesters.length === 0) {
      return;
    }

    if (availableSemesters.includes(activeSemester)) {
      return;
    }

    updateSearchParams(
      {
        semester: null,
        page: '1',
      },
      {
        replace: true,
        preventScrollReset: true,
      }
    );
  }, [activeSemester, availableSemesters, updateSearchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_SEMESTER_MEDIA_QUERY);
    const updateSemesterWindowSize = () => {
      setSemesterWindowSize(
        mediaQuery.matches ? DESKTOP_SEMESTER_WINDOW_SIZE : MOBILE_SEMESTER_WINDOW_SIZE
      );
    };

    updateSemesterWindowSize();
    mediaQuery.addEventListener('change', updateSemesterWindowSize);

    return () => mediaQuery.removeEventListener('change', updateSemesterWindowSize);
  }, []);

  useEffect(() => {
    if (availableSemesters.length === 0) {
      setSemesterWindowStart(0);
      return;
    }

    const activeSemesterIndex = activeSemester ? availableSemesters.indexOf(activeSemester) : -1;

    if (activeSemesterIndex === -1) {
      setSemesterWindowStart((current) => Math.min(current, maxSemesterWindowStart));
      return;
    }

    if (
      activeSemesterIndex >= semesterWindowStart &&
      activeSemesterIndex < semesterWindowStart + semesterWindowSize
    ) {
      return;
    }

    const centeredStart = Math.min(
      Math.max(activeSemesterIndex - 1, 0),
      Math.max(availableSemesters.length - semesterWindowSize, 0)
    );

    setSemesterWindowStart(centeredStart);
  }, [
    activeSemester,
    availableSemesters,
    maxSemesterWindowStart,
    semesterWindowSize,
    semesterWindowStart,
  ]);

  useEffect(() => {
    let isCancelled = false;
    const requestToken = ++archiveRequestTokenRef.current;

    const applyArchiveEntry = (entry: ArchiveCacheEntry, requestedUiPages = loadedArchivePages) => {
      if (isCancelled || requestToken !== archiveRequestTokenRef.current) {
        return;
      }

      const nextPage = Math.min(requestedUiPages, Math.max(entry.totalPages, 1));
      const mergedVisibleEvents = mergeUniqueEvents(
        Array.from({ length: nextPage }, (_, index) => entry.pages.get(index + 1) ?? [])
      );
      const loadedPages = getLoadedArchivePages(entry);

      startTransition(() => {
        setArchiveEvents(mergedVisibleEvents);
        setArchiveLoadedPages(loadedPages);
        setArchivePagination({
          page: nextPage,
          totalPages: entry.totalPages,
          total: entry.total,
        });
      });
    };

    const fetchArchiveEvents = async () => {
      try {
        setArchiveError(null);
        setArchiveLoadMoreError(null);
        const cachedEntry = archiveCacheRef.current.get(currentArchiveKey);

        if (cachedEntry && getLoadedArchivePages(cachedEntry) >= loadedArchivePages) {
          applyArchiveEntry(cachedEntry);
          setIsArchiveLoading(false);
          return;
        }

        if (!cachedEntry) {
          startTransition(() => {
            setArchiveEvents([]);
            setArchiveLoadedPages(0);
            setArchivePagination({
              page: 1,
              totalPages: 1,
              total: 0,
            });
          });
        }

        setIsArchiveLoading(true);

        const archiveQuery = {
          limit: ARCHIVE_PAGE_SIZE,
          search: activeSearch || undefined,
          semester: activeSemester || undefined,
          endDate: archiveCutoffRef.current,
          sort: 'startTime:desc' as const,
        };

        let nextEntry: ArchiveCacheEntry =
          cachedEntry ??
          ({
            pages: new Map<number, Event[]>(),
            totalPages: 1,
            total: 0,
          } satisfies ArchiveCacheEntry);

        const targetPage = Math.max(1, loadedArchivePages);
        while (getLoadedArchivePages(nextEntry) < targetPage) {
          const nextPageNumber = getLoadedArchivePages(nextEntry) + 1;
          const response = await dataService.events.getAll({
            page: nextPageNumber,
            ...archiveQuery,
          });

          if (isCancelled || requestToken !== archiveRequestTokenRef.current) {
            return;
          }

          nextEntry = {
            pages: new Map(nextEntry.pages).set(response.pagination.page, response.events),
            totalPages: response.pagination.totalPages || 1,
            total: response.pagination.total,
          };

          archiveCacheRef.current.set(currentArchiveKey, nextEntry);

          if (response.pagination.page >= nextEntry.totalPages) {
            break;
          }
        }

        applyArchiveEntry(nextEntry);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        let message = 'Failed to load the event archive.';
        if (error instanceof Error) {
          message = error.message;
        }

        const cachedEntry = archiveCacheRef.current.get(currentArchiveKey);
        const loadedPages = cachedEntry ? getLoadedArchivePages(cachedEntry) : 0;
        if (cachedEntry && loadedPages > 0 && loadedArchivePages > loadedPages) {
          setArchiveLoadMoreError(message);
          applyArchiveEntry(cachedEntry, loadedPages);
        } else {
          setArchiveError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsArchiveLoading(false);
        }
      }
    };

    void fetchArchiveEvents();

    return () => {
      isCancelled = true;
    };
  }, [activeSearch, activeSemester, archiveRetryNonce, currentArchiveKey, loadedArchivePages]);

  const isArchiveLoadingMore = isArchiveLoading && loadedArchivePages > archiveLoadedPages;

  const handleToggleArchiveEventExpand = useCallback((eventId: string) => {
    setExpandedArchiveEventId((current) => (current === eventId ? null : eventId));
  }, []);

  const handleToggleUpcomingEventExpand = useCallback((eventId: string) => {
    setExpandedUpcomingEventId((current) => (current === eventId ? null : eventId));
  }, []);

  useEffect(() => {
    if (isArchiveLoading) {
      return;
    }

    if (loadedArchivePages <= archivePagination.totalPages) {
      return;
    }

    updateSearchParams(
      {
        page: String(archivePagination.page),
      },
      {
        replace: true,
        preventScrollReset: true,
      }
    );
  }, [
    archivePagination.page,
    archivePagination.totalPages,
    isArchiveLoading,
    loadedArchivePages,
    updateSearchParams,
  ]);

  useEffect(() => {
    if (!modalFlyer) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalFlyer(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalFlyer]);

  const displayedEvents = useMemo(
    () => [...upcomingEvents, ...archiveEvents].filter((event) => event.flyerFile),
    [archiveEvents, upcomingEvents]
  );
  const renderedEventIds = useMemo(
    () => [...upcomingEvents, ...archiveEvents].map((event) => event.id),
    [archiveEvents, upcomingEvents]
  );

  useEffect(() => {
    if (displayedEvents.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const eventId = entry.target.getAttribute('data-event-id');
          const event = displayedEvents.find((candidate) => candidate.id === eventId);
          if (!event) {
            return;
          }

          preloadFullImage(event);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.15,
      }
    );

    displayedEvents.forEach((event) => {
      const element = flyerButtonRefs.current.get(event.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [displayedEvents, preloadFullImage]);

  useEffect(() => {
    if (archiveEvents.length === 0) {
      setMaskedArchiveEventIds(new Set());
      return;
    }

    const updateMaskedCards = () => {
      const collapsedMaxHeight = getCollapsedArchiveBodyMaxHeight();
      const nextMaskedIds = new Set<string>();

      archiveEvents.forEach((event) => {
        const element = archiveBodyRefs.current.get(event.id);
        if (!element) {
          return;
        }

        if (element.scrollHeight > collapsedMaxHeight + 1) {
          nextMaskedIds.add(event.id);
        }
      });

      setMaskedArchiveEventIds(nextMaskedIds);
    };

    const handleResize = () => {
      window.requestAnimationFrame(updateMaskedCards);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [archiveEvents, expandedArchiveEventId]);

  useEffect(() => {
    if (upcomingEvents.length === 0) {
      setMaskedUpcomingEventIds(new Set());
      return;
    }

    const updateMaskedCards = () => {
      const collapsedMaxHeight = getCollapsedUpcomingCopyMaxHeight();
      const nextMaskedIds = new Set<string>();

      upcomingEvents.forEach((event) => {
        const element = upcomingCopyRefs.current.get(event.id);
        if (!element) {
          return;
        }

        if (element.scrollHeight > collapsedMaxHeight + 1) {
          nextMaskedIds.add(event.id);
        }
      });

      setMaskedUpcomingEventIds(nextMaskedIds);
    };

    const handleResize = () => {
      window.requestAnimationFrame(updateMaskedCards);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [expandedUpcomingEventId, upcomingEvents]);

  useEffect(() => {
    if (renderedEventIds.length === 0) {
      setActiveRailEventId(null);
      return;
    }

    const updateActiveRail = () => {
      const viewportHeight = window.innerHeight;
      const targetY = Math.min(Math.max(viewportHeight * 0.34, 140), viewportHeight - 140);

      let nextActiveId: string | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      renderedEventIds.forEach((eventId) => {
        const element = eventCardRefs.current.get(eventId);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= viewportHeight) {
          return;
        }

        const nearestPoint = Math.min(Math.max(targetY, rect.top), rect.bottom);
        const distance = Math.abs(nearestPoint - targetY);
        if (distance < bestDistance) {
          bestDistance = distance;
          nextActiveId = eventId;
        }
      });

      if (!nextActiveId) {
        renderedEventIds.forEach((eventId) => {
          const element = eventCardRefs.current.get(eventId);
          if (!element) {
            return;
          }

          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - targetY);
          if (distance < bestDistance) {
            bestDistance = distance;
            nextActiveId = eventId;
          }
        });
      }

      setActiveRailEventId((current) => (current === nextActiveId ? current : nextActiveId));
    };

    const handleViewportChange = () => {
      const nextScrollY = window.scrollY;
      if (nextScrollY !== lastScrollYRef.current) {
        setActiveRailDirection(nextScrollY > lastScrollYRef.current ? 'down' : 'up');
        lastScrollYRef.current = nextScrollY;
      }

      window.requestAnimationFrame(updateActiveRail);
    };

    lastScrollYRef.current = window.scrollY;
    handleViewportChange();
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [renderedEventIds]);

  useLayoutEffect(() => {
    if (!location.hash.startsWith('#event-')) {
      lastScrolledHashRef.current = null;
      lastAutoExpandedHashRef.current = null;
      return;
    }

    const targetEventId = decodeURIComponent(location.hash.slice('#event-'.length));
    const isUpcomingTarget = upcomingEvents.some((event) => event.id === targetEventId);
    const needsUpcomingExpansion =
      isUpcomingTarget &&
      expandedUpcomingEventId !== targetEventId &&
      lastAutoExpandedHashRef.current !== location.hash;

    if (needsUpcomingExpansion) {
      lastAutoExpandedHashRef.current = location.hash;
      lastScrolledHashRef.current = null;
      setExpandedUpcomingEventId(targetEventId);
      return;
    }

    const targetElement = eventCardRefs.current.get(targetEventId);
    if (!targetElement || lastScrolledHashRef.current === location.hash) {
      return;
    }

    lastScrolledHashRef.current = location.hash;

    const timeoutIds: number[] = [];
    let nestedAnimationFrameId = 0;

    scrollEventCardIntoView(targetElement);

    const animationFrameId = window.requestAnimationFrame(() => {
      nestedAnimationFrameId = window.requestAnimationFrame(() => {
        scrollEventCardIntoView(targetElement);
      });
    });

    timeoutIds.push(
      window.setTimeout(() => {
        scrollEventCardIntoView(targetElement);
      }, 80)
    );

    timeoutIds.push(
      window.setTimeout(() => {
        scrollEventCardIntoView(targetElement);
      }, 220)
    );

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      if (nestedAnimationFrameId) {
        window.cancelAnimationFrame(nestedAnimationFrameId);
      }
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [expandedUpcomingEventId, location.hash, renderedEventIds, upcomingEvents]);

  return (
    <>
      <div className="page-container events-page">
        <SubpageHero
          ref={heroAnimation.elementRef}
          visible={heroAnimation.isVisible}
          className="events-hero"
          backgroundImageSrc="/events-gallery/events-gallery-1.jpeg"
          backgroundImageAlt="SJBA members at an event"
          imagePosition="center 72%"
          title="Events"
          lead="Explore upcoming speaker sessions, archive highlights, and the programming that shapes SJBA each semester."
        />

        <section className="events-shell">
          <section
            ref={upcomingAnimation.elementRef}
            className={`events-upcoming ${upcomingAnimation.isVisible ? 'visible' : ''}`}
            aria-labelledby="events-upcoming-title"
          >
            <div className="events-section-heading events-section-heading--archive">
              <div>
                <span className="events-section__eyebrow">Upcoming Events</span>
                {/* <h2 id="events-upcoming-title">Upcoming</h2> */}
              </div>
            </div>

            {isUpcomingLoading ? (
              <div className="events-status">
                <LoadingSpinner />
              </div>
            ) : upcomingError ? (
              <div className="events-status">
                <ErrorDisplay error={upcomingError} onRetry={handleUpcomingRetry} />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="events-empty-state">
                <p>No upcoming events are scheduled yet.</p>
              </div>
            ) : (
              <div className="events-archive__list">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    active={activeRailEventId === event.id}
                    expanded={expandedUpcomingEventId === event.id}
                    event={event}
                    imageErrors={imageErrors}
                    masked={maskedUpcomingEventIds.has(event.id)}
                    now={now}
                    onImageError={handleImageError}
                    onOpen={handleOpenFlyer}
                    onPreload={preloadFullImage}
                    onToggleExpand={
                      maskedUpcomingEventIds.has(event.id)
                        ? handleToggleUpcomingEventExpand
                        : undefined
                    }
                    railDirection={activeRailDirection}
                    registerBodyRef={registerArchiveBodyRef}
                    registerCardRef={registerEventCardRef}
                    registerCopyRef={registerUpcomingCopyRef}
                    registerFlyerButton={registerFlyerButton}
                    variant="upcoming"
                  />
                ))}
              </div>
            )}
          </section>

          <section
            id="events-archive"
            ref={archiveAnimation.elementRef}
            className={`events-archive-shell ${archiveAnimation.isVisible ? 'visible' : ''}`}
            aria-labelledby="events-archive-title"
          >
            <div className="events-overview" aria-label="Events page controls">
              <div className="events-overview__panel">
                <div className="events-overview__eyebrow">
                  <span className="events-section__eyebrow">Previous Events</span>
                </div>

                <form
                  className="events-search"
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <label htmlFor="events-search-input" className="events-visually-hidden">
                    Search events
                  </label>
                  <div className="events-search__field">
                    <input
                      id="events-search-input"
                      name="search"
                      type="search"
                      inputMode="search"
                      autoComplete="off"
                      value={searchInput}
                      onChange={(event) => {
                        const { value } = event.target;
                        startTransition(() => {
                          setSearchInput(value);
                        });
                      }}
                      placeholder="Search previous events"
                      className="events-search__input"
                    />
                    {searchInput ? (
                      <button
                        type="button"
                        className="events-search__clear"
                        onClick={() => {
                          startTransition(() => {
                            setSearchInput('');
                          });
                        }}
                        aria-label="Clear search"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className="events-semesters">
                  <div className="events-semesters__header">
                    <div className="events-semesters__nav" aria-label="Semester navigation">
                      <button
                        type="button"
                        className={`events-semesters__reset events-semesters__link ${
                          activeSemester ? '' : 'is-active'
                        }`}
                        onClick={() =>
                          updateSearchParams({
                            semester: null,
                            page: '1',
                          })
                        }
                      >
                        All Semesters
                      </button>

                      <button
                        type="button"
                        className="events-semesters__arrow events-semesters__link"
                        onClick={() =>
                          setSemesterWindowStart((current) => Math.max(current - 1, 0))
                        }
                        aria-label="Previous semesters"
                        disabled={!canGoToPreviousSemesterWindow}
                      >
                        <ArrowIcon className="events-semesters__arrow-icon" direction="left" />
                      </button>

                      <div
                        className="events-semesters__window"
                        role="list"
                        aria-label="Semester filters"
                      >
                        {visibleSemesters.map((semester) => (
                          <button
                            key={semester}
                            type="button"
                            className={`events-semesters__chip events-semesters__link ${
                              activeSemester === semester ? 'is-active' : ''
                            }`}
                            onClick={() =>
                              updateSearchParams({
                                semester: semester,
                                page: '1',
                              })
                            }
                          >
                            {semesterLabel(semester)}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="events-semesters__arrow events-semesters__link"
                        onClick={() =>
                          setSemesterWindowStart((current) =>
                            Math.min(current + 1, maxSemesterWindowStart)
                          )
                        }
                        aria-label="Next semesters"
                        disabled={!canGoToNextSemesterWindow}
                      >
                        <ArrowIcon className="events-semesters__arrow-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`events-archive ${archiveAnimation.isVisible ? 'visible' : ''}`}>
              {isArchiveLoading && archiveEvents.length === 0 ? (
                <div className="events-status">
                  <LoadingSpinner />
                </div>
              ) : archiveError ? (
                <div className="events-status">
                  <ErrorDisplay error={archiveError} onRetry={handleArchiveRetry} />
                </div>
              ) : archiveEvents.length === 0 ? (
                <div className="events-empty-state">
                  <p>
                    {hasActiveArchiveFilters
                      ? 'No events matched the current search and semester filters.'
                      : 'No archived events are available yet.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="events-archive__list">
                    {archiveEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        active={activeRailEventId === event.id}
                        event={event}
                        imageErrors={imageErrors}
                        masked={maskedArchiveEventIds.has(event.id)}
                        now={now}
                        onImageError={handleImageError}
                        onOpen={handleOpenFlyer}
                        onPreload={preloadFullImage}
                        railDirection={activeRailDirection}
                        expanded={expandedArchiveEventId === event.id}
                        registerBodyRef={registerArchiveBodyRef}
                        onToggleExpand={handleToggleArchiveEventExpand}
                        registerCardRef={registerEventCardRef}
                        registerFlyerButton={registerFlyerButton}
                        variant="archive"
                      />
                    ))}
                  </div>

                  {archivePagination.page < archivePagination.totalPages ? (
                    <div className="events-archive__load-more">
                      {archiveLoadMoreError ? (
                        <div className="events-archive__load-error" role="alert" aria-live="polite">
                          <p>{archiveLoadMoreError}</p>
                          <button
                            type="button"
                            className="events-load-more"
                            onClick={handleArchiveLoadMoreRetry}
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        <>
                          {isArchiveLoadingMore ? (
                            <LoadingSpinner />
                          ) : (
                            <button
                              type="button"
                              className="events-load-more"
                              onClick={() =>
                                updateSearchParams(
                                  {
                                    page: String(archivePagination.page + 1),
                                  },
                                  {
                                    preventScrollReset: true,
                                  }
                                )
                              }
                            >
                              <span className="events-load-more__label">Load More Events</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </section>
        </section>
      </div>

      <Footer />

      {modalFlyer ? (
        <div className="events-flyer-modal" role="presentation" onClick={() => setModalFlyer(null)}>
          <div
            className="events-flyer-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${modalFlyer.title} flyer`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="events-flyer-modal__close"
              onClick={() => setModalFlyer(null)}
              aria-label="Close flyer viewer"
            >
              <span className="events-flyer-modal__close-icon" aria-hidden="true"></span>
            </button>

            <img
              src={modalFlyer.src}
              alt={`${modalFlyer.title} flyer`}
              className="events-flyer-modal__image"
              width={DEFAULT_IMAGE_WIDTH}
              height={DEFAULT_IMAGE_HEIGHT}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
