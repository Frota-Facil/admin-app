import { cookies } from "next/headers";
import { z } from "zod";
import { trackSchema } from "@/server/contracts/tracks/track-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TracksRouteContext = {
  params: Promise<{
    routeId: string;
  }>;
};

const routeParamsSchema = z.object({
  routeId: z.uuid(),
});

export async function GET(_request: Request, context: TracksRouteContext) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return new Response("Não autenticado", { status: 401 });
  }

  if (!process.env.CORE_API_URL) {
    return new Response("CORE_API_URL não configurada", { status: 500 });
  }

  const parsedParams = routeParamsSchema.safeParse(await context.params);

  if (!parsedParams.success) {
    return new Response("Rota inválida", { status: 400 });
  }

  const upstream = await fetch(
    `${process.env.CORE_API_URL}/admin/tracks/${encodeURIComponent(parsedParams.data.routeId)}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!upstream.ok) {
    return new Response("Não foi possível carregar os registros", {
      status: upstream.status,
    });
  }

  const tracks = trackSchema.array().parse(await upstream.json());

  return Response.json(
    tracks.map((track) => ({
      ...track,
      capturedAt: track.capturedAt.toISOString(),
      createdAt: track.createdAt.toISOString(),
      updatedAt: track.updatedAt.toISOString(),
    })),
  );
}
