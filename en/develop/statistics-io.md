---
title: Statistics and Data Transfer
---

# Statistics and Data Transfer

MaiBot aggregates model usage and activity into hourly records for dashboards and reports. Prefer aggregate services or HTTP endpoints over repeated scans of raw event rows.

## Export and import jobs

Data transfer runs as an asynchronous job. An export job validates its scope, writes a temporary archive, records progress, and exposes the finished file for download. An import job validates the archive layout and entries before applying supported data.

Treat an archive as sensitive: it may include messages, learned data, identities, configuration fragments, and statistics.

## Safe operation

- Check job status until it reaches a terminal state before downloading or retrying.
- Validate the archive and keep an independent backup before import.
- Do not edit paths inside an archive to bypass validation.
- Avoid concurrent imports into the same live dataset.
- Account for aggregation delay when comparing dashboard values with raw events.

The HTTP endpoints are summarized in [Data and Memory API](./webui-api/data-and-memory-api.md).
