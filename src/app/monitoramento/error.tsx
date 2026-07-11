"use client";

import { Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

type MonitoringErrorProps = {
  reset: () => void;
};

export default function MonitoringError({ reset }: MonitoringErrorProps) {
  return (
    <AdminLayout>
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
                  placeholder="Buscar..."
                  readOnly
                  type="search"
                />
              </label>
            </div>
          </div>
        </header>

        <div className="p-8">
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Não foi possível carregar as rotas ativas.
            </p>
            <button
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={reset}
              type="button"
            >
              Tentar novamente
            </button>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
