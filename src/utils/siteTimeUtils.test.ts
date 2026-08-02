import { describe, expect, it } from 'vitest';
import { getCurrentSiteDateKey, getDateKeyInTimeZone } from './siteTimeUtils';

describe('siteTimeUtils', () => {
  it('returns the date key in the site timezone', () => {
    expect(getDateKeyInTimeZone(new Date('2026-05-10T03:30:00.000Z'))).toBe('2026-05-09');
  });

  it('supports explicit timezone overrides', () => {
    expect(getDateKeyInTimeZone(new Date('2026-05-10T03:30:00.000Z'), 'UTC')).toBe('2026-05-10');
  });

  it('uses the site timezone for current date keys', () => {
    expect(getCurrentSiteDateKey(new Date('2026-05-10T03:30:00.000Z'))).toBe('2026-05-09');
  });
});
