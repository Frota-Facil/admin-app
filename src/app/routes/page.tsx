import { AdminLayout } from "@/components/layout/AdminLayout";
import type { RouteDTO } from "@/server/contracts/routes/route-schema";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchRoutesUseCase } from "@/server/use-cases/fetch-routes-use-case";
import { type RouteListItem, RoutesPanel } from "./routes-panel";

export default async function RoutesPage() {
  const routes = await fetchRoutesPageData();

  const routeItems: RouteListItem[] = routes.map((route) => ({
    date: route.date.toISOString(),
    department: route.driver.department ?? "Sem setor",
    destination: route.destination,
    driverName: route.driver.name,
    duration: route.duration,
    id: route.id,
    reason: route.reason,
    status: route.status,
    vehicleModel: route.vehicle.model,
    vehiclePlate: route.vehicle.plate,
  }));

  return (
    <AdminLayout>
      <RoutesPanel routes={routeItems} />
    </AdminLayout>
  );
}

async function fetchRoutesPageData(): Promise<RouteDTO[]> {
  try {
    return await fetchRoutesUseCase();
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}
