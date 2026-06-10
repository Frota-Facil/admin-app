import { getCoreApi } from "@/lib/core-api";

export async function deleteVehicle(id: string) {
  const api = await getCoreApi();

  await api.delete(`/admin/vehicles/${id}`);
}
