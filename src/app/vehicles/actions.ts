"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { VehicleRequestDTO } from "@/server/contracts/vehicles/register-vehicle-request";
import { createUploadPresignedUrl } from "@/server/services/core/create-upload-presigned";
import { deleteVehicleUseCase } from "@/server/use-cases/delete-vehicle-use-case";
import { registerVehicleUseCase } from "@/server/use-cases/register-vehicle-use-case";
import { updateVehicleUseCase } from "@/server/use-cases/update-vehicle-use-case";

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
  const { uploadUrl, fileUrl, signedUploadHost } =
    await createUploadPresignedUrl({
      contentType: file.type,
    });

  console.log("Uploading vehicle image to MinIO with presigned URL", {
    uploadUrl,
    fileUrl,
    signedUploadHost,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      ...(signedUploadHost ? { Host: signedUploadHost } : {}),
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
  return {
    plate: requiredValue(formData, "plate"),
    model: requiredValue(formData, "model"),
    year: Number(requiredValue(formData, "year")),
    odometer: Number(requiredValue(formData, "odometer")),
    imageUrl: await vehicleImageUrl(formData),
    status: requiredValue(formData, "status") as VehicleRequestDTO["status"],
    type: requiredValue(formData, "type") as VehicleRequestDTO["type"],
  };
}

export async function registerVehicleAction(formData: FormData) {
  await registerVehicleUseCase(await vehicleInput(formData));
  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  await updateVehicleUseCase(id, await vehicleInput(formData));
  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function deleteVehicleAction(id: string) {
  await deleteVehicleUseCase(id);
  revalidatePath("/vehicles");
}
