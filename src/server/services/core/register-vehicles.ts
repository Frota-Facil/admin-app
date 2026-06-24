import { getCoreApi } from "@/lib/core-api";
import type { VehicleRequestDTO } from "@/server/contracts/vehicles/register-vehicle-request";

export async function registerVehicle(input: VehicleRequestDTO) {
  const api = await getCoreApi();
  const { data } = await api.post("/admin/vehicles", input);

  return data;
}
