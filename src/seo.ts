export const SITE_URL = 'https://nyutamid.org';
export const SITE_NAME = 'TAMID Group at NYU';
export const SITE_SHORT_NAME = 'TAMID';
export const SITE_DESCRIPTION =
  'TAMID Group at NYU is a nonprofit, apolitical, and areligious student organization that develops undergraduates’ professional skills through hands-on work with the Israeli economy.';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/home-gallery/tamid-gallery-1.JPG`;

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export const PUBLIC_SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    imageAlt: 'TAMID Group at NYU logo',
  },
  {
    path: '/our-board',
    title: `Executive Board | ${SITE_SHORT_NAME}`,
    description: 'Meet the student leaders powering TAMID Group at NYU.',
    image: `${SITE_URL}/board-gallery/nyu-stern.jpg?v=3`,
    imageAlt: 'The NYU Stern School of Business building',
  },
  {
    path: '/our-members',
    title: `General Members | ${SITE_SHORT_NAME}`,
    description: "Meet TAMID Group at NYU's members.",
    image: `${SITE_URL}/members-gallery/washington-square-arch.jpg?v=4`,
    imageAlt: 'The Washington Square Arch at NYU',
  },
  {
    path: '/tracks/fund',
    title: `Investment Fund | ${SITE_SHORT_NAME}`,
    description:
      'TAMID Group at NYU’s student-run Investment Fund: equity research and a national simulated-fund competition where members build and pitch long/short theses.',
    image: `${SITE_URL}/mentorship-gallery/mentorship-gallery-1.jpeg?v=19`,
    imageAlt: 'TAMID Group at NYU Investment Fund members',
  },
  {
    path: '/tracks/consulting',
    title: `Consulting | ${SITE_SHORT_NAME}`,
    description:
      'TAMID Group at NYU’s Consulting track: semester-long, pro-bono engagements with Israeli startups spanning market research, competitive analysis, US market-entry strategy, and go-to-market.',
    image: `${SITE_URL}/mentorship-gallery/mentorship-gallery-2.jpeg?v=3`,
    imageAlt: 'TAMID Group at NYU Consulting members',
  },
  {
    path: '/tracks/quant',
    title: `Quant | ${SITE_SHORT_NAME}`,
    description:
      'TAMID Group at NYU’s Quant track: quantitative and algorithmic strategy through data-driven research, signal and backtest development, and Python-based modeling.',
    image: `${SITE_URL}/mentorship-gallery/quant-hero-v5.jpg?v=2`,
    imageAlt: 'TAMID Group at NYU Quant members',
  },
  {
    path: '/tracks/fellowship',
    title: `Israel Fellowship | ${SITE_SHORT_NAME}`,
    description:
      'TAMID Group at NYU’s Israel Fellowship: a summer program placing members inside Israeli companies and startups for hands-on, immersive work experience.',
    image: `${SITE_URL}/mentorship-gallery/fellowship-hero-telaviv.jpg`,
    imageAlt: 'Tel Aviv skyline at dusk along the Mediterranean coast',
  },
  {
    path: '/apply',
    title: `Apply | ${SITE_SHORT_NAME}`,
    description:
      'Apply to TAMID Group at NYU. Each semester we select a cohort of top-performing undergraduates for the Investment Fund, Consulting, and Quant tracks. Applications open at the start of each term.',
    image: `${SITE_URL}/events-gallery/events-gallery-1.jpeg`,
    imageAlt: 'TAMID Group at NYU members',
  },
  {
    path: '/contact',
    title: `Contact | ${SITE_SHORT_NAME}`,
    description: 'Contact TAMID Group at NYU.',
    imageAlt: 'TAMID Group at NYU logo',
  },
];

export const NOT_FOUND_SEO: SeoRoute = {
  path: '/404',
  title: `Page Not Found | ${SITE_SHORT_NAME}`,
  description: 'The requested page could not be found.',
  imageAlt: 'TAMID Group at NYU logo',
  noindex: true,
};

export const normalizeSeoPath = (path: string): string => {
  const pathname = path.split(/[?#]/)[0] || '/';
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
};

export const getCanonicalUrl = (path: string): string => `${SITE_URL}${path === '/' ? '/' : path}`;

export const getSeoForPath = (path: string): SeoRoute => {
  const normalizedPath = normalizeSeoPath(path);
  return (
    PUBLIC_SEO_ROUTES.find((route) => route.path === normalizedPath) ?? {
      ...NOT_FOUND_SEO,
      path: normalizedPath,
    }
  );
};

export const getSocialImage = (route: SeoRoute): string => route.image ?? DEFAULT_SOCIAL_IMAGE;

export const getOrganizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: ['TAMID', 'TAMID at NYU', 'TAMID Group at NYU'],
  url: SITE_URL,
  logo: `${SITE_URL}/tamid/tamid-logo-full.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '44 West 4th Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10012',
    addressCountry: 'US',
  },
  sameAs: ['https://www.linkedin.com/company/tamidgroup/', 'https://www.instagram.com/tamidnyu/'],
});

export const getWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['TAMID', 'TAMID at NYU', 'TAMID Group at NYU'],
  url: `${SITE_URL}/`,
});

export const getPageJsonLd = (route: SeoRoute) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: route.title,
  description: route.description,
  url: getCanonicalUrl(route.path),
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
});
