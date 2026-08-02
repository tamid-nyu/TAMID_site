export const SITE_URL = 'https://nyu-sjba.org';
export const SITE_NAME = 'NYU Stern Jewish Business Association';
export const SITE_SHORT_NAME = 'SJBA';
export const SITE_DESCRIPTION =
  'The NYU Stern Jewish Business Association connects Jewish students at NYU Stern School of Business through professional development, networking, and community events.';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/home-gallery/sjba-gallery-1.JPG`;

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
    imageAlt: 'NYU Stern Jewish Business Association logo',
  },
  {
    path: '/our-mission',
    title: `Our Mission | ${SITE_SHORT_NAME}`,
    description:
      'Learn how and why SJBA builds a value-driven Jewish business community at NYU Stern.',
    image: `${SITE_URL}/mission-gallery/stern-building.jpg`,
    imageAlt: 'NYU Stern building',
  },
  {
    path: '/our-board',
    title: `Executive Board | ${SITE_SHORT_NAME}`,
    description: 'Meet the student leaders powering the Stern Jewish Business Association.',
    image: `${SITE_URL}/board-gallery/board-gallery-1.jpg`,
    imageAlt: 'SJBA executive board members gathered at an event',
  },
  {
    path: '/our-members',
    title: `General Members | ${SITE_SHORT_NAME}`,
    description: "Meet SJBA's recognized members.",
    image: `${SITE_URL}/members-gallery/members-gallery-1.jpeg`,
    imageAlt: 'SJBA members at a community event',
  },
  {
    path: '/mentorship',
    title: `Mentorship | ${SITE_SHORT_NAME}`,
    description:
      'Explore SJBA mentorship programs connecting undergraduate, graduate, underclass, and upperclass students.',
    image: `${SITE_URL}/mentorship-gallery/mentorship-gallery-3.jpeg`,
    imageAlt: 'SJBA mentorship program participants',
  },
  {
    path: '/events',
    title: `Events | ${SITE_SHORT_NAME}`,
    description: 'Explore upcoming SJBA speaker sessions and professional networking events.',
    image: `${SITE_URL}/events-gallery/events-gallery-1.jpeg`,
    imageAlt: 'SJBA members at an event',
  },
  {
    path: '/contact',
    title: `Contact | ${SITE_SHORT_NAME}`,
    description: 'Contact NYU SJBA.',
    imageAlt: 'NYU Stern Jewish Business Association logo',
  },
];

export const NOT_FOUND_SEO: SeoRoute = {
  path: '/404',
  title: `Page Not Found | ${SITE_SHORT_NAME}`,
  description: 'The requested page could not be found.',
  imageAlt: 'NYU Stern Jewish Business Association logo',
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
  alternateName: ['NYU SJBA', 'SJBA', 'Stern Jewish Business Association'],
  url: SITE_URL,
  logo: `${SITE_URL}/sjba/sjba-logo-full.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '44 West 4th Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10012',
    addressCountry: 'US',
  },
  sameAs: ['https://www.linkedin.com/company/sjba/', 'https://www.instagram.com/nyusjba/'],
});

export const getWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['NYU SJBA', 'SJBA', 'Stern Jewish Business Association'],
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
