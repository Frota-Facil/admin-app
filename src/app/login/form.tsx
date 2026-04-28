"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const router = useRouter();

  async function handleLogin() {
    try {
      await login(cpf, senha);

      router.push("/");
    } catch (err: unknown) {
      alert(err);
    }
  }

  return (
    <div>
      <input onChange={(e) => setCpf(e.target.value)} />
      <input type="password" onChange={(e) => setSenha(e.target.value)} />

      <button type="submit" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
