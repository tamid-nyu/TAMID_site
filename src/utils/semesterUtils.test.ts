import { describe, expect, it } from 'vitest';
import { semesterLabel, semesterSortKey } from './semesterUtils';

describe('semesterUtils', () => {
  it('sorts fall after spring in the same year', () => {
    expect(semesterSortKey('S26')).toBeLessThan(semesterSortKey('F26'));
  });

  it('converts semester codes to readable labels', () => {
    expect(semesterLabel('S26')).toBe('Spring 2026');
    expect(semesterLabel('F25')).toBe('Fall 2025');
  });
});
