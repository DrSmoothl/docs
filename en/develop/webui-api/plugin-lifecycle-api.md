---
title: Plugin Lifecycle API
---

# Plugin Lifecycle API

The plugin API manages installed plugins, Git-based installation and updates, enable/disable state, configuration, runtime components, marketplace support, icons, and progress events.

## Install, update, and uninstall

- **`POST /api/webui/plugins/install`** — Clone and validate a plugin repository
- **`POST /api/webui/plugins/update`** — Update an installed repository while preserving supported local configuration
- **`POST /api/webui/plugins/uninstall`** — Disable and unload a plugin before deleting its directory

Operations for the **same plugin are mutually exclusive**. If install, update, or uninstall is already running for that plugin, the server immediately returns **HTTP 409 Conflict** with a `detail` message describing the active operation. Wait for the current progress to finish before retrying. Different plugins may still be processed concurrently.

Installed plugins use `_manifest.json`; the manifest ID must match the requested and installed plugin identity.

## State and configuration

The toggle endpoint changes `[plugin].enabled` and asks the runtime to load or unload the plugin. Configuration endpoints expose schema, structured values, raw TOML, update, and reset operations. Writes are backed up and validated before activation.

## Runtime inspection

Runtime endpoints list registered components, home cards, and Hook specifications. Icon paths are constrained to safe local image files under the plugin directory.

## Progress

Use the unified WebSocket channel with domain `plugin_progress` and topic `main`. Progress records contain the operation, stage, percentage, message, plugin ID, error, and optional batch or mirror retry counters. The older dedicated plugin progress socket remains for compatibility.

For Host/Runner behavior, see [Plugin Runtime Internals](../plugin-runtime-internals.md).
