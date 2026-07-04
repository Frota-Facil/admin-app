import { paginatedAuditLogsResponseSchema } from "@/server/contracts/audit-logs/audit-log-response";
import { fetchAuditLogs } from "@/server/services/core/fetch-audit-logs";

export async function fetchAuditLogsUseCase() {
  const data = await fetchAuditLogs();
  const auditLogs = paginatedAuditLogsResponseSchema.parse(data);

  return {
    ...auditLogs,
    data: auditLogs.data
      .slice()
      .sort(
        (firstLog, secondLog) =>
          secondLog.createdAt.getTime() - firstLog.createdAt.getTime(),
      ),
  };
}
