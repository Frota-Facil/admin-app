"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  className?: string;
  href?: string;
  label?: string;
  onClick?: () => void;
};

const buttonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100";

export function BackButton({
  className = "",
  href,
  label = "Voltar",
  onClick,
}: BackButtonProps) {
  const router = useRouter();
  const classes = `${buttonClassName} ${className}`.trim();

  if (href) {
    return (
      <Link className={classes} href={href}>
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick ?? (() => router.back())}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}
