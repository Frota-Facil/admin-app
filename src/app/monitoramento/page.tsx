import { AdminLayout } from "@/components/layout/AdminLayout";
import { MonitoringPanel } from "@/components/monitoring/MonitoringPanel";
import type { ActiveRouteItem } from "@/components/monitoring/types";
import type { RouteDTO } from "@/server/contracts/routes/route-schema";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchRoutesUseCase } from "@/server/use-cases/fetch-routes-use-case";

const activeRouteStatuses = new Set([
  "STARTED",
  "IN_PROGRESS",
  "EM_ANDAMENTO",
  "EM ANDAMENTO",
]);

type MonitoringPageProps = {
  searchParams?: Promise<{
    routeId?: string | string[];
  }>;
};

export default async function MonitoringPage({
  searchParams,
}: MonitoringPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialRouteId = getRouteIdParam(resolvedSearchParams?.routeId);
  const routes = await fetchMonitoringPageData();
  const activeRoutes = routes
    .filter((route) => isActiveRoute(route.status))
    .map(toActiveRouteItem);

  return (
    <AdminLayout>
      <MonitoringPanel
        initialSelectedRouteId={initialRouteId}
        routes={activeRoutes}
      />
    </AdminLayout>
  );
}

async function fetchMonitoringPageData(): Promise<RouteDTO[]> {
  try {
    return await fetchRoutesUseCase();
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}

function getRouteIdParam(routeId?: string | string[]) {
  if (Array.isArray(routeId)) {
    return routeId[0] ?? null;
  }

  return routeId ?? null;
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
