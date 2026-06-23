import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approveRequestAction,
  rejectRequestAction,
} from "@/app/vehicles/[id]/requests/actions";
import { fetchRequestByIdUseCase } from "@/server/use-cases/fetch-request-by-id-use-case";

type RequestDetailPageProps = {
  params: Promise<{ id: string; requestId: string }>;
};

export default async function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const { id, requestId } = await params;
  const request = await fetchRequestByIdUseCase(id, requestId);

  if (!request) {
    notFound();
  }

  return (
    <main>
      <Link href={`/vehicles/${id}/requests`}>Voltar</Link>
      <h1>Detalhes da requisição</h1>

      <dl>
        <dt>ID</dt>
        <dd>{request.id}</dd>
        <dt>Usuário</dt>
        <dd>
          <Link href={`/users/${request.user.id}/edit`}>
            {request.user.name}
          </Link>{" "}
          ({request.userId})
        </dd>
        <dt>Veículo</dt>
        <dd>
          {request.vehicle.model} ({request.vehicleId})
        </dd>
        <dt>Aprovada por</dt>
        <dd>{request.approvedBy ?? "Não aprovada"}</dd>
        <dt>Status</dt>
        <dd>{request.status}</dd>
        <dt>Início previsto</dt>
        <dd>{request.predictedStartDate.toLocaleString("pt-BR")}</dd>
        <dt>Fim previsto</dt>
        <dd>{request.predictedEndDate.toLocaleString("pt-BR")}</dd>
        <dt>Motivo</dt>
        <dd>{request.reason}</dd>
        <dt>Criada em</dt>
        <dd>{request.createdAt.toLocaleString("pt-BR")}</dd>
        <dt>Atualizada em</dt>
        <dd>{request.updatedAt.toLocaleString("pt-BR")}</dd>
      </dl>

      {request.status === "PENDING" && (
        <>
          <form action={approveRequestAction.bind(null, id, requestId)}>
            <button type="submit">Aprovar</button>
          </form>
          <form action={rejectRequestAction.bind(null, id, requestId)}>
            <button type="submit">Rejeitar</button>
          </form>
        </>
      )}
    </main>
  );
}
