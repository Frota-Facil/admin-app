import { vehicleIdParamSchema } from "@/server/contracts/vehicles/vehicle-id-param-schema";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

export async function fetchVehicleByIdUseCase(id: string) {
  const vehicleId = vehicleIdParamSchema.parse({ id }).id;
  const vehicles = await fetchVehiclesUseCase();

  return vehicles.find((vehicle) => vehicle.id === vehicleId);
}
