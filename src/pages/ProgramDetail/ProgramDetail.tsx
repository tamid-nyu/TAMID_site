import { useParams } from 'react-router-dom';
import { Footer, SubpageHero } from '@components';
import { useScrollAnimation } from '@hooks';
import { NotFound } from '../NotFound';
import './ProgramDetail.css';

type TrackSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type TrackContent = {
  eyebrow: string;
  title: string;
  lead: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  imagePosition?: string;
  sections: TrackSection[];
};

const TRACK_CONTENT: Record<'fund' | 'consulting' | 'quant' | 'fellowship', TrackContent> = {
  fund: {
    eyebrow: '',
    title: 'Investment Fund',
    lead: 'A student-run equity research track where members build long and short theses, own coverage, and pitch to the fund.',
    backgroundImageSrc: '/mentorship-gallery/mentorship-gallery-1.jpeg?v=24',
    backgroundImageAlt: 'TAMID Group at NYU Investment Fund members',
    sections: [
      {
        heading: 'Hands-on equity research',
        paragraphs: [
          'Investment Fund members learn the fundamentals of equity research and portfolio management by doing the work themselves. Analysts pick up sector coverage, build financial models, and develop investment theses that they refine over the course of the semester.',
          'The track pairs a structured curriculum with real analytical output, so members leave with a portfolio of research they can speak to in interviews and beyond.',
        ],
      },
      {
        heading: 'National simulated-fund competition',
        paragraphs: [
          'The Investment Fund participates in a national, simulated-fund competition alongside TAMID chapters at other universities. Members translate their research into positions, track performance, and compete on the strength of their ideas rather than on any real capital.',
        ],
      },
      {
        heading: 'What members build',
        paragraphs: ['Over a cycle, analysts develop a repeatable research workflow:'],
        bullets: [
          'Long and short theses grounded in fundamental analysis',
          'Ongoing coverage of assigned sectors and names',
          'Pitches delivered to the fund for discussion and challenge',
        ],
      },
    ],
  },
  consulting: {
    eyebrow: '',
    title: 'Consulting',
    lead: 'Pro-bono consulting engagements that give members real client experience with Israeli startups.',
    backgroundImageSrc: '/mentorship-gallery/mentorship-gallery-2.jpeg?v=3',
    backgroundImageAlt: 'TAMID Group at NYU Consulting members',
    sections: [
      {
        heading: 'Real engagements, real clients',
        paragraphs: [
          'Consulting members work in small teams on semester-long, pro-bono engagements with early-stage Israeli startups. Each team owns a defined problem and delivers concrete recommendations the client can act on.',
          'The work is hands-on from day one: members scope the problem, gather evidence, and present findings directly to founders and operators.',
        ],
      },
      {
        heading: 'Scope of work',
        paragraphs: [
          'Engagements typically center on helping a startup understand or enter the US market:',
        ],
        bullets: [
          'Market research and industry analysis',
          'Competitive analysis and positioning',
          'US market-entry strategy',
          'Product and beta feedback',
          'Go-to-market planning',
        ],
      },
      {
        heading: 'Skills members develop',
        paragraphs: [
          'Members build the core toolkit of a consultant: structuring an ambiguous problem, synthesizing research into a clear recommendation, and communicating it persuasively to a client. It is a practical, project-based way to engage with the Israeli startup ecosystem.',
        ],
      },
    ],
  },
  quant: {
    eyebrow: '',
    title: 'Quant',
    lead: 'A quantitative and algorithmic strategy track built around data-driven research and systematic trading concepts.',
    backgroundImageSrc: '/mentorship-gallery/quant-hero-v5.jpg?v=2',
    backgroundImageAlt: 'TAMID Group at NYU Quant members',
    imagePosition: 'center 45%',
    sections: [
      {
        heading: 'Quantitative and algorithmic strategy',
        paragraphs: [
          'The Quant track introduces members to the concepts behind systematic and algorithmic trading. Members explore how quantitative researchers turn data into testable ideas and how those ideas become rules-based strategies.',
          'The emphasis is on rigor and process: forming a hypothesis, testing it against data, and being honest about what the results do and do not show.',
        ],
      },
      {
        heading: 'Data-driven research and backtesting',
        paragraphs: ['Members work through the research lifecycle used by quantitative teams:'],
        bullets: [
          'Sourcing and cleaning data for analysis',
          'Signal generation and hypothesis testing',
          'Backtest development and evaluation',
          'Reasoning about systematic trading concepts and risk',
        ],
      },
      {
        heading: 'AI-native, agentic tooling',
        paragraphs: [
          'Artificial intelligence is foundational to the track, so members build practical, transferable skills using agentic tools and LLM-powered workflows while learning quantitative methods. No prior tech background is required, only curiosity and a willingness to work through the data.',
        ],
      },
    ],
  },
  fellowship: {
    eyebrow: '',
    title: 'Israel Fellowship',
    lead: 'A summer fellowship that places members inside the Israeli innovation economy for hands-on, immersive work experience.',
    backgroundImageSrc: '/mentorship-gallery/fellowship-hero-telaviv.jpg',
    backgroundImageAlt: 'Tel Aviv skyline at dusk along the Mediterranean coast',
    sections: [
      {
        heading: 'Hands-on experience in Israel',
        paragraphs: [
          'The Israel Fellowship gives members the chance to spend the summer working directly with companies and startups in Israel. It is where the skills members build across the Investment Fund, Consulting, and Quant tracks come together in a real, immersive setting.',
          'Fellows step into day-to-day work at their host organizations, contributing to real projects while learning how the Israeli innovation ecosystem operates up close.',
        ],
      },
      {
        heading: 'Professional and cultural immersion',
        paragraphs: [
          'Beyond the work itself, the Fellowship is an immersion in a new professional environment. Members build a network across the ecosystem, adapt to a different business culture, and gain perspective that is difficult to get from a classroom.',
        ],
        bullets: [
          'Placement with an Israeli company or startup',
          'Real project work alongside full-time teams',
          'Exposure to the broader innovation and startup ecosystem',
          'A network that extends well beyond the summer',
        ],
      },
    ],
  },
};

const isValidSlug = (slug: string | undefined): slug is keyof typeof TRACK_CONTENT =>
  slug === 'fund' || slug === 'consulting' || slug === 'quant' || slug === 'fellowship';

export const ProgramDetail = () => {
  const { slug } = useParams();
  const heroAnim = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  const sectionsAnim = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  if (!isValidSlug(slug)) {
    return <NotFound />;
  }

  const content = TRACK_CONTENT[slug];

  return (
    <>
      <div className="page-container program-detail-page">
        <SubpageHero
          ref={heroAnim.elementRef}
          visible={heroAnim.isVisible}
          backgroundImageSrc={content.backgroundImageSrc}
          backgroundImageAlt={content.backgroundImageAlt}
          imagePosition={content.imagePosition}
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
        />

        <div
          ref={sectionsAnim.elementRef}
          className={`program-detail-sections ${sectionsAnim.isVisible ? 'visible' : ''}`}
        >
          {content.sections.map((section) => (
            <section key={section.heading} className="program-detail-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul className="program-detail-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};
