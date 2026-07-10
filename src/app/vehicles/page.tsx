import { VehiclesPanel } from "@/app/vehicles/vehicles-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

export default async function VehiclesPage() {
  const vehicles = await fetchVehiclesPageData();

  return (
    <AdminLayout>
      <VehiclesPanel vehicles={vehicles} />
    </AdminLayout>
  );
}

async function fetchVehiclesPageData(): Promise<VehicleResponseDTO[]> {
  try {
    return await fetchVehiclesUseCase();
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}
