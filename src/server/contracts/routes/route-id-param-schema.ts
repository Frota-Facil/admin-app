import { z } from "zod";

export const routeIdParamSchema = z.object({
  routeId: z.uuid(),
});
