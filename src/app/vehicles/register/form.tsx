"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useActionState, useState } from "react";
import type { VehicleFormState } from "@/app/vehicles/actions";
import {
  VEHICLE_STATUSES,
  type VehicleStatus,
} from "@/server/contracts/vehicles/status";
import {
  VEHICLE_TYPES,
  type VehicleType,
} from "@/server/contracts/vehicles/type";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import { normalizePlate } from "@/utils/masks";

type VehicleFormProps = {
  action: (
    state: VehicleFormState,
    formData: FormData,
  ) => VehicleFormState | Promise<VehicleFormState>;
  cancelHref?: string;
  submitLabel?: string;
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

const fieldControlClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

export function VehicleForm({
  action,
  cancelHref = "/vehicles",
  submitLabel = "Salvar",
  vehicle,
}: VehicleFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [plate, setPlate] = useState(normalizePlate(vehicle?.plate ?? ""));
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="w-full max-w-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      noValidate
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-base font-bold tracking-normal text-slate-950">
          Dados do veículo
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Informe os dados cadastrais e operacionais do veículo.
        </p>
      </div>

      {state.error ? (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        <FormField error={fieldErrors.plate} htmlFor="plate" label="Placa">
          <input
            className={fieldControlClassName}
            id="plate"
            maxLength={12}
            name="plate"
            onChange={(event) => setPlate(normalizePlate(event.target.value))}
            placeholder="ABC1D23"
            value={plate}
          />
        </FormField>

        <FormField error={fieldErrors.model} htmlFor="model" label="Modelo">
          <input
            className={fieldControlClassName}
            defaultValue={vehicle?.model}
            id="model"
            name="model"
            placeholder="Ex.: Fiat Toro"
          />
        </FormField>

        <FormField error={fieldErrors.year} htmlFor="year" label="Ano">
          <input
            className={fieldControlClassName}
            defaultValue={vehicle?.year}
            id="year"
            max={new Date().getFullYear() + 1}
            min="1900"
            name="year"
            type="number"
          />
        </FormField>

        <FormField
          error={fieldErrors.odometer}
          htmlFor="odometer"
          label="Quilometragem"
        >
          <input
            className={fieldControlClassName}
            defaultValue={vehicle?.odometer ?? 0}
            id="odometer"
            min="0"
            name="odometer"
            step="1"
            type="number"
          />
        </FormField>

        <FormField error={fieldErrors.status} htmlFor="status" label="Status">
          <select
            className={fieldControlClassName}
            defaultValue={vehicle?.status ?? "AVAILABLE"}
            id="status"
            name="status"
          >
            {VEHICLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldErrors.type} htmlFor="type" label="Tipo">
          <select
            className={fieldControlClassName}
            defaultValue={vehicle?.type ?? "CAR"}
            id="type"
            name="type"
          >
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          className="md:col-span-2 xl:col-span-3"
          htmlFor="image"
          label="Imagem do veículo"
        >
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
            <input
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-slate-600 file:mr-4 file:h-9 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              id="image"
              name="image"
              type="file"
            />
            <p className="mt-2 text-xs text-slate-500">
              Formatos aceitos: JPG, PNG ou WebP.
            </p>
          </div>
        </FormField>
      </div>

      <input
        name="currentImageUrl"
        type="hidden"
        defaultValue={vehicle?.imageUrl ?? ""}
      />
      {vehicle?.imageUrl ? (
        <figure className="mx-6 mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {/* biome-ignore lint/performance/noImgElement: remote MinIO URLs are managed by the core service. */}
          <img
            src={vehicle.imageUrl}
            alt={`Imagem do veículo ${vehicle.model}`}
            className="h-36 w-60 rounded-lg object-cover"
          />
          <figcaption className="mt-3 text-sm font-semibold text-slate-700">
            Imagem atual
          </figcaption>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <input
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
              name="removeImage"
              type="checkbox"
              value="true"
            />
            Remover imagem
          </label>
        </figure>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200"
          href={cancelHref}
        >
          Cancelar
        </Link>
        <button
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  error?: string;
  htmlFor: string;
  label: string;
};

function FormField({
  children,
  className = "",
  error,
  htmlFor,
  label,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
