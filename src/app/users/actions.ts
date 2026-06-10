"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateUserDTO } from "@/server/contracts/users/create-user-schema";
import type { UpdateUserDTO } from "@/server/contracts/users/update-user-schema";
import { createUserUseCase } from "@/server/use-cases/create-user-use-case";
import { deleteUserUseCase } from "@/server/use-cases/delete-user-use-case";
import { updateUserUseCase } from "@/server/use-cases/update-user-use-case";

function optionalValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" && value ? value : undefined;
}

function requiredValue(formData: FormData, field: string) {
  return String(formData.get(field) ?? "");
}

export async function createUserAction(formData: FormData) {
  const input: CreateUserDTO = {
    name: requiredValue(formData, "name"),
    email: requiredValue(formData, "email"),
    password: requiredValue(formData, "password"),
    cpf: requiredValue(formData, "cpf"),
    cnh: optionalValue(formData, "cnh"),
    phone: requiredValue(formData, "phone"),
    department: optionalValue(formData, "department"),
    role: requiredValue(formData, "role") as CreateUserDTO["role"],
  };

  await createUserUseCase(input);
  revalidatePath("/");
  redirect("/");
}

export async function updateUserAction(id: string, formData: FormData) {
  const input: UpdateUserDTO = {
    name: requiredValue(formData, "name"),
    email: requiredValue(formData, "email"),
    password: optionalValue(formData, "password"),
    cpf: requiredValue(formData, "cpf"),
    cnh: optionalValue(formData, "cnh"),
    phone: requiredValue(formData, "phone"),
    department: optionalValue(formData, "department"),
    role: requiredValue(formData, "role") as UpdateUserDTO["role"],
  };

  await updateUserUseCase(id, input);
  revalidatePath("/");
  redirect("/");
}

export async function deleteUserAction(id: string) {
  await deleteUserUseCase(id);
  revalidatePath("/");
}
