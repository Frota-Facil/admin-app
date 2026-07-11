import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { TracksCard } from "@/components/routes/TracksCard";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import type { RouteDetailDTO } from "@/server/contracts/routes/route-detail-schema";
import { fetchRouteDetailUseCase } from "@/server/use-cases/fetch-route-detail-use-case";
import { formatRouteDuration } from "../route-duration";

type RouteDetailPageProps = {
  params: Promise<{ routeId: string }>;
};

type DisplayStatus =
  | "APPROVED"
  | "COMPLETED"
  | "FINISHED"
  | "PENDING"
  | "READY"
  | "REJECTED"
  | "STARTED";

const statusDisplay = {
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "Aprovada",
  },
  COMPLETED: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    label: "Concluída",
  },
  FINISHED: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    label: "Finalizada",
  },
  PENDING: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    label: "Pendente",
  },
  READY: {
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
    label: "Pronta",
  },
  REJECTED: {
    className: "border-red-200 bg-red-50 text-red-700",
    label: "Recusada",
  },
  STARTED: {
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
    label: "Iniciada",
  },
} satisfies Record<DisplayStatus, { className: string; label: string }>;

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const EMPTY_VALUE = "Não informado";

export default async function RouteDetailPage({
  params,
}: RouteDetailPageProps) {
  const { routeId } = await params;
  const route = await fetchRouteDetailUseCase(routeId);

  if (!route) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            actions={
              <div className="flex items-center gap-3">
                <StatusBadge status={route.status} />
                <NotificationBell />
              </div>
            }
            backHref="/routes"
            subtitle="Informações completas da rota finalizada"
            title="Detalhes da rota"
          />
        </header>

        <div className="space-y-5 p-8">
          <section className="grid gap-5 xl:grid-cols-2">
            <DetailCard title="Dados da rota">
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Status da rota"
                  value={<StatusBadge status={route.status} />}
                />
                <DetailItem
                  className="sm:col-span-2"
                  label="Descrição"
                  value={route.description || "-"}
                />
                <DetailItem
                  className="sm:col-span-2"
                  label="Relatório"
                  value={route.reportMarkdown || "Sem relatório"}
                />
                <DetailItem
                  label="Iniciada em"
                  value={formatDateTime(route.startedAt)}
                />
                <DetailItem
                  label="Finalizada em"
                  value={formatDateTime(route.finishedAt)}
                />
                <DetailItem
                  label="Criada em"
                  value={formatDateTime(route.createdAt)}
                />
                <DetailItem
                  label="Atualizada em"
                  value={formatDateTime(route.updatedAt)}
                />
              </dl>
            </DetailCard>

            <DetailCard title="Dados da solicitação">
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Usuário / Motorista"
                  value={route.request.user.name || EMPTY_VALUE}
                />
                <DetailItem
                  label="Veículo"
                  value={formatVehicle(route.request.vehicle)}
                />
                <DetailItem
                  label="Aprovada por"
                  value={route.request.approvedByUser?.name || EMPTY_VALUE}
                />
                <DetailItem
                  label="Status da solicitação"
                  value={<StatusBadge status={route.request.status} />}
                />
                <DetailItem
                  label="Início previsto"
                  value={formatDateTime(route.request.predictedStartDate)}
                />
                <DetailItem
                  label="Fim previsto"
                  value={formatDateTime(route.request.predictedEndDate)}
                />
                <DetailItem
                  className="sm:col-span-2"
                  label="Destino"
                  value={route.request.destination || "-"}
                />
                <DetailItem
                  className="sm:col-span-2"
                  label="Motivo / Finalidade"
                  value={route.request.reason || "-"}
                />
                <DetailItem
                  label="Criada em"
                  value={formatDateTime(route.request.createdAt)}
                />
                <DetailItem
                  label="Atualizada em"
                  value={formatDateTime(route.request.updatedAt)}
                />
              </dl>
            </DetailCard>
          </section>

          <SummaryCard route={route} />

          <TracksCard
            routeId={route.id}
            status={route.status}
            tracks={route.tracks}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

type SummaryCardProps = {
  route: RouteDetailDTO;
};

function SummaryCard({ route }: SummaryCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold tracking-normal text-slate-950">
        Resumo da viagem
      </h2>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryItem label="Motorista" value={route.request.user.name} />
        <SummaryItem
          label="Veículo"
          value={formatVehicle(route.request.vehicle)}
        />
        <SummaryItem label="Destino" value={route.request.destination || "-"} />
        <SummaryItem label="Finalidade" value={route.request.reason || "-"} />
        <SummaryItem
          label="Duração"
          value={
            formatRouteDuration(
              route.startedAt,
              route.finishedAt,
              route.status,
            ) ?? "—"
          }
        />
        <SummaryItem
          label="Status"
          value={<StatusBadge status={route.status} />}
        />
      </dl>
    </section>
  );
}

type DetailCardProps = {
  children: ReactNode;
  title: string;
};

function DetailCard({ children, title }: DetailCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold tracking-normal text-slate-950">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </article>
  );
}

type DetailItemProps = {
  className?: string;
  label: string;
  value?: ReactNode;
};

function DetailItem({ className = "", label, value }: DetailItemProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 ${className}`}
    >
      <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </dd>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value?: ReactNode;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-bold text-slate-950">
        {value || "-"}
      </dd>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const display = normalizedStatus
    ? statusDisplay[normalizedStatus]
    : {
        className: "border-slate-200 bg-slate-100 text-slate-600",
        label: status,
      };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${display.className}`}
      title={status}
    >
      {display.label}
    </span>
  );
}

function normalizeStatus(status: string): DisplayStatus | null {
  const normalized = status.trim().toUpperCase();

  if (normalized in statusDisplay) {
    return normalized as DisplayStatus;
  }

  return null;
}

function formatDateTime(value?: Date | string | null) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
}

function formatVehicle(vehicle: RouteDetailDTO["request"]["vehicle"]) {
  return `${vehicle.model} · ${vehicle.plate}`;
}
