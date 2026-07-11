import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageBackHeader } from "@/components/ui/PageBackHeader";

export default function RouteDetailNotFound() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            backHref="/routes"
            subtitle="Informações completas da rota finalizada"
            title="Detalhes da rota"
          />
        </header>

        <div className="p-8">
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Rota não encontrada.
            </p>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
