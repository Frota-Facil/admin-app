import { registerVehicleAction } from "@/app/vehicles/actions";
import { VehicleForm } from "@/app/vehicles/register/form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageBackHeader } from "@/components/ui/PageBackHeader";

export default function RegisterVehiclePage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            backHref="/vehicles"
            subtitle="Cadastre um novo veículo na frota"
            title="Novo veículo"
          />
        </header>

        <div className="p-8">
          <VehicleForm action={registerVehicleAction} />
        </div>
      </div>
    </AdminLayout>
  );
}
