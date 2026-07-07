import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import { fetchVehicleByIdUseCase } from "@/server/use-cases/fetch-vehicle-by-id-use-case";
import { fetchVehicleRequestsUseCase } from "@/server/use-cases/fetch-vehicle-requests-use-case";

type VehicleRequestsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VehicleRequestsPage({
  params,
}: VehicleRequestsPageProps) {
  const { id } = await params;
  const vehicle = await fetchVehicleByIdUseCase(id);

  if (!vehicle) {
    notFound();
  }

  const requests = await fetchVehicleRequestsUseCase(id);

  return (
    <main>
      <PageBackHeader
        backHref="/vehicles"
        className="mb-4"
        subtitle={`${vehicle.model} - ${vehicle.plate}`}
        title="Requisições do veículo"
      />

      {requests.length === 0 ? (
        <p>Nenhuma requisição encontrada.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <Link href={`/vehicles/${id}/requests/${request.id}`}>
                {request.predictedStartDate.toLocaleString("pt-BR")} -{" "}
                {request.predictedEndDate.toLocaleString("pt-BR")}
              </Link>{" "}
              - {request.status} - Usuário:{" "}
              <Link href={`/users/${request.user.id}/edit`}>
                {request.user.name}
              </Link>{" "}
              - Veículo: {request.vehicle.model}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
