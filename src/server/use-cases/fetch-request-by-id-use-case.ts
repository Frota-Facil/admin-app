import { requestIdParamSchema } from "@/server/contracts/requests/request-id-param-schema";
import { fetchVehicleRequestsUseCase } from "@/server/use-cases/fetch-vehicle-requests-use-case";

export async function fetchRequestByIdUseCase(
  vehicleId: string,
  requestId: string,
) {
  const id = requestIdParamSchema.parse({ id: requestId }).id;
  const requests = await fetchVehicleRequestsUseCase(vehicleId);

  return requests.find((request) => request.id === id);
}
