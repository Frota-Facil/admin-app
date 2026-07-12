"use client";

import Link from "next/link";
import type { ChangeEvent, ReactNode } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import type { VehicleFormState } from "@/app/vehicles/actions";
import { ImageCropModal } from "@/components/ui/ImageCropModal";
import {
  VEHICLE_STATUSES,
  type VehicleStatus,
} from "@/server/contracts/vehicles/status";
import {
  VEHICLE_TYPES,
  type VehicleType,
} from "@/server/contracts/vehicles/type";
import type { VehicleResponseDTO } from "@/server/contracts/vehicles/vehicle-response";
import { getCroppedImageFile } from "@/utils/crop-image";
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

const VEHICLE_IMAGE_ASPECT_RATIO = 16 / 9;

type AcceptedVehicleImageMimeType = "image/jpeg" | "image/png" | "image/webp";

type PendingCropImage = {
  fileName: string;
  mimeType: AcceptedVehicleImageMimeType;
  src: string;
};

type CroppedVehicleImage = {
  file: File;
  previewUrl: string;
};

const acceptedVehicleImageMimeTypes = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const vehicleImageMimeTypeByExtension: Record<
  string,
  AcceptedVehicleImageMimeType
> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function VehicleForm({
  action,
  cancelHref = "/vehicles",
  submitLabel = "Salvar",
  vehicle,
}: VehicleFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [plate, setPlate] = useState(normalizePlate(vehicle?.plate ?? ""));
  const [cropError, setCropError] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<CroppedVehicleImage | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | undefined>();
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [pendingCropImage, setPendingCropImage] =
    useState<PendingCropImage | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldErrors = state.fieldErrors ?? {};
  const previewImageUrl = croppedImage?.previewUrl ?? vehicle?.imageUrl ?? null;

  useEffect(() => {
    return () => {
      if (pendingCropImage) {
        URL.revokeObjectURL(pendingCropImage.src);
      }
    };
  }, [pendingCropImage]);

  useEffect(() => {
    return () => {
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage.previewUrl);
      }
    };
  }, [croppedImage]);

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFormAction(formData: FormData) {
    formData.delete("image");

    if (croppedImage) {
      formData.set("image", croppedImage.file);
    }

    formAction(formData);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setCropError(null);
    setImageError(undefined);

    if (!file) {
      return;
    }

    const mimeType = resolveVehicleImageMimeType(file);

    if (!mimeType) {
      setImageError("Selecione uma imagem JPG, PNG ou WebP.");
      clearFileInput();
      return;
    }

    setPendingCropImage({
      fileName: file.name,
      mimeType,
      src: URL.createObjectURL(file),
    });
  }

  function handleCancelCrop() {
    setCropError(null);
    setIsApplyingCrop(false);
    setPendingCropImage(null);
    clearFileInput();
  }

  async function handleApplyCrop(croppedAreaPixels: Area) {
    if (!pendingCropImage || isApplyingCrop) {
      return;
    }

    setCropError(null);
    setIsApplyingCrop(true);

    try {
      const file = await getCroppedImageFile({
        croppedAreaPixels,
        fileName: buildCroppedVehicleImageFileName(
          pendingCropImage.fileName,
          pendingCropImage.mimeType,
        ),
        imageSrc: pendingCropImage.src,
        mimeType: pendingCropImage.mimeType,
      });

      setCroppedImage({
        file,
        previewUrl: URL.createObjectURL(file),
      });
      setImageError(undefined);
      setPendingCropImage(null);
      setRemoveImage(false);
      clearFileInput();
    } catch (error) {
      setCropError(getCropImageErrorMessage(error));
    } finally {
      setIsApplyingCrop(false);
    }
  }

  return (
    <form
      action={handleFormAction}
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
          error={imageError}
          htmlFor="image"
          label="Imagem do veículo"
        >
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
            <input
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-slate-600 file:mr-4 file:h-9 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              id="image"
              onChange={handleImageChange}
              ref={fileInputRef}
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
      {previewImageUrl ? (
        <figure className="mx-6 mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {/* biome-ignore lint/performance/noImgElement: vehicle previews can be local blob URLs before upload. */}
          <img
            src={previewImageUrl}
            alt={
              croppedImage
                ? "Imagem ajustada do veículo"
                : `Imagem do veículo ${vehicle?.model ?? ""}`
            }
            className="aspect-video h-auto w-full max-w-80 rounded-lg object-cover"
          />
          <figcaption className="mt-3 text-sm font-semibold text-slate-700">
            {croppedImage ? "Imagem ajustada selecionada" : "Imagem atual"}
          </figcaption>
          {vehicle?.imageUrl && !croppedImage ? (
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input
                checked={removeImage}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                name="removeImage"
                onChange={(event) => setRemoveImage(event.target.checked)}
                type="checkbox"
                value="true"
              />
              Remover imagem
            </label>
          ) : null}
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

      {pendingCropImage ? (
        <ImageCropModal
          aspectRatio={VEHICLE_IMAGE_ASPECT_RATIO}
          errorMessage={cropError}
          imageSrc={pendingCropImage.src}
          isApplying={isApplyingCrop}
          onApply={(croppedAreaPixels) => {
            void handleApplyCrop(croppedAreaPixels);
          }}
          onCancel={handleCancelCrop}
          title="Ajustar imagem do veículo"
        />
      ) : null}
    </form>
  );
}

function resolveVehicleImageMimeType(file: File) {
  if (
    acceptedVehicleImageMimeTypes.has(file.type) &&
    isAcceptedVehicleImageMimeType(file.type)
  ) {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLocaleLowerCase("pt-BR");

  if (!extension) {
    return null;
  }

  return vehicleImageMimeTypeByExtension[extension] ?? null;
}

function isAcceptedVehicleImageMimeType(
  mimeType: string,
): mimeType is AcceptedVehicleImageMimeType {
  return acceptedVehicleImageMimeTypes.has(mimeType);
}

function buildCroppedVehicleImageFileName(
  fileName: string,
  mimeType: AcceptedVehicleImageMimeType,
) {
  const baseName = fileName.replace(/\.[^/.]+$/, "").trim() || "veiculo";
  const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];

  return `${baseName}-ajustada.${extension}`;
}

function getCropImageErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível ajustar a imagem. Tente novamente.";
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
