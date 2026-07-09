"use client";

import { useEffect } from "react";
import { useToast } from "@/components/toast/ToastProvider";
import { routeStartedEventSchema } from "@/server/contracts/routes/route-started-event";
import { trackCreatedEventSchema } from "@/server/contracts/tracks/track-created-event";

export const TRACK_CREATED_EVENT = "admin-track-created";

export function RouteEventListener() {
  const { showToast } = useToast();

  useEffect(() => {
    const eventSource = new EventSource("/api/route-events");

    function handleRouteStarted(event: MessageEvent<string>) {
      const parsedJson = parseJson(event.data);
      const parsedEvent = routeStartedEventSchema.safeParse(parsedJson);

      if (!parsedEvent.success) {
        console.warn("Evento de rota iniciada inválido:", parsedEvent.error);
        return;
      }

      const routeEvent = parsedEvent.data;

      showToast({
        actionHref: `/routes/${routeEvent.routeId}`,
        actionLabel: "Ver rota",
        description: `${routeEvent.driver.name} iniciou uma rota com ${routeEvent.vehicle.model} às ${formatEventDate(routeEvent.startedAt)}.`,
        title: "Rota iniciada",
      });
    }

    function handleTrackCreated(event: MessageEvent<string>) {
      const parsedJson = parseJson(event.data);
      const parsedEvent = trackCreatedEventSchema.safeParse(parsedJson);

      if (!parsedEvent.success) {
        console.warn("Evento de track criada inválido:", parsedEvent.error);
        return;
      }

      window.dispatchEvent(
        new CustomEvent(TRACK_CREATED_EVENT, {
          detail: parsedEvent.data,
        }),
      );
    }

    eventSource.addEventListener("route.started", handleRouteStarted);
    eventSource.addEventListener("track.created", handleTrackCreated);

    eventSource.onerror = () => {
      console.warn("SSE de rotas indisponível. Usando atualização manual.");
    };

    return () => {
      eventSource.removeEventListener("route.started", handleRouteStarted);
      eventSource.removeEventListener("track.created", handleTrackCreated);
      eventSource.close();
    };
  }, [showToast]);

  return null;
}

function parseJson(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "horário não informado";
  }

  return date.toLocaleString("pt-BR");
}
