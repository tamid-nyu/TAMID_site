import { describe, expect, it } from 'vitest';
import { hasActionableRsvpLink } from './Events';

describe('hasActionableRsvpLink', () => {
  it('rejects missing and placeholder RSVP links', () => {
    expect(hasActionableRsvpLink(null)).toBe(false);
    expect(hasActionableRsvpLink('')).toBe(false);
    expect(hasActionableRsvpLink('#')).toBe(false);
    expect(hasActionableRsvpLink('  #  ')).toBe(false);
  });

  it('accepts a real RSVP link', () => {
    expect(hasActionableRsvpLink('https://example.com/rsvp')).toBe(true);
  });
});
