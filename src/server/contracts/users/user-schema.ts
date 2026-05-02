import { z } from "zod";
import { userRoleEnum } from "@/server/contracts/users/user-role";

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  cpf: z.string(),
  cnh: z.string().min(11).max(11).nullish(),
  phone: z.string().min(10).max(14),
  department: z.string().nullish(),
  role: userRoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserResponseDTO = z.infer<typeof userSchema>;
