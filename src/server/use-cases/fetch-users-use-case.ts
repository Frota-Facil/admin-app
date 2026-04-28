import { userSchema } from "@/server/contracts/users/user-schema";
import { fetchUsers } from "@/server/services/core/fetch-users";

export async function fetchUsersUseCase() {
  const data = await fetchUsers();
  const users = userSchema.array().parse(data);
  return users;
}
