"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateUserDTO } from "@/server/contracts/users/create-user-schema";
import type { UpdateUserDTO } from "@/server/contracts/users/update-user-schema";
import { createUploadPresignedUrl } from "@/server/services/core/create-upload-presigned";
import { createUserUseCase } from "@/server/use-cases/create-user-use-case";
import { deleteUserUseCase } from "@/server/use-cases/delete-user-use-case";
import { updateUserUseCase } from "@/server/use-cases/update-user-use-case";

const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UserFormState = {
  error?: string;
};

function optionalValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" && value ? value : undefined;
}

function requiredValue(formData: FormData, field: string) {
  return String(formData.get(field) ?? "");
}

function nullableValue(formData: FormData, field: string) {
  const value = requiredValue(formData, field).trim();

  return value || null;
}

function userPhotoFile(formData: FormData) {
  const value = formData.get("photo");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  if (!allowedPhotoTypes.has(value.type)) {
    throw new Error("A foto do motorista deve ser JPG, PNG ou WebP.");
  }

  return value;
}

async function uploadUserPhoto(file: File) {
  const { uploadUrl, fileUrl } = await createUploadPresignedUrl({
    contentType: file.type,
    folder: "users",
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
      `Não foi possível enviar a foto do motorista. MinIO respondeu ${response.status} ${response.statusText}: ${details}`,
    );
  }

  return fileUrl;
}

async function userPhotoUrl(formData: FormData) {
  const photo = userPhotoFile(formData);

  if (photo) {
    return uploadUserPhoto(photo);
  }

  if (formData.get("removePhoto") === "true") {
    return null;
  }

  return nullableValue(formData, "currentPhotoUrl");
}

async function createUserInput(formData: FormData): Promise<CreateUserDTO> {
  return {
    name: requiredValue(formData, "name"),
    email: requiredValue(formData, "email"),
    password: requiredValue(formData, "password"),
    cpf: requiredValue(formData, "cpf"),
    cnh: optionalValue(formData, "cnh"),
    phone: requiredValue(formData, "phone"),
    photoUrl: await userPhotoUrl(formData),
    department: optionalValue(formData, "department"),
    role: requiredValue(formData, "role") as CreateUserDTO["role"],
  };
}

async function updateUserInput(formData: FormData): Promise<UpdateUserDTO> {
  return {
    name: requiredValue(formData, "name"),
    email: requiredValue(formData, "email"),
    password: optionalValue(formData, "password"),
    cpf: requiredValue(formData, "cpf"),
    cnh: optionalValue(formData, "cnh"),
    phone: requiredValue(formData, "phone"),
    photoUrl: await userPhotoUrl(formData),
    department: optionalValue(formData, "department"),
    role: requiredValue(formData, "role") as UpdateUserDTO["role"],
  };
}

export async function createUserAction(
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    await createUserUseCase(await createUserInput(formData));
  } catch (error) {
    return {
      error: userFormErrorMessage(error),
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(
  id: string,
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    await updateUserUseCase(id, await updateUserInput(formData));
  } catch (error) {
    return {
      error: userFormErrorMessage(error),
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUserAction(id: string) {
  await deleteUserUseCase(id);
  revalidatePath("/users");
}

function userFormErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Não foi possível salvar o usuário. Tente novamente.";
  }

  if (error.message === "A foto do motorista deve ser JPG, PNG ou WebP.") {
    return error.message;
  }

  if (error.message.includes("Não foi possível enviar a foto do motorista")) {
    return "Não foi possível enviar a foto do motorista. Tente novamente.";
  }

  return "Não foi possível salvar o usuário. Tente novamente.";
}
