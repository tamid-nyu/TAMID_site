import { describe, expect, it, vi } from 'vitest';
import type { Event } from '@types';
import {
  formatEventDate,
  getEventFlyerUrl,
  getEventThumbnailUrl,
  getNextUpcomingEvent,
} from './eventUtils';

vi.mock('@constants', () => ({
  EVENT_FLYERS_BUCKET: 'https://cdn.example.com/event-flyers/',
}));

const makeEvent = (id: string, startTime: string): Event => ({
  id,
  startTime,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  title: `Event ${id}`,
  company: null,
  endTime: null,
  location: null,
  flyerFile: null,
  rsvpLink: null,
  description: null,
  semester: 'S26',
});

describe('eventUtils', () => {
  it('formats event dates and times in the site timezone', () => {
    expect(formatEventDate('2026-03-31T23:45:00.000Z', '2026-04-01T01:15:00.000Z')).toBe(
      'Tue, Mar 31, 2026 • 7:45 PM - 9:15 PM'
    );
  });

  it('falls back to TBA labels for invalid dates', () => {
    expect(formatEventDate('not-a-date', null)).toBe('Date TBA • Time TBA');
  });

  it('builds canonical root-level flyer URLs', () => {
    expect(getEventFlyerUrl('spring-panel.PNG')).toBe(
      'https://cdn.example.com/event-flyers/spring-panel.PNG'
    );
    expect(getEventThumbnailUrl('spring-panel.PNG')).toBe(
      'https://cdn.example.com/event-flyers/thumbnails/spring-panel.jpg'
    );
    expect(getEventThumbnailUrl(null)).toBe('');
  });

  it('versions full-size and thumbnail URLs when event metadata changes', () => {
    const version = '2026-07-22T18:42:00.000Z';

    expect(getEventFlyerUrl('spring-panel.webp', version)).toBe(
      'https://cdn.example.com/event-flyers/spring-panel.webp?v=2026-07-22T18%3A42%3A00.000Z'
    );
    expect(getEventThumbnailUrl('spring-panel.webp', version)).toBe(
      'https://cdn.example.com/event-flyers/thumbnails/spring-panel.jpg?v=2026-07-22T18%3A42%3A00.000Z'
    );
  });

  it('keeps transitional nested flyer paths compatible', () => {
    expect(getEventFlyerUrl('events/spring-panel.webp')).toBe(
      'https://cdn.example.com/event-flyers/events/spring-panel.webp'
    );
    expect(getEventThumbnailUrl('events/spring-panel.webp')).toBe(
      'https://cdn.example.com/event-flyers/events/thumbnails/spring-panel.jpg'
    );
  });

  it('returns the next upcoming event sorted by start time', () => {
    const now = new Date('2026-03-31T12:00:00.000Z');
    const events = [
      makeEvent('future-late', '2026-04-03T16:00:00.000Z'),
      makeEvent('past', '2026-03-30T16:00:00.000Z'),
      makeEvent('future-early', '2026-04-01T16:00:00.000Z'),
    ];

    expect(getNextUpcomingEvent(events, now)?.id).toBe('future-early');
  });
});
