import { describe, expect, it, vi } from 'vitest';
import { getBoardMemberImageUrl, getBoardMemberThumbnailUrl } from './boardMemberUtils';

vi.mock('@constants', () => ({
  BOARD_IMAGES_BUCKET: 'https://cdn.example.com/board-headshots/',
}));

describe('boardMemberUtils', () => {
  it('builds canonical root-level headshot URLs with cache versions', () => {
    const version = '2026-07-22T18:42:00.000Z';

    expect(getBoardMemberImageUrl('ada.webp', version)).toBe(
      'https://cdn.example.com/board-headshots/ada.webp?v=2026-07-22T18%3A42%3A00.000Z'
    );
    expect(getBoardMemberThumbnailUrl('ada.webp', version)).toBe(
      'https://cdn.example.com/board-headshots/thumbnails/ada.jpg?v=2026-07-22T18%3A42%3A00.000Z'
    );
  });

  it('keeps transitional nested headshot paths compatible', () => {
    expect(getBoardMemberImageUrl('members/ada.webp')).toBe(
      'https://cdn.example.com/board-headshots/members/ada.webp'
    );
    expect(getBoardMemberThumbnailUrl('members/ada.webp')).toBe(
      'https://cdn.example.com/board-headshots/members/thumbnails/ada.jpg'
    );
  });

  it('returns an empty URL when no headshot is available', () => {
    expect(getBoardMemberThumbnailUrl(null, 'version')).toBe('');
  });
});
