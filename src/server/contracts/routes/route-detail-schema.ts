import { z } from "zod";
import { requestWithRelationsResponseSchema } from "@/server/contracts/requests/request-response";
import { trackSchema } from "@/server/contracts/tracks/track-schema";

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

export const routeDetailSchema = z.object({
  id: z.uuid(),
  requestId: z.uuid(),
  status: z.enum(["PENDING", "READY", "STARTED", "FINISHED"]),
  description: z.string().nullish(),
  reportMarkdown: z.string().nullish(),
  startedAt: z.coerce.date().nullish(),
  finishedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  request: routeDetailRequestSchema,
  tracks: trackSchema.array(),
});

export type RouteDetailDTO = z.infer<typeof routeDetailSchema>;
