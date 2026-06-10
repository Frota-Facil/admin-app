import Link from "next/link";
import { registerVehicleAction } from "@/app/vehicles/actions";
import { VehicleForm } from "@/app/vehicles/register/form";

export default function RegisterVehiclePage() {
  return (
    <main>
      <Link href="/vehicles">Voltar</Link>
      <h1>Novo veículo</h1>
      <VehicleForm action={registerVehicleAction} />
    </main>
  );
}
