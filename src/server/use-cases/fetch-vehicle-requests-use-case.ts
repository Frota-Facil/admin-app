import { requestWithRelationsResponseSchema } from "@/server/contracts/requests/request-response";
import { vehicleIdParamSchema } from "@/server/contracts/vehicles/vehicle-id-param-schema";
import { fetchVehicleRequests } from "@/server/services/core/fetch-vehicle-requests";

export async function fetchVehicleRequestsUseCase(vehicleId: string) {
  const id = vehicleIdParamSchema.parse({ id: vehicleId }).id;
  const data = await fetchVehicleRequests(id);

  return requestWithRelationsResponseSchema.array().parse(data);
}
