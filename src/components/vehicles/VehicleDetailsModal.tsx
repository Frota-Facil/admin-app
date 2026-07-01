"use client";

import type { ReactNode } from "react";
import { DetailsModal } from "@/components/ui/DetailsModal";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";

type VehicleDetailsModalProps = {
  driverName?: string | null;
  onClose: () => void;
  vehicle: VehicleResponseDTO;
};

type DisplayStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "UNAVAILABLE";

const statusLabels = {
  AVAILABLE: "Disponível",
  IN_USE: "Em Uso",
  MAINTENANCE: "Manutenção",
  UNAVAILABLE: "Indisponível",
} satisfies Record<DisplayStatus, string>;

const statusBadgeClasses = {
  AVAILABLE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  IN_USE: "border-blue-200 bg-blue-50 text-blue-700",
  MAINTENANCE: "border-amber-200 bg-amber-50 text-amber-700",
  UNAVAILABLE: "border-slate-200 bg-slate-100 text-slate-600",
} satisfies Record<DisplayStatus, string>;

const typeLabels: Record<string, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Motocicleta",
  TRUCK: "Caminhão",
  TRACTOR: "Trator",
  VAN: "Van",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function VehicleDetailsModal({
  driverName,
  onClose,
  vehicle,
}: VehicleDetailsModalProps) {
  return (
    <DetailsModal onClose={onClose} title="Detalhes do veículo">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          {vehicle.imageUrl ? (
            <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {/* biome-ignore lint/performance/noImgElement: remote vehicle image URLs are provided by the core service. */}
              <img
                alt={`Imagem do veículo ${vehicle.model}`}
                className="h-64 w-full object-cover"
                src={vehicle.imageUrl}
              />
            </figure>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-slate-500">
              <CarIcon className="h-10 w-10 text-slate-400" />
              <span className="text-sm font-semibold">
                Sem imagem do veículo
              </span>
            </div>
          )}
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <VehicleDetailItem label="Placa" value={vehicle.plate} />
          <VehicleDetailItem label="Modelo" value={vehicle.model} />
          <VehicleDetailItem label="Ano" value={vehicle.year} />
          <VehicleDetailItem
            label="Tipo"
            value={typeLabels[vehicle.type] ?? vehicle.type}
          />
          <VehicleDetailItem
            label="Quilometragem"
            value={`${numberFormatter.format(vehicle.odometer)} km`}
          />
          <VehicleDetailItem
            label="Status"
            value={<VehicleStatusBadge status={vehicle.status} />}
          />
          {driverName ? (
            <VehicleDetailItem label="Motorista vinculado" value={driverName} />
          ) : null}
          <VehicleDetailItem
            label="Cadastrado em"
            value={formatDateTime(vehicle.createdAt)}
          />
          <VehicleDetailItem
            label="Atualizado em"
            value={formatDateTime(vehicle.updatedAt)}
          />
        </dl>
      </div>
    </DetailsModal>
  );
}

type VehicleDetailItemProps = {
  label: string;
  value: ReactNode;
};

function VehicleDetailItem({ label, value }: VehicleDetailItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </dd>
    </div>
  );
}

type VehicleStatusBadgeProps = {
  status: string;
};

function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[normalizedStatus]}`}
      title={status}
    >
      {statusLabels[normalizedStatus]}
    </span>
  );
}

function normalizeStatus(status: string): DisplayStatus {
  const normalized = status.trim().toUpperCase();

  if (normalized === "AVAILABLE") {
    return "AVAILABLE";
  }

  if (normalized === "IN_USE" || normalized === "IN USE") {
    return "IN_USE";
  }

  if (normalized === "MAINTENANCE") {
    return "MAINTENANCE";
  }

  return "UNAVAILABLE";
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
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
