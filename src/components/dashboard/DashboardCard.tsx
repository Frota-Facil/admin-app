import type { ReactNode } from "react";

type DashboardCardProps = {
  description: string;
  icon: ReactNode;
  iconClassName?: string;
  label: string;
  value: number | string;
};

export function DashboardCard({
  description,
  icon,
  iconClassName = "bg-blue-50 text-blue-600",
  label,
  value,
}: DashboardCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
            {label}
          </p>
          <strong className="mt-3 block text-3xl font-bold tracking-normal text-slate-950">
            {value}
          </strong>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}
