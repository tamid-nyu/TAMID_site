import { describe, expect, it } from 'vitest';
import { stripRootPreloadLinks } from './prerenderHtml.mjs';

describe('stripRootPreloadLinks', () => {
  it('removes React-generated leading image preload links from SSR app markup', () => {
    const appHtml =
      '<link rel="preload" as="image" href="/logo.png"/>' +
      '<link rel="preload" as="image" href="/hero.jpg" fetchPriority="high"/>' +
      '<div class="app"><main>Home</main></div>';

    expect(stripRootPreloadLinks(appHtml)).toBe('<div class="app"><main>Home</main></div>');
  });

  it('preserves non-leading app markup', () => {
    const appHtml =
      '<div class="app"><link rel="preload" as="image" href="/nested.png"/><main>Home</main></div>';

    expect(stripRootPreloadLinks(appHtml)).toBe(appHtml);
  });
});
