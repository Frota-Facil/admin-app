import { AdminLayout } from "@/components/layout/AdminLayout";
import { MonitoringPanel } from "@/components/monitoring/MonitoringPanel";
import type { ActiveRouteItem } from "@/components/monitoring/types";
import type { RouteDTO } from "@/server/contracts/routes/route-schema";
import { fetchRoutesUseCase } from "@/server/use-cases/fetch-routes-use-case";

const activeRouteStatuses = new Set([
  "STARTED",
  "IN_PROGRESS",
  "EM_ANDAMENTO",
  "EM ANDAMENTO",
]);

export default async function MonitoringPage() {
  const routes = await fetchRoutesUseCase();
  const activeRoutes = routes
    .filter((route) => isActiveRoute(route.status))
    .map(toActiveRouteItem);

  return (
    <AdminLayout>
      <MonitoringPanel routes={activeRoutes} />
    </AdminLayout>
  );
}

function toActiveRouteItem(route: RouteDTO): ActiveRouteItem {
  return {
    date: route.date.toISOString(),
    destination: route.destination,
    driverName: route.driver.name,
    id: route.id,
    status: route.status,
    vehicleModel: route.vehicle.model,
    vehiclePlate: route.vehicle.plate,
  };
}

function isActiveRoute(status: string) {
  const normalizedStatus = status.trim().toUpperCase().replace(/-/g, "_");

  return activeRouteStatuses.has(normalizedStatus);
}
