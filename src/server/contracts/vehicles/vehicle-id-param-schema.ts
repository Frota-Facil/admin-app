import { z } from "zod";

export const vehicleIdParamSchema = z.object({
  id: z.uuid(),
});
