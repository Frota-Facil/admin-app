import { getCoreApi } from "@/lib/core-api";

export async function fetchUserById(id: string) {
  const api = await getCoreApi();
  const { data } = await api.get(`/admin/users/${id}`);

  return data;
}
