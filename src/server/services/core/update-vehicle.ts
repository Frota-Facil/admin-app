import { getCoreApi } from "@/lib/core-api";
import type { VehicleRequestDTO } from "@/server/contracts/vehicles/register-vehicle-request";

export async function updateVehicle(id: string, input: VehicleRequestDTO) {
  const api = await getCoreApi();
  const { data } = await api.put(`/admin/vehicles/${id}`, input);

  return data;
}
