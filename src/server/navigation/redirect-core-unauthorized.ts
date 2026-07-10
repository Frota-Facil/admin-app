import { redirect } from "next/navigation";
import { isCoreUnauthorizedError } from "@/server/services/core/auth-error";

export function redirectCoreUnauthorized(error: unknown): never {
  if (isCoreUnauthorizedError(error)) {
    redirect("/api/auth/logout?next=/login");
  }

  if (isNextRedirectError(error)) {
    throw error;
  }

  throw error;
}

export function isNextRedirectError(error: unknown) {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  const { digest } = error as { digest?: unknown };

  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}
