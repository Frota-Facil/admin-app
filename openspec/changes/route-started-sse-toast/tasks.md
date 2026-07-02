## 1. Route Detail Contract

- [x] 1.1 Confirm the route detail URL to use for started routes, preferably `/routes/[routeId]`.
- [x] 1.2 Verify core-service exposes a route detail data source by `routeId`; if it does not, add or request `GET /admin/routes/:routeId` before building a durable detail page.
- [x] 1.3 Add the admin-app route detail contract, core service function, use-case, and page needed by the toast link.

## 2. SSE Bridge

- [x] 2.1 Add a Next route handler for same-origin SSE, for example `src/app/api/route-events/route.ts`.
- [x] 2.2 Read the `token` cookie in the route handler and reject/redirect unauthenticated requests without exposing core events.
- [x] 2.3 Forward the request to `${CORE_API_URL}/admin/route-events` with `Authorization: Bearer <token>` and stream the response as `text/event-stream`.
- [x] 2.4 Ensure disconnects abort the upstream core-service SSE request.

## 3. Client Event Handling

- [x] 3.1 Add a zod contract for the `route.started` SSE payload in the admin app.
- [x] 3.2 Add a client listener component that opens `EventSource("/api/route-events")` once for the authenticated admin layout.
- [x] 3.3 Parse only `route.started` events and ignore invalid payloads without crashing the page.
- [x] 3.4 Close the EventSource connection on component unmount.

## 4. Toast UI

- [x] 4.1 Add a minimal toast provider/renderer or install the chosen toast dependency.
- [x] 4.2 Show a toast for each valid route-started event with driver name, vehicle model, and formatted start time.
- [x] 4.3 Add an action link in the toast that navigates to the route detail page for the event `routeId`.
- [x] 4.4 Mount the toast provider and route event listener in the authenticated admin layout without showing it on `/login`.

## 5. Validation

- [x] 5.1 Run a focused type/lint check for touched files using Node 22.14 if needed.
- [x] 5.2 Manually verify that a mocked or real `route.started` event renders a toast and the action navigates to the route detail page.
- [x] 5.3 Verify unauthenticated sessions cannot receive SSE events through the Next bridge.
