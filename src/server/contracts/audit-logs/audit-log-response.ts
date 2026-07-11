import { z } from "zod";

const performedByUserSchema = z.object({
  email: z.string().nullish(),
  id: z.uuid().nullish(),
  name: z.string().nullish(),
});

const performedBySchema = z.union([z.uuid(), performedByUserSchema]).nullish();

export const auditLogResponseSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== "object") {
      return value;
    }

    const auditLog = value as Record<string, unknown>;

    return {
      ...auditLog,
      performedBy:
        auditLog.performedBy ??
        auditLog.performed_by ??
        auditLog.performedById ??
        auditLog.performed_by_id,
    };
  },
  z.object({
    action: z.string(),
    createdAt: z.coerce.date(),
    entityId: z.uuid().nullish(),
    id: z.uuid(),
    performedBy: performedBySchema,
  }),
);

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
