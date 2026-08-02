export const SITE_TIME_ZONE = 'America/New_York';

const DATE_KEY_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const siteDateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  ...DATE_KEY_FORMATTER_OPTIONS,
  timeZone: SITE_TIME_ZONE,
});

export const getDateKeyInTimeZone = (date: Date, timeZone = SITE_TIME_ZONE): string => {
  const formatter =
    timeZone === SITE_TIME_ZONE
      ? siteDateKeyFormatter
      : new Intl.DateTimeFormat('en-CA', {
          ...DATE_KEY_FORMATTER_OPTIONS,
          timeZone,
        });
  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return formatter.format(date);
  }

  return `${year}-${month}-${day}`;
};

export const getCurrentSiteDateKey = (now = new Date()): string => {
  return getDateKeyInTimeZone(now, SITE_TIME_ZONE);
};
