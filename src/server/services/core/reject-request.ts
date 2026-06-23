import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

export async function rejectRequest(requestId: string) {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.put(`/admin/requests/${requestId}/reject`, {});
    return data;
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
