---
title: Memory Management
---

# Memory Management

Memory management is the most feature-rich module in WebUI, providing complete management capabilities for MaiBot's long-term memory system. The memory API routes (`/api/webui/memory/*`) are the largest code volume module among all routes, covering complete functions including graph operations, source management, memory fragments, character profiles, V5 memory actions, import, retrieval tuning, deletion and recovery.

## Knowledge Graph Management

MaiBot's long-term memory is stored in the form of a knowledge graph, consisting of nodes (Node) and edges (Edge).

### Graph Reading

- **`GET /memory/graph`** — Get graph data (can limit quantity, default 200, maximum 5000)
- **`GET /memory/graph/search`** — Search graph (keywords + quantity limit)
- **`GET /memory/graph/node-detail`** — Get node detailed information (including relationships, paragraphs, evidence nodes)
- **`GET /memory/graph/edge-detail`** — Get edge detailed information (including paragraphs, evidence nodes)

The node detail interface supports controlling the amount of returned data through `relation_limit`, `paragraph_limit`, `evidence_node_limit` parameters.

### Node Operations

- **`POST /memory/graph/node`** — Create node (need to provide `name`)
- **`DELETE /memory/graph/node`** — Delete node (need to provide `name`)
- **`POST /memory/graph/node/rename`** — Rename node (need to provide `old_name` and `new_name`)

### Edge Operations

- **`POST /memory/graph/edge`** — Create edge (need to provide `subject`, `predicate`, `object`, optional `confidence`)
- **`DELETE /memory/graph/edge`** — Delete edge (can locate through `hash` or `subject`+`object`)
- **`POST /memory/graph/edge/weight`** — Modify edge weight (need to provide `weight`)

## Source Management

Sources record the origin information of memory data, used for traceability and batch management.

- **`GET /memory/sources`** — List all sources
- **`POST /memory/sources/delete`** — Delete specified source
- **`POST /memory/sources/batch-delete`** — Batch delete multiple sources

## Memory Query

- **`GET /memory/query/aggregate`** — Aggregate query memory

Aggregate query supports the following optional filter conditions:
- `query`: Search keywords
- `limit`: Return quantity limit (1-200)
- `chat_id`: Filter by chat ID
- `person_id`: Filter by person ID
- `time_start` / `time_end`: Filter by time range (Unix timestamp)

## Memory Fragment (Episode) Management

Memory fragments are processed memory units containing structured information extracted from original conversations.

- **`GET /memory/episodes`** — List memory fragments (supports search, source, person, time filtering)
- **`GET /memory/episodes/{episode_id}`** — Get single memory fragment details
- **`POST /memory/episodes/rebuild`** — Rebuild memory fragments (by source or all)
- **`GET /memory/episodes/status`** — Get memory fragment processing status
- **`POST /memory/episodes/process-pending`** — Process pending memory fragments

The `process-pending` interface supports `limit` (1-200) and `max_retry` (1-20) parameters to control batch processing scale and retry upper limit.

## Character Profile Management

Character profiles store MaiBot's understanding and cognition of each user.

- **`GET /memory/profiles/query`** — Query character profiles (supports search by person_id or keywords)
- **`GET /memory/profiles`** — List all character profiles
- **`POST /memory/profiles/override`** — Set character profile override text
- **`DELETE /memory/profiles/override/{person_id}`** — Delete character profile override

The profile override function allows manual modification of a user's profile description, and the override text will take precedence over automatically generated profiles.

## Feedback Correction Management

- **`GET /memory/feedback-corrections`** — List feedback correction records (supports status and rollback status filtering)
- **`GET /memory/feedback-corrections/{task_id}`** — Get single correction details
- **`POST /memory/feedback-corrections/{task_id}/rollback`** — Roll back a correction operation

## V5 Memory Actions

The V5 memory system provides more refined memory manipulation capabilities:

- **`GET /memory/v5/status`** — Get V5 memory status
- **`GET /memory/v5/recycle-bin`** — Get V5 recycle bin content
- **`POST /memory/v5/reinforce`** — Reinforce memory (increase memory strength)
- **`POST /memory/v5/weaken`** — Weaken memory (decrease memory strength)
- **`POST /memory/v5/remember-forever`** — Permanent memory (mark as never forget)
- **`POST /memory/v5/forget`** — Forget memory (move to recycle bin)
- **`POST /memory/v5/restore`** — Restore memory (restore from recycle bin)

All V5 actions support `target` (target identifier), `strength` (optional strength coefficient), `reason` (operation reason) parameters.

## Deletion Management

Deletion operations adopt a preview-execute-restore safety mode:

