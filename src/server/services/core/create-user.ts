import { getCoreApi } from "@/lib/core-api";
import type { CreateUserDTO } from "@/server/contracts/users/create-user-schema";

export async function createUser(input: CreateUserDTO) {
  const api = await getCoreApi();
  const { data } = await api.post("/admin/users", input);

  return data;
}
