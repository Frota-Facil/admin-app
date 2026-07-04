"use client";

import { type ReactNode, useState } from "react";
import { BackButton } from "@/components/ui/BackButton";
import { UserDetailsModal } from "@/components/users/UserDetailsModal";
import { VehicleDetailsModal } from "@/components/vehicles/VehicleDetailsModal";
import type { RequestResponseDTO } from "@/server/contracts/requests/request-response";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";

type RequestDetailsPanelProps = {
  approver: UserResponseDTO | null;
  backHref: string;
  children?: ReactNode;
  request: RequestResponseDTO;
  user: UserResponseDTO | null;
  vehicle: VehicleResponseDTO | null;
};

type RequestDisplayStatus =
  | "APPROVED"
  | "COMPLETED"
  | "PENDING"
  | "READY"
  | "REJECTED";

const statusDisplay = {
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "Aprovada",
  },
  COMPLETED: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    label: "Concluída",
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
} satisfies Record<RequestDisplayStatus, { className: string; label: string }>;

const vehicleTypeLabels: Record<string, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Motocicleta",
  TRUCK: "Caminhão",
  TRACTOR: "Trator",
  VAN: "Van",
};

const vehicleStatusLabels: Record<string, string> = {
  AVAILABLE: "Disponível",
  IN_USE: "Em Uso",
  MAINTENANCE: "Manutenção",
  UNAVAILABLE: "Indisponível",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function RequestDetailsPanel({
  approver,
  backHref,
  children,
  request,
  user,
  vehicle,
}: RequestDetailsPanelProps) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const requesterName = user?.name ?? "Usuário não encontrado";
  const vehicleModel = vehicle?.model ?? "Veículo não encontrado";

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BackButton href={backHref} />
            <h1 className="mt-4 text-2xl font-bold tracking-normal text-slate-950">
              Detalhes da solicitação
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Informações completas da solicitação de veículo
            </p>
          </div>

          <RequestStatusBadge status={request.status} />
        </div>
      </header>

      <div className="space-y-5 p-8">
        <section className="grid gap-5 xl:grid-cols-2">
          <DetailCard title="Dados da solicitação">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Status"
                value={<RequestStatusBadge status={request.status} />}
              />
              <DetailItem
                label="Data da solicitação"
                value={formatDateTime(request.createdAt)}
              />
              <DetailItem
                label="Início previsto"
                value={formatDateTime(request.predictedStartDate)}
              />
              <DetailItem
                label="Fim previsto"
                value={formatDateTime(request.predictedEndDate)}
              />
              <DetailItem
                className="sm:col-span-2"
                label="Destino"
                value={request.destination || "Não informado"}
              />
              <DetailItem
                className="sm:col-span-2"
                label="Finalidade"
                value={request.reason || "Não informado"}
              />
              <DetailItem
                label="Criada em"
                value={formatDateTime(request.createdAt)}
              />
              <DetailItem
                label="Atualizada em"
                value={formatDateTime(request.updatedAt)}
              />
            </dl>
          </DetailCard>

          <DetailCard title="Motorista / Usuário">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                className="sm:col-span-2"
                label="Nome"
                value={
                  user ? (
                    <button
                      className="font-bold text-blue-700 transition hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      onClick={() => setIsUserModalOpen(true)}
                      type="button"
                    >
                      {requesterName}
                    </button>
                  ) : (
                    requesterName
                  )
                }
              />
              <DetailItem label="Departamento" value={user?.department} />
              <DetailItem label="E-mail" value={user?.email} />
              <DetailItem label="Telefone" value={formatPhone(user?.phone)} />
              <DetailItem label="CPF" value={user?.cpf} />
              <DetailItem label="CNH" value={user?.cnh} />
            </dl>
          </DetailCard>

          <DetailCard title="Veículo">
            <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
              {vehicle?.imageUrl ? (
                <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {/* biome-ignore lint/performance/noImgElement: remote vehicle image URLs are provided by the core service. */}
                  <img
                    alt={`Imagem do veículo ${vehicle.model}`}
                    className="h-40 w-full object-cover"
                    src={vehicle.imageUrl}
                  />
                </figure>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-slate-500">
                  <CarIcon className="h-8 w-8 text-slate-400" />
                  <span className="text-xs font-semibold">
                    Sem imagem do veículo
                  </span>
                </div>
              )}

              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  className="sm:col-span-2"
                  label="Modelo"
                  value={
                    vehicle ? (
                      <button
                        className="font-bold text-blue-700 transition hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        onClick={() => setIsVehicleModalOpen(true)}
                        type="button"
                      >
                        {vehicleModel}
                      </button>
                    ) : (
                      vehicleModel
                    )
                  }
                />
                <DetailItem label="Placa" value={vehicle?.plate} />
                <DetailItem label="Ano" value={vehicle?.year} />
                <DetailItem
                  label="Tipo"
                  value={
                    vehicle
                      ? (vehicleTypeLabels[vehicle.type] ?? vehicle.type)
                      : null
                  }
                />
                <DetailItem
                  label="Quilometragem"
                  value={
                    typeof vehicle?.odometer === "number"
                      ? `${numberFormatter.format(vehicle.odometer)} km`
                      : null
                  }
                />
                <DetailItem
                  label="Status"
                  value={
                    vehicle
                      ? (vehicleStatusLabels[vehicle.status] ?? vehicle.status)
                      : null
                  }
                />
              </dl>
            </div>
          </DetailCard>

          <DetailCard title="Aprovação">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                className="sm:col-span-2"
                label="Aprovado por"
                value={
                  request.approvedBy
                    ? (approver?.name ?? request.approvedBy)
                    : "Não aprovado ainda"
                }
              />
              <DetailItem
                label="Status da aprovação"
                value={
                  request.approvedBy
                    ? "Aprovada"
                    : normalizeStatus(request.status) === "REJECTED"
                      ? "Recusada"
                      : "Não aprovado ainda"
                }
              />
              <DetailItem
                label="Data de criação"
                value={formatDateTime(request.createdAt)}
              />
              <DetailItem
                label="Data de atualização"
                value={formatDateTime(request.updatedAt)}
              />
            </dl>
          </DetailCard>
        </section>

        {children ? (
          <section className="flex flex-wrap items-center justify-end gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
            {children}
          </section>
        ) : null}
      </div>

      {isUserModalOpen && user ? (
        <UserDetailsModal
          onClose={() => setIsUserModalOpen(false)}
          user={user}
        />
      ) : null}

      {isVehicleModalOpen && vehicle ? (
        <VehicleDetailsModal
          driverName={user?.name}
          onClose={() => setIsVehicleModalOpen(false)}
          vehicle={vehicle}
        />
      ) : null}
    </div>
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
      <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </dd>
    </div>
  );
}

type RequestStatusBadgeProps = {
  status: string;
};

function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const display = statusDisplay[normalizedStatus] ?? {
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

function normalizeStatus(status: string): RequestDisplayStatus {
  const normalized = status.trim().toUpperCase();

  if (normalized === "APPROVED") {
    return "APPROVED";
  }

  if (normalized === "READY") {
    return "READY";
  }

  if (normalized === "REJECTED") {
    return "REJECTED";
  }

  if (normalized === "COMPLETED") {
    return "COMPLETED";
  }

  return "PENDING";
}

function formatDateTime(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatPhone(phone?: string | null) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

type IconProps = {
  className?: string;
};

function CarIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.5 16.5h11M7.8 8h8.4l2.3 5H5.5L7.8 8ZM5 13h14a1.5 1.5 0 0 1 1.5 1.5V18H18l-.6-1.5H6.6L6 18H3.5v-3.5A1.5 1.5 0 0 1 5 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="7.5" cy="18" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
