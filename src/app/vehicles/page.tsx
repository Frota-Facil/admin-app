import { VehiclesPanel } from "@/app/vehicles/vehicles-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

type VehiclesPageProps = {
  searchParams: Promise<{ details?: string }>;
};

export default async function VehiclesPage({
  searchParams,
}: VehiclesPageProps) {
  const { details } = await searchParams;
  const vehicles = await fetchVehiclesPageData();

  return (
    <AdminLayout>
      <VehiclesPanel initialSelectedVehicleId={details} vehicles={vehicles} />
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
