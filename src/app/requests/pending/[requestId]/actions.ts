"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { approveRequestUseCase } from "@/server/use-cases/approve-request-use-case";
import { rejectRequestUseCase } from "@/server/use-cases/reject-request-use-case";

export async function approvePendingRequestAction(requestId: string) {
  await approveRequestUseCase(requestId);
  revalidatePath("/requests/pending");
  redirect("/requests/pending");
}

export async function rejectPendingRequestAction(requestId: string) {
  await rejectRequestUseCase(requestId);
  revalidatePath("/requests/pending");
  redirect("/requests/pending");
}
