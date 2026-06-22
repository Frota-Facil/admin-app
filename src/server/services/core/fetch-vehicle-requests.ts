import { getCoreApi } from "@/lib/core-api";

export async function fetchVehicleRequests(vehicleId: string) {
  const api = await getCoreApi();
  const { data } = await api.get(`/admin/requests/${vehicleId}`);

  return data;
}
