import { requestIdParamSchema } from "@/server/contracts/requests/request-id-param-schema";
import { requestResponseSchema } from "@/server/contracts/requests/request-response";
import { approveRequest } from "@/server/services/core/approve-request";

export async function approveRequestUseCase(requestId: string) {
  const id = requestIdParamSchema.parse({ id: requestId }).id;
  const data = await approveRequest(id);

  return requestResponseSchema.parse(data);
}
