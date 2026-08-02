export const stripRootPreloadLinks = (html) =>
  html.replace(/^(?:<link\s+rel="preload"\s+as="image"[^>]*\/>)+/, '');
