"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type IconProps = {
  className?: string;
};

type NavItem = {
  disabled?: boolean;
  href?: string;
  icon: ComponentType<IconProps>;
  label: string;
};

type SidebarProps = {
  isOpen: boolean;
};

const mainNavItems: NavItem[] = [
  { href: "/", icon: DashboardIcon, label: "Dashboard" },
  { href: "/vehicles", icon: VehicleIcon, label: "Veículos" },
  { href: "/users", icon: UsersIcon, label: "Usuários" },
  { href: "/requests", icon: RequestsIcon, label: "Solicitações" },
  { disabled: true, icon: HistoryIcon, label: "Histórico" },
  { disabled: true, icon: MonitoringIcon, label: "Monitoramento" },
];

const systemNavItems: NavItem[] = [
  { disabled: true, icon: BellIcon, label: "Notificações" },
  { disabled: true, icon: SettingsIcon, label: "Configurações" },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-y-auto bg-slate-950 text-slate-300 shadow-xl transition-all duration-300 ${
        isOpen ? "w-[264px]" : "w-[88px]"
      }`}
    >
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-white text-slate-950 shadow-sm">
          <Image
            alt="Logo do SIF"
            className="h-9 w-9 object-contain"
            height={40}
            priority
            src="/images/logo.png"
            width={40}
          />
        </div>

        {isOpen ? (
          <div className="min-w-0">
            <p className="text-base font-bold tracking-normal text-white">
              SIF
            </p>
            <p className="truncate text-xs text-slate-400">
              Sistema Integrado de Frotas
            </p>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-8 px-4 pt-2">
        <NavSection
          isOpen={isOpen}
          items={mainNavItems}
          pathname={pathname}
          title="Menu principal"
        />
        <NavSection
          isOpen={isOpen}
          items={systemNavItems}
          pathname={pathname}
          title="Sistema"
        />
      </nav>

      <div className="px-4 pb-6">
        <div
          className={`flex items-center rounded-lg bg-slate-900/80 ${
            isOpen ? "gap-3 p-3" : "justify-center p-2"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-sm font-bold text-blue-400">
            AD
          </div>
          {isOpen ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Administrador
              </p>
              <p className="truncate text-xs text-slate-500">Sessão ativa</p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

type NavSectionProps = {
  isOpen: boolean;
  items: NavItem[];
  pathname: string;
  title: string;
};

function NavSection({ isOpen, items, pathname, title }: NavSectionProps) {
  return (
    <section>
      {isOpen ? (
        <h2 className="mb-3 px-2 text-[11px] font-bold uppercase text-slate-600">
          {title}
        </h2>
      ) : null}

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <NavEntry isOpen={isOpen} item={item} pathname={pathname} />
          </li>
        ))}
      </ul>
    </section>
  );
}

type NavEntryProps = {
  isOpen: boolean;
  item: NavItem;
  pathname: string;
};

function NavEntry({ isOpen, item, pathname }: NavEntryProps) {
  const Icon = item.icon;
  const isActive = item.href
    ? item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
    : false;
  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      {isOpen ? <span className="truncate">{item.label}</span> : null}
    </>
  );
  const className = `flex h-10 items-center rounded-lg px-3 text-sm font-medium transition ${
    isOpen ? "gap-3" : "justify-center"
  } ${
    isActive
      ? "bg-blue-600/15 text-blue-400"
      : "text-slate-300 hover:bg-slate-900 hover:text-white"
  }`;

  if (item.disabled || !item.href) {
    return (
      <button
        aria-disabled="true"
        className={`${className} w-full cursor-not-allowed opacity-50`}
        title={item.label}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Link className={className} href={item.href} title={item.label}>
      {content}
    </Link>
  );
}

function DashboardIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3ZM14 5.5A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3ZM4 15.5A1.5 1.5 0 0 1 5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3ZM14 15.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function VehicleIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 14.5 5.5 10A2 2 0 0 1 7.4 8.6h7.2a2 2 0 0 1 1.8 1.1l2.1 4.2M5 17h14M6.5 17.5v1M17.5 17.5v1M7 14h.01M17 14h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 19a4 4 0 0 0-8 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19a3.5 3.5 0 0 0-3-3.46M17 6.45a2.5 2.5 0 0 1 0 5.1M4 19a3.5 3.5 0 0 1 3-3.46M7 6.45a2.5 2.5 0 0 0 0 5.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function RequestsIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 4.5h8M8 9h8M8 13.5h5M6.5 20h11A1.5 1.5 0 0 0 19 18.5v-13A1.5 1.5 0 0 0 17.5 4h-11A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HistoryIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 6.5V11h4.5M5.45 11A7 7 0 1 0 7.5 6.05M12 8v4l2.5 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MonitoringIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21s6-5.05 6-10a6 6 0 1 0-12 0c0 4.95 6 10 6 10Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M9.5 19a2.5 2.5 0 0 0 5 0M18 16H6l1.4-2.1V10a4.6 4.6 0 0 1 9.2 0v3.9L18 16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18.5 13.5a7.6 7.6 0 0 0 .05-3l2-1.5-2-3.5-2.45 1a7.4 7.4 0 0 0-2.6-1.5L13 2.5h-4l-.5 2.5a7.4 7.4 0 0 0-2.6 1.5l-2.45-1-2 3.5 2 1.5a7.6 7.6 0 0 0 .05 3l-2 1.5 2 3.5 2.45-1a7.4 7.4 0 0 0 2.6 1.5l.5 2.5h4l.5-2.5a7.4 7.4 0 0 0 2.6-1.5l2.45 1 2-3.5-2.1-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
