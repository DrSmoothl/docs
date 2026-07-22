---
title: Development Guide
---
# Development Guide

MaiBot (Mai / MaiSaka) is an interactive agent based on large language models. This section is aimed at developers who wish to participate in development or write plugins, introducing the project's technology stack, directory structure, and development environment setup.

## Tech Stack

| Category | Technology |
|------|------|
| Language | Python 3.12+ |
| Web Framework | FastAPI |
| ORM | SQLModel |
| ASGI Server | Uvicorn |
| Configuration Management | Pydantic + TOML + Hot Reload |
| Plugin IPC | msgpack over UDS / TCP / Named Pipe |
| Package Management | uv |
| Code Linting | Ruff |
| License | GPL-3.0 |

## Project Structure

```
MaiBot/
├── src/                    # Core source code
│   ├── config/             # Configuration management (TOML + Pydantic + Hot reload)
│   ├── chat/               # Chat processing, HeartFlow engine, response generation
│   ├── maisaka/             # Core AI runtime (Planner, Inference engine, Tool calling)
│   ├── A_memorix/           # Long-term memory engine
│   ├── plugin_runtime/      # Plugin runtime (Host/Runner IPC architecture)
│   ├── platform_io/         # Platform abstraction layer (Routing, Drivers, Deduplication)
│   ├── llm_models/          # LLM client implementations
│   ├── services/            # Business service layer (Sending service, Memory stream, etc.)
│   ├── webui/               # FastAPI Web management backend
│   ├── learners/            # Expression learning and slang mining
│   ├── emoji_system/        # Emoji management
│   ├── mcp_module/          # Model Context Protocol integration
│   ├── manager/              # Global manager (Emoji management, etc.)
│   ├── person_info/          # Character profile information module
│   ├── common/              # Shared utilities (Database, Logging, i18n, Message models)
│   ├── prompt/              # Prompt template management
│   └── core/                # Core type definitions, Event bus, Tool registration
├── dashboard/               # Frontend (Built from independent repository, do not modify)
├── plugins/                 # Third-party plugin directory
├── src/plugins/built_in/    # Built-in plugin directory
├── pytests/                 # Tests
└── data/                    # Runtime data (gitignore)
```

### Core Module Descriptions

- **config/**: Manages configuration using Pydantic models, supports TOML file hot reloading. Configuration changes are published via template + version number; do not edit runtime configuration directly.
- **chat/**: Chat message entry point and main link scheduling. Includes `ChatBot` (message processing entry), `ChatManager` (session management), `HeartFlow` (HeartFlow message processor), etc.
- **maisaka/**: Core AI runtime. Centered around `ChatLoopService`, responsible for LLM dialogue loops, tool calling planning, and context message management.
- **A_memorix/**: Long-term memory engine, responsible for persisting user preferences, dialogue memories, and other psychological dimension data.
- **plugin_runtime/**: Plugin runtime system. Adopts a Host (main process) / Runner (child process) IPC architecture, uses msgpack for encoding/decoding, and supports Hook mechanisms, component registration, and hot reloading.
- **platform_io/**: Platform abstraction layer. Achieves unified management of multi-platform message sending and receiving through the `RouteKey` routing mechanism. Supports driver registration, route binding, inbound deduplication, and outbound tracking.
- **llm_models/**: LLM client implementations, encapsulating the calling logic for various model APIs.
- **services/**: Business service layer, containing core services such as `SendService` (outbound message sending).
- **webui/**: FastAPI-driven Web management backend, providing plugin management, configuration editing, authentication, and authorization. Defaults to binding `127.0.0.1:8001`.
- **core/**: Core type definitions, including `ComponentType`, `ActionInfo`, `CommandInfo`, `ToolInfo`, `MaiMessages`, etc., as well as the Event Bus (`EventBus`) and Tool Registry (`ToolRegistry`).
- **learners/**: Expression learning and slang mining, automatically learning new words and expression habits by analyzing chat content.
- **emoji_system/**: Sticker pack management and distribution system, supporting sticker pack loading, matching, collage filtering, and sending.
- **mcp_module/**: Model Context Protocol integration, supporting external tool calls via the MCP Server/Client protocol.
- **common/**: Shared utility module, including database models (`SQLModel`), logging system, internationalization (`i18n`), message data models (`MaimMessage`), and other common infrastructure.
- **prompt/**: Prompt template management system, supporting loading of multi-language prompts, variable substitution, and template hot reloading.
- **manager/**: Global manager module, managing application-level singleton services (such as the Emoji Manager).
- **person_info/**: Character profile information module, responsible for querying and displaying user profile data.

## Development Environment Setup

### Prerequisites

- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager

### Install Dependencies

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv sync
```

:::

### Start the Project

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv run python bot.py
```

:::

`bot.py` adopts a Runner/Worker dual-process model: the Runner process is responsible for guarding and restarting (exit code 42 triggers a restart), while the Worker process executes the actual `MainSystem` initialization and task scheduling.

### Run Tests

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv run pytest
```

:::

### Code Checking and Formatting

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# Lint check
uv run ruff check .

# Auto-format
uv run ruff format .
```

:::

## Advanced Topics

This section now focuses on deployment operators, integrators, and developers who need to inspect or extend concrete runtime boundaries:

- [Configuration System](./configuration.md) — Versioned TOML models, upgrades, validation, and hot reload
- [Database](./database.md) — Sessions, identities, migrations, backups, and operational access
- [Message Server and Adapter Integration](./message-server-and-adapters.md) — Protocol modes, authentication, routing, and delivery receipts
- [LLM Provider Integration](./llm-providers.md) — Providers, models, tasks, extra parameters, and plugin clients
- [MCP Integration](./mcp-integration.md) — Transports, callbacks, tool registration, and deployment security
- [WebUI HTTP API](./webui-api/) — Authentication, system operations, data, plugins, realtime events, and statistics
- [Logging and Observability](./observability.md) — Log routing, snapshots, and production diagnosis
- [Statistics and Data Transfer](./statistics-io.md) — Aggregation and asynchronous import/export jobs
- [Event Pipeline and Hooks](./event-pipeline-hooks.md) — Internal events and cross-process plugin Hooks
- [Plugin Runtime Internals](./plugin-runtime-internals.md) — Host/Runner IPC, manifests, lifecycle, and recovery

## Next Steps

- [Plugin Development](../plugin/) — Build and package MaiBot plugins
- [Bot Configuration](../manual/configuration/bot-config.md) — Configure a running deployment
- [Markdown Features](./markdown-features.md) — Follow this repository's documentation conventions
