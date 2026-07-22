---
title: Data and Memory API
---

# Data and Memory API

This API group covers configuration, Prompt versions, people and learned data, A_Memorix administration, and asynchronous import/export jobs.

## Configuration

Schema endpoints provide field metadata for the WebUI. Structured update endpoints validate submitted values before writing TOML; raw endpoints additionally parse the complete TOML document. Invalid configuration returns HTTP 400 and leaves the previous valid configuration in place.

Bot, model, and adapter configurations use separate endpoint groups. Model configuration is versioned, so clients should preserve the active-version relationship when creating or switching files.

## Prompt and learned data

Prompt endpoints list editable templates and their versions. Entity routes expose people, avatar cache, behavior, expressions, jargon, and emoji data. Treat IDs as opaque and preserve platform/account scope.

## A_Memorix

Memory endpoints cover graph inspection, Episodes, profiles, sources, timeline, import, retrieval tuning, correction plans, deletion, and maintenance. Long-running operations return jobs or progress state instead of completing all work inside one HTTP request.

Source-level Episode processing now uses the source job queue. Configuration updates validate the current A_Memorix constraints, including threshold ordering and lifecycle bounds.

## Data transfer

Create an export or import job, poll its status, and download the completed export only after the job succeeds. Imports should be preceded by a database and configuration backup.

Compatibility `/api/*` memory routes cover common older operations but do not expose every newer module. New integrations should use the main `/api/webui/*` routes.
