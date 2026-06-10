import {
  type VehicleRequestDTO,
  vehicleRequestSchema,
} from "@/server/contracts/vehicles/register-vehicle-request";
import { vehicleIdParamSchema } from "@/server/contracts/vehicles/vehicle-id-param-schema";
import { vehicleResponseSchema } from "@/server/contracts/vehicles/vehicle-response";
import { updateVehicle } from "@/server/services/core/update-vehicle";

export async function updateVehicleUseCase(
  id: string,
  input: VehicleRequestDTO,
) {
  const vehicleId = vehicleIdParamSchema.parse({ id }).id;
  const vehicleData = vehicleRequestSchema.parse(input);
  const vehicle = await updateVehicle(vehicleId, vehicleData);

  return vehicleResponseSchema.parse(vehicle);
}
