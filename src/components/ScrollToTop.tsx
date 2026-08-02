import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const resetScrollPosition = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // Preserve the user's position on the first load; only reset after SPA navigation.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    resetScrollPosition();
  }, [pathname]);

  return null;
};
