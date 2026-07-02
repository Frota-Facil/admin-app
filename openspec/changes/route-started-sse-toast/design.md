## Context

The core-service diff adds `GET /admin/route-events`, guarded by the existing admin JWT authorization, and publishes `route.started` events when `startRouteUseCase` creates a route. The event payload is validated by `routeStartedEventSchema` and includes:

- `type: "route.started"`
- `routeId`
- `vehicle.id`
- `vehicle.model`
- `driver.id`
- `driver.name`
- `startedAt`

The admin app stores the core JWT in an `httpOnly` `token` cookie. That is correct for normal server-side core calls, but it means a browser `EventSource` cannot connect directly to `CORE_API_URL/admin/route-events` with an `Authorization` header. The app also has no existing toast package and no current route detail UI by `routeId`.

## Goals / Non-Goals

**Goals:**
- Keep the core-service SSE contract as the source of truth.
- Subscribe admin sessions to route-started events while preserving the `httpOnly` token cookie.
- Show a toast with driver, vehicle, start time, and an action link.
- Make the toast action navigate to a route detail URL for the started `routeId`.
- Keep the implementation small and consistent with the existing Next app patterns.

**Non-Goals:**
- Do not change how login stores the JWT.
- Do not introduce broad client-side state management.
- Do not implement notifications for other event types.
- Do not redesign the dashboard or unrelated route/request pages.

## Decisions

1. Add a same-origin Next route handler as the SSE bridge.

   The client will open `EventSource("/api/route-events")`. The route handler will read the `token` cookie server-side, call `${CORE_API_URL}/admin/route-events` with `Authorization: Bearer <token>`, and stream the response body back with `text/event-stream` headers.

   Alternative considered: connect directly from the browser to core-service. This is not viable with the current `httpOnly` cookie because `EventSource` cannot set a bearer token header.

2. Add a small client provider mounted only for authenticated admin UI.

   A client component, for example `RouteEventListener`, should be mounted in the authenticated layout shell. It owns the `EventSource`, handles reconnect through native `EventSource` behavior, closes the connection on unmount, parses `route.started`, and calls the toast API.

   Alternative considered: mount the listener in every page. A layout-level provider avoids duplicate SSE connections during normal navigation.

3. Prefer a lightweight in-repo toast implementation unless a toast dependency is already chosen.

   The current app has no `sonner`, `react-hot-toast`, or local toast system. A minimal provider with a fixed toast region is enough for this feature and avoids adding a dependency just for one notification type. If the team prefers a dependency, `sonner` is the smallest common choice, but it would add package churn.

4. Treat route detail by `routeId` as a hard navigation target.

   The toast action should link to a stable path such as `/routes/{routeId}`. During implementation, verify whether core-service exposes a route detail endpoint by `routeId`. The inspected core-service currently exposes `GET /admin/routes` for finished routes only and no `GET /admin/routes/:routeId`, while the SSE payload does not include request destination/reason or vehicle plate.

   If the backend still lacks route detail by `routeId`, implementation should add/support that core-service endpoint before wiring a useful detail page, or explicitly agree on a temporary frontend fallback. A fallback based only on the SSE payload can show driver, vehicle model, and start time, but it will not be a durable detail page after refresh.

## Risks / Trade-offs

- SSE bridge keeps a long-lived server route open -> ensure the route handler forwards disconnect/abort to the core request and does not buffer the stream.
- Core-service emits only active started routes, while `GET /admin/routes` currently returns finished routes -> route detail may require backend support before the toast link can be fully useful.
- Toast may be missed when no admin browser is connected -> acceptable for this feature because the requirement is a real-time toast, not persistent notification history.
- Invalid or changed event payloads could break the listener -> validate with a zod contract in the admin app and ignore/log unknown payloads without crashing the UI.
