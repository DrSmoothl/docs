---
title: Event Pipeline and Hooks
---

# Event Pipeline and Hooks

MaiBot has two related extension paths: the internal `EventBus`, which distributes typed runtime events, and named plugin Hooks, which cross the Host/Runner boundary.

## EventBus

Subscribers register for an `EventType` with a weight. Intercepting events run in order and may alter or stop a pipeline; fire-and-forget events notify observers without blocking the caller. A slow intercepting subscriber increases end-to-end message latency.

## Named Hooks

Named Hooks are dispatched to plugins in a deterministic order. A blocking handler may return modified data or abort the remaining chain. An observe handler records or reacts to an event without changing the result.

Each Hook has a timeout and a declared parameter schema. Plugins should return only the documented result shape and must not rely on registration order as a substitute for explicit priority.

## Diagnosis

- Compare the Hook timeout with the component's own logs.
- Disable one plugin at a time when isolating a slow blocking chain.
- Use runtime Hook inspection from the WebUI API to confirm the current specification.
- Move independent network or storage work out of blocking handlers when possible.

See [Plugin Runtime Internals](./plugin-runtime-internals.md) and [Plugin Hook Development](../plugin/hooks.md).
