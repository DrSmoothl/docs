---
title: WebUI HTTP API
---

# WebUI HTTP API

MaiBot's WebUI backend is a FastAPI application. Current endpoints normally use the `/api/webui/*` prefix; compatibility routers keep selected older `/api/*` paths available for existing clients.

## Authentication

- **Cookie token** — The browser login flow stores the authenticated WebUI session in `maibot_session`.
- **API key** — External clients for the additional API server use keys from `api_server_allowed_api_keys` where supported.
- **Temporary WebSocket token** — Realtime clients exchange an authenticated session for a short-lived connection token.

Do not place persistent secrets in URLs or logs. Browser-oriented endpoints may specifically require the Cookie flow even when another API surface accepts an API key.

## First connection

Check the WebUI status, authenticate with the startup token, replace temporary credentials with a stable token, and complete first-run configuration. A successful health/status response does not imply that every optional subsystem is configured.

Continue with:

- [Authentication and Setup](./auth-and-setup.md)
- [System Control](./system-control.md)
- [Data and Memory API](./data-and-memory-api.md)
- [Plugin Lifecycle API](./plugin-lifecycle-api.md)
- [Realtime and Statistics](./realtime-and-stats.md)
