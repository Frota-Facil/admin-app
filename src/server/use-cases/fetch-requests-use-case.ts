import { requestResponseSchema } from "@/server/contracts/requests/request-response";
import { fetchRequests } from "@/server/services/core/fetch-requests";

export async function fetchRequestsUseCase() {
  const data = await fetchRequests();

  return requestResponseSchema.array().parse(data);
}
