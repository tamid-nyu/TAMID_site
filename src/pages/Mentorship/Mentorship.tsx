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
import './Mentorship.css';

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
    console.error('Failed to read mentorship application config cache:', error);
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
    console.error('Failed to write mentorship application config cache:', error);
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

const MENTORSHIP_TRACKS = [
  {
    eyebrow: 'Cross-Degree Pairings',
    title: 'Undergraduate & Graduate Pairings',
    description:
      'In partnership with the Jewish Student Association (JSA), undergraduate students are paired with MBA and JD mentors, creating opportunities to learn directly from those with advanced academic and professional experience.',
    image: '/mentorship-gallery/mentorship-gallery-1.jpeg',
    alt: 'Graduate mentorship pairing',
  },
  {
    eyebrow: 'Peer Guidance',
    title: 'Underclassmen & Upperclassmen',
    description:
      'Guidance is available at every stage of the undergraduate journey. Freshmen are matched with sophomores, and sophomores with juniors or seniors – ensuring that every student has a peer who recently navigated the same challenges and can offer first-hand advice.',
    image: '/mentorship-gallery/mentorship-gallery-2.jpeg',
    alt: 'Undergraduate mentorship pairing',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Apply',
    description:
      "Fill out the application form where you'll select which program(s) you're interested in and share your background, interests, and goals.",
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
    description: 'Pairs are matched thoughtfully to maximize value for both mentors and mentees.',
  },
];

export const Mentorship = () => {
  const heroAnim = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  const overviewAnim = useScrollAnimation({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const tracksAnim = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  const processAnim = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const applyAnim = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  const applyHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const initialApplicationConfig = getCachedApplicationConfig();

  const [mentorshipChair, setMentorshipChair] = useState<BoardMember | null>(null);
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
          member.position.toLowerCase().includes('mentor')
        );
        if (chair) {
          setMentorshipChair(chair);
        }
      } else {
        console.error('Failed to fetch mentorship chair:', membersResult.reason);
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
      <div className="page-container mentorship-page">
        <SubpageHero
          ref={heroAnim.elementRef}
          visible={heroAnim.isVisible}
          backgroundImageSrc="/mentorship-gallery/mentorship-gallery-3.jpeg"
          eyebrow="Programs / Mentorship"
          title="Mentorship"
          lead="Participants in our mentorship programs foster lasting relationships, exchange career guidance, and strengthen the Jewish community at NYU Stern across class years and degree levels."
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
          className={`mentorship-overview ${overviewAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="mentorship-overview-grid">
            <div className="mentorship-overview-intro">
              <span className="mentorship-section-label">Mentorship Program Overview</span>
              <h2>One program, two mentorship paths.</h2>
              <p className="mentorship-overview-lead">
                SJBA offers two distinct mentorship tracks, each designed to foster meaningful
                connections and provide tailored guidance to our members.
              </p>
            </div>
          </div>
        </section>

        <ZigzagView
          ref={tracksAnim.elementRef}
          className="mentorship-tracks"
          visible={tracksAnim.isVisible}
          items={MENTORSHIP_TRACKS}
        />

        <section
          ref={processAnim.elementRef}
          className={`mentorship-process ${processAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="mentorship-process-header">
            <span className="mentorship-section-label">How It Works</span>
            <h2>A simple and deliberate matching process.</h2>
          </div>

          <NumberedList items={PROCESS_STEPS} />
        </section>

        <section
          id="apply-section"
          ref={applyAnim.elementRef}
          className={`mentorship-apply ${applyAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="mentorship-apply-copy">
            <span className="mentorship-section-label">Next Step</span>
            <h2 ref={applyHeadingRef}>
              {isApplicationOpen ? (
                <>
                  <InlineLink href={applicationUrl} target="_blank" rel="noopener noreferrer">
                    Apply
                  </InlineLink>{' '}
                  to join the next mentorship cohort.
                </>
              ) : (
                'Applications are closed for the current cycle.'
              )}
            </h2>
            {mentorshipChair && (
              <p className="mentorship-contact mentorship-contact--intro">
                Questions can be directed to{' '}
                <a href={`mailto:${mentorshipChair.email}`}>{mentorshipChair.fullName}</a>,{' '}
                {mentorshipChair.position}.
              </p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};
