import { Activity, Car, ClipboardList, Search, UsersRound } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { RequestResponseDTO } from "@/server/contracts/requests/request-response";
import type { RouteDTO } from "@/server/contracts/routes/route-schema";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import {
  isNextRedirectError,
  redirectCoreUnauthorized,
} from "@/server/navigation/redirect-core-unauthorized";
import { isCoreUnauthorizedError } from "@/server/services/core/auth-error";
import { fetchRequestsUseCase } from "@/server/use-cases/fetch-requests-use-case";
import { fetchRoutesUseCase } from "@/server/use-cases/fetch-routes-use-case";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

type DashboardData = {
  requests: RequestResponseDTO[];
  routes: RouteDTO[];
  users: UserResponseDTO[];
  vehicles: VehicleResponseDTO[];
};

type FleetStatusItem = {
  color: string;
  count: number;
  label: string;
  status: string;
};

type MonthlyUsageItem = {
  count: number;
  key: string;
  label: string;
};

type DonutSegment = FleetStatusItem & {
  offset: number;
  percentage: number;
  tooltipX: number;
  tooltipY: number;
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

const routeUsageStatuses = new Set(["COMPLETED", "FINISHED", "STARTED"]);

const fleetStatusConfig: Record<string, { color: string; label: string }> = {
  AVAILABLE: {
    color: "#10b981",
    label: "Disponível",
  },
  IN_USE: {
    color: "#0ea5e9",
    label: "Em uso",
  },
  MAINTENANCE: {
    color: "#f59e0b",
    label: "Manutenção",
  },
  UNAVAILABLE: {
    color: "#ef4444",
    label: "Indisponível",
  },
};

const fallbackStatusColors = ["#6366f1", "#14b8a6", "#f97316", "#a855f7"];
const chartGridLines = ["100", "75", "50", "25"];

export default async function Home() {
  await requireDashboardSession();

  const { requests, routes, users, vehicles } = await fetchDashboardData();
  const monthlyUsage = buildMonthlyUsage(routes);
  const fleetStatus = buildFleetStatus(vehicles);
  const totalVehicles = vehicles.length;
  const vehiclesInUseNow = countVehiclesInUseNow(vehicles, routes);
  const pendingRequests = requests.filter((request) =>
    isStatus(request.status, "PENDING"),
  ).length;
  const totalDrivers = users.filter(isDriver).length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Visão geral da frota municipal
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <label className="relative block w-[280px] max-w-full">
                <span className="sr-only">Buscar no dashboard</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Buscar..."
                  type="search"
                />
              </label>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              description="Veículos cadastrados no sistema"
              icon={<Car className="h-5 w-5" />}
              iconClassName="bg-blue-50 text-blue-600"
              label="Total de veículos"
              value={formatNumber(totalVehicles)}
            />
            <DashboardCard
              description="Veículos com rota em andamento"
              icon={<Activity className="h-5 w-5" />}
              iconClassName="bg-cyan-50 text-cyan-700"
              label="Em uso agora"
              value={formatNumber(vehiclesInUseNow)}
            />
            <DashboardCard
              description="Aguardando análise administrativa"
              icon={<ClipboardList className="h-5 w-5" />}
              iconClassName="bg-amber-50 text-amber-700"
              label="Solicitações pendentes"
              value={formatNumber(pendingRequests)}
            />
            <DashboardCard
              description="Motoristas cadastrados"
              icon={<UsersRound className="h-5 w-5" />}
              iconClassName="bg-emerald-50 text-emerald-700"
              label="Motoristas"
              value={formatNumber(totalDrivers)}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <DashboardPanel
              description="Quantidade de rotas usadas nos últimos 6 meses"
              title="Utilização Mensal da Frota"
            >
              <MonthlyUsageChart data={monthlyUsage} />
            </DashboardPanel>

            <DashboardPanel
              description="Distribuição atual por status dos veículos"
              title="Status da Frota"
            >
              <FleetStatusDonut items={fleetStatus} total={totalVehicles} />
            </DashboardPanel>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const [vehicles, routes, requests, users] = await Promise.all([
      safeFetch("veículos", fetchVehiclesUseCase),
      safeFetch("rotas", fetchRoutesUseCase),
      safeFetch("solicitações", fetchRequestsUseCase),
      safeFetch("usuários", fetchUsersUseCase),
    ]);

    return {
      requests,
      routes,
      users,
      vehicles,
    };
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}

async function safeFetch<T>(
  label: string,
  loader: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await loader();
  } catch (error) {
    if (isCoreUnauthorizedError(error) || isNextRedirectError(error)) {
      throw error;
    }

    console.error(`Não foi possível carregar ${label} do dashboard.`, error);
    return [];
  }
}

async function requireDashboardSession() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }
}

