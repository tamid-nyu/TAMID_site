import { useState, useEffect } from 'react';

/**
 * Hook for progressive image loading: starts with a thumbnail,
 * then swaps to the full-resolution image once loaded.
 *
 * @param thumbnailSrc - URL of the small thumbnail image
 * @param fullSrc - URL of the full-resolution image
 * @returns currentSrc (the best available image URL) and isFullLoaded flag
 */
export function useProgressiveImage(
  thumbnailSrc: string | null,
  fullSrc: string | null
): { currentSrc: string | null; isFullLoaded: boolean } {
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  useEffect(() => {
    if (!fullSrc) {
      setIsFullLoaded(false);
      return;
    }

    setIsFullLoaded(false);

    const img = new Image();
    img.src = fullSrc;

    const handleLoad = () => setIsFullLoaded(true);
    img.addEventListener('load', handleLoad);

    // If already cached, load event may have already fired
    if (img.complete) {
      setIsFullLoaded(true);
    }

    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [fullSrc]);

  const currentSrc = isFullLoaded ? fullSrc : thumbnailSrc;
  return { currentSrc, isFullLoaded };
}
