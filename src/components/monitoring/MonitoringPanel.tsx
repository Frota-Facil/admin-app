"use client";

import {
  Camera,
  Car,
  Clock,
  ImageOff,
  MapPin,
  Navigation,
  Search,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type {
  ActiveRouteItem,
  MonitoringPhotoRecord,
} from "@/components/monitoring/types";

type MonitoringPanelProps = {
  routes: ActiveRouteItem[];
};

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  timeZone: "America/Fortaleza",
  year: "numeric",
});

const monitoringRecords: MonitoringPhotoRecord[] = [];

export function MonitoringPanel({ routes }: MonitoringPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const filteredRoutes = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return routes;
    }

    return routes.filter((route) => {
      const searchableFields = [
        route.vehiclePlate,
        route.vehicleModel,
        route.driverName,
        route.destination,
      ];

      return searchableFields.some((field) =>
        normalizeText(field).includes(normalizedSearch),
      );
    });
  }, [routes, search]);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? null,
    [routes, selectedRouteId],
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              Monitoramento
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Localização dos veículos em tempo real
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="relative block w-[280px] max-w-full">
              <span className="sr-only">Buscar rotas ativas</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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

      <div className="grid gap-6 p-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="min-w-0 space-y-6">
          <MonitoringWorkspace
            hasActiveRoutes={routes.length > 0}
            selectedRoute={selectedRoute}
          />
          <MonitoringPhotoGrid
            records={selectedRoute ? monitoringRecords : []}
            route={selectedRoute}
          />
        </main>

        <ActiveRoutesPanel
          filteredRoutes={filteredRoutes}
          onSelectRoute={setSelectedRouteId}
          routeCount={routes.length}
          selectedRouteId={selectedRouteId}
        />
      </div>
    </div>
  );
}

type MonitoringWorkspaceProps = {
  hasActiveRoutes: boolean;
  selectedRoute: ActiveRouteItem | null;
};

function MonitoringWorkspace({
  hasActiveRoutes,
  selectedRoute,
}: MonitoringWorkspaceProps) {
  return (
    <section className="relative min-h-[440px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-slate-50/80" />
      <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(37,99,235,0.12)]" />
      <div className="absolute right-[18%] top-[34%] h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
      <div className="absolute bottom-[18%] left-[34%] h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_0_6px_rgba(6,182,212,0.12)]" />
      <div className="absolute left-[12%] top-[22%] h-[48%] w-[58%] rounded-[42%] border-2 border-dashed border-slate-300/80" />

      <div className="relative z-10 flex min-h-[440px] flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
              Área de monitoramento
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-950">
              {selectedRoute?.destination ?? "Monitoramento da frota"}
            </h2>
          </div>

          {selectedRoute ? <StatusBadge status={selectedRoute.status} /> : null}
        </div>

        {selectedRoute ? (
          <SelectedRouteDetails route={selectedRoute} />
        ) : (
          <MonitoringEmptyState hasActiveRoutes={hasActiveRoutes} />
        )}
      </div>
    </section>
  );
}

type MonitoringEmptyStateProps = {
  hasActiveRoutes: boolean;
};

function MonitoringEmptyState({ hasActiveRoutes }: MonitoringEmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
          {hasActiveRoutes ? (
            <MapPin className="h-7 w-7" />
          ) : (
            <Camera className="h-7 w-7" />
          )}
        </div>
        <h3 className="mt-5 text-lg font-bold tracking-normal text-slate-950">
          {hasActiveRoutes
            ? "Selecione uma rota ativa"
            : "Nenhuma rota ativa para monitorar"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {hasActiveRoutes
            ? "Escolha uma rota em trânsito para visualizar os registros de monitoramento."
            : "Nenhuma rota ativa no momento."}
        </p>
      </div>
    </div>
  );
}

type SelectedRouteDetailsProps = {
  route: ActiveRouteItem;
};

function SelectedRouteDetails({ route }: SelectedRouteDetailsProps) {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <InfoTile
        icon={<Navigation className="h-5 w-5" />}
        label="Destino"
        value={route.destination}
      />
      <InfoTile
        icon={<Car className="h-5 w-5" />}
        label="Veículo"
        value={`${route.vehicleModel} - ${route.vehiclePlate}`}
      />
      <InfoTile
        icon={<User className="h-5 w-5" />}
        label="Motorista"
        value={route.driverName}
      />
      <InfoTile
        icon={<Clock className="h-5 w-5" />}
        label="Início"
        value={formatDateTime(route.date)}
      />
    </div>
  );
}

type InfoTileProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="flex min-h-24 items-start gap-3 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

type MonitoringPhotoGridProps = {
  records: MonitoringPhotoRecord[];
  route: ActiveRouteItem | null;
};

function MonitoringPhotoGrid({ records, route }: MonitoringPhotoGridProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-bold tracking-normal text-slate-950">
            Registros de monitoramento
          </h2>
          {route ? (
            <p className="mt-1 text-sm text-slate-500">
              {route.vehiclePlate} · {route.driverName}
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {records.length} registros
        </span>
      </div>

      {route ? (
        records.length === 0 ? (
          <PhotoEmptyState />
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <MonitoringPhotoCard key={record.id} record={record} />
            ))}
          </div>
        )
      ) : (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Selecione uma rota ativa para visualizar os registros.
          </p>
        </div>
      )}
    </section>
  );
}

function PhotoEmptyState() {
  return (
    <div className="p-5">
      <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
          <ImageOff className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold tracking-normal text-slate-950">
          Nenhum registro de foto encontrado para esta rota.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Os registros do monitoramento serão exibidos aqui quando estiverem
          disponíveis.
        </p>
      </div>
    </div>
  );
}

type MonitoringPhotoCardProps = {
  record: MonitoringPhotoRecord;
};

function MonitoringPhotoCard({ record }: MonitoringPhotoCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="aspect-video bg-slate-100">
        {/* biome-ignore lint/performance/noImgElement: future monitoring photos will come from the core service. */}
        <img
          alt="Registro de monitoramento"
          className="h-full w-full object-cover"
          src={record.imageUrl}
        />
      </div>
      <div className="space-y-2 p-4 text-sm">
        <p className="font-bold text-slate-950">
          {formatDateTime(record.capturedAt)}
        </p>
        <p className="text-slate-500">{record.locationText ?? "-"}</p>
      </div>
    </article>
  );
}

type ActiveRoutesPanelProps = {
  filteredRoutes: ActiveRouteItem[];
  onSelectRoute: (routeId: string) => void;
  routeCount: number;
  selectedRouteId: string | null;
};

function ActiveRoutesPanel({
  filteredRoutes,
  onSelectRoute,
  routeCount,
  selectedRouteId,
}: ActiveRoutesPanelProps) {
  return (
    <aside className="min-w-0">
      <section className="sticky top-8 rounded-lg border border-slate-200 bg-white shadow-sm xl:max-h-[calc(100vh-8rem)] xl:overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-normal text-slate-950">
                Rotas ativas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {routeCount} {routeCount === 1 ? "veículo" : "veículos"} em
                trânsito
              </p>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
              Ao vivo
            </span>
          </div>
        </div>

        {routeCount === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              Nenhuma rota ativa no momento.
            </p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Nenhuma rota ativa encontrada.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4 xl:max-h-[calc(100vh-15rem)] xl:overflow-y-auto">
            {filteredRoutes.map((route) => (
              <ActiveRouteCard
                isSelected={route.id === selectedRouteId}
                key={route.id}
                onSelect={() => onSelectRoute(route.id)}
                route={route}
              />
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}

type ActiveRouteCardProps = {
  isSelected: boolean;
  onSelect: () => void;
  route: ActiveRouteItem;
};

function ActiveRouteCard({
  isSelected,
  onSelect,
  route,
}: ActiveRouteCardProps) {
  return (
    <button
      className={`w-full rounded-lg border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
        isSelected
          ? "border-blue-300 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-normal text-slate-950">
            {route.vehiclePlate}
          </p>
          <p className="mt-1 truncate text-sm text-slate-500">
            {route.vehicleModel}
          </p>
        </div>
        <StatusBadge status={route.status} />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <RouteInfoRow label="Motorista" value={route.driverName} />
        <RouteInfoRow label="Destino" value={route.destination} />
        <RouteInfoRow label="Início" value={formatDateTime(route.date)} />
      </dl>
    </button>
  );
}

type RouteInfoRowProps = {
  label: string;
  value: string;
};

function RouteInfoRow({ label, value }: RouteInfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="truncate text-right font-semibold text-slate-900">
        {value}
      </dd>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className="inline-flex shrink-0 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
      title={status}
    >
      Em andamento
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}
