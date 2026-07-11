"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

export type RouteListItem = {
  date: string;
  department: string;
  destination: string;
  driverName: string;
  duration: string | null;
  id: string;
  reason: string;
  status: string;
  vehicleModel: string;
  vehiclePlate: string;
};

type RoutesPanelProps = {
  routes: RouteListItem[];
};

const routeDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "America/Fortaleza",
  year: "numeric",
});

type RouteDisplayStatus =
  | "APPROVED"
  | "CANCELED"
  | "CANCELLED"
  | "COMPLETED"
  | "FINISHED"
  | "PENDING"
  | "READY"
  | "REJECTED"
  | "STARTED";

const routeStatusDisplay = {
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "Aprovada",
  },
  CANCELED: {
    className: "border-red-200 bg-red-50 text-red-700",
    label: "Cancelada",
  },
  CANCELLED: {
    className: "border-red-200 bg-red-50 text-red-700",
    label: "Cancelada",
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
    label: "Em andamento",
  },
} satisfies Record<RouteDisplayStatus, { className: string; label: string }>;

export function RoutesPanel({ routes }: RoutesPanelProps) {
  const [search, setSearch] = useState("");

  const filteredRoutes = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return routes.filter((route) => {
      if (!normalizedSearch) {
        return true;
      }

      const searchableFields = [
        formatDate(route.date),
        route.vehicleModel,
        route.vehiclePlate,
        route.driverName,
        route.department,
        route.duration ?? "",
        route.destination,
        route.reason,
        routeStatusLabelFor(route.status),
      ];

      return searchableFields.some((field) =>
        normalizeText(field).includes(normalizedSearch),
      );
    });
  }, [routes, search]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              Rotas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Registro das rotas finalizadas da frota
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="relative block w-[280px] max-w-full">
              <span className="sr-only">Buscar rotas</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                type="search"
                value={search}
              />
            </label>
          </div>
        </div>
      </header>

      <div className="p-8">
        <RoutesTable routes={filteredRoutes} />
      </div>
    </div>
  );
}

type RoutesTableProps = {
  routes: RouteListItem[];
};

function RoutesTable({ routes }: RoutesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <TableHead>Data</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Finalidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detalhes</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {routes.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                  colSpan={9}
                >
                  Nenhuma rota finalizada encontrada.
                </td>
              </tr>
            ) : (
              routes.map((route) => (
                <tr className="transition hover:bg-slate-50/80" key={route.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">
                    {formatDate(route.date)}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {route.vehicleModel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {route.vehiclePlate}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {route.driverName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {route.department}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {route.duration ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {route.destination}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {route.reason}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <RouteStatusBadge status={route.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <Link
                      aria-label={`Ver detalhes da rota ${route.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      href={`/routes/${route.id}`}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
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

type RouteStatusBadgeProps = {
  status: string;
};

function RouteStatusBadge({ status }: RouteStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const display = normalizedStatus
    ? routeStatusDisplay[normalizedStatus]
    : {
        className: "border-slate-200 bg-slate-100 text-slate-600",
        label: status.trim() || "Desconhecido",
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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return routeDateFormatter.format(date);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function normalizeStatus(status: string): RouteDisplayStatus | null {
  const normalized = status.trim().toUpperCase();

  if (normalized in routeStatusDisplay) {
    return normalized as RouteDisplayStatus;
  }

  return null;
}

function routeStatusLabelFor(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus) {
    return routeStatusDisplay[normalizedStatus].label;
  }

  return status;
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
