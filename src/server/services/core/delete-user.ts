import { getCoreApi } from "@/lib/core-api";

export async function deleteUser(id: string) {
  const api = await getCoreApi();
  await api.delete(`/admin/users/${id}`);
}
