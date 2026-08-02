export const SITE_URL = 'https://nyu-tamid.org';
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
    path: '/our-mission',
    title: `Our Mission | ${SITE_SHORT_NAME}`,
    description:
      'Learn how TAMID Group at NYU develops students’ professional skills through hands-on work with the Israeli economy across four programs: Education, Consulting, Investment Fund, and Israel Fellowship.',
    image: `${SITE_URL}/mission-gallery/stern-building.jpg`,
    imageAlt: 'NYU building',
  },
  {
    path: '/our-board',
    title: `Executive Board | ${SITE_SHORT_NAME}`,
    description: 'Meet the student leaders powering TAMID Group at NYU.',
    image: `${SITE_URL}/board-gallery/board-gallery-1.jpg`,
    imageAlt: 'TAMID Group at NYU executive board members gathered at an event',
  },
  {
    path: '/our-members',
    title: `General Members | ${SITE_SHORT_NAME}`,
    description: "Meet TAMID Group at NYU's members.",
    image: `${SITE_URL}/members-gallery/members-gallery-1.jpeg`,
    imageAlt: 'TAMID Group at NYU members at an event',
  },
  {
    path: '/programs',
    title: `Programs | ${SITE_SHORT_NAME}`,
    description:
      'Explore TAMID Group at NYU’s four programs: Education, Consulting, Investment Fund, and Israel Fellowship.',
    image: `${SITE_URL}/mentorship-gallery/mentorship-gallery-3.jpeg`,
    imageAlt: 'TAMID Group at NYU program participants',
  },
  {
    path: '/events',
    title: `Events | ${SITE_SHORT_NAME}`,
    description:
      'Explore upcoming TAMID Group at NYU speaker sessions and professional networking events.',
    image: `${SITE_URL}/events-gallery/events-gallery-1.jpeg`,
    imageAlt: 'TAMID Group at NYU members at an event',
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
  sameAs: ['https://www.linkedin.com/company/tamidgroup/', 'https://www.instagram.com/nyutamid/'],
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
