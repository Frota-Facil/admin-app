import { z } from "zod";

const performedByUserSchema = z.object({
  email: z.string().nullish(),
  id: z.uuid().nullish(),
  name: z.string().nullish(),
});

export const auditLogResponseSchema = z.object({
  action: z.string(),
  createdAt: z.coerce.date(),
  entityId: z.uuid().nullish(),
  id: z.uuid(),
  performedBy: z.union([z.uuid(), performedByUserSchema]).nullish(),
});

export type AuditLogResponseDTO = z.infer<typeof auditLogResponseSchema>;

export const paginatedAuditLogsResponseSchema = z.object({
  data: auditLogResponseSchema.array(),
  pagination: z.object({
    page: z.number().int().positive(),
    perPage: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type PaginatedAuditLogsResponseDTO = z.infer<
  typeof paginatedAuditLogsResponseSchema
>;
