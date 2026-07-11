"use client";

import {
  ArrowLeft,
  ArrowRight,
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
import { useEffect, useMemo, useState } from "react";
import type {
  ActiveRouteItem,
  MonitoringTrackRecord,
} from "@/components/monitoring/types";
import { TRACK_CREATED_EVENT } from "@/components/routes/RouteEventListener";
import type { TrackCreatedEventDTO } from "@/server/contracts/tracks/track-created-event";
import { formatDate, formatDateTime, formatTime } from "@/utils/date-format";

type MonitoringPanelProps = {
  initialSelectedRouteId?: string | null;
  routes: ActiveRouteItem[];
};

export function MonitoringPanel({
  initialSelectedRouteId = null,
  routes,
}: MonitoringPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(() =>
    getSelectableRouteId(routes, initialSelectedRouteId),
  );
  const [trackError, setTrackError] = useState("");
  const [tracks, setTracks] = useState<MonitoringTrackRecord[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

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

  useEffect(() => {
    const routeId = getSelectableRouteId(routes, initialSelectedRouteId);

    if (routeId) {
      setSelectedRouteId(routeId);
    }
  }, [initialSelectedRouteId, routes]);

  useEffect(() => {
    if (!selectedRouteId) {
      setTrackError("");
      setTracks([]);
      setIsLoadingTracks(false);
      return;
    }

    const routeId = selectedRouteId;
    const controller = new AbortController();

    async function loadTracks() {
      setTrackError("");
      setTracks([]);
      setIsLoadingTracks(true);

      try {
        const response = await fetch(
          `/api/admin/tracks/${encodeURIComponent(routeId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar os registros");
        }

        const data = (await response.json()) as MonitoringTrackRecord[];
        setTracks(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Erro ao carregar registros de monitoramento:", error);
        setTracks([]);
        setTrackError(
          "Não foi possível carregar os registros de monitoramento.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTracks(false);
        }
      }
    }

    void loadTracks();

    return () => {
      controller.abort();
    };
  }, [selectedRouteId]);

  useEffect(() => {
    function handleTrackCreated(event: Event) {
      const { detail } = event as CustomEvent<TrackCreatedEventDTO>;

      if (!detail || detail.routeId !== selectedRouteId) {
        return;
      }

      const nextRecord = toMonitoringTrackRecord(detail);

      setTracks((currentTracks) => {
        if (currentTracks.some((track) => track.id === nextRecord.id)) {
          return currentTracks;
        }

        return [...currentTracks, nextRecord];
      });
    }

    window.addEventListener(TRACK_CREATED_EVENT, handleTrackCreated);

    return () => {
      window.removeEventListener(TRACK_CREATED_EVENT, handleTrackCreated);
    };
  }, [selectedRouteId]);

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
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="min-w-0 space-y-6">
          <MonitoringWorkspace
            hasActiveRoutes={routes.length > 0}
            selectedRoute={selectedRoute}
          />
          <MonitoringPhotoCarousel
            errorMessage={trackError}
            isLoading={isLoadingTracks}
            key={selectedRoute?.id ?? "no-selected-route"}
            records={selectedRoute ? tracks : []}
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

type MonitoringPhotoCarouselProps = {
  errorMessage: string;
  isLoading: boolean;
  records: MonitoringTrackRecord[];
  route: ActiveRouteItem | null;
};

function MonitoringPhotoCarousel({
  errorMessage,
  isLoading,
  records,
  route,
}: MonitoringPhotoCarouselProps) {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const selectedRecord = records[selectedRecordIndex] ?? records[0] ?? null;
  const hasMultipleRecords = records.length > 1;
  const isFirstRecord = selectedRecordIndex === 0;
  const isLastRecord = selectedRecordIndex >= records.length - 1;

  useEffect(() => {
    setSelectedRecordIndex((currentIndex) => {
      if (records.length === 0) {
        return 0;
      }

      return Math.min(currentIndex, records.length - 1);
    });
  }, [records.length]);

  function goToPreviousRecord() {
    setSelectedRecordIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function goToNextRecord() {
    setSelectedRecordIndex((currentIndex) =>
      Math.min(records.length - 1, currentIndex + 1),
    );
  }

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
        isLoading ? (
          <MonitoringStateMessage message="Carregando registros de monitoramento..." />
        ) : errorMessage ? (
          <MonitoringStateMessage isError message={errorMessage} />
        ) : records.length === 0 ? (
          <PhotoEmptyState />
        ) : (
          selectedRecord && (
            <div className="space-y-5 p-5">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <div className="aspect-[4/3] w-full">
                  {selectedRecord.imageUrl ? (
                    /* biome-ignore lint/performance/noImgElement: tracking map images are generated and stored by the core service. */
                    <img
                      alt="Mapa do registro de monitoramento"
                      className="h-full w-full object-cover"
                      src={selectedRecord.imageUrl}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        Imagem não disponível
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <dl className="grid gap-4 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <TrackCardInfo
                  label="Data"
                  value={formatDate(selectedRecord.capturedAt)}
                />
                <TrackCardInfo
                  label="Horário"
                  value={formatTime(selectedRecord.capturedAt)}
                />
                <TrackCardInfo
                  label="Latitude"
                  value={formatCoordinate(selectedRecord.latitude)}
                />
                <TrackCardInfo
                  label="Longitude"
                  value={formatCoordinate(selectedRecord.longitude)}
                />
              </dl>

              {hasMultipleRecords ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <span className="text-sm font-semibold text-slate-600">
                    {selectedRecordIndex + 1} de {records.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Registro anterior"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                      disabled={isFirstRecord}
                      onClick={goToPreviousRecord}
                      title="Registro anterior"
                      type="button"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Próximo registro"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                      disabled={isLastRecord}
                      onClick={goToNextRecord}
                      title="Próximo registro"
                      type="button"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )
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
          Nenhum registro de monitoramento encontrado para esta rota.
        </h3>
      </div>
    </div>
  );
}

type MonitoringStateMessageProps = {
  isError?: boolean;
  message: string;
};

function MonitoringStateMessage({
  isError = false,
  message,
}: MonitoringStateMessageProps) {
  return (
    <div className="p-10 text-center">
      <p
        className={`text-sm font-medium ${
          isError ? "text-red-600" : "text-slate-500"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

type TrackCardInfoProps = {
  label: string;
  value: string;
};

function TrackCardInfo({ label, value }: TrackCardInfoProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words font-semibold text-slate-950">{value}</dd>
    </div>
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

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function getSelectableRouteId(
  routes: ActiveRouteItem[],
  routeId?: string | null,
) {
  if (!routeId) {
    return null;
  }

  return routes.some((route) => route.id === routeId) ? routeId : null;
}

function toMonitoringTrackRecord(
  event: TrackCreatedEventDTO,
): MonitoringTrackRecord {
  return {
    capturedAt: event.track.capturedAt.toISOString(),
    id: event.track.id,
    imageKey: event.track.imageKey,
    imageUrl: event.track.imageUrl,
    latitude: event.track.latitude,
    longitude: event.track.longitude,
    routeId: event.routeId,
  };
}
