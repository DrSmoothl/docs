---
title: Plugin Runtime Internals
---

# Plugin Runtime Internals

MaiBot runs plugin code in Runner processes supervised by the Host. The split isolates plugin failures and gives the Host a consistent RPC boundary for lifecycle operations, capabilities, messages, and Hooks.

## Transport and startup

Host and Runner communicate through UDS, named pipes, or TCP according to the platform and runtime configuration. The Host starts the Runner with scoped environment variables, waits for the handshake and readiness report, then activates registered components.

## RPC protocol

Requests and responses use the versioned Envelope protocol. The current Host-to-Runner surface contains 17 plugin methods, including single and batch reload plus **`plugin.unload_batch`**. Batch unload follows dependency-safe order and returns unloaded and failed plugin IDs.

## Manifest v2

Plugins declare metadata in **`_manifest.json`**. `manifest_version` must be `2`; the manifest includes the stable plugin ID, semantic version, author, compatibility ranges, dependencies, requested capabilities, plugin type, display metadata, and optional changelog location.

## Lifecycle and recovery

Load activates validated components. Unload removes components and releases plugin resources. Configuration updates call the plugin update lifecycle when possible. File changes may trigger a reload or Supervisor restart depending on their scope.

Reload and unload operations share a lock so overlapping lifecycle mutations are rejected. The Host monitors Runner health and applies a bounded restart policy when a Runner exits unexpectedly.

For public plugin APIs, see the [Plugin Development Guide](../plugin/). For WebUI operations, see [Plugin Lifecycle API](./webui-api/plugin-lifecycle-api.md).
