import { startTransition, useEffect, useState } from 'react';

export const useCurrentTime = (tickMs = 30_000): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId: number | undefined;

    const updateNow = () => {
      startTransition(() => {
        setNow(new Date());
      });
    };

    const startInterval = () => {
      intervalId = window.setInterval(updateNow, tickMs);
    };

    const timeoutId = window.setTimeout(
      () => {
        updateNow();
        startInterval();
      },
      tickMs - (Date.now() % tickMs)
    );

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [tickMs]);

  return now;
};
