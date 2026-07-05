"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { VehicleRequestDTO } from "@/server/contracts/vehicles/register-vehicle-request";
import { createUploadPresignedUrl } from "@/server/services/core/create-upload-presigned";
import { deleteVehicleUseCase } from "@/server/use-cases/delete-vehicle-use-case";
import { registerVehicleUseCase } from "@/server/use-cases/register-vehicle-use-case";
import { updateVehicleUseCase } from "@/server/use-cases/update-vehicle-use-case";
import { normalizePlate } from "@/utils/masks";

type VehicleField = "plate" | "model" | "year" | "odometer" | "status" | "type";

export type VehicleFormState = {
  error?: string;
  fieldErrors?: Partial<Record<VehicleField, string>>;
};

function requiredValue(formData: FormData, field: string) {
  return String(formData.get(field) ?? "");
}

function nullableValue(formData: FormData, field: string) {
  const value = requiredValue(formData, field).trim();

  return value || null;
}

function vehicleImageFile(formData: FormData) {
  const value = formData.get("image");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

async function uploadVehicleImage(file: File) {
  const { uploadUrl, fileUrl } = await createUploadPresignedUrl({
    contentType: file.type,
  });

  console.log("Uploading vehicle image to MinIO with presigned URL", {
    uploadUrl,
    fileUrl,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Não foi possível enviar a imagem do veículo. MinIO respondeu ${response.status} ${response.statusText}: ${details}`,
    );
  }

  return fileUrl;
}

async function vehicleImageUrl(formData: FormData) {
  const image = vehicleImageFile(formData);

  if (image) {
    return uploadVehicleImage(image);
  }

  if (formData.get("removeImage") === "true") {
    return null;
  }

  return nullableValue(formData, "currentImageUrl");
}

async function vehicleInput(formData: FormData): Promise<VehicleRequestDTO> {
  const plate = normalizePlate(requiredValue(formData, "plate"));

  return {
    plate,
    model: requiredValue(formData, "model").trim(),
    year: Number(requiredValue(formData, "year")),
    odometer: Number(requiredValue(formData, "odometer")),
    imageUrl: await vehicleImageUrl(formData),
    status: requiredValue(formData, "status") as VehicleRequestDTO["status"],
    type: requiredValue(formData, "type") as VehicleRequestDTO["type"],
  };
}

function validateVehicleForm(formData: FormData): VehicleFormState {
  const fieldErrors: VehicleFormState["fieldErrors"] = {};
  const plate = normalizePlate(requiredValue(formData, "plate"));
  const model = requiredValue(formData, "model").trim();
  const year = requiredValue(formData, "year").trim();
  const odometer = requiredValue(formData, "odometer").trim();
  const status = requiredValue(formData, "status").trim();
  const type = requiredValue(formData, "type").trim();

  if (!plate) {
    fieldErrors.plate = "Placa obrigatória.";
  }

  if (!model) {
    fieldErrors.model = "Modelo obrigatório.";
  }

  if (!year) {
    fieldErrors.year = "Ano obrigatório.";
  } else if (!Number.isInteger(Number(year))) {
    fieldErrors.year = "Ano inválido.";
  }

  if (!odometer) {
    fieldErrors.odometer = "Quilometragem obrigatória.";
  } else if (!Number.isFinite(Number(odometer)) || Number(odometer) < 0) {
    fieldErrors.odometer = "Quilometragem inválida.";
  }

  if (!status) {
    fieldErrors.status = "Status obrigatório.";
  }

  if (!type) {
    fieldErrors.type = "Tipo obrigatório.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Verifique os campos informados.",
      fieldErrors,
    };
  }

  return {};
}

export async function registerVehicleAction(
  _state: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const validation = validateVehicleForm(formData);

  if (validation.fieldErrors) {
    return validation;
  }

  try {
    await registerVehicleUseCase(await vehicleInput(formData));
  } catch (error) {
    return vehicleFormErrorState(error);
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateVehicleAction(
  id: string,
  _state: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const validation = validateVehicleForm(formData);

  if (validation.fieldErrors) {
    return validation;
  }

  try {
    await updateVehicleUseCase(id, await vehicleInput(formData));
  } catch (error) {
    return vehicleFormErrorState(error);
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function deleteVehicleAction(id: string) {
  await deleteVehicleUseCase(id);
  revalidatePath("/vehicles");
}

function vehicleFormErrorState(error: unknown): VehicleFormState {
  const message = getErrorMessage(error);
  const normalizedMessage = normalizeErrorMessage(message);

  if (
    normalizedMessage.includes("placa") ||
    normalizedMessage.includes("plate")
  ) {
    return {
      error: "Verifique os campos informados.",
      fieldErrors: {
        plate: "Placa já cadastrada.",
      },
    };
  }

  return {
    error: message || "Não foi possível salvar o veículo. Tente novamente.",
  };
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Não foi possível salvar o veículo. Tente novamente.";
  }

  if ("response" in error) {
    const response = error.response;

    if (response && typeof response === "object" && "data" in response) {
      const data = response.data;

      if (data && typeof data === "object" && "message" in data) {
        const message = data.message;

        if (typeof message === "string") {
          return message;
        }
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível salvar o veículo. Tente novamente.";
}

function normalizeErrorMessage(message: string) {
  return message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
