import { z } from "zod";

export const trackSchema = z.object({
  id: z.uuid(),
  routeId: z.uuid(),
  latitude: z.number(),
  longitude: z.number(),
  capturedAt: z.coerce.date(),
  imageUrl: z.string().nullable(),
  imageKey: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type TrackDTO = z.infer<typeof trackSchema>;
