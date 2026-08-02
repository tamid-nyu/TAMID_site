import { EVENT_FLYERS_BUCKET } from '@constants';
import type { Event } from '@types';
import { getMediaThumbnailPath } from './mediaUtils';
import { SITE_TIME_ZONE } from './siteTimeUtils';

const EVENT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE_TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const EVENT_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const INVALID_EVENT_DATE_LABEL = 'Date TBA';
const INVALID_EVENT_TIME_LABEL = 'Time TBA';

const getValidDate = (value: string): Date | null => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getEventTimestamp = (value: string): number | null => {
  const date = getValidDate(value);
  return date ? date.getTime() : null;
};

const getSortableTimestamp = (value: string): number => {
  return getEventTimestamp(value) ?? Number.POSITIVE_INFINITY;
};

export const formatEventDate = (startTime: string, endTime: string | null): string => {
  return `${formatEventDateOnly(startTime)} • ${formatEventTimeOnly(startTime, endTime)}`;
};

export const formatEventDateOnly = (startTime: string): string => {
  const start = getValidDate(startTime);
  return start ? EVENT_DATE_FORMATTER.format(start) : INVALID_EVENT_DATE_LABEL;
};

export const formatEventTimeOnly = (startTime: string, endTime: string | null): string => {
  const start = getValidDate(startTime);
  if (!start) return INVALID_EVENT_TIME_LABEL;

  const startLabel = EVENT_TIME_FORMATTER.format(start);

  if (!endTime) return startLabel;

  const end = getValidDate(endTime);
  if (!end) return startLabel;

  const endLabel = EVENT_TIME_FORMATTER.format(end);
  return `${startLabel} - ${endLabel}`;
};

const appendAssetVersion = (url: string, version?: string): string => {
  if (!version) return url;
  return `${url}?v=${encodeURIComponent(version)}`;
};

export const getEventFlyerUrl = (filename: string | null, version?: string): string => {
  if (!filename) return '';
  return appendAssetVersion(`${EVENT_FLYERS_BUCKET}${filename}`, version);
};

export const getEventThumbnailUrl = (filename: string | null, version?: string): string => {
  if (!filename) return '';
  return appendAssetVersion(`${EVENT_FLYERS_BUCKET}${getMediaThumbnailPath(filename)}`, version);
};

export const compareEventStarts = (
  a: Pick<Event, 'startTime'>,
  b: Pick<Event, 'startTime'>
): number => {
  return getSortableTimestamp(a.startTime) - getSortableTimestamp(b.startTime);
};

export const isEventUpcoming = (event: Pick<Event, 'startTime'>, now = new Date()): boolean => {
  const startTimestamp = getEventTimestamp(event.startTime);
  return startTimestamp !== null && startTimestamp >= now.getTime();
};

export const isEventPast = (event: Pick<Event, 'startTime'>, now = new Date()): boolean => {
  const startTimestamp = getEventTimestamp(event.startTime);
  return startTimestamp !== null && startTimestamp < now.getTime();
};

export const getNextUpcomingEvent = (events: Event[], now = new Date()): Event | null => {
  const upcomingEvents = events
    .filter((event) => isEventUpcoming(event, now))
    .sort(compareEventStarts);

  return upcomingEvents[0] ?? null;
};
