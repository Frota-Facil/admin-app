import { routeSchema } from "@/server/contracts/routes/route-schema";
import { fetchRoutes } from "@/server/services/core/fetch-routes";

export async function fetchRoutesUseCase() {
  const data = await fetchRoutes();

  return routeSchema.array().parse(data);
}
