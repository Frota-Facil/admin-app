import axios from "axios";
import { redirect } from "next/navigation";

export function handleCoreAuthError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    redirect("/api/auth/logout?next=/login");
  }
}
