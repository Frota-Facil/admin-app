"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateUserDTO } from "@/server/contracts/users/create-user-schema";
import type { UpdateUserDTO } from "@/server/contracts/users/update-user-schema";
import { createUploadPresignedUrl } from "@/server/services/core/create-upload-presigned";
import { createUserUseCase } from "@/server/use-cases/create-user-use-case";
import { deleteUserUseCase } from "@/server/use-cases/delete-user-use-case";
import { updateUserUseCase } from "@/server/use-cases/update-user-use-case";
import { onlyNumbers } from "@/utils/masks";

const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type UserField =
  | "name"
  | "email"
  | "password"
  | "cpf"
  | "cnh"
  | "phone"
  | "department"
  | "role"
  | "photo";

export type UserFormState = {
  error?: string;
  fieldErrors?: Partial<Record<UserField, string>>;
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
    name: requiredValue(formData, "name").trim(),
    email: requiredValue(formData, "email").trim(),
    password: requiredValue(formData, "password"),
    cpf: onlyNumbers(requiredValue(formData, "cpf")),
    cnh: onlyNumbers(requiredValue(formData, "cnh")),
    phone: onlyNumbers(requiredValue(formData, "phone")),
    photoUrl: await userPhotoUrl(formData),
    department: optionalValue(formData, "department")?.trim(),
    role: requiredValue(formData, "role") as CreateUserDTO["role"],
  };
}

async function updateUserInput(formData: FormData): Promise<UpdateUserDTO> {
  return {
    name: requiredValue(formData, "name").trim(),
    email: requiredValue(formData, "email").trim(),
    password: optionalValue(formData, "password"),
    cpf: onlyNumbers(requiredValue(formData, "cpf")),
    cnh: onlyNumbers(requiredValue(formData, "cnh")),
    phone: onlyNumbers(requiredValue(formData, "phone")),
    photoUrl: await userPhotoUrl(formData),
    department: optionalValue(formData, "department")?.trim(),
    role: requiredValue(formData, "role") as UpdateUserDTO["role"],
  };
}

function validateUserForm(
  formData: FormData,
  isEditing: boolean,
): UserFormState {
  const fieldErrors: UserFormState["fieldErrors"] = {};
  const name = requiredValue(formData, "name").trim();
  const email = requiredValue(formData, "email").trim();
  const password = requiredValue(formData, "password");
  const cpf = onlyNumbers(requiredValue(formData, "cpf"));
  const cnh = onlyNumbers(requiredValue(formData, "cnh"));
  const phone = onlyNumbers(requiredValue(formData, "phone"));
  const role = requiredValue(formData, "role").trim();

  if (!name) {
    fieldErrors.name = "Nome obrigatório.";
  }

  if (!email) {
    fieldErrors.email = "E-mail obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "E-mail inválido.";
  }

  if (!isEditing && !password) {
    fieldErrors.password = "Senha obrigatória.";
  }

  if (cpf.length < 11) {
    fieldErrors.cpf = "CPF incompleto. Informe 11 números.";
  } else if (cpf.length > 11) {
    fieldErrors.cpf = "CPF deve ter 11 números.";
  }

  if (cnh.length < 11) {
    fieldErrors.cnh = "CNH incompleta. Informe 11 números.";
  } else if (cnh.length > 11) {
    fieldErrors.cnh = "CNH deve ter 11 números.";
  }

  if (phone.length < 10) {
    fieldErrors.phone = "Telefone incompleto. Informe DDD + número.";
  } else if (phone.length > 11) {
    fieldErrors.phone = "Telefone deve ter no máximo 11 números.";
  }

  if (!role) {
    fieldErrors.role = "Perfil obrigatório.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Verifique os campos informados.",
      fieldErrors,
    };
  }

  return {};
}

export async function createUserAction(
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const validation = validateUserForm(formData, false);

  if (validation.fieldErrors) {
    return validation;
  }

  try {
    await createUserUseCase(await createUserInput(formData));
  } catch (error) {
    return userFormErrorState(error);
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(
  id: string,
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const validation = validateUserForm(formData, true);

  if (validation.fieldErrors) {
    return validation;
  }

  try {
    await updateUserUseCase(id, await updateUserInput(formData));
  } catch (error) {
    return userFormErrorState(error);
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUserAction(id: string) {
  await deleteUserUseCase(id);
  revalidatePath("/users");
}

function userFormErrorState(error: unknown): UserFormState {
  const message = getErrorMessage(error);
  const normalizedMessage = normalizeErrorMessage(message);

  if (message === "A foto do motorista deve ser JPG, PNG ou WebP.") {
    return {
      error: "Verifique os campos informados.",
      fieldErrors: {
        photo: message,
      },
    };
  }

  if (message.includes("Não foi possível enviar a foto do motorista")) {
    return {
      error: "Não foi possível enviar a foto do motorista. Tente novamente.",
    };
  }

  if (
    normalizedMessage.includes("email") ||
    normalizedMessage.includes("e-mail")
  ) {
    return fieldError("email", "E-mail já cadastrado.");
  }

  if (normalizedMessage.includes("cpf")) {
    return fieldError("cpf", "CPF já cadastrado.");
  }

  if (normalizedMessage.includes("cnh")) {
    return fieldError("cnh", "CNH já cadastrada.");
  }

  if (
    normalizedMessage.includes("telefone") ||
    normalizedMessage.includes("phone")
  ) {
    return fieldError("phone", "Telefone incompleto. Informe DDD + número.");
  }

  return {
    error: message || "Não foi possível salvar o usuário. Tente novamente.",
  };
}

function fieldError(field: UserField, message: string): UserFormState {
  return {
    error: "Verifique os campos informados.",
    fieldErrors: {
      [field]: message,
    },
  };
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Não foi possível salvar o usuário. Tente novamente.";
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

  return "Não foi possível salvar o usuário. Tente novamente.";
}

function normalizeErrorMessage(message: string) {
  return message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
