import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { fetchPendingRequestsUseCase } from "@/server/use-cases/fetch-pending-requests-use-case";

export default async function PendingRequestsPage() {
  const requests = await fetchPendingRequestsUseCase();

  return (
    <main>
      <div className="mb-4">
        <BackButton href="/requests" />
      </div>
      <h1>Requisições pendentes</h1>

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
