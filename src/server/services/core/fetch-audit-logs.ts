import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

type FetchAuditLogsParams = {
  page?: number;
  perPage?: number;
};

export async function fetchAuditLogs({
  page = 1,
  perPage = 100,
}: FetchAuditLogsParams = {}) {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.get("/admin/audit-logs", {
      params: {
        page,
        perPage,
      },
    });

    return data;
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
