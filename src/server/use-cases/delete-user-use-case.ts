import { userIdParamSchema } from "@/server/contracts/users/user-id-param-schema";
import { deleteUser } from "@/server/services/core/delete-user";

export async function deleteUserUseCase(id: string) {
  const userId = userIdParamSchema.parse({ id }).id;

  await deleteUser(userId);
}
