import { z } from "zod";
import { VEHICLE_STATUSES } from "@/server/contracts/vehicles/status";
import { VEHICLE_TYPES } from "@/server/contracts/vehicles/type";

export const vehicleRequestSchema = z.object({
  plate: z.string().trim().min(1),
  model: z.string().trim().min(1),
  year: z.number().int(),
  odometer: z.number().nonnegative(),
  imageUrl: z.string().trim().nullable(),
  status: z.enum(VEHICLE_STATUSES),
  type: z.enum(VEHICLE_TYPES),
});

export type VehicleRequestDTO = z.infer<typeof vehicleRequestSchema>;
