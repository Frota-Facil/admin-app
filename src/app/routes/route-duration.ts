import { getDateTimestamp } from "@/utils/date-format";

const finishedRouteStatuses = new Set([
  "COMPLETED",
  "CONCLUIDA",
  "CONCLUÍDA",
  "FINALIZADA",
  "FINISHED",
]);

export function formatRouteDuration(
  startedAt?: Date | string | null,
  finishedAt?: Date | string | null,
  status?: string,
) {
  if (status && !finishedRouteStatuses.has(status.trim().toUpperCase())) {
    return null;
  }

  if (!startedAt || !finishedAt) {
    return null;
  }

  const startTimestamp = getDateTimestamp(startedAt);
  const finishTimestamp = getDateTimestamp(finishedAt);

  if (startTimestamp === null || finishTimestamp === null) {
    return null;
  }

  if (finishTimestamp < startTimestamp) {
    return null;
  }

  const durationInMinutes = Math.floor(
    (finishTimestamp - startTimestamp) / 60000,
  );
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}
