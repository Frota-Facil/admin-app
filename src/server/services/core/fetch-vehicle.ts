import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

export async function fetchVehicles() {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.get("/admin/vehicles");

    return data;
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
