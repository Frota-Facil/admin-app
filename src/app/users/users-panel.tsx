"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { deleteUserWithResultAction } from "@/app/users/actions";
import { useToast } from "@/components/toast/ToastProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UserDetailsModal } from "@/components/users/UserDetailsModal";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";

type UsersPanelProps = {
  users: UserResponseDTO[];
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  administrador: "Administrador",
  driver: "Motorista",
  gestor: "Gestor",
  manager: "Gestor",
  motorista: "Motorista",
};

export function UsersPanel({ users }: UsersPanelProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponseDTO | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      const searchableFields = [user.name, user.cpf, user.cnh, user.department];

      return searchableFields.some((field) =>
        normalizeText(field ?? "").includes(normalizedSearch),
      );
    });
  }, [search, users]);

  async function handleConfirmDeleteUser() {
    if (!userToDelete || isDeletingUser) {
      return;
    }

    const user = userToDelete;
    setIsDeletingUser(true);

    try {
      const result = await deleteUserWithResultAction(user.id);

      if (!result.ok) {
        showToast({
          description: result.error,
          title: "Erro ao excluir usuário",
        });
        return;
      }

      setUserToDelete(null);
      showToast({
        description: `${user.name} foi excluído com sucesso.`,
        title: "Usuário excluído",
      });
      router.refresh();
    } catch {
      showToast({
        description: "Não foi possível excluir o usuário. Tente novamente.",
        title: "Erro ao excluir usuário",
      });
    } finally {
      setIsDeletingUser(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              Gestão de Usuários
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Motoristas e funcionários
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="relative block w-[280px] max-w-full">
              <span className="sr-only">Buscar usuários</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                type="search"
                value={search}
              />
            </label>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-600">
            {users.length}{" "}
            {users.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}
          </p>

          <Link
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/users/new"
          >
            <PlusIcon className="h-4 w-4" />
            Novo Usuário
          </Link>
        </div>

        {filteredUsers.length === 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Nenhum usuário encontrado.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                onRequestDelete={setUserToDelete}
                onViewDetails={setSelectedUser}
                user={user}
              />
            ))}
          </section>
        )}
      </div>

      {selectedUser ? (
        <UserDetailsModal
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel="Excluir usuário"
        description={
          userToDelete
            ? `Tem certeza que deseja excluir o usuário ${userToDelete.name}? Esta ação não poderá ser desfeita.`
            : ""
        }
        destructive
        loading={isDeletingUser}
        onConfirm={handleConfirmDeleteUser}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
          }
        }}
        open={Boolean(userToDelete)}
        title="Excluir usuário?"
      />
    </div>
  );
}

type UserCardProps = {
  onRequestDelete: (user: UserResponseDTO) => void;
  onViewDetails: (user: UserResponseDTO) => void;
  user: UserResponseDTO;
};

function UserCard({ onRequestDelete, onViewDetails, user }: UserCardProps) {
  const roleLabel = roleLabelFor(user.role);
  const isAdmin = roleLabel === "Administrador" || roleLabel === "Gestor";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <UserAvatar isAdmin={isAdmin} user={user} />

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-normal text-slate-950">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>
          </div>
        </div>

        <UserStatusBadge user={user} />
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <UserInfoRow label="Departamento" value={user.department} />
        <UserInfoRow label="CNH" value={user.cnh} />
        <UserInfoRow label="Telefone" value={formatPhone(user.phone)} />
      </dl>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          aria-label={`Ver detalhes do usuário ${user.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={() => onViewDetails(user)}
          title="Ver detalhes"
          type="button"
        >
          <EyeIcon className="h-4 w-4" />
        </button>

        <Link
          aria-label={`Editar usuário ${user.name}`}
          className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          href={`/users/${user.id}/edit`}
        >
          Editar
        </Link>

        <button
          aria-label={`Excluir usuário ${user.name}`}
          className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
          onClick={() => onRequestDelete(user)}
          type="button"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

type UserAvatarProps = {
  isAdmin: boolean;
  user: UserResponseDTO;
};

function UserAvatar({ isAdmin, user }: UserAvatarProps) {
  if (user.photoUrl) {
    return (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200">
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
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        isAdmin ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
      }`}
    >
      {isAdmin ? (
        <ShieldIcon className="h-5 w-5" />
      ) : (
        <UserIcon className="h-5 w-5" />
      )}
    </div>
  );
}

type UserInfoRowProps = {
  label: string;
  value?: string | null;
};

function UserInfoRow({ label, value }: UserInfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate text-right font-semibold text-slate-900">
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

type IconProps = {
  className?: string;
};

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m20 20-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21s7-3.5 7-10V6.5L12 4 5 6.5V11c0 6.5 7 10 7 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
