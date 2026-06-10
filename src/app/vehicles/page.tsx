import Link from "next/link";
import { deleteVehicleAction } from "@/app/vehicles/actions";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

export default async function VehiclesPage() {
  const vehicles = await fetchVehiclesUseCase();

  return (
    <main>
      <Link href="/">Início</Link>
      <h1>Veículos</h1>
      <Link href="/vehicles/register">Novo veículo</Link>

      {vehicles.length === 0 ? (
        <p>Nenhum veículo cadastrado.</p>
      ) : (
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              {vehicle.model} - {vehicle.plate} - {vehicle.year} -{" "}
              {vehicle.status}{" "}
              <Link href={`/vehicles/${vehicle.id}/edit`}>Editar</Link>
              <form action={deleteVehicleAction.bind(null, vehicle.id)}>
                <button type="submit">Excluir</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
