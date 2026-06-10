import { vehicleResponseSchema } from "@/server/contracts/vehicles/vehicle-response";
import { fetchVehicles } from "@/server/services/core/fetch-vehicle";

export async function fetchVehiclesUseCase() {
  const data = await fetchVehicles();

  return vehicleResponseSchema.array().parse(data);
}
