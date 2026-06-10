import {
  type VehicleRequestDTO,
  vehicleRequestSchema,
} from "@/server/contracts/vehicles/register-vehicle-request";
import { vehicleResponseSchema } from "@/server/contracts/vehicles/vehicle-response";
import { registerVehicle } from "@/server/services/core/register-vehicles";

export async function registerVehicleUseCase(input: VehicleRequestDTO) {
  const vehicleData = vehicleRequestSchema.parse(input);
  const vehicle = await registerVehicle(vehicleData);

  return vehicleResponseSchema.parse(vehicle);
}
