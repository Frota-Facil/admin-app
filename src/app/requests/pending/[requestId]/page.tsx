import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approvePendingRequestAction,
  rejectPendingRequestAction,
} from "@/app/requests/pending/[requestId]/actions";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import { fetchPendingRequestByIdUseCase } from "@/server/use-cases/fetch-pending-request-by-id-use-case";

type PendingRequestDetailPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function PendingRequestDetailPage({
  params,
}: PendingRequestDetailPageProps) {
  const { requestId } = await params;
  const request = await fetchPendingRequestByIdUseCase(requestId);

  if (!request) {
    notFound();
  }

  return (
    <main>
      <PageBackHeader
        backHref="/requests/pending"
        className="mb-4"
        title="Detalhes da requisição pendente"
      />

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

      <form action={approvePendingRequestAction.bind(null, requestId)}>
        <button type="submit">Aprovar</button>
      </form>
      <form action={rejectPendingRequestAction.bind(null, requestId)}>
        <button type="submit">Rejeitar</button>
      </form>
    </main>
  );
}
