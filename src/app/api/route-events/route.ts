import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return new Response("Não autenticado", { status: 401 });
  }

  if (!process.env.CORE_API_URL) {
    return new Response("CORE_API_URL não configurada", { status: 500 });
  }

  const controller = new AbortController();
  request.signal.addEventListener("abort", () => controller.abort(), {
    once: true,
  });

  try {
    const upstream = await fetch(
      `${process.env.CORE_API_URL}/admin/route-events`,
      {
        cache: "no-store",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      },
    );

    if (!upstream.ok || !upstream.body) {
      return new Response("Não foi possível conectar aos eventos de rota", {
        status: upstream.status,
      });
    }

    return new Response(upstream.body, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    if (controller.signal.aborted) {
      return new Response(null, { status: 204 });
    }

    console.error("Erro ao conectar ao SSE de rotas:", error);
    return new Response("Erro ao conectar aos eventos de rota", {
      status: 502,
    });
  }
}
