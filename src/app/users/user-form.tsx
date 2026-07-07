"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { ChangeEvent, ReactNode } from "react";
import { useActionState, useEffect, useState } from "react";
import type { UserFormState } from "@/app/users/actions";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import { formatCpf, formatPhone, onlyNumbers } from "@/utils/masks";

type UserFormProps = {
  action: (
    state: UserFormState,
    formData: FormData,
  ) => UserFormState | Promise<UserFormState>;
  cancelHref?: string;
  submitLabel?: string;
  user?: UserResponseDTO;
};

const fieldControlClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

const passwordControlClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

const acceptedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

export function UserForm({
  action,
  cancelHref = "/users",
  submitLabel = "Salvar",
  user,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [state, formAction, isPending] = useActionState(action, {});
  const [cpf, setCpf] = useState(formatCpf(user?.cpf ?? ""));
  const [cnh, setCnh] = useState(onlyNumbers(user?.cnh ?? "").slice(0, 11));
  const [phone, setPhone] = useState(formatPhone(user?.phone ?? ""));
  const fieldErrors = state.fieldErrors ?? {};

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    if (!file) {
      setPhotoPreviewUrl(null);
      setPhotoError("");
      setPhotoFileName("");
      return;
    }

    if (!acceptedPhotoTypes.includes(file.type)) {
      event.target.value = "";
      setPhotoPreviewUrl(null);
      setPhotoError("A foto do motorista deve ser JPG, PNG ou WebP.");
      setPhotoFileName("");
      return;
    }

    setPhotoPreviewUrl(URL.createObjectURL(file));
    setPhotoError("");
    setPhotoFileName(file.name);
  }

  const previewUrl = photoPreviewUrl ?? user?.photoUrl ?? null;

  return (
    <form
      action={formAction}
      className="w-full max-w-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      noValidate
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-base font-bold tracking-normal text-slate-950">
          Dados do usuário
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Informe os dados de acesso e identificação do usuário.
        </p>
      </div>

      {state.error ? (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        <FormField error={fieldErrors.name} htmlFor="name" label="Nome">
          <input
            className={fieldControlClassName}
            defaultValue={user?.name}
            id="name"
            name="name"
            placeholder="Nome completo"
          />
        </FormField>

        <FormField error={fieldErrors.email} htmlFor="email" label="E-mail">
          <input
            className={fieldControlClassName}
            defaultValue={user?.email}
            id="email"
            name="email"
            placeholder="usuario@email.com"
            type="email"
          />
        </FormField>

        <FormField
          error={fieldErrors.password}
          htmlFor="password"
          label="Senha"
        >
          <div className="relative">
            <input
              className={passwordControlClassName}
              id="password"
              name="password"
              placeholder={user ? "Deixe em branco para manter" : "Senha"}
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        </FormField>

        <FormField error={fieldErrors.cpf} htmlFor="cpf" label="CPF">
          <input
            className={fieldControlClassName}
            id="cpf"
            inputMode="numeric"
            maxLength={14}
            name="cpf"
            onChange={(event) => setCpf(formatCpf(event.target.value))}
            placeholder="000.000.000-00"
            value={cpf}
          />
        </FormField>

        <FormField error={fieldErrors.cnh} htmlFor="cnh" label="CNH">
          <input
            className={fieldControlClassName}
            id="cnh"
            inputMode="numeric"
            maxLength={11}
            name="cnh"
            onChange={(event) =>
              setCnh(onlyNumbers(event.target.value).slice(0, 11))
            }
            placeholder="Somente números"
            value={cnh}
          />
        </FormField>

        <FormField error={fieldErrors.phone} htmlFor="phone" label="Telefone">
          <input
            className={fieldControlClassName}
            id="phone"
            inputMode="numeric"
            maxLength={15}
            name="phone"
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            placeholder="(00) 00000-0000"
            value={phone}
          />
        </FormField>

        <FormField
          error={fieldErrors.department}
          htmlFor="department"
          label="Departamento"
        >
          <input
            className={fieldControlClassName}
            defaultValue={user?.department ?? ""}
            id="department"
            name="department"
            placeholder="Ex.: Operações"
          />
        </FormField>

        <FormField error={fieldErrors.role} htmlFor="role" label="Perfil">
          <select
            className={fieldControlClassName}
            defaultValue={user?.role ?? "driver"}
            id="role"
            name="role"
          >
            <option value="driver">Motorista</option>
            <option value="admin">Administrador</option>
          </select>
        </FormField>

        <FormField
          className="md:col-span-2 xl:col-span-3"
          error={fieldErrors.photo}
          htmlFor="photo"
          label="Foto do motorista"
        >
          <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 ">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center h-">
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  id="photo"
                  name="photo"
                  onChange={handlePhotoChange}
                  type="file"
                />
                <label
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-100"
                  htmlFor="photo"
                >
                  Escolher arquivo
                </label>
                <span className="min-w-0 truncate text-sm text-slate-600">
                  {photoFileName || "Nenhum arquivo escolhido"}
                </span>
              </div>

              {photoError ? (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  {photoError}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">
                Formatos aceitos: JPG, PNG ou WebP.
              </p>
            </div>

            {previewUrl ? (
              <figure className="flex shrink-0 items-center gap-3 ">
                {/* biome-ignore lint/performance/noImgElement: preview uses local object URLs and remote MinIO URLs. */}
                <img
                  alt="Prévia da foto do motorista"
                  className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200"
                  src={previewUrl}
                />
                <figcaption className="sr-only">
                  {photoPreviewUrl ? "Prévia da foto" : "Foto atual"}
                </figcaption>
              </figure>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                Sem foto
              </div>
            )}
          </div>
        </FormField>
      </div>

      <input
        defaultValue={user?.photoUrl ?? ""}
        name="currentPhotoUrl"
        type="hidden"
      />
      {user?.photoUrl ? (
        <div className="mx-6 mb-6">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
              name="removePhoto"
              type="checkbox"
              value="true"
            />
            Remover foto atual
          </label>
        </div>
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
