import { getCoreApi } from "@/lib/core-api";

export async function rejectRequest(requestId: string) {
  const api = await getCoreApi();
  const { data } = await api.put(`/admin/requests/${requestId}/reject`, {});

  return data;
}
