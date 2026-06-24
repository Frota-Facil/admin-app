import { getCoreApi } from "@/lib/core-api";

export async function fetchPendingRequests() {
  const api = await getCoreApi();
  const { data } = await api.get("/admin/requests/pending");

  return data;
}
