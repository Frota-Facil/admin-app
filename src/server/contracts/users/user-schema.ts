import { z } from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  cpf: z.string(),
  cnh: z.string().min(11).max(11).nullish(),
  phone: z.string().min(10).max(14),
  photoUrl: z.string().nullable(),
  department: z.string().nullish(),
  role: z.string().trim().min(1).default("driver"),
  status: z.string().nullish(),
  active: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserResponseDTO = z.infer<typeof userSchema>;
