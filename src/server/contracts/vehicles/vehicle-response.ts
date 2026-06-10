import { z } from "zod";
import { VEHICLE_STATUSES } from "./status";
import { VEHICLE_TYPES } from "./type";

export const vehicleResponseSchema = z.object({
  id: z.uuid(),
  plate: z.string(),
  model: z.string(),
  year: z.number(),
  odometer: z.number(),
  imageUrl: z.string().nullable(),
  status: z.enum(VEHICLE_STATUSES),
  type: z.enum(VEHICLE_TYPES),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type VehicleResponseDTO = z.infer<typeof vehicleResponseSchema>;