- **`POST /memory/delete/preview`** — Preview deletion impact (no actual deletion)
- **`POST /memory/delete/execute`** — Execute deletion
- **`POST /memory/delete/restore`** — Restore deleted content
- **`GET /memory/delete/operations`** — List deletion operation history
- **`GET /memory/delete/operations/{operation_id}`** — Get single deletion operation details
- **`POST /memory/delete/purge`** — Completely clear deleted data (supports grace period)

The `purge` interface's `grace_hours` parameter can be used to retain recently deleted data within a certain number of hours, and the `limit` parameter controls the amount cleared in a single operation (1-5000).

## Memory Import

Memory import functionality supports importing external data into long-term memory in multiple ways:

- **`GET /memory/import/settings`** — Get import settings
- **`GET /memory/import/path-aliases`** — Get path aliases
- **`GET /memory/import/guide`** — Get import guide
- **`POST /memory/import/resolve-path`** — Resolve path (supports aliases)
- **`POST /memory/import/upload`** — Upload file import
- **`POST /memory/import/paste`** — Paste text import
- **`POST /memory/import/raw-scan`** — Scan whitelist directory raw text
- **`POST /memory/import/lpmm-openie`** — LPMM OpenIE import
- **`POST /memory/import/lpmm-convert`** — LPMM format conversion import
- **`POST /memory/import/temporal-backfill`** — Time information backfill
- **`POST /memory/import/maibot-migration`** — Migrate from MaiBot host database

### Import Task Management

- **`GET /memory/import/tasks`** — List import tasks
- **`GET /memory/import/tasks/{task_id}`** — Get task details
- **`GET /memory/import/tasks/{task_id}/chunks/{file_id}`** — Get task chunks
- **`POST /memory/import/tasks/{task_id}/cancel`** — Cancel import task
- **`POST /memory/import/tasks/{task_id}/retry`** — Retry failed import tasks

When uploading files for import, files are first temporarily stored in subdirectories under the `data/memory_upload_staging/` directory and automatically cleaned up after import completion.

## Retrieval Tuning

Retrieval tuning functionality is used to optimize memory retrieval effects:

- **`GET /memory/retrieval_tuning/settings`** — Get tuning settings
- **`GET /memory/retrieval_tuning/profile`** — Get current tuning configuration
- **`POST /memory/retrieval_tuning/profile/apply`** — Apply tuning configuration
- **`POST /memory/retrieval_tuning/profile/rollback`** — Roll back tuning configuration
- **`GET /memory/retrieval_tuning/profile/export`** — Export tuning configuration
- **`POST /memory/retrieval_tuning/tasks`** — Create tuning tasks
- **`GET /memory/retrieval_tuning/tasks`** — List tuning tasks
- **`GET /memory/retrieval_tuning/tasks/{task_id}`** — Get task details
- **`GET /memory/retrieval_tuning/tasks/{task_id}/rounds`** — Get tuning rounds
- **`POST /memory/retrieval_tuning/tasks/{task_id}/cancel`** — Cancel tuning task
- **`POST /memory/retrieval_tuning/tasks/{task_id}/apply-best`** — Apply best tuning results
- **`GET /memory/retrieval_tuning/tasks/{task_id}/report`** — Get tuning report

## Runtime and Maintenance

- **`POST /memory/runtime/save`** — Manually save memory data
- **`GET /memory/config/schema`** — Get memory configuration schema
- **`GET /memory/config`** — Get memory configuration
- **`PUT /memory/config`** — Update memory configuration (structured)
- **`GET /memory/config/raw`** — Get raw TOML memory configuration
- **`PUT /memory/config/raw`** — Update raw TOML memory configuration
- **`GET /memory/runtime/config`** — Get runtime configuration
- **`GET /memory/runtime/self-check`** — Run self-check
- **`POST /memory/runtime/self-check/refresh`** — Refresh and run self-check
- **`GET /memory/runtime/auto-save`** — Get auto-save status
- **`POST /memory/runtime/auto-save`** — Set auto-save switch

### Maintenance Operations

- **`GET /memory/maintenance/recycle-bin`** — Get recycle bin content
- **`POST /memory/maintenance/restore`** — Restore memory from recycle bin
- **`POST /memory/maintenance/reinforce`** — Reinforce memory relationships
- **`POST /memory/maintenance/freeze`** — Freeze memory (prevent automatic forgetting)
- **`POST /memory/maintenance/protect`** — Protect memory (specify protection duration)

## Compatible Routes

For backward compatibility, some old interfaces are also mounted under the `/api/webui/api/*` path (`compat_router`), including graph operations, source management, and memory queries. New development should prioritize using the `/memory/*` path.