---
title: Realtime Subscriptions and Statistics
---

# Realtime Subscriptions and Statistics

The unified WebSocket endpoint carries logs, plugin progress, status changes, and other topic-based realtime events. Obtain a temporary WebSocket token through authenticated HTTP before connecting.

Each frame identifies its topic and event and carries a domain-specific `data` object. Subscribe only to required topics and implement reconnect/backoff; do not assume every event is replayed after a disconnect.

## Statistics endpoints

- **Dashboard** — Operational totals and recent trends for the WebUI overview
- **Summary** — Aggregated usage over the selected time range
- **Models** — Per-model request, token, latency, and cost statistics where available

Aggregates may lag behind raw events by one collection interval.

## Maisaka Monitor and replay

Monitor routes expose recorded reasoning and execution information for diagnosis. Replay reconstructs a saved request for debugging and can repeat external model calls, so use it carefully and review private content before sharing a record.

Production clients should bound retained frames, handle unknown event types, and avoid logging authentication tokens or full private payloads.
