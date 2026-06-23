import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-950">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
