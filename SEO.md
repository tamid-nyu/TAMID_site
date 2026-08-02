# SEO

This site is a React + Vite app that is built as static, prerendered HTML for the public routes.

## Crawl Discovery

The site ships static crawl files from `public/`:

- `public/robots.txt` allows crawling and points crawlers to the sitemap.
- `public/sitemap.xml` lists the public canonical routes that should be discoverable.

Keep the sitemap in sync when adding or removing public pages.

## Route Metadata

Route-level SEO data lives in `src/seo.ts`. It defines:

- canonical paths
- page titles and descriptions
- social preview images and alt text
- shared site constants
- Organization, WebSite, and WebPage JSON-LD helpers

The `Seo` component in `src/components/Seo/Seo.tsx` applies that metadata in the browser on client-side navigation. This keeps metadata correct when a visitor moves between routes without a full page reload.

## Static Prerendering

Production builds prerender public routes with:

```bash
npm run build
```

The build creates a temporary SSR bundle from `src/entry-server.tsx`, then `build-tools/prerender.mjs` renders each route from `PUBLIC_SEO_ROUTES` into static HTML under `dist/`. This produces route files such as:

- `dist/index.html`
- `dist/events/index.html`
- `dist/mentorship/index.html`
- `dist/contact/index.html`
- `dist/404.html`

Each generated page includes route-specific title, description, canonical, Open Graph, Twitter/X preview tags, and JSON-LD before React hydrates in the browser.

## 404 Behavior

The app has a dedicated `NotFound` route and prerenders `404.html`. Unknown client-side routes receive noindex metadata through `getSeoForPath`, and the static 404 page is available for hosts that support `404.html`.

## Events Structured Data

The Events page injects JSON-LD for upcoming events after they load from the API. This keeps public event metadata available to crawlers that execute JavaScript while keeping tests independent from the live backend.

## Developer Notes

When adding a public route:

- Add the route to React Router in `src/App.tsx`.
- Add the route metadata to `PUBLIC_SEO_ROUTES` in `src/seo.ts`.
- Add the URL to `public/sitemap.xml`.
- Run `npm run build` and confirm the route gets a corresponding `dist/<route>/index.html`.
