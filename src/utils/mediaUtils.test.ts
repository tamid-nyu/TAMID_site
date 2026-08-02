import { describe, expect, it } from 'vitest';
import { getMediaThumbnailPath } from './mediaUtils';

describe('getMediaThumbnailPath', () => {
  it('keeps root-level media paths canonical', () => {
    expect(getMediaThumbnailPath('photo.png')).toBe('thumbnails/photo.jpg');
  });

  it('keeps transitional nested paths compatible', () => {
    expect(getMediaThumbnailPath('events/speaker.webp')).toBe('events/thumbnails/speaker.jpg');
  });
});
