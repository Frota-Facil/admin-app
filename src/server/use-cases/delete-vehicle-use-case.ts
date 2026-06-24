import { vehicleIdParamSchema } from "@/server/contracts/vehicles/vehicle-id-param-schema";
import { deleteVehicle } from "@/server/services/core/delete-vehicle";

export async function deleteVehicleUseCase(id: string) {
  const vehicleId = vehicleIdParamSchema.parse({ id }).id;

  await deleteVehicle(vehicleId);
}
