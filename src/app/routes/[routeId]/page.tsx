import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchRouteDetailUseCase } from "@/server/use-cases/fetch-route-detail-use-case";

type RouteDetailPageProps = {
  params: Promise<{ routeId: string }>;
};

export default async function RouteDetailPage({
  params,
}: RouteDetailPageProps) {
  const { routeId } = await params;
  const route = await fetchRouteDetailUseCase(routeId);

  return (
    <AdminLayout>
      <main>
        <Link href="/routes">Voltar</Link>
        <h1>Detalhes da rota</h1>

        <h2>Rota</h2>
        <dl>
          <dt>ID</dt>
          <dd>{route.id}</dd>
          <dt>Solicitação</dt>
          <dd>{route.requestId}</dd>
          <dt>Status</dt>
          <dd>{route.status}</dd>
          <dt>Descrição</dt>
          <dd>{route.description ?? "Sem descrição"}</dd>
          <dt>Relatório</dt>
          <dd>{route.reportMarkdown ?? "Sem relatório"}</dd>
          <dt>Iniciada em</dt>
          <dd>{formatDate(route.startedAt)}</dd>
          <dt>Finalizada em</dt>
          <dd>{formatDate(route.finishedAt)}</dd>
          <dt>Criada em</dt>
          <dd>{formatDate(route.createdAt)}</dd>
          <dt>Atualizada em</dt>
          <dd>{formatDate(route.updatedAt)}</dd>
        </dl>

        <h2>Solicitação</h2>
        <dl>
          <dt>ID</dt>
          <dd>{route.request.id}</dd>
          <dt>Usuário</dt>
          <dd>
            {route.request.user.name} ({route.request.userId})
          </dd>
          <dt>Veículo</dt>
          <dd>
            {route.request.vehicle.model} ({route.request.vehicleId})
          </dd>
          <dt>Aprovada por</dt>
          <dd>{route.request.approvedBy ?? "Não aprovada"}</dd>
          <dt>Status</dt>
          <dd>{route.request.status}</dd>
          <dt>Início previsto</dt>
          <dd>{formatDate(route.request.predictedStartDate)}</dd>
          <dt>Fim previsto</dt>
          <dd>{formatDate(route.request.predictedEndDate)}</dd>
          <dt>Destino</dt>
          <dd>{route.request.destination ?? "Sem destino"}</dd>
          <dt>Motivo</dt>
          <dd>{route.request.reason}</dd>
          <dt>Criada em</dt>
          <dd>{formatDate(route.request.createdAt)}</dd>
          <dt>Atualizada em</dt>
          <dd>{formatDate(route.request.updatedAt)}</dd>
        </dl>

        <h2>Tracks</h2>
        {route.tracks.length === 0 ? (
          <p>Nenhum track encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>X</th>
                <th>Y</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {route.tracks.map((track) => (
                <tr key={track.id}>
                  <td>{track.id}</td>
                  <td>{track.xCoordinate}</td>
                  <td>{track.yCoordinate}</td>
                  <td>{formatDate(track.createdAt)}</td>
                  <td>{formatDate(track.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </AdminLayout>
  );
}

function formatDate(value?: Date | null) {
  return value ? value.toLocaleString("pt-BR") : "Não informado";
}
