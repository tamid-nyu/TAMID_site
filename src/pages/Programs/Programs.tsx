import { useEffect, useRef, useState } from 'react';
import {
  Footer,
  InlineLink,
  LinkButtonPrimary,
  LinkButtonSecondary,
  NumberedList,
  SubpageHero,
  ZigzagView,
} from '@components';
import { dataService } from '@api';
import {
  MENTORSHIP_APPLICATION_CONFIG_DEFAULTS,
  MENTORSHIP_APPLICATION_CONFIG_STORAGE_KEY,
} from '@constants';
import { useScrollAnimation } from '@hooks';
import type { BoardMember } from '@types';
import './Programs.css';

type ApplicationConfig = {
  applicationUrl: string;
  isApplicationOpen: boolean;
};

type PersistedApplicationConfig = ApplicationConfig & {
  fetchedAt: number;
};

let cachedApplicationConfig: ApplicationConfig | null = null;
let applicationConfigPromise: Promise<ApplicationConfig> | null = null;

const readPersistedApplicationConfig = (): PersistedApplicationConfig | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(MENTORSHIP_APPLICATION_CONFIG_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PersistedApplicationConfig>;
    if (
      typeof parsedValue.fetchedAt !== 'number' ||
      typeof parsedValue.isApplicationOpen !== 'boolean' ||
      typeof parsedValue.applicationUrl !== 'string'
    ) {
      window.localStorage.removeItem(MENTORSHIP_APPLICATION_CONFIG_STORAGE_KEY);
      return null;
    }

    return {
      fetchedAt: parsedValue.fetchedAt,
      isApplicationOpen: parsedValue.isApplicationOpen,
      applicationUrl: parsedValue.applicationUrl,
    };
  } catch (error) {
    console.error('Failed to read programs application config cache:', error);
    return null;
  }
};

const writePersistedApplicationConfig = (config: PersistedApplicationConfig) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(MENTORSHIP_APPLICATION_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to write programs application config cache:', error);
  }
};

const getCachedApplicationConfig = () => {
  if (cachedApplicationConfig !== null) {
    return cachedApplicationConfig;
  }

  const persistedConfig = readPersistedApplicationConfig();
  if (persistedConfig) {
    cachedApplicationConfig = {
      isApplicationOpen: persistedConfig.isApplicationOpen,
      applicationUrl: persistedConfig.applicationUrl,
    };
    return cachedApplicationConfig;
  }

  return null;
};

const TRACK_PILLARS = [
  {
    eyebrow: 'Investment Fund',
    title: 'Investment Fund',
    description: 'Equity research and a national simulated-fund competition.',
    image: '/mentorship-gallery/mentorship-gallery-1.jpeg',
    alt: 'TAMID Group at NYU Investment Fund track',
  },
  {
    eyebrow: 'Consulting',
    title: 'Consulting',
    description: 'Pro-bono consulting for Israeli startups.',
    image: '/mentorship-gallery/mentorship-gallery-2.jpeg',
    alt: 'TAMID Group at NYU Consulting track',
  },
  {
    eyebrow: 'Quant',
    title: 'Quant',
    description:
      'Applied AI and agentic workflows: building LLM-powered tools that research markets and automate analytical work.',
    image: '/mentorship-gallery/mentorship-gallery-3.jpeg',
    alt: 'TAMID Group at NYU Quant track',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Apply',
    description:
      "Fill out the application form where you'll select which track(s) you're interested in and share your background, interests, and goals.",
  },
  {
    number: '02',
    title: 'Interview',
    description:
      'Participate in a brief interview. Interview time slots are sent out after the application window closes.',
  },
  {
    number: '03',
    title: 'Match',
    description: 'Members are placed thoughtfully to maximize value across our three tracks.',
  },
];

