export const APP_TIME_ZONE = "America/Fortaleza";
const APP_TIME_ZONE_OFFSET_MINUTES = -3 * 60;
const EMPTY_DATE_VALUE = "-";
const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2})(?::(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?)?)?$/;

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  timeZone: APP_TIME_ZONE,
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: APP_TIME_ZONE,
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: APP_TIME_ZONE,
});

export function formatDateTime(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return dateTimeFormatter.format(date);
}

export function formatDate(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return dateFormatter.format(date);
}

export function formatTime(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return timeFormatter.format(date);
}

export function getDateTimestamp(value?: Date | string | null) {
  const date = parseDate(value);

  return date ? date.getTime() : null;
}

export const formatDateTimeBR = formatDateTime;
export const formatDateBR = formatDate;
export const formatTimeBR = formatTime;

function parseDate(value?: Date | string | null) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date ? value : parseStringDateInAppTimeZone(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function parseStringDateInAppTimeZone(value: string) {
  const normalizedValue = value.trim();

  if (hasExplicitTimezone(normalizedValue)) {
    return new Date(normalizedValue);
  }

  const localDate = parseLocalDateTime(normalizedValue);

  if (localDate) {
    return localDate;
  }

  return new Date(Number.NaN);
}

function parseLocalDateTime(value: string) {
  const match = LOCAL_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, yearPart, monthPart, dayPart, hourPart, minutePart, secondPart, ms] =
    match;
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  const hour = Number(hourPart ?? "0");
  const minute = Number(minutePart ?? "0");
  const second = Number(secondPart ?? "0");
  const millisecond = Number((ms ?? "0").slice(0, 3).padEnd(3, "0"));

  if (!isValidDatePart(year, month, day, hour, minute, second, millisecond)) {
    return null;
  }

  return new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond) -
      APP_TIME_ZONE_OFFSET_MINUTES * 60 * 1000,
  );
}

function isValidDatePart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
) {
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59 ||
    millisecond < 0 ||
    millisecond > 999
  ) {
    return false;
  }

  const checkDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
  );

  return (
    checkDate.getUTCFullYear() === year &&
    checkDate.getUTCMonth() === month - 1 &&
    checkDate.getUTCDate() === day &&
    checkDate.getUTCHours() === hour &&
    checkDate.getUTCMinutes() === minute &&
    checkDate.getUTCSeconds() === second &&
    checkDate.getUTCMilliseconds() === millisecond
  );
}

function hasExplicitTimezone(value: string) {
  return /(?:Z|[+-]\d{2}:?\d{2}|\bGMT\b|\bUTC\b)$/i.test(value);
}
