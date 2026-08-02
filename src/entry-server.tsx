import { renderToString } from 'react-dom/server';
import * as ReactRouterDom from 'react-router-dom';
import { AppContent } from './App';
import { getSeoForPath, PUBLIC_SEO_ROUTES } from './seo';

export { getSeoForPath, PUBLIC_SEO_ROUTES };

const { StaticRouter } = ReactRouterDom;

export const render = (url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
