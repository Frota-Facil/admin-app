import Link from "next/link";
import { registerVehicleAction } from "@/app/vehicles/actions";
import { VehicleForm } from "@/app/vehicles/register/form";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function RegisterVehiclePage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">
                Novo veículo
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Cadastre um novo veículo na frota
              </p>
            </div>

            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/vehicles"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar
            </Link>
          </div>
        </header>

        <div className="p-8">
          <VehicleForm action={registerVehicleAction} />
        </div>
      </div>
    </AdminLayout>
  );
}

type IconProps = {
  className?: string;
};

function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
