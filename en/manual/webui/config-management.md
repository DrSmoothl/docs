---
title: Config Management
---

# Config Management

WebUI provides complete configuration management functionality, supporting modification of `bot_config.toml` and `model_config.toml` through form interfaces or raw TOML editing. All modifications are validated by the backend to ensure correct configuration format.

## Configuration Files Overview

MaiBot's core configuration is divided into two files:

- **`bot_config.toml`** — Robot main configuration (platform, personality, features, etc.). Corresponding class: `Config`
- **`model_config.toml`** — Model configuration (API providers, model task assignment). Corresponding class: `ModelConfig`

## Configuration Architecture and Dynamic Forms

WebUI frontend uses `ConfigSchemaGenerator` to automatically generate JSON Schema based on backend Pydantic models, dynamically rendering configuration forms. Each configuration field specifies frontend control type and icon through `x-widget` and `x-icon` in `json_schema_extra`.

### Get Configuration Schema

- **`GET /api/webui/config/schema/bot`** — Get complete schema for `bot_config.toml`
- **`GET /api/webui/config/schema/model`** — Get complete schema for `model_config.toml`
- **`GET /api/webui/config/schema/section/{name}`** — Get schema for specified configuration section

### Supported Configuration Sections

The `/schema/section/{name}` interface supports the following section names:

- **`bot`** — Basic information (platform, account, nickname)
- **`personality`** — Personality and expression style
- **`chat`** — Chat behavior control
- **`message_receive`** — Message receiving settings
- **`emoji`** — Emoji functionality
- **`expression`** — Expression methods
- **`keyword_reaction`** — Keyword reactions
- **`chinese_typo`** — Chinese typo simulation
- **`response_post_process`** — Response post-processing
- **`response_splitter`** — Response splitting
- **`telemetry`** — Telemetry
- **`maim_message`** — maim-message integration
- **`memory`** — Memory system
- **`debug`** — Debug options
- **`voice`** — Speech recognition
- **`model_task_config`** — Model task configuration
- **`api_provider`** — API provider
- **`model_info`** — Model information

## Read Configuration

- **`GET /api/webui/config/bot`** — Read all content of `bot_config.toml`
- **`GET /api/webui/config/model`** — Read all content of `model_config.toml`
- **`GET /api/webui/config/bot/raw`** — Read raw TOML text of `bot_config.toml`

The read interface returns structured data (JSON format) parsed by tomlkit, containing all configuration items and comment information in the file.

## Update Configuration

### Overall Update

- **`POST /api/webui/config/bot`** — Overall update of `bot_config.toml`
- **`POST /api/webui/config/model`** — Overall update of `model_config.toml`

Overall update will replace the entire configuration file content. Before submission, the backend will perform complete validation through `Config.from_dict()` / `ModelConfig.from_dict()`. Validation failure will return 400 error and specific failure reasons. When saving, `save_toml_with_format` automatically preserves comments and format.

### Section Update

- **`POST /api/webui/config/bot/section/{section_name}`** — Update specified section of `bot_config.toml`
- **`POST /api/webui/config/model/section/{section_name}`** — Update specified section of `model_config.toml`

Section updates adopt recursive merge strategy:
- **Dictionary type** fields: Recursive merge, preserving unmodified keys and comments
- **List type** fields (such as `platforms`, `api_providers`): Direct replacement
- **Other types**: Direct replacement

After merge completion, the complete configuration will be validated. For the `api_providers` section of `model_config.toml`, if a provider is deleted but models still reference it, the backend will return detailed error information listing affected model names.

### Raw TOML Editing

- **`GET /api/webui/config/bot/raw`** — Get raw TOML text
- **`POST /api/webui/config/bot/raw`** — Save raw TOML text

Raw editing mode is suitable for advanced users to directly edit TOML files. When submitting, the backend will:
1. Use `tomlkit.loads()` to verify TOML format correctness
2. Use `Config.from_dict()` to validate configuration data structure
3. Directly write to file after both validations pass

## Adapter Configuration Management

WebUI also supports managing independent configuration files for adapters (such as NapCat adapter configuration files).

### Path Management

- **`GET /api/webui/config/adapter-config/path`** — Get adapter configuration file path
- **`POST /api/webui/config/adapter-config/path`** — Save adapter configuration file path

Path preferences are stored in the `adapter_config_path` field of `data/webui.json`.

### Security Restrictions

Adapter configuration paths must meet the following security conditions:
- File suffix must be `.toml`
- Path must be within allowed root directory ranges (project root directory, `MaiBot-Napcat-Adapter` directory, `/MaiMBot/adapters-config`)
- Relative paths will be automatically converted to absolute paths of the project root directory

### Configuration Read/Write

- **`GET /api/webui/config/adapter-config?path=...`** — Read adapter configuration file content
- **`POST /api/webui/config/adapter-config`** — Save adapter configuration file content

When saving, it will first verify TOML format, and write to file after validation passes. If the target directory doesn't exist, it will be automatically created.

## Configuration File Format Preservation

All configuration write operations use the `save_toml_with_format` function, which:
- Preserves comments in TOML files
- Formats arrays as multi-line display
- Maintains original indentation and whitespace style

This means modifying configuration through WebUI won't destroy manually added comments, suitable for mixed use of WebUI and manual editing to manage configuration.