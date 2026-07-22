---
title: Database
---

# Database

MaiBot uses SQLAlchemy models and managed sessions for chat history, learned expressions, jargon, behavior, people, statistics, monitoring, and supporting caches. Application code should acquire sessions through the shared database helpers instead of creating independent engines.

## Sessions and identities

Chat records are grouped by session and stream identifiers. Platform and account identifiers are part of routing and identity; integrations must not assume that a numeric user or group ID is globally unique across platforms or accounts.

JSON columns store extensible metadata. Treat their shape as versioned application data and use the corresponding service/model helpers when available.

## Migrations

Startup runs database migrations in order before services begin normal work. Back up the database before upgrading across releases and do not manually change the schema version.

## Operations

- Stop writers or use the supported backup path before copying SQLite files.
- Use `VACUUM` only during a suitable maintenance window.
- Query aggregate tables for dashboards instead of scanning raw message or model-usage rows repeatedly.
- Avoid exposing raw message content in diagnostics and exported reports.

For supported import and export jobs, see [Statistics and Data Transfer](./statistics-io.md).
