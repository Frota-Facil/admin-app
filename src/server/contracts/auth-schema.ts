import { z } from "zod";

export const loginSchema = z.object({
  cpf: z
    .string()
    .length(11, "CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),

  senha: z.string().min(5, "Senha inválida"),
});
