import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripRootPreloadLinks } from './prerenderHtml.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const ssrEntryPath = path.join(projectRoot, '.prerender-ssr', 'entry-server.js');

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const normalizePath = (routePath) =>
  routePath === '/' ? routePath : routePath.replace(/\/+$/, '');
const canonicalUrl = (routePath) => `https://nyu-sjba.org${routePath === '/' ? '/' : routePath}`;
const socialImage = (route) =>
  route.image ?? 'https://nyu-sjba.org/home-gallery/sjba-gallery-1.JPG';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NYU Stern Jewish Business Association',
  alternateName: ['NYU SJBA', 'SJBA', 'Stern Jewish Business Association'],
  url: 'https://nyu-sjba.org',
  logo: 'https://nyu-sjba.org/sjba/sjba-logo-full.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '44 West 4th Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10012',
    addressCountry: 'US',
  },
  sameAs: ['https://www.linkedin.com/company/sjba/', 'https://www.instagram.com/nyusjba/'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NYU Stern Jewish Business Association',
  alternateName: ['NYU SJBA', 'SJBA', 'Stern Jewish Business Association'],
  url: 'https://nyu-sjba.org/',
};

const buildPageJsonLd = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: route.title,
  description: route.description,
  url: canonicalUrl(route.path),
  isPartOf: {
    '@type': 'WebSite',
    name: 'NYU Stern Jewish Business Association',
    url: 'https://nyu-sjba.org/',
  },
});

const buildHead = (route) => {
  const url = canonicalUrl(route.path);
  const image = socialImage(route);
  const imageAlt = route.imageAlt ?? 'NYU Stern Jewish Business Association';
  const robots = route.noindex ? 'noindex, nofollow' : 'index, follow';

  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:site_name" content="NYU Stern Jewish Business Association" />',
    `<meta property="og:type" content="${route.type ?? 'website'}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:url" content="${escapeHtml(url)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<script id="organization-jsonld" type="application/ld+json">${JSON.stringify(organizationJsonLd)}</script>`,
    `<script id="website-jsonld" type="application/ld+json">${JSON.stringify(websiteJsonLd)}</script>`,
    `<script id="page-jsonld" type="application/ld+json">${JSON.stringify(buildPageJsonLd(route))}</script>`,
  ].join('\n  ');
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const removeTagWithAttribute = (html, tagName, attributeName, attributeValue) =>
  html.replace(
    new RegExp(
      `<${tagName}\\b(?=[^>]*\\b${escapeRegExp(attributeName)}=["']${escapeRegExp(attributeValue)}["'])[^>]*>\\s*`,
      'g'
    ),
    ''
  );

const replaceSeoHead = (template, route) => {
  const seoMetaNames = [
    'description',
    'robots',
    'twitter:card',
    'twitter:url',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:image:alt',
  ];
  const seoMetaProperties = [
    'og:site_name',
    'og:type',
    'og:url',
    'og:title',
    'og:description',
    'og:image',
    'og:image:alt',
  ];

  let html = template
    .replace(/<!-- Open Graph[\s\S]*?-->\s*/g, '')
    .replace(/<!-- Twitter -->\s*/g, '')
    .replace(/<script id="organization-jsonld"[\s\S]*?<\/script>\n?/g, '')
    .replace(/<script id="website-jsonld"[\s\S]*?<\/script>\n?/g, '')
    .replace(/<script id="page-jsonld"[\s\S]*?<\/script>\n?/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');

  for (const name of seoMetaNames) {
    html = removeTagWithAttribute(html, 'meta', 'name', name);
  }

  for (const property of seoMetaProperties) {
    html = removeTagWithAttribute(html, 'meta', 'property', property);
  }

  html = removeTagWithAttribute(html, 'link', 'rel', 'canonical');

  return html.replace(/<title>[\s\S]*?<\/title>/, buildHead(route));
};

const writeHtml = async (routePath, html) => {
  if (routePath === '/') {
    await fs.writeFile(path.join(distDir, 'index.html'), html);
    return;
  }

  const routeDir = path.join(distDir, routePath.slice(1));
  await fs.mkdir(routeDir, { recursive: true });
  await fs.writeFile(path.join(routeDir, 'index.html'), html);
};

try {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
  const { render, PUBLIC_SEO_ROUTES, getSeoForPath } = await import(ssrEntryPath);
  const routes = [...PUBLIC_SEO_ROUTES, { ...getSeoForPath('/404'), path: '/404' }];

  for (const route of routes) {
    const routePath = normalizePath(route.path);
    const appHtml = stripRootPreloadLinks(render(routePath));
    const html = replaceSeoHead(template, route)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace('<!-- Twitter -->', '<!-- Open Graph / Social Preview -->');

    await writeHtml(routePath, html);
  }

  const notFoundHtml = await fs.readFile(path.join(distDir, '404', 'index.html'), 'utf-8');
  await fs.writeFile(path.join(distDir, '404.html'), notFoundHtml);
} finally {
  await fs.rm(path.join(projectRoot, '.prerender-ssr'), { recursive: true, force: true });
}
