import { AdminLayout } from "@/components/layout/AdminLayout";

export default function MonitoringLoading() {
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
              <div className="h-10 w-[280px] max-w-full rounded-lg bg-slate-100" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 p-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
          <section className="min-h-[440px] rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-4 w-44 rounded-full bg-slate-100" />
            <div className="mt-4 h-7 w-72 rounded-full bg-slate-100" />
            <div className="mt-28 text-center text-sm font-medium text-slate-500">
              Carregando rotas ativas...
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="h-5 w-28 rounded-full bg-slate-100" />
              <div className="mt-3 h-4 w-36 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-3 p-4">
              <div className="h-32 rounded-lg bg-slate-100" />
              <div className="h-32 rounded-lg bg-slate-100" />
              <div className="h-32 rounded-lg bg-slate-100" />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
