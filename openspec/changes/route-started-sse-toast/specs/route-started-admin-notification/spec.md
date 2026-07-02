## ADDED Requirements

### Requirement: Admin receives route-started SSE events
The admin app SHALL maintain a real-time SSE subscription for authenticated admin sessions to receive `route.started` events from core-service.

#### Scenario: Authenticated admin connects to route events
- **WHEN** an authenticated admin is using the admin app
- **THEN** the app opens a same-origin SSE connection that forwards authentication to core-service `GET /admin/route-events`

#### Scenario: Unauthenticated session cannot subscribe
- **WHEN** the session has no valid admin token cookie
- **THEN** the SSE bridge does not expose core-service route events to the browser

### Requirement: Route-started event payload is validated
The admin app MUST validate incoming `route.started` payloads before rendering a notification.

#### Scenario: Valid route-started event is accepted
- **WHEN** an SSE message named `route.started` contains `type`, `routeId`, `vehicle.id`, `vehicle.model`, `driver.id`, `driver.name`, and `startedAt`
- **THEN** the app treats the message as a route-started notification

#### Scenario: Invalid route-started event is ignored
- **WHEN** an SSE message is missing required route-started fields or has invalid identifiers
- **THEN** the app ignores that message without crashing the current page

### Requirement: Admin sees a route-started toast
The admin app SHALL show a toast when a valid `route.started` event is received.

#### Scenario: Route-started toast content
- **WHEN** a valid `route.started` event is received
- **THEN** the toast shows that a route was started, the driver name, the vehicle model, and the formatted start time

#### Scenario: Multiple route-started events
- **WHEN** multiple valid `route.started` events are received while the admin app is open
- **THEN** each event is visible as its own notification or as part of the toast queue without replacing unrelated active notifications unexpectedly

### Requirement: Toast links to route detail
The route-started toast MUST provide an action that navigates to the detail page for the started route.

#### Scenario: Admin opens started route from toast
- **WHEN** the admin activates the toast action for a valid `route.started` event
- **THEN** the app navigates to the route detail page identified by that event's `routeId`

#### Scenario: Route detail is unavailable
- **WHEN** the app cannot load details for the route identified by `routeId`
- **THEN** the route detail page shows an appropriate not-found or unavailable state instead of failing silently
