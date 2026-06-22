import { requestIdParamSchema } from "@/server/contracts/requests/request-id-param-schema";
import { fetchPendingRequestsUseCase } from "@/server/use-cases/fetch-pending-requests-use-case";

export async function fetchPendingRequestByIdUseCase(requestId: string) {
  const id = requestIdParamSchema.parse({ id: requestId }).id;
  const requests = await fetchPendingRequestsUseCase();

  return requests.find((request) => request.id === id);
}
