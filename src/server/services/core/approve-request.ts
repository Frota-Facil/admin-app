import { getCoreApi } from "@/lib/core-api";

export async function approveRequest(requestId: string) {
  const api = await getCoreApi();
  const { data } = await api.put(`/admin/requests/${requestId}/approve`, {});

  return data;
}
