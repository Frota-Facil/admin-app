import { z } from "zod";
import { requestWithRelationsResponseSchema } from "@/server/contracts/requests/request-response";
import { trackSchema } from "@/server/contracts/tracks/track-schema";

const nullableRouteDateSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  z.coerce.date().nullish(),
);

const routeDetailRequestSchema = requestWithRelationsResponseSchema.extend({
  vehicle: z.object({
    id: z.uuid(),
    model: z.string(),
    plate: z.string(),
  }),
  approvedByUser: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullish(),
});

export const routeDetailSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== "object") {
      return value;
    }

    const route = value as Record<string, unknown>;

    return {
      ...route,
      finishedAt:
        route.finishedAt ?? route.finished_at ?? route.finalizadaEm ?? null,
      startedAt:
        route.startedAt ?? route.started_at ?? route.iniciadaEm ?? null,
    };
  },
  z.object({
    id: z.uuid(),
    requestId: z.uuid(),
    status: z.enum(["PENDING", "READY", "STARTED", "FINISHED"]),
    description: z.string().nullish(),
    reportMarkdown: z.string().nullish(),
    startedAt: nullableRouteDateSchema,
    finishedAt: nullableRouteDateSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    request: routeDetailRequestSchema,
    tracks: trackSchema.array(),
  }),
);

export type RouteDetailDTO = z.infer<typeof routeDetailSchema>;
