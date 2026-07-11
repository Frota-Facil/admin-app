"use client";

import { type ReactNode, useEffect } from "react";

type DetailsModalProps = {
  bodyClassName?: string;
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
  title: string;
};

const defaultPanelClassName =
  "relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20";

const defaultBodyClassName = "min-h-0 flex-1 overflow-y-auto p-6";

export function DetailsModal({
  bodyClassName = defaultBodyClassName,
  children,
  onClose,
  panelClassName = defaultPanelClassName,
  title,
}: DetailsModalProps) {
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Fechar detalhes"
        className="absolute inset-0 cursor-default bg-slate-950/45"
        onClick={onClose}
        type="button"
      />

      <section aria-modal="true" className={panelClassName} role="dialog">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold tracking-normal text-slate-950">
            {title}
          </h2>
          <button
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            onClick={onClose}
            title="Fechar"
            type="button"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </header>

        <div className={bodyClassName}>{children}</div>
      </section>
    </div>
  );
}

type IconProps = {
  className?: string;
};

function XIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
