---
title: Configuration System
---

# Configuration System

MaiBot keeps runtime settings in two versioned TOML files: `config/bot_config.toml` for bot behavior and services, and `config/model_config.toml` for providers, models, and task routing. Pydantic models in `src/config/official_configs.py` and `src/config/model_config.py` define the accepted fields, defaults, validation rules, and WebUI metadata.

## Loading and upgrades

At startup, the configuration manager reads the TOML files, applies the ordered upgrade-hook chain, validates the result, and writes a backup before persisting a migrated version. Do not add undeclared fields: newer versions may remove or rename them during validation.

Legacy `.env` values and older layouts are migrated before the current models are instantiated. Review the generated diff and backup when crossing a major version.

## Hot reload

The file watcher detects changes, reloads and validates the affected configuration, then fans the new object out to registered callbacks. A failed validation keeps the previous valid runtime configuration.

Use `register_reload_callback()` for services that need to react to configuration changes, and unregister callbacks when their owner is disposed.

## Editing guidance

- Prefer WebUI for ordinary settings and raw TOML for advanced fields.
- Keep provider names, model names, and task references consistent across `model_config.toml`.
- Preserve comments and backups when performing automated edits.
- Restart only when a component does not support hot reload or the log explicitly asks for it.

See [Bot Configuration](../manual/configuration/bot-config.md), [Model Configuration](../manual/configuration/model-config.md), and [A_Memorix Configuration](../manual/configuration/amemorix-config.md).
