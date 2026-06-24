import { getCoreApi } from "@/lib/core-api";
import { handleCoreAuthError } from "@/server/services/core/auth-error";

export async function fetchUsers() {
  const api = await getCoreApi({ requireToken: true });

  try {
    const { data } = await api.get("/admin/users");
    return data;
  } catch (error) {
    handleCoreAuthError(error);
    throw error;
  }
}
