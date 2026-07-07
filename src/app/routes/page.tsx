import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchRoutesUseCase } from "@/server/use-cases/fetch-routes-use-case";
import { type RouteListItem, RoutesPanel } from "./routes-panel";

export default async function RoutesPage() {
  const routes = await fetchRoutesUseCase();

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
