import { requestIdParamSchema } from "@/server/contracts/requests/request-id-param-schema";
import { requestResponseSchema } from "@/server/contracts/requests/request-response";
import { fetchRequestById } from "@/server/services/core/fetch-request-by-id";

export async function fetchRequestByIdUseCase(requestId: string) {
  const id = requestIdParamSchema.parse({ id: requestId }).id;
  const request = await fetchRequestById(id);

  return request ? requestResponseSchema.parse(request) : null;
}
