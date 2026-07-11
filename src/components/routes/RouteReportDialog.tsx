"use client";

import { useState } from "react";
import { DetailsModal } from "@/components/ui/DetailsModal";

type RouteReportDialogProps = {
  report?: string | null;
};

export function RouteReportDialog({ report }: RouteReportDialogProps) {
  const routeReport = report?.trim();
  const [isOpen, setIsOpen] = useState(false);

  if (!routeReport) {
    return <span>Sem relatório</span>;
  }

  return (
    <>
      <button
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Ver relatório
      </button>

      {isOpen ? (
        <DetailsModal
          bodyClassName="overflow-hidden p-6"
          onClose={() => setIsOpen(false)}
          title="Relatório da rota"
        >
          <article className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-800">
            {routeReport}
          </article>

          <footer className="mt-5 flex justify-end">
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Fechar
            </button>
          </footer>
        </DetailsModal>
      ) : null}
    </>
  );
}
