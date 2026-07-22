---
title: System Control
---

# System Control

System routes expose runtime status, configuration reload, graceful restart/shutdown, update notices, local-cache maintenance, and selected Maisaka Monitor media.

## Status and lifecycle

Use the status endpoint for uptime and version checks. Graceful restart and shutdown ask active services to stop cleanly; the process supervisor is responsible for starting MaiBot again after a restart exit.

Configuration reload validates files and distributes new values to registered callbacks. A successful HTTP response does not mean that a subsystem without hot-reload support has restarted.

## Update notices

**`GET /api/webui/system/update-notice`** returns the pending notice for the current WebUI version. The optional **`force=true`** query parameter is for display debugging: when no normal notice is pending, MaiBot returns a generated debug notice for the current version.

::: code-group

```bash [Preview a notice ~vscode-icons:file-type-http~]
curl "http://127.0.0.1:8001/api/webui/system/update-notice?force=true" \
  -H "Cookie: maibot_session=YOUR_TOKEN"
```

:::

Normal clients should omit `force`. Use the acknowledgement endpoint only after the user has seen the notice.

## Maintenance

Local-cache routes can inspect and clean cache entries, image records, logs, and other generated data. Database `VACUUM` is a separate maintenance action and may be expensive on large databases. Review the selected scope and age cutoff before destructive cleanup.
