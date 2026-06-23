import { requestWithRelationsResponseSchema } from "@/server/contracts/requests/request-response";
import { fetchPendingRequests } from "@/server/services/core/fetch-pending-requests";

export async function fetchPendingRequestsUseCase() {
  const data = await fetchPendingRequests();

  return requestWithRelationsResponseSchema.array().parse(data);
}
