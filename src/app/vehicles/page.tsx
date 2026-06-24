import { VehiclesPanel } from "@/app/vehicles/vehicles-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

export default async function VehiclesPage() {
  const vehicles = await fetchVehiclesUseCase();

  return (
    <AdminLayout>
      <VehiclesPanel vehicles={vehicles} />
    </AdminLayout>
  );
}
