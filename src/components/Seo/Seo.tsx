import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getCanonicalUrl,
  getOrganizationJsonLd,
  getPageJsonLd,
  getSeoForPath,
  getSocialImage,
  getWebsiteJsonLd,
  SITE_NAME,
} from '@seo';

const upsertMeta = (
  selector: string,
  attribute: 'name' | 'property',
  key: string,
  content: string
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const upsertJsonLd = (id: string, data: unknown) => {
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

export const Seo = () => {
  const location = useLocation();

  useEffect(() => {
    const route = getSeoForPath(location.pathname);
    const canonicalUrl = getCanonicalUrl(route.path);
    const socialImage = getSocialImage(route);
    const robots = route.noindex ? 'noindex, nofollow' : 'index, follow';

    document.title = route.title;
    upsertMeta('meta[name="description"]', 'name', 'description', route.description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
    upsertCanonical(canonicalUrl);

    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', route.type ?? 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', route.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', route.description);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', socialImage);
    upsertMeta(
      'meta[property="og:image:alt"]',
      'property',
      'og:image:alt',
      route.imageAlt ?? SITE_NAME
    );

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', route.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      route.description
    );
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage);
    upsertMeta(
      'meta[name="twitter:image:alt"]',
      'name',
      'twitter:image:alt',
      route.imageAlt ?? SITE_NAME
    );

    upsertJsonLd('organization-jsonld', getOrganizationJsonLd());
    upsertJsonLd('website-jsonld', getWebsiteJsonLd());
    upsertJsonLd('page-jsonld', getPageJsonLd(route));
  }, [location.pathname]);

  return null;
};
