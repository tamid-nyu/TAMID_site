import { useEffect, useState } from 'react';
import { Footer, LinkButtonPrimary, SubpageHero } from '@components';
import { dataService } from '@api';
import {
  APPLICATION_CYCLE_CONFIG_DEFAULTS,
  MENTORSHIP_APPLICATION_CONFIG_DEFAULTS,
} from '@constants';
import { useScrollAnimation } from '@hooks';
import './Application.css';

type ApplicationConfig = {
  isApplicationOpen: boolean;
  applicationUrl: string;
  cycleLabel: string;
  deadline: string;
  note: string;
  coffeeChatUrl: string;
};

const CYCLE_DEFAULTS = {
  cycleLabel: APPLICATION_CYCLE_CONFIG_DEFAULTS.application_cycle_label,
  deadline: APPLICATION_CYCLE_CONFIG_DEFAULTS.application_deadline,
  note: APPLICATION_CYCLE_CONFIG_DEFAULTS.application_note,
  coffeeChatUrl: APPLICATION_CYCLE_CONFIG_DEFAULTS.coffee_chat_url,
};

export const Application = () => {
  const heroAnim = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  const bodyAnim = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean | null>(null);
  const [applicationUrl, setApplicationUrl] = useState('');
  const [cycle, setCycle] = useState(CYCLE_DEFAULTS);
  const isStatusReady = isApplicationOpen !== null;

  useEffect(() => {
    let isActive = true;

    const resolveConfig = async (): Promise<ApplicationConfig> => {
      // NOTE: 'mentorship_application_open' / 'mentorship_application_url' are backend
      // WIRE-contract config key literals — do NOT rename them (INV3).
      const config = await dataService.siteConfig.getByKeys([
        'mentorship_application_open',
        'mentorship_application_url',
        'application_cycle_label',
        'application_deadline',
        'application_note',
        'coffee_chat_url',
      ]);
      return {
        isApplicationOpen:
          (config.mentorship_application_open ??
            MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open) === 'true',
        applicationUrl:
          config.mentorship_application_url ??
          MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url,
        cycleLabel: (config.application_cycle_label ?? CYCLE_DEFAULTS.cycleLabel).trim(),
        deadline: (config.application_deadline ?? CYCLE_DEFAULTS.deadline).trim(),
        note: (config.application_note ?? CYCLE_DEFAULTS.note).trim(),
        coffeeChatUrl: (config.coffee_chat_url ?? CYCLE_DEFAULTS.coffeeChatUrl).trim(),
      };
    };

    resolveConfig()
      .then((config) => {
        if (!isActive) return;
        setIsApplicationOpen(config.isApplicationOpen);
        setApplicationUrl(config.applicationUrl);
        setCycle({
          cycleLabel: config.cycleLabel,
          deadline: config.deadline,
          note: config.note,
          coffeeChatUrl: config.coffeeChatUrl,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch application config:', error);
        if (!isActive) return;
        setIsApplicationOpen(
          MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_open === 'true'
        );
        setApplicationUrl(MENTORSHIP_APPLICATION_CONFIG_DEFAULTS.mentorship_application_url);
        setCycle(CYCLE_DEFAULTS);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <div className="page-container application-page">
        <SubpageHero
          ref={heroAnim.elementRef}
          visible={heroAnim.isVisible}
          backgroundImageSrc="/nyc-summer-summit.jpg"
          backgroundImageAlt="TAMID Group at NYU members at the NYC Summer Summit"
          imagePosition="center"
          title="Apply"
          lead="Each semester we select a cohort of top-performing undergraduate students for our Investment Fund, Consulting, and Quant tracks."
        />

        <div
          ref={bodyAnim.elementRef}
          className={`application-body ${bodyAnim.isVisible ? 'visible' : ''}`}
        >
          {isStatusReady && isApplicationOpen ? (
            <section className="application-panel">
              <h2>
                {cycle.cycleLabel
                  ? `Applications for ${cycle.cycleLabel} are open.`
                  : 'The application is open.'}
              </h2>
              <p>
                {cycle.deadline
                  ? `Applications close ${cycle.deadline}. `
                  : 'Applications for this cycle are open now. '}
                Complete the form to tell us about your background, interests, and the track you
                want to join. Shortlisted applicants are invited to a brief interview.
              </p>
              {cycle.note ? <p className="application-note">{cycle.note}</p> : null}
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
                {cycle.coffeeChatUrl ? (
                  <LinkButtonPrimary
                    variant="subpage"
                    href={cycle.coffeeChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request a coffee chat
                  </LinkButtonPrimary>
                ) : null}
              </div>
            </section>
          ) : null}

          {isStatusReady && !isApplicationOpen ? (
            <section className="application-panel">
              <h2>Applications are closed for now.</h2>
              <p>
                We run one application cycle each semester, and the current cycle is closed. The
                next cycle opens at the beginning of the term. Check back then to apply.
              </p>
              <div className="application-actions">
                {cycle.coffeeChatUrl ? (
                  <LinkButtonPrimary
                    variant="subpage"
                    href={cycle.coffeeChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request a coffee chat
                  </LinkButtonPrimary>
                ) : null}
                <LinkButtonPrimary variant="subpage" to="/contact">
                  Get in touch
                </LinkButtonPrimary>
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
                Applications open at the beginning of the semester and remain open for a week,
                during which applicants have the opportunity to network with our members and learn
                more about the organization. Shortlisted candidates will be invited to interview
                throughout the following week and receive a final decision several days later.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};
