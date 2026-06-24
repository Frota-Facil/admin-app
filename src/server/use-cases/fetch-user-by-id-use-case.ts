import { userIdParamSchema } from "@/server/contracts/users/user-id-param-schema";
import { userSchema } from "@/server/contracts/users/user-schema";
import { fetchUserById } from "@/server/services/core/fetch-user-by-id";

export async function fetchUserByIdUseCase(id: string) {
  const userId = userIdParamSchema.parse({ id }).id;
  const user = await fetchUserById(userId);

  return userSchema.parse(user);
}
