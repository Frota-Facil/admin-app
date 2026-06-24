import {
  type CreateUserDTO,
  createUserSchema,
} from "@/server/contracts/users/create-user-schema";
import { userSchema } from "@/server/contracts/users/user-schema";
import { createUser } from "@/server/services/core/create-user";

export async function createUserUseCase(input: CreateUserDTO) {
  const userData = createUserSchema.parse(input);
  const user = await createUser(userData);

  return userSchema.parse(user);
}
