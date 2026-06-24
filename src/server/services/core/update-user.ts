import { getCoreApi } from "@/lib/core-api";
import type { UpdateUserDTO } from "@/server/contracts/users/update-user-schema";

export async function updateUser(id: string, input: UpdateUserDTO) {
  const api = await getCoreApi();
  const { data } = await api.put(`/admin/users/${id}`, input);

  return data;
}
