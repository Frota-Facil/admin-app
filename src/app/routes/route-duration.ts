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

  const start = startedAt instanceof Date ? startedAt : new Date(startedAt);
  const finish = finishedAt instanceof Date ? finishedAt : new Date(finishedAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(finish.getTime())) {
    return null;
  }

  if (finish.getTime() < start.getTime()) {
    return null;
  }

  const durationInMinutes = Math.floor(
    (finish.getTime() - start.getTime()) / 60000,
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
