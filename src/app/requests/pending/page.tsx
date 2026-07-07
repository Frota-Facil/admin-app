import Link from "next/link";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import { fetchPendingRequestsUseCase } from "@/server/use-cases/fetch-pending-requests-use-case";

export default async function PendingRequestsPage() {
  const requests = await fetchPendingRequestsUseCase();

  return (
    <main>
      <PageBackHeader
        backHref="/requests"
        className="mb-4"
        title="Requisições pendentes"
      />

      {requests.length === 0 ? (
        <p>Nenhuma requisição pendente encontrada.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <Link href={`/requests/pending/${request.id}`}>
                {request.predictedStartDate.toLocaleString("pt-BR")} -{" "}
                {request.predictedEndDate.toLocaleString("pt-BR")}
              </Link>{" "}
              - Usuário:{" "}
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
