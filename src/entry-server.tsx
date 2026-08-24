import { renderToString } from 'react-dom/server';
import * as ReactRouterDom from 'react-router-dom';
import { AppContent } from './App';
import {
  getCanonicalUrl,
  getOrganizationJsonLd,
  getPageJsonLd,
  getSeoForPath,
  getSocialImage,
  getWebsiteJsonLd,
  PUBLIC_SEO_ROUTES,
  SITE_NAME,
} from './seo';

export {
  getCanonicalUrl,
  getOrganizationJsonLd,
  getPageJsonLd,
  getSeoForPath,
  getSocialImage,
  getWebsiteJsonLd,
  PUBLIC_SEO_ROUTES,
  SITE_NAME,
};

const { StaticRouter } = ReactRouterDom;

export const render = (url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
