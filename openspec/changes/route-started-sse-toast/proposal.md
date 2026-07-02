## Why

The core-service now publishes an admin-only SSE event when a route is started, but the admin app does not subscribe to that stream yet. Admin users need immediate visibility when a driver starts a route, with enough context to open the related route detail.

## What Changes

- Add a client-side listener for the core-service `GET /admin/route-events` SSE endpoint.
- Validate and handle `route.started` events containing `routeId`, `vehicle`, `driver`, and `startedAt`.
- Show an in-app toast when a route starts, including the driver name, vehicle model, start time, and an action link.
- Route the toast action to the route detail page for the started route.
- Add the minimal route detail surface needed for that link if the admin app does not already have it.

## Capabilities

### New Capabilities
- `route-started-admin-notification`: Admin users receive real-time route-started notifications and can navigate from the toast to the started route detail.

### Modified Capabilities

## Impact

- Affected admin app areas: root/admin layout client providers, core-service integration, route-related contracts/services/use-cases, and route detail navigation.
- Depends on core-service SSE contract: `GET /admin/route-events`, event name `route.started`, and payload fields `type`, `routeId`, `vehicle.id`, `vehicle.model`, `driver.id`, `driver.name`, and `startedAt`.
- May require a lightweight toast implementation or a small toast dependency because the current admin app has no toast package.
- The route detail link requires an admin route detail path backed by data retrievable by `routeId`; if core-service still lacks `GET /admin/routes/:routeId`, implementation must either add/support that backend route or choose a frontend fallback approved by the team.
