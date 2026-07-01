"use client";

import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { deleteVehicleAction } from "@/app/vehicles/actions";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { VehicleDetailsModal } from "@/components/vehicles/VehicleDetailsModal";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";

type VehiclesPanelProps = {
  vehicles: VehicleResponseDTO[];
};

type StatusFilter = "ALL" | DisplayStatus;

type DisplayStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "UNAVAILABLE";

const statusLabels = {
  AVAILABLE: "Disponível",
  IN_USE: "Em Uso",
  MAINTENANCE: "Manutenção",
  UNAVAILABLE: "Indisponível",
} satisfies Record<DisplayStatus, string>;

const statusFilters = [
  { label: "Todos", value: "ALL" },
  { label: statusLabels.AVAILABLE, value: "AVAILABLE" },
  { label: statusLabels.IN_USE, value: "IN_USE" },
  { label: statusLabels.MAINTENANCE, value: "MAINTENANCE" },
  { label: statusLabels.UNAVAILABLE, value: "UNAVAILABLE" },
] satisfies { label: string; value: StatusFilter }[];

const typeLabels: Record<string, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Motocicleta",
  TRUCK: "Caminhão",
  TRACTOR: "Trator",
  VAN: "Van",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function VehiclesPanel({ vehicles }: VehiclesPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponseDTO | null>(null);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        vehicle.model.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        vehicle.plate.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(vehicle.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vehicles]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              Gestão de Veículos
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Cadastro e controle da frota
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="relative block w-[280px] max-w-full">
              <span className="sr-only">Buscar veículos</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                type="search"
                value={search}
              />
            </label>

            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="space-y-5 p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <VehicleFilters
            currentStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <Link
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/vehicles/register"
          >
            <PlusIcon className="h-4 w-4" />
            Novo Veículo
          </Link>
        </div>

        <VehicleTable
          onViewDetails={setSelectedVehicle}
          vehicles={filteredVehicles}
        />
      </div>

      {selectedVehicle ? (
        <VehicleDetailsModal
          onClose={() => setSelectedVehicle(null)}
          vehicle={selectedVehicle}
        />
      ) : null}
    </div>
  );
}

type VehicleFiltersProps = {
  currentStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
};

function VehicleFilters({
  currentStatus,
  onStatusChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {statusFilters.map((filter) => {
        const isActive = filter.value === currentStatus;

        return (
          <button
            className={`h-9 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:text-blue-700 hover:ring-blue-200"
            }`}
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

type VehicleTableProps = {
  onViewDetails: (vehicle: VehicleResponseDTO) => void;
  vehicles: VehicleResponseDTO[];
};

function VehicleTable({ onViewDetails, vehicles }: VehicleTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>KM</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vehicles.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                  colSpan={5}
                >
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  className="transition hover:bg-slate-50/80"
                  key={vehicle.id}
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">
                    {vehicle.plate}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {vehicle.model}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Ano {vehicle.year}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {typeLabels[vehicle.type] ?? vehicle.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {numberFormatter.format(vehicle.odometer)} km
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        aria-label={`Ver detalhes do veículo ${vehicle.plate}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        onClick={() => onViewDetails(vehicle)}
                        title="Ver detalhes"
                        type="button"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <Link
                        className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        href={`/vehicles/${vehicle.id}/edit`}
                      >
                        Editar
                      </Link>
                      <form action={deleteVehicleAction.bind(null, vehicle.id)}>
                        <button
                          className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                          type="submit"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
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
  className?: string;
};

function TableHead({ children, className = "" }: TableHeadProps) {
  return (
    <th
      className={`px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-500 ${className}`}
    >
      {children}
    </th>
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

type IconProps = {
  className?: string;
};

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m20 20-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
