"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

async function login(cpf: string, senha: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cpf, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}

export default function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(onlyDigits(cpf), senha);

      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível realizar o login";

      setError(message);
      alert(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950">
      <div className="flex w-full max-w-[380px] flex-col items-center">
        <div className="mb-5 flex h-20 w-36 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-3xl font-bold tracking-normal text-slate-950">
              SIF
            </span>
          </div>
        </div>

        <p className="mb-8 text-center text-sm font-medium text-slate-500">
          Sistema Integrado de Frotas
        </p>

        <section className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-9 shadow-lg shadow-slate-200/70 sm:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-normal text-slate-900">
              Acesse sua conta
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                CPF
              </span>
              <span className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <UserIcon />
                <input
                  autoComplete="username"
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                  inputMode="numeric"
                  maxLength={14}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  required
                  value={cpf}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                Senha
              </span>
              <span className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <LockIcon />
                <input
                  autoComplete="current-password"
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                  minLength={5}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  type="password"
                  value={senha}
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              className="mt-6 h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          © 2026 SIF · Todos os direitos reservados
        </p>
      </div>
    </main>
  );
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-slate-950"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        d="M7 20.5h9.7l3.5-9.5H9.6L7 20.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="M20.3 11H24l2.7 5.1v4.4h-7.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <circle cx="11" cy="23" r="2.4" fill="currentColor" />
      <circle cx="23" cy="23" r="2.4" fill="currentColor" />
      <path
        d="M4 13h4M3 17h3.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2M6.5 10h11A1.5 1.5 0 0 1 19 11.5v7A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
