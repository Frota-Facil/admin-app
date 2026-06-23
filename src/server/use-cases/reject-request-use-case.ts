import { requestIdParamSchema } from "@/server/contracts/requests/request-id-param-schema";
import { requestResponseSchema } from "@/server/contracts/requests/request-response";
import { rejectRequest } from "@/server/services/core/reject-request";

export async function rejectRequestUseCase(requestId: string) {
  const id = requestIdParamSchema.parse({ id: requestId }).id;
  const data = await rejectRequest(id);

  return requestResponseSchema.parse(data);
}
