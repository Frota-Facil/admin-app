"use server";

import { revalidatePath } from "next/cache";
import { approveRequestUseCase } from "@/server/use-cases/approve-request-use-case";
import { rejectRequestUseCase } from "@/server/use-cases/reject-request-use-case";

function requestPath(vehicleId: string, requestId: string) {
  return `/vehicles/${vehicleId}/requests/${requestId}`;
}

export async function approveRequestAction(
  vehicleId: string,
  requestId: string,
) {
  await approveRequestUseCase(requestId);
  revalidatePath(`/vehicles/${vehicleId}/requests`);
  revalidatePath("/requests/pending");
  revalidatePath(requestPath(vehicleId, requestId));
}

export async function rejectRequestAction(
  vehicleId: string,
  requestId: string,
) {
  await rejectRequestUseCase(requestId);
  revalidatePath(`/vehicles/${vehicleId}/requests`);
  revalidatePath("/requests/pending");
  revalidatePath(requestPath(vehicleId, requestId));
}
