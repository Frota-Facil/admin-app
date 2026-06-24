import { z } from "zod";
import { userRoleEnum } from "@/server/contracts/users/user-role";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  cpf: z.string().length(11).optional(),
  cnh: z.string().length(11).optional(),
  phone: z.string().min(10).max(14).optional(),
  department: z.string().optional(),
  role: userRoleEnum.optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
