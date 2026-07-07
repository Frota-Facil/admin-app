import { notFound } from "next/navigation";
import { updateVehicleAction } from "@/app/vehicles/actions";
import { VehicleForm } from "@/app/vehicles/register/form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import { fetchVehicleByIdUseCase } from "@/server/use-cases/fetch-vehicle-by-id-use-case";

type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  const { id } = await params;
  const vehicle = await fetchVehicleByIdUseCase(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            actions={<NotificationBell />}
            backHref="/vehicles"
            subtitle="Atualize os dados cadastrais e operacionais do veículo"
            title="Editar veículo"
          />
        </header>

        <div className="p-8">
          <VehicleForm
            action={updateVehicleAction.bind(null, id)}
            vehicle={vehicle}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
