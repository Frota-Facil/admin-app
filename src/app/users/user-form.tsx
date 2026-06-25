import Link from "next/link";
import type { ReactNode } from "react";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";

type UserFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  cancelHref?: string;
  submitLabel?: string;
  user?: UserResponseDTO;
};

const fieldControlClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

export function UserForm({
  action,
  cancelHref = "/users",
  submitLabel = "Salvar",
  user,
}: UserFormProps) {
  return (
    <form
      action={action}
      className="w-full max-w-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-base font-bold tracking-normal text-slate-950">
          Dados do usuário
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Informe os dados de acesso e identificação do usuário.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        <FormField htmlFor="name" label="Nome">
          <input
            className={fieldControlClassName}
            defaultValue={user?.name}
            id="name"
            name="name"
            placeholder="Nome completo"
            required
          />
        </FormField>

        <FormField htmlFor="email" label="E-mail">
          <input
            className={fieldControlClassName}
            defaultValue={user?.email}
            id="email"
            name="email"
            placeholder="usuario@email.com"
            required
            type="email"
          />
        </FormField>

        <FormField htmlFor="password" label="Senha">
          <input
            className={fieldControlClassName}
            id="password"
            name="password"
            placeholder={user ? "Deixe em branco para manter" : "Senha"}
            required={!user}
            type="password"
          />
        </FormField>

        <FormField htmlFor="cpf" label="CPF">
          <input
            className={fieldControlClassName}
            defaultValue={user?.cpf}
            id="cpf"
            maxLength={11}
            minLength={11}
            name="cpf"
            placeholder="Somente números"
            required
          />
        </FormField>

        <FormField htmlFor="cnh" label="CNH">
          <input
            className={fieldControlClassName}
            defaultValue={user?.cnh ?? ""}
            id="cnh"
            maxLength={11}
            minLength={11}
            name="cnh"
            placeholder="Somente números"
          />
        </FormField>

        <FormField htmlFor="phone" label="Telefone">
          <input
            className={fieldControlClassName}
            defaultValue={user?.phone}
            id="phone"
            maxLength={14}
            minLength={10}
            name="phone"
            placeholder="DDD + número"
            required
          />
        </FormField>

        <FormField htmlFor="department" label="Departamento">
          <input
            className={fieldControlClassName}
            defaultValue={user?.department ?? ""}
            id="department"
            name="department"
            placeholder="Ex.: Operações"
          />
        </FormField>

        <FormField htmlFor="role" label="Perfil">
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
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200"
          href={cancelHref}
        >
          Cancelar
        </Link>
        <button
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          type="submit"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  children: ReactNode;
  htmlFor: string;
  label: string;
};

function FormField({ children, htmlFor, label }: FormFieldProps) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
