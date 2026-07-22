---
title: Logging and Observability
---

# Logging and Observability

MaiBot routes structured log records to three destinations: JSONL files for retention, the console for live diagnosis, and WebSocket subscribers for the WebUI.

## Configuration

`log_level`, `console_log_level`, and `file_log_level` control the global and destination thresholds. Console style options affect presentation only. Retention limits bound the number and age of log files and diagnostic snapshots.

Use `library_log_levels` to reduce noise from a specific dependency. `suppress_libraries` removes a library completely and should be reserved for persistently irrelevant output.

## LLM snapshots

Failed LLM requests may create bounded snapshots containing the reconstructed request and response context needed for replay. These files can contain private prompts or message content; restrict access and remove them after diagnosis.

## Production diagnosis

1. Read the last console events and identify the failing subsystem.
2. Search JSONL logs by level, logger, request ID, or plugin ID.
3. Temporarily raise the relevant level and reproduce once.
4. Use a failed-request snapshot only when ordinary logs are insufficient.
5. Restore normal logging after the investigation.

Realtime subscription details are in [Realtime and Statistics](./webui-api/realtime-and-stats.md).