export const Programs = () => {
  const heroAnim = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  const overviewAnim = useScrollAnimation({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const tracksAnim = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  const processAnim = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const applyAnim = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  const applyHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const initialApplicationConfig = getCachedApplicationConfig();

  const [programsChair, setProgramsChair] = useState<BoardMember | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean | null>(
    initialApplicationConfig?.isApplicationOpen ?? null
  );
  const [applicationUrl, setApplicationUrl] = useState(
    initialApplicationConfig?.applicationUrl ?? ''
  );
  const isApplicationStatusReady = isApplicationOpen !== null;

  useEffect(() => {
    const resolveApplicationConfig = async (): Promise<ApplicationConfig> => {
      if (!applicationConfigPromise) {
        // NOTE: 'mentorship_application_open' / 'mentorship_application_url' are
        // backend WIRE-contract config key literals: do NOT rename them (INV3).
        applicationConfigPromise = dataService.siteConfig
          .getByKeys(['mentorship_application_open', 'mentorship_application_url'])
          .then((config) => ({
            isApplicationOpen:
              (config.mentorship_application_open ??
                MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open) === 'true',
            applicationUrl:
              config.mentorship_application_url ??
              MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url,
          }))
          .finally(() => {
            applicationConfigPromise = null;
          });
      }

      const config = await applicationConfigPromise;
      const fetchedAt = Date.now();
      cachedApplicationConfig = config;
      writePersistedApplicationConfig({ ...config, fetchedAt });
      return config;
    };

    const fetchData = async () => {
      const [applicationConfig, membersResult] = await Promise.allSettled([
        resolveApplicationConfig(),
        dataService.boardMembers.getAll(),
      ]);

      if (applicationConfig.status === 'fulfilled') {
        setIsApplicationOpen(applicationConfig.value.isApplicationOpen);
        setApplicationUrl(applicationConfig.value.applicationUrl);
      } else {
        console.error('Failed to fetch site config:', applicationConfig.reason);
        setIsApplicationOpen(
          (currentValue) =>
            currentValue ??
            MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open === 'true'
        );
        setApplicationUrl(
          (currentValue) =>
            currentValue || MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url
        );
      }

      if (membersResult.status === 'fulfilled') {
        const chair = membersResult.value.find((member) =>
          member.position.toLowerCase().includes('program')
        );
        if (chair) {
          setProgramsChair(chair);
        }
      } else {
        console.error('Failed to fetch programs chair:', membersResult.reason);
      }
    };

    void fetchData();
  }, []);

  const scrollToApply = () => {
    const target = applyHeadingRef.current ?? document.getElementById('apply-section');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="page-container programs-page">
        <SubpageHero
          ref={heroAnim.elementRef}
          visible={heroAnim.isVisible}
          backgroundImageSrc="/mentorship-gallery/mentorship-gallery-3.jpeg"
          eyebrow="Tracks"
          title="Tracks"
          lead="TAMID Group at NYU runs three tracks (Investment Fund, Consulting, and Quant) that build professional skills through hands-on work with the Israeli economy."
          actions={
            <>
              <LinkButtonSecondary
                className={`programs-application-status${
                  isApplicationStatusReady ? '' : ' programs-application-status--loading'
                }`}
                variant="status"
                statusTone={
                  isApplicationStatusReady ? (isApplicationOpen ? 'open' : 'closed') : undefined
                }
                showStatusDot={isApplicationStatusReady}
                onClick={scrollToApply}
              >
                {isApplicationStatusReady
                  ? isApplicationOpen
                    ? 'Application open'
                    : 'Application closed'
                  : 'Checking status'}
              </LinkButtonSecondary>

              {isApplicationOpen ? (
                <LinkButtonPrimary
                  variant="subpage"
                  href={applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Application
                </LinkButtonPrimary>
              ) : (
                <LinkButtonPrimary variant="subpage" onClick={scrollToApply}>
                  View Application
                </LinkButtonPrimary>
              )}
            </>
          }
        />

        <section
          ref={overviewAnim.elementRef}
          className={`programs-overview ${overviewAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="programs-overview-grid">
            <div className="programs-overview-intro">
              <span className="programs-section-label">Tracks Overview</span>
              <h2>One club, three tracks.</h2>
              <p className="programs-overview-lead">
                TAMID Group at NYU offers three tracks, each giving members a different, hands-on
                way to engage with the Israeli economy and build professional skills.
              </p>
            </div>
          </div>
        </section>

        <ZigzagView
          ref={tracksAnim.elementRef}
          className="programs-tracks"
          visible={tracksAnim.isVisible}
          items={TRACK_PILLARS}
        />

        <section
          ref={processAnim.elementRef}
          className={`programs-process ${processAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="programs-process-header">
            <span className="programs-section-label">How It Works</span>
            <h2>A simple and deliberate application process.</h2>
          </div>

          <NumberedList items={PROCESS_STEPS} />
        </section>

        <section
          id="apply-section"
          ref={applyAnim.elementRef}
          className={`programs-apply ${applyAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="programs-apply-copy">
            <span className="programs-section-label">Next Step</span>
            <h2 ref={applyHeadingRef}>
              {isApplicationOpen ? (
                <>
                  <InlineLink href={applicationUrl} target="_blank" rel="noopener noreferrer">
                    Apply
                  </InlineLink>{' '}
                  to join a TAMID track.
                </>
              ) : (
                'Applications are closed for the current cycle.'
              )}
            </h2>
            {programsChair && (
              <p className="programs-contact programs-contact--intro">
                Questions can be directed to{' '}
                <a href={`mailto:${programsChair.email}`}>{programsChair.fullName}</a>,{' '}
                {programsChair.position}.
              </p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};
