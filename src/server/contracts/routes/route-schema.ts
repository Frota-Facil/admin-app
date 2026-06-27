import { z } from "zod";

export const routeSchema = z.object({
  id: z.uuid(),
  date: z.coerce.date(),
  vehicle: z.object({
    id: z.uuid(),
    model: z.string(),
    plate: z.string(),
  }),
  driver: z.object({
    id: z.uuid(),
    name: z.string(),
    department: z.string().nullish(),
  }),
  duration: z.string(),
  destination: z.string(),
  reason: z.string(),
  status: z.string(),
});

export type RouteDTO = z.infer<typeof routeSchema>;
