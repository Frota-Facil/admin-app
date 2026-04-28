import { z } from "zod";

export const userRoleEnum = z.enum(["driver", "admin"]);

export type UserRole = z.infer<typeof userRoleEnum>;
