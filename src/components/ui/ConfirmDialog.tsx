"use client";

import { type ReactNode, useEffect } from "react";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel: string;
  destructive?: boolean;
  description: ReactNode;
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel,
  destructive = false,
  description,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, onOpenChange, open]);

  if (!open) {
    return null;
  }

  const confirmClasses = destructive
    ? "bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 focus:ring-red-100"
    : "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Fechar confirmação"
        className="absolute inset-0 cursor-default bg-slate-950/45"
        disabled={loading}
        onClick={() => onOpenChange(false)}
        type="button"
      />

      <section
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
        role="alertdialog"
      >
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-normal text-slate-950">
            {title}
          </h2>
          <div className="mt-3 text-sm leading-6 text-slate-600">
            {description}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
            disabled={loading}
            onClick={onConfirm}
            type="button"
          >
            {loading ? "Excluindo..." : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
