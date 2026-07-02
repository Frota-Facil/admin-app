"use client";

import { type ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { RouteEventListener } from "@/components/routes/RouteEventListener";
import { ToastProvider } from "@/components/toast/ToastProvider";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ToastProvider>
      <RouteEventListener />

      <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-950">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="relative min-w-0 flex-1">
          <button
            aria-expanded={isSidebarOpen}
            aria-label={
              isSidebarOpen ? "Recolher menu lateral" : "Abrir menu lateral"
            }
            className="absolute left-0 top-5 z-30 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            onClick={() => setIsSidebarOpen((current) => !current)}
            title={
              isSidebarOpen ? "Recolher menu lateral" : "Abrir menu lateral"
            }
            type="button"
          >
            <SidebarToggleIcon className="h-4 w-4" isOpen={isSidebarOpen} />
          </button>

          <main className="h-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

type SidebarToggleIconProps = {
  className?: string;
  isOpen: boolean;
};

function SidebarToggleIcon({ className, isOpen }: SidebarToggleIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d={isOpen ? "M15 6 9 12l6 6" : "m9 6 6 6-6 6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
