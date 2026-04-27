import { NextResponse } from "next/server";
import { auth } from "@/server/services/core/auth";
import { loginSchema } from "@/server/contracts/auth-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cpf, senha } = loginSchema.parse(body);

    const { token } = await auth(cpf, senha);

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }
}