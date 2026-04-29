import { getCoreApi } from "@/lib/core-api";

export async function fetchUsers() {
  const api = await getCoreApi();
  const { data } = await api.get("/admin/users");
  return data;
}
