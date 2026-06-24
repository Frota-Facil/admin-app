import { NextResponse } from "next/server";
import { loginSchema } from "@/server/contracts/auth-schema";
import { auth } from "@/server/services/core/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cpf, senha } = loginSchema.parse(body);

    const { token } = await auth(cpf, senha);

    const res = NextResponse.json({ success: true });

    console.log(token);

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 },
    );
  }
}
