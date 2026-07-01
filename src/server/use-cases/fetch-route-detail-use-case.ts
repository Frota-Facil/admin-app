import { routeDetailSchema } from "@/server/contracts/routes/route-detail-schema";
import { routeIdParamSchema } from "@/server/contracts/routes/route-id-param-schema";
import { fetchRouteDetail } from "@/server/services/core/fetch-route-detail";

export async function fetchRouteDetailUseCase(routeId: string) {
  const { routeId: id } = routeIdParamSchema.parse({ routeId });
  const data = await fetchRouteDetail(id);

  return routeDetailSchema.parse(data);
}
