import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

export async function fetchRequestById(requestId: string) {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.get("/admin/requests");
    const requests = Array.isArray(data) ? data : [];

    return requests.find((request) => request.id === requestId);
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
