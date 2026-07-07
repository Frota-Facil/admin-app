import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/BackButton";

type PageBackHeaderProps = {
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function PageBackHeader({
  actions,
  backHref,
  backLabel,
  className = "",
  subtitle,
  title,
}: PageBackHeaderProps) {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-4 ${className}`.trim()}
    >
      <div className="flex min-w-0 items-start gap-4">
        <BackButton className="shrink-0" href={backHref} label={backLabel} />

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
