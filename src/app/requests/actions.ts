"use server";

import { revalidatePath } from "next/cache";
import { approveRequestUseCase } from "@/server/use-cases/approve-request-use-case";
import { rejectRequestUseCase } from "@/server/use-cases/reject-request-use-case";

export async function approveRequestAction(requestId: string) {
  await approveRequestUseCase(requestId);
  revalidatePath("/requests");
  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/requests/pending");
}

export async function rejectRequestAction(requestId: string) {
  await rejectRequestUseCase(requestId);
  revalidatePath("/requests");
  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/requests/pending");
}
