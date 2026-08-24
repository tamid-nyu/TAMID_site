import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCanonicalUrl, PUBLIC_SEO_ROUTES, SITE_URL } from './seo';

describe('seo canonical host', () => {
  it('uses the live www host', () => {
    expect(SITE_URL).toBe('https://www.nyutamid.org');
  });

  it('builds every canonical URL from SITE_URL', () => {
    for (const route of PUBLIC_SEO_ROUTES) {
      expect(getCanonicalUrl(route.path).startsWith(SITE_URL)).toBe(true);
    }
  });

  it('names NYU in every indexable page title', () => {
    for (const route of PUBLIC_SEO_ROUTES) {
      expect(route.title).toContain('NYU');
    }
  });

  // Regression guard: the prerender script once carried its own copy of the
  // canonical host and shipped a dead domain to every crawler for weeks while
  // src/seo.ts looked correct. It must import from seo.ts, never re-declare.
  it('keeps prerender.mjs free of hardcoded absolute URLs', () => {
    const prerender = readFileSync(
      path.resolve(__dirname, '../build-tools/prerender.mjs'),
      'utf-8'
    );
    expect(prerender).not.toMatch(/https?:\/\/[a-z0-9-]+\.[a-z]/i);
  });
});
