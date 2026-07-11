const DATE_TIME_ZONE = "America/Fortaleza";
const EMPTY_DATE_VALUE = "--";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  timeZone: DATE_TIME_ZONE,
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: DATE_TIME_ZONE,
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: DATE_TIME_ZONE,
});

export function formatDateTimeBR(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return dateTimeFormatter.format(date);
}

export function formatDateBR(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return dateFormatter.format(date);
}

export function formatTimeBR(value?: Date | string | null) {
  const date = parseDate(value);

  if (!date) {
    return EMPTY_DATE_VALUE;
  }

  return timeFormatter.format(date);
}

function parseDate(value?: Date | string | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}
