"use client";

import { type ReactNode, useMemo, useState } from "react";
import { UserDetailsModal } from "@/components/users/UserDetailsModal";
import type { AuditLogResponseDTO } from "@/server/contracts/audit-logs/audit-log-response";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import { formatDateTime } from "@/utils/date-format";

type LogsPanelProps = {
  logs: AuditLogResponseDTO[];
  users: UserResponseDTO[];
};

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

export function LogsPanel({ logs, users }: LogsPanelProps) {
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );

  const usersById = useMemo(() => {
    return new Map(users.map((user) => [user.id, user]));
  }, [users]);

  return (
    <>
      <AuditLogsTable
        logs={logs}
        onSelectUser={setSelectedUser}
        usersById={usersById}
      />

      {selectedUser ? (
        <UserDetailsModal
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      ) : null}
    </>
  );
}

type AuditLogsTableProps = {
  logs: AuditLogResponseDTO[];
  onSelectUser: (user: UserResponseDTO) => void;
  usersById: Map<string, UserResponseDTO>;
};

function AuditLogsTable({
  logs,
  onSelectUser,
  usersById,
}: AuditLogsTableProps) {
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
                    <PerformedByCell
                      onSelectUser={onSelectUser}
                      performedBy={log.performedBy}
                      usersById={usersById}
                    />
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

type PerformedByCellProps = {
  onSelectUser: (user: UserResponseDTO) => void;
  performedBy: AuditLogResponseDTO["performedBy"];
  usersById: Map<string, UserResponseDTO>;
};

function PerformedByCell({
  onSelectUser,
  performedBy,
  usersById,
}: PerformedByCellProps) {
  const performedById = getPerformedById(performedBy);
  const user = performedById ? usersById.get(performedById) : null;
  const fallbackName =
    typeof performedBy === "object"
      ? (performedBy?.name ?? performedBy?.email)
      : null;

  if (user) {
    return (
      <button
        className="block max-w-[220px] cursor-pointer truncate font-semibold text-blue-700 transition hover:text-blue-800 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-100"
        onClick={() => onSelectUser(user)}
        title={`Ver detalhes de ${user.name}`}
        type="button"
      >
        {user.name}
      </button>
    );
  }

  if (performedById) {
    return (
      <span className="block max-w-[220px] truncate text-slate-500">
        Usuário não encontrado
      </span>
    );
  }

  if (fallbackName) {
    return (
      <span className="block max-w-[220px] truncate font-semibold text-slate-700">
        {fallbackName}
      </span>
    );
  }

  return (
    <span className="block max-w-[220px] truncate text-slate-500">
      Usuário não encontrado
    </span>
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

function getPerformedById(performedBy: AuditLogResponseDTO["performedBy"]) {
  if (!performedBy) {
    return null;
  }

  if (typeof performedBy === "string") {
    return performedBy;
  }

  return performedBy.id ?? null;
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
