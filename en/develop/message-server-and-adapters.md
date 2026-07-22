---
title: Message Server and Adapter Integration
---

# Message Server and Adapter Integration

Adapters translate platform events into MaiBot's inbound message model and translate outbound messages into platform API calls. MaiBot supports the legacy WebSocket server and the additional API server; use the server that matches the adapter protocol.

## Authentication and routing

The legacy server uses the configured `auth_token` list. The additional API server uses `api_server_allowed_api_keys` and can expose WSS with the configured certificate and key.

`RouteKey` includes platform, account, and conversation routing information. Multi-account adapters must preserve `account_id`; otherwise messages from different accounts may collide.

## Message lifecycle

An adapter builds an inbound envelope with stable message, user, group, and account identifiers. MaiBot converts it to `SessionMessage`, processes it, and returns a `DeliveryReceipt` for outbound delivery. Preserve `message_id_echo` when the protocol uses it to correlate the response with the incoming message.

## Deployment checklist

- Bind public interfaces only when required.
- Always configure authentication for cross-host connections.
- Prefer WSS or a trusted private network for remote adapters.
- Give every account a stable and unique account ID.
- Log delivery failures without leaking tokens or private message content.

See the [Adapter Overview](../manual/adapters/) for supported adapters.
