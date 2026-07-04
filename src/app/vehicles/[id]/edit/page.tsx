import { notFound } from "next/navigation";
import { updateVehicleAction } from "@/app/vehicles/actions";
import { VehicleForm } from "@/app/vehicles/register/form";
import { BackButton } from "@/components/ui/BackButton";
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
    <main>
      <div className="mb-4">
        <BackButton href="/vehicles" />
      </div>
      <h1>Editar veículo</h1>
      <VehicleForm
        action={updateVehicleAction.bind(null, id)}
        vehicle={vehicle}
      />
    </main>
  );
}
