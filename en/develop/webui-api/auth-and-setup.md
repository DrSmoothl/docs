---
title: Authentication and First-Time Setup
---

# Authentication and First-Time Setup

The WebUI uses an HTTP-only `maibot_session` Cookie for browser requests. Authentication endpoints verify the current token, report session state, replace or regenerate credentials, and log the browser out.

## Main endpoints

- **`POST /api/webui/auth/verify`** — Verify a token and create the login Cookie
- **`GET /api/webui/auth/check`** — Check whether the current Cookie is authenticated
- **`POST /api/webui/auth/update`** — Replace the current token with a chosen value
- **`POST /api/webui/auth/regenerate`** — Generate a new random token
- **`POST /api/webui/auth/logout`** — Clear the current login

Changing or regenerating the token invalidates the old session. Automation must capture the new token and authenticate again.

## First-run flow

1. Enable and start the WebUI on a trusted interface.
2. Read the temporary startup token from the local console.
3. Verify it and receive the session Cookie.
4. Replace it with a stable token.
5. Complete the required bot and model configuration.
6. Mark first-run setup as complete.

Apply rate limiting at the reverse proxy when exposing authentication endpoints. Use HTTPS and secure cookies outside localhost.

## WebSocket token

Realtime clients request a short-lived WebSocket token through an authenticated HTTP request, then pass that token when opening the socket. Do not reuse it as a general WebUI credential.