type DashboardPanelProps = {
  children: ReactNode;
  description: string;
  title: string;
};

function DashboardPanel({ children, description, title }: DashboardPanelProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold tracking-normal text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {children}
    </article>
  );
}

type MonthlyUsageChartProps = {
  data: MonthlyUsageItem[];
};

function MonthlyUsageChart({ data }: MonthlyUsageChartProps) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);
  const hasData = data.some((item) => item.count > 0);

  return (
    <div className="relative mt-6 min-h-80">
      <div className="absolute inset-x-0 top-8 bottom-16 flex flex-col justify-between">
        {chartGridLines.map((line) => (
          <div
            className="border-t border-dashed border-slate-200"
            key={`grid-line-${line}`}
          />
        ))}
      </div>

      {!hasData ? (
        <div className="absolute inset-x-0 top-20 z-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Nenhuma rota usada nos últimos 6 meses.
          </p>
        </div>
      ) : null}

      <div className="relative z-20 grid min-h-80 grid-cols-6 items-end gap-3">
        {data.map((item) => {
          const percentage =
            item.count > 0 ? Math.max(8, (item.count / maxValue) * 100) : 0;

          return (
            <div
              className="flex h-72 min-w-0 flex-col justify-end gap-3"
              key={item.key}
            >
              <div className="flex h-56 items-end justify-center px-1">
                <div
                  aria-label={`${item.label}: ${item.count} rotas`}
                  className="group relative flex h-full w-full max-w-16 items-end justify-center outline-none"
                  role="img"
                >
                  <div
                    className="w-full rounded-t-lg bg-blue-600 shadow-sm shadow-blue-600/20 transition group-hover:bg-blue-700"
                    style={{ height: `${percentage}%` }}
                  />
                  <ChartTooltip
                    rows={[
                      {
                        label: "Rotas usadas",
                        value: formatNumber(item.count),
                      },
                    ]}
                    title={`Mês: ${formatMonthTooltipLabel(item.label)}`}
                  />
                </div>
              </div>
              <p className="truncate text-center text-xs font-bold uppercase tracking-normal text-slate-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type FleetStatusDonutProps = {
  items: FleetStatusItem[];
  total: number;
};

function FleetStatusDonut({ items, total }: FleetStatusDonutProps) {
  const hasData = total > 0;
  const segments = buildDonutSegments(items, total);

  return (
    <div className="mt-6 flex flex-col items-center gap-6">
      <div className="relative h-52 w-52">
        <svg
          aria-label="Distribuição dos veículos por status"
          className="relative z-20 h-full w-full overflow-visible"
          role="img"
          viewBox="0 0 208 208"
        >
          <circle
            cx="104"
            cy="104"
            fill="none"
            r="82"
            stroke="#e2e8f0"
            strokeWidth="30"
          />
          {hasData
            ? segments.map((segment) => (
                <g
                  aria-label={`${segment.label}: ${segment.count} veículos`}
                  className="group outline-none"
                  key={segment.status}
                >
                  <circle
                    className="transition group-hover:opacity-80"
                    cx="104"
                    cy="104"
                    fill="none"
                    pathLength="100"
                    r="82"
                    stroke={segment.color}
                    strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                    strokeDashoffset={-segment.offset}
                    strokeWidth="30"
                    transform="rotate(-90 104 104)"
                  />
                  <DonutSvgTooltip segment={segment} />
                </g>
              ))
            : null}
        </svg>

        <div className="pointer-events-none absolute inset-12 z-10 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
          <strong className="text-3xl font-bold tracking-normal text-slate-950">
            {formatNumber(total)}
          </strong>
          <span className="text-xs font-semibold uppercase tracking-normal text-slate-500">
            veículos
          </span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-sm font-medium text-slate-500">
            Nenhum veículo cadastrado.
          </p>
        ) : (
          items.map((item) => (
            <div
              className="flex items-center justify-between gap-3 text-sm"
              key={item.status}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate font-medium text-slate-600">
                  {item.label}
                </span>
              </div>
              <span className="font-bold text-slate-950">
                {formatNumber(item.count)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type ChartTooltipProps = {
  rows: {
    label: string;
    value: string;
  }[];
  title: string;
};

function ChartTooltip({ rows, title }: ChartTooltipProps) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-max min-w-36 -translate-x-1/2 translate-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left opacity-0 shadow-lg shadow-slate-900/10 transition group-hover:translate-y-0 group-hover:opacity-100">
      <p className="text-xs font-bold text-slate-950">{title}</p>
      <div className="mt-1.5 space-y-1">
        {rows.map((row) => (
          <div
            className="flex items-center justify-between gap-4 text-xs"
            key={row.label}
          >
            <span className="text-slate-500">{row.label}</span>
            <span className="font-bold text-slate-950">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type DonutSvgTooltipProps = {
  segment: DonutSegment;
};

function DonutSvgTooltip({ segment }: DonutSvgTooltipProps) {
  return (
    <g
      className="pointer-events-none opacity-0 transition group-hover:opacity-100"
      transform={`translate(${segment.tooltipX} ${segment.tooltipY})`}
    >
      <rect fill="#ffffff" height="58" rx="8" stroke="#e2e8f0" width="150" />
      <text fill="#0f172a" fontSize="12" fontWeight="700" x="12" y="22">
        {segment.label}
      </text>
      <circle cx="17" cy="40" fill={segment.color} r="4" />
      <text fill="#475569" fontSize="11" x="28" y="44">
        Quantidade
      </text>
      <text
        fill="#0f172a"
        fontSize="12"
        fontWeight="700"
        textAnchor="end"
        x="136"
        y="44"
      >
        {formatNumber(segment.count)}
      </text>
    </g>
  );
}

function countVehiclesInUseNow(
  vehicles: VehicleResponseDTO[],
  routes: RouteDTO[],
) {
  const startedRouteVehicleIds = new Set(
    routes
      .filter((route) => isStatus(route.status, "STARTED"))
      .map((route) => route.vehicle.id),
  );

  if (startedRouteVehicleIds.size > 0) {
    return startedRouteVehicleIds.size;
  }

  return vehicles.filter((vehicle) => isStatus(vehicle.status, "IN_USE"))
    .length;
}

function buildMonthlyUsage(routes: RouteDTO[]): MonthlyUsageItem[] {
  const months = getLastSixMonths();
  const countByMonth = new Map(months.map((month) => [month.key, 0]));

  for (const route of routes) {
    if (!routeUsageStatuses.has(normalizeStatus(route.status))) {
      continue;
    }

    const key = getMonthKey(route.date);

    if (countByMonth.has(key)) {
      countByMonth.set(key, (countByMonth.get(key) ?? 0) + 1);
    }
  }

  return months.map((month) => ({
    ...month,
    count: countByMonth.get(month.key) ?? 0,
  }));
}

function buildFleetStatus(vehicles: VehicleResponseDTO[]): FleetStatusItem[] {
  const countByStatus = new Map<string, number>();

  for (const vehicle of vehicles) {
    const status = normalizeStatus(vehicle.status);
    countByStatus.set(status, (countByStatus.get(status) ?? 0) + 1);
  }

  const orderedStatuses = [
    ...Object.keys(fleetStatusConfig),
    ...Array.from(countByStatus.keys()).filter(
      (status) => !(status in fleetStatusConfig),
    ),
  ];

  return orderedStatuses
    .map((status, index) => {
      const config = fleetStatusConfig[status];

      return {
        color:
          config?.color ??
          fallbackStatusColors[index % fallbackStatusColors.length],
        count: countByStatus.get(status) ?? 0,
        label: config?.label ?? humanizeStatus(status),
        status,
      };
    })
    .filter((item) => item.count > 0 || item.status in fleetStatusConfig);
}

function buildDonutSegments(
  items: FleetStatusItem[],
  total: number,
): DonutSegment[] {
  if (total === 0) {
    return [];
  }

  let offset = 0;

  return items
    .filter((item) => item.count > 0)
    .map((item) => {
      const percentage = (item.count / total) * 100;
      const midpoint = offset + percentage / 2;
      const tooltipPosition = getDonutTooltipPosition(midpoint);
      const segment = {
        ...item,
        offset,
        percentage,
        ...tooltipPosition,
      };

      offset += percentage;

      return segment;
    });
}

function getDonutTooltipPosition(percentage: number) {
  const angle = (percentage / 100) * Math.PI * 2 - Math.PI / 2;
  const x = 104 + Math.cos(angle) * 78;
  const y = 104 + Math.sin(angle) * 78;

  return {
    tooltipX: clamp(x - 75, 8, 50),
    tooltipY: clamp(y - 29, 8, 142),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getLastSixMonths() {
  const reference = new Date();
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() - 5 + index, 1);

    return {
      key: getMonthKey(date),
      label: monthFormatter.format(date).replace(".", ""),
    };
  });
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isDriver(user: UserResponseDTO) {
  const role = normalizeText(user.role);

  return role === "driver" || role === "motorista";
}

function isStatus(value: string, expectedStatus: string) {
  return normalizeStatus(value) === expectedStatus;
}

function normalizeStatus(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]/g, "_");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function humanizeStatus(status: string) {
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLocaleLowerCase("pt-BR"))
    .join(" ");
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatMonthTooltipLabel(label: string) {
  return label.charAt(0).toLocaleUpperCase("pt-BR") + label.slice(1);
}
