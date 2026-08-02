import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrentTime } from './useCurrentTime';

describe('useCurrentTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-10T12:00:01.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current time and updates on the next aligned tick', () => {
    const { result } = renderHook(() => useCurrentTime(30_000));

    expect(result.current.toISOString()).toBe('2026-05-10T12:00:01.000Z');

    act(() => {
      vi.advanceTimersByTime(29_000);
    });

    expect(result.current.toISOString()).toBe('2026-05-10T12:00:30.000Z');

    vi.setSystemTime(new Date('2026-05-10T12:01:00.000Z'));

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current.toISOString()).toBe('2026-05-10T12:01:30.000Z');
  });
});
