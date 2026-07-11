"use client";

import type { ReactNode } from "react";
import { DetailsModal } from "@/components/ui/DetailsModal";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import { formatDateTime } from "@/utils/date-format";

type UserDetailsModalProps = {
  onClose: () => void;
  user: UserResponseDTO;
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  administrador: "Administrador",
  driver: "Motorista",
  gestor: "Gestor",
  manager: "Gestor",
  motorista: "Motorista",
};

export function UserDetailsModal({ onClose, user }: UserDetailsModalProps) {
  const roleLabel = roleLabelFor(user.role);
  const title = isDriverRole(user.role)
    ? "Detalhes do motorista"
    : "Detalhes do usuário";

  return (
    <DetailsModal onClose={onClose} title={title}>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-6 text-center">
          <UserPhoto user={user} />
          <h3 className="mt-4 break-words text-base font-bold tracking-normal text-slate-950">
            {user.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{roleLabel}</p>
          <div className="mt-4 flex justify-center">
            <UserStatusBadge user={user} />
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <UserDetailItem label="Nome" value={user.name} />
          <UserDetailItem label="E-mail" value={user.email} />
          <UserDetailItem label="CPF" value={user.cpf} />
          <UserDetailItem label="CNH" value={user.cnh} />
          <UserDetailItem label="Telefone" value={formatPhone(user.phone)} />
          <UserDetailItem label="Departamento" value={user.department} />
          <UserDetailItem label="Perfil" value={roleLabel} />
          <UserDetailItem
            label="Status"
            value={<UserStatusBadge user={user} />}
          />
          <UserDetailItem
            label="Cadastrado em"
            value={formatDateTime(user.createdAt)}
          />
          <UserDetailItem
            label="Atualizado em"
            value={formatDateTime(user.updatedAt)}
          />
        </dl>
      </div>
    </DetailsModal>
  );
}

type UserPhotoProps = {
  user: UserResponseDTO;
};

function UserPhoto({ user }: UserPhotoProps) {
  if (user.photoUrl) {
    return (
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-1 ring-slate-200">
        {/* biome-ignore lint/performance/noImgElement: remote user photo URLs are managed by the core service. */}
        <img
          alt={`Foto de ${user.name}`}
          className="h-full w-full object-cover"
          src={user.photoUrl}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-700 ring-1 ring-inset ring-blue-100">
      {initialsFor(user.name)}
    </div>
  );
}

type UserDetailItemProps = {
  label: string;
  value?: ReactNode;
};

function UserDetailItem({ label, value }: UserDetailItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </dd>
    </div>
  );
}

type UserStatusBadgeProps = {
  user: UserResponseDTO;
};

function UserStatusBadge({ user }: UserStatusBadgeProps) {
  const isActive = isUserActive(user);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
}

function isUserActive(user: UserResponseDTO) {
  if (typeof user.active === "boolean") {
    return user.active;
  }

  if (typeof user.isActive === "boolean") {
    return user.isActive;
  }

  if (typeof user.status === "string") {
    const normalizedStatus = normalizeText(user.status);

    return !["inactive", "inativo", "disabled", "desativado"].includes(
      normalizedStatus,
    );
  }

  return true;
}

function roleLabelFor(role: string) {
  const normalizedRole = normalizeText(role);

  return roleLabels[normalizedRole] ?? role;
}

function isDriverRole(role: string) {
  return ["driver", "motorista"].includes(normalizeText(role));
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

function initialsFor(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const firstInitial = nameParts[0]?.[0] ?? "U";
  const lastInitial =
    nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? "") : "";

  return `${firstInitial}${lastInitial}`.toLocaleUpperCase("pt-BR");
}
