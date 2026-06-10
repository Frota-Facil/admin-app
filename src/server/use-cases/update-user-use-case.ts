import {
  type UpdateUserDTO,
  updateUserSchema,
} from "@/server/contracts/users/update-user-schema";
import { userIdParamSchema } from "@/server/contracts/users/user-id-param-schema";
import { userSchema } from "@/server/contracts/users/user-schema";
import { updateUser } from "@/server/services/core/update-user";

export async function updateUserUseCase(id: string, input: UpdateUserDTO) {
  const userId = userIdParamSchema.parse({ id }).id;
  const userData = updateUserSchema.parse(input);
  const user = await updateUser(userId, userData);

  return userSchema.parse(user);
}
