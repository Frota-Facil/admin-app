import { z } from "zod";
import { trackSchema } from "@/server/contracts/tracks/track-schema";

export const trackCreatedEventSchema = z.object({
  type: z.literal("track.created"),
  routeId: z.uuid(),
  track: z.preprocess(normalizeTrackPayload, trackSchema),
});

export type TrackCreatedEventDTO = z.infer<typeof trackCreatedEventSchema>;

function normalizeTrackPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const track = payload as Record<string, unknown>;

  return {
    ...track,
    capturedAt: track.capturedAt ?? track.createdAt,
    imageKey: track.imageKey ?? null,
    imageUrl: track.imageUrl ?? null,
    latitude: track.latitude ?? track.xCoordinate,
    longitude: track.longitude ?? track.yCoordinate,
  };
}
