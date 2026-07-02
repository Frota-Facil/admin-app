"use client";

import Link from "next/link";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ToastInput = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  title: string;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            onDismiss={() => dismissToast(toast.id)}
            toast={toast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }

  return context;
}

type ToastCardProps = {
  onDismiss: () => void;
  toast: ToastItem;
};

function ToastCard({ onDismiss, toast }: ToastCardProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 10000);

    return () => window.clearTimeout(timeout);
  }, [onDismiss]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 text-slate-950 shadow-lg shadow-slate-900/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-normal">{toast.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{toast.description}</p>
        </div>
        <button
          aria-label="Fechar notificação"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          onClick={onDismiss}
          type="button"
        >
          x
        </button>
      </div>

      {toast.actionHref && toast.actionLabel ? (
        <Link
          className="mt-3 inline-flex h-9 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          href={toast.actionHref}
          onClick={onDismiss}
        >
          {toast.actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
