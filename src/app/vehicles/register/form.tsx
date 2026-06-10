import {
  VEHICLE_STATUSES,
  type VehicleStatus,
} from "@/server/contracts/vehicles/status";
import {
  VEHICLE_TYPES,
  type VehicleType,
} from "@/server/contracts/vehicles/type";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";

type VehicleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  vehicle?: VehicleResponseDTO;
};

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Disponível",
  IN_USE: "Em uso",
  MAINTENANCE: "Em manutenção",
};

const typeLabels: Record<VehicleType, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Motocicleta",
  TRUCK: "Caminhão",
  TRACTOR: "Trator",
  VAN: "Van",
};

export function VehicleForm({ action, vehicle }: VehicleFormProps) {
  return (
    <form action={action}>
      <label>
        Placa
        <input name="plate" defaultValue={vehicle?.plate} required />
      </label>

      <label>
        Modelo
        <input name="model" defaultValue={vehicle?.model} required />
      </label>

      <label>
        Ano
        <input
          name="year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          defaultValue={vehicle?.year}
          required
        />
      </label>

      <label>
        Quilometragem
        <input
          name="odometer"
          type="number"
          min="0"
          step="1"
          defaultValue={vehicle?.odometer ?? 0}
          required
        />
      </label>

      <label>
        Imagem
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
        />
      </label>
      <input
        name="currentImageUrl"
        type="hidden"
        defaultValue={vehicle?.imageUrl ?? ""}
      />
      {vehicle?.imageUrl ? (
        <figure>
          {/* biome-ignore lint/performance/noImgElement: remote MinIO URLs are managed by the core service. */}
          <img
            src={vehicle.imageUrl}
            alt={`Imagem do veículo ${vehicle.model}`}
            style={{ maxWidth: 240 }}
          />
          <figcaption>Imagem atual</figcaption>
          <label>
            <input name="removeImage" type="checkbox" value="true" />
            Remover imagem
          </label>
        </figure>
      ) : null}

      <label>
        Status
        <select name="status" defaultValue={vehicle?.status ?? "AVAILABLE"}>
          {VEHICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tipo
        <select name="type" defaultValue={vehicle?.type ?? "CAR"}>
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {typeLabels[type]}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Salvar</button>
    </form>
  );
}
