import { getCoreApi } from "@/lib/core-api";

export async function fetchVehicles() {
  const api = await getCoreApi();
  const { data } = await api.get("/admin/vehicles");

  return data;
}
