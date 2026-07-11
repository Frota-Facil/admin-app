import {
  type RequestListItem,
  RequestsPanel,
} from "@/app/requests/requests-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { RequestResponseDTO } from "@/server/contracts/requests/request-response";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchRequestsUseCase } from "@/server/use-cases/fetch-requests-use-case";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

export default async function RequestsPage() {
  const { requests, users, vehicles } = await fetchRequestsPageData();

  const usersById = new Map(users.map((user) => [user.id, user]));
  const vehiclesById = new Map(
    vehicles.map((vehicle) => [vehicle.id, vehicle]),
  );

  const requestItems: RequestListItem[] = requests.map((request) => {
    const user = usersById.get(request.userId);
    const vehicle = vehiclesById.get(request.vehicleId);

    return {
      department: user?.department ?? "Sem departamento",
      createdAt: request.createdAt.toISOString(),
      destination: request.destination ?? "",
      endDate: request.predictedEndDate.toISOString(),
      id: request.id,
      reason: request.reason,
      startDate: request.predictedStartDate.toISOString(),
      status: request.status,
      userId: request.userId,
      userName: user?.name ?? "Solicitante nao encontrado",
      vehicleId: request.vehicleId,
      vehicleModel: vehicle?.model ?? "Veiculo nao encontrado",
      vehiclePlate: vehicle?.plate ?? "-",
    };
  });

  return (
    <AdminLayout>
      <RequestsPanel requests={requestItems} />
    </AdminLayout>
  );
}

type RequestsPageData = {
  requests: RequestResponseDTO[];
  users: UserResponseDTO[];
  vehicles: VehicleResponseDTO[];
};

async function fetchRequestsPageData(): Promise<RequestsPageData> {
  try {
    const [requests, users, vehicles] = await Promise.all([
      fetchRequestsUseCase(),
      fetchUsersUseCase(),
      fetchVehiclesUseCase(),
    ]);

    return {
      requests,
      users,
      vehicles,
    };
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}
