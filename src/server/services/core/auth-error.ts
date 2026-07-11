import axios from "axios";

export class CoreUnauthorizedError extends Error {
  constructor() {
    super("Core service returned 401.");
    this.name = "CoreUnauthorizedError";
  }
}

export function isCoreUnauthorizedError(
  error: unknown,
): error is CoreUnauthorizedError {
  return error instanceof CoreUnauthorizedError;
}

export function handleCoreAuthError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    throw new CoreUnauthorizedError();
  }
}
