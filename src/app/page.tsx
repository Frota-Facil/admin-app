import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function Home() {
  // TODO: integrar estes indicadores com o core-service quando o dashboard real for implementado.
  const totalVehicles = 0;
  const availableVehicles = 0;
  const inUseVehicles = 0;
  const maintenanceVehicles = 0;
  const pendingRequests = 0;
  const registeredDrivers = 0;
  const registeredUsers = 0;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Painel administrativo
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal text-slate-950">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Visão geral do sistema
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                href="/requests/pending"
              >
                Requisições pendentes
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                href="/vehicles"
              >
                Gerenciar veículos
              </Link>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              description="Frota cadastrada no SIF"
              icon={<VehicleIcon className="h-5 w-5" />}
              label="Total de veículos"
              value={totalVehicles}
            />
            <DashboardCard
              description="Prontos para novas viagens"
              icon={<AvailableIcon className="h-5 w-5" />}
              label="Veículos disponíveis"
              value={availableVehicles}
            />
            <DashboardCard
              description="Aguardando análise administrativa"
              icon={<RequestsIcon className="h-5 w-5" />}
              label="Solicitações pendentes"
              value={pendingRequests}
            />
            <DashboardCard
              description="Motoristas registrados no painel"
              icon={<DriversIcon className="h-5 w-5" />}
              label="Motoristas cadastrados"
              value={registeredDrivers}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-normal text-slate-950">
                    Status da frota
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Distribuição atual dos veículos cadastrados
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {totalVehicles} veículos
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <StatusRow
                  colorClass="bg-emerald-500"
                  label="Disponíveis"
                  total={totalVehicles}
                  value={availableVehicles}
                />
                <StatusRow
                  colorClass="bg-blue-500"
                  label="Em uso"
                  total={totalVehicles}
                  value={inUseVehicles}
                />
                <StatusRow
                  colorClass="bg-amber-500"
                  label="Em manutenção"
                  total={totalVehicles}
                  value={maintenanceVehicles}
                />
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold tracking-normal text-slate-950">
                Operação
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Indicadores rápidos para acompanhamento diário
              </p>

              <div className="mt-6 space-y-3">
                <OperationItem
                  label="Usuários cadastrados"
                  value={registeredUsers}
                  variant="blue"
                />
                <OperationItem
                  label="Veículos em uso"
                  value={inUseVehicles}
                  variant="emerald"
                />
                <OperationItem
                  label="Solicitações aguardando painel"
                  value={pendingRequests}
                  variant="amber"
                />
              </div>
            </article>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

type IconProps = {
  className?: string;
};

type StatusRowProps = {
  colorClass: string;
  label: string;
  total: number;
  value: number;
};

function StatusRow({ colorClass, label, total, value }: StatusRowProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-950">
          {value} · {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type OperationItemProps = {
  label: string;
  value: number;
  variant: "amber" | "blue" | "emerald";
};

const operationVariantClasses = {
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
} satisfies Record<OperationItemProps["variant"], string>;

function OperationItem({ label, value, variant }: OperationItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-sm font-bold ${operationVariantClasses[variant]}`}
      >
        {value}
      </span>
    </div>
  );
}

function VehicleIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 14.5 5.5 10A2 2 0 0 1 7.4 8.6h7.2a2 2 0 0 1 1.8 1.1l2.1 4.2M5 17h14M6.5 17.5v1M17.5 17.5v1M7 14h.01M17 14h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AvailableIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12 4 4 10-10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function RequestsIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 4.5h8M8 9h8M8 13.5h5M6.5 20h11A1.5 1.5 0 0 0 19 18.5v-13A1.5 1.5 0 0 0 17.5 4h-11A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DriversIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 19a4 4 0 0 0-8 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19a3.5 3.5 0 0 0-3-3.46M17 6.45a2.5 2.5 0 0 1 0 5.1M4 19a3.5 3.5 0 0 1 3-3.46M7 6.45a2.5 2.5 0 0 0 0 5.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
