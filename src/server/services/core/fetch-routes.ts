import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

export async function fetchRoutes() {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.get("/admin/routes");

    return data;
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
