import { useEffect, useState } from 'react';
import { Footer, LinkButtonPrimary, LinkButtonSecondary, SubpageHero } from '@components';
import { dataService } from '@api';
import { MENTORSHIP_APPLICATION_CONFIG_DEFAULTS } from '@constants';
import { useScrollAnimation } from '@hooks';
import './Application.css';

type ApplicationConfig = {
  isApplicationOpen: boolean;
  applicationUrl: string;
};

export const Application = () => {
  const heroAnim = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  const bodyAnim = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean | null>(null);
  const [applicationUrl, setApplicationUrl] = useState('');
  const isStatusReady = isApplicationOpen !== null;

  useEffect(() => {
    let isActive = true;

    const resolveConfig = async (): Promise<ApplicationConfig> => {
      // NOTE: 'mentorship_application_open' / 'mentorship_application_url' are backend
      // WIRE-contract config key literals — do NOT rename them (INV3).
      const config = await dataService.siteConfig.getByKeys([
        'mentorship_application_open',
        'mentorship_application_url',
      ]);
      return {
        isApplicationOpen:
          (config.mentorship_application_open ??
            MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open) === 'true',
        applicationUrl:
          config.mentorship_application_url ??
          MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url,
      };
    };

    resolveConfig()
      .then((config) => {
        if (!isActive) return;
        setIsApplicationOpen(config.isApplicationOpen);
        setApplicationUrl(config.applicationUrl);
      })
      .catch((error) => {
        console.error('Failed to fetch application config:', error);
        if (!isActive) return;
        setIsApplicationOpen(
          MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open === 'true'
        );
        setApplicationUrl(MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const statusLabel = !isStatusReady
    ? 'Checking application status'
    : isApplicationOpen
      ? 'Applications are open'
      : 'Applications are currently closed';

  const statusTone = !isStatusReady ? 'loading' : isApplicationOpen ? 'open' : 'closed';

  return (
    <>
      <div className="page-container application-page">
        <SubpageHero
          ref={heroAnim.elementRef}
          visible={heroAnim.isVisible}
          backgroundImageSrc="/events-gallery/events-gallery-1.jpeg"
          backgroundImageAlt="TAMID Group at NYU members"
          imagePosition="center 20%"
          title="Apply"
          lead="Each semester we select a cohort of top-performing undergraduate students for our Investment Fund, Consulting, and Quant tracks."
        />

        <div
          ref={bodyAnim.elementRef}
          className={`application-body ${bodyAnim.isVisible ? 'visible' : ''}`}
        >
          <div className={`application-status application-status--${statusTone}`}>
            <span className="application-status__dot" aria-hidden="true" />
            <span className="application-status__label">{statusLabel}</span>
          </div>

          {isStatusReady && isApplicationOpen ? (
            <section className="application-panel">
              <h2>The application is open.</h2>
              <p>
                Applications for this cycle are open now. Complete the form to tell us about your
                background, interests, and the track you want to join. Shortlisted applicants are
                invited to a brief interview.
              </p>
              <div className="application-actions">
                {applicationUrl ? (
                  <LinkButtonPrimary
                    variant="subpage"
                    href={applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start your application
                  </LinkButtonPrimary>
                ) : null}
                <LinkButtonSecondary to="/tracks">Explore the tracks</LinkButtonSecondary>
              </div>
            </section>
          ) : null}

          {isStatusReady && !isApplicationOpen ? (
            <section className="application-panel">
              <h2>Applications are closed for now.</h2>
              <p>
                We run one application cycle each semester, and the current cycle is closed. The
                next cycle opens at the beginning of the term. In the meantime, explore our tracks
                to learn about the work we do.
              </p>
              <div className="application-actions">
                <LinkButtonPrimary variant="subpage" to="/tracks">
                  Explore the tracks
                </LinkButtonPrimary>
                <LinkButtonSecondary to="/contact">Get in touch</LinkButtonSecondary>
              </div>
            </section>
          ) : null}

          <section className="application-details">
            <div className="application-detail">
              <h3>How it works</h3>
              <ol className="application-steps">
                <li>
                  <strong>Apply.</strong> Submit the application and select the track or tracks you
                  are interested in.
                </li>
                <li>
                  <strong>Interview.</strong> Shortlisted applicants are invited to a short
                  interview after the application window closes.
                </li>
                <li>
                  <strong>Join a track.</strong> New members are placed thoughtfully across the
                  Investment Fund, Consulting, and Quant tracks.
                </li>
              </ol>
            </div>

            <div className="application-detail">
              <h3>Timing</h3>
              <p>
                Applications open at the beginning of each semester. If you are somebody who
                embodies merit, excellence, and intelligence, we encourage you to apply.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};
