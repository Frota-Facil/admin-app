import { z } from "zod";

const nullableRouteDateSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  z.coerce.date().nullish(),
);

export const routeSchema = z.preprocess(
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
    duration: z.string().nullable(),
    destination: z.string(),
    finishedAt: nullableRouteDateSchema,
    reason: z.string(),
    startedAt: nullableRouteDateSchema,
    status: z.string(),
  }),
);

export type RouteDTO = z.infer<typeof routeSchema>;
