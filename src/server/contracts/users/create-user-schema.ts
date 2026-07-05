import { z } from "zod";
import { userRoleEnum } from "@/server/contracts/users/user-role";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  cpf: z.string().length(11),
  cnh: z.string().length(11).optional(),
  phone: z.string().min(10).max(14),
  photoUrl: z.string().nullable().optional(),
  department: z.string().optional(),
  role: userRoleEnum.default("driver"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
