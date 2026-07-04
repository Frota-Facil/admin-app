import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type { AuditLogResponseDTO } from "@/server/contracts/audit-logs/audit-log-response";
import { fetchAuditLogsUseCase } from "@/server/use-cases/fetch-audit-logs-use-case";

const actionLabels: Record<string, string> = {
  "REQUEST.APPROVED": "Solicitação aprovada",
  "REQUEST.CREATED": "Solicitação criada",
  "REQUEST.REJECTED": "Solicitação recusada",
  REQUEST_APPROVED: "Solicitação aprovada",
  REQUEST_REJECTED: "Solicitação recusada",
  ROUTE_FINISHED: "Rota finalizada",
  ROUTE_STARTED: "Rota iniciada",
  "TRIP.FINISHED": "Rota finalizada",
  "TRIP.STARTED": "Rota iniciada",
  "USER.CREATED": "Usuário criado",
  "USER.DELETED": "Usuário excluído",
  "USER.UPDATED": "Usuário atualizado",
  USER_CREATED: "Usuário criado",
  USER_DELETED: "Usuário excluído",
  USER_UPDATED: "Usuário atualizado",
  "VEHICLE.CREATED": "Veículo criado",
  "VEHICLE.DELETED": "Veículo excluído",
  "VEHICLE.UPDATED": "Veículo atualizado",
  VEHICLE_CREATED: "Veículo criado",
  VEHICLE_DELETED: "Veículo excluído",
  VEHICLE_UPDATED: "Veículo atualizado",
};

const entityLabels: Record<string, string> = {
  REQUEST: "Solicitação",
  ROUTE: "Rota",
  TRIP: "Rota",
  USER: "Usuário",
  VEHICLE: "Veículo",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function LogsPage() {
  const { data: logs } = await fetchAuditLogsUseCase();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">
                Logs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Registro de atividades do sistema
              </p>
            </div>

            <NotificationBell />
          </div>
        </header>

        <div className="p-8">
          <AuditLogsTable logs={logs} />
        </div>
      </div>
    </AdminLayout>
  );
}

type AuditLogsTableProps = {
  logs: AuditLogResponseDTO[];
};

function AuditLogsTable({ logs }: AuditLogsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <TableHead>Data/Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Realizado por</TableHead>
              <TableHead>ID da entidade</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                  colSpan={5}
                >
                  Nenhum log disponível no momento.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr className="transition hover:bg-slate-50/80" key={log.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                    {formatAction(log.action)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {formatEntity(log.action)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    <span className="block max-w-[220px] truncate">
                      {formatPerformedBy(log.performedBy)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    <span className="block max-w-[260px] truncate font-mono text-xs">
                      {log.entityId ?? "-"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type TableHeadProps = {
  children: ReactNode;
};

function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-500">
      {children}
    </th>
  );
}

function formatDateTime(date: Date) {
  return dateFormatter.format(date);
}

function formatAction(action: string) {
  return actionLabels[action] ?? action;
}

function formatEntity(action: string) {
  const entity = action.split(/[._]/)[0];

  if (!entity) {
    return "-";
  }

  return entityLabels[entity] ?? entity;
}

function formatPerformedBy(performedBy: AuditLogResponseDTO["performedBy"]) {
  if (!performedBy) {
    return "-";
  }

  if (typeof performedBy === "string") {
    return performedBy;
  }

  return performedBy.name ?? performedBy.email ?? performedBy.id ?? "-";
}
