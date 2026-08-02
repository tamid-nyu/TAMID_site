import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgressiveImage } from './useProgressiveImage';

type Listener = () => void;

class TestImage {
  static instances: TestImage[] = [];

  complete = false;
  src = '';
  private listeners = new Map<string, Listener>();

  constructor() {
    TestImage.instances.push(this);
  }

  addEventListener(type: string, listener: Listener) {
    this.listeners.set(type, listener);
  }

  removeEventListener(type: string) {
    this.listeners.delete(type);
  }

  triggerLoad() {
    this.complete = true;
    this.listeners.get('load')?.();
  }
}

describe('useProgressiveImage', () => {
  const originalImage = window.Image;

  beforeEach(() => {
    TestImage.instances = [];
    vi.stubGlobal('Image', TestImage);
  });

  afterEach(() => {
    vi.stubGlobal('Image', originalImage);
  });

  it('starts with the thumbnail and swaps to the full image after it loads', () => {
    const { result } = renderHook(() => useProgressiveImage('/thumb.jpg', '/full.jpg'));

    expect(result.current).toEqual({ currentSrc: '/thumb.jpg', isFullLoaded: false });
    expect(TestImage.instances[0]?.src).toBe('/full.jpg');

    act(() => {
      TestImage.instances[0]?.triggerLoad();
    });

    expect(result.current).toEqual({ currentSrc: '/full.jpg', isFullLoaded: true });
  });

  it('resets when no full image is available', () => {
    const { result, rerender } = renderHook(
      ({ thumbnailSrc, fullSrc }) => useProgressiveImage(thumbnailSrc, fullSrc),
      { initialProps: { thumbnailSrc: '/thumb.jpg', fullSrc: '/full.jpg' as string | null } }
    );

    act(() => {
      TestImage.instances[0]?.triggerLoad();
    });

    expect(result.current.isFullLoaded).toBe(true);

    rerender({ thumbnailSrc: '/next-thumb.jpg', fullSrc: null });

    expect(result.current).toEqual({ currentSrc: '/next-thumb.jpg', isFullLoaded: false });
  });
});
