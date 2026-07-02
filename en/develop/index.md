---
title: Development Guide
---# Development Guide

MaiBot (麦麦 / MaiSaka) is an interactive agent based on large language models. This section is intended for developers who wish to participate in development or write plugins, introducing the project's tech stack, directory structure, and development environment setup.

## Tech Stack

| Category | Technology |
|------|------|
| Language | Python 3.10+ |
| Web Framework | FastAPI |
| ORM | SQLModel |
| ASGI Server | Uvicorn |
| Configuration Management | Pydantic + TOML + Hot Reload |
| Plugin IPC | msgpack over UDS / TCP / Named Pipe |
| Package Manager | uv |
| Linting | Ruff |
| License | GPL-3.0 |

## Project Structure

```
MaiBot/
├── src/                    # Core source code
│   ├── config/             # Configuration management (TOML + Pydantic + hot reload)
│   ├── chat/               # Chat processing, HeartFlow engine, reply generation
│   ├── maisaka/             # Core AI runtime (planner, reasoning engine, tool calling)
│   ├── A_memorix/           # Long-term memory engine
│   ├── plugin_runtime/      # Plugin runtime (Host/Runner IPC architecture)
│   ├── platform_io/         # Platform abstraction layer (routing, drivers, deduplication)
│   ├── llm_models/          # LLM client implementations
│   ├── services/            # Business service layer (sending service, memory flow, etc.)
│   ├── webui/               # FastAPI Web management backend
│   ├── learners/            # Expression learning and slang mining
│   ├── emoji_system/        # Emoji management
│   ├── mcp_module/          # Model Context Protocol integration
│   ├── manager/              # Global managers (emoji management, etc.)
│   ├── person_info/          # User profile information module
│   ├── common/              # Shared utilities (database, logging, i18n, message models)
│   ├── prompt/              # Prompt template management
│   └── core/                # Core type definitions, event bus, tool registry
├── dashboard/               # Frontend (built from a separate repository, do not modify)
├── plugins/                 # Third-party plugin directory
├── src/plugins/built_in/    # Built-in plugin directory
├── pytests/                 # Tests
└── data/                    # Runtime data (gitignore)
```

### Core Module Descriptions

- **config/**: Manages configuration using Pydantic models, supports TOML file hot reload. Configuration changes are released via templates + version numbers; runtime configurations are not edited directly.
- **chat/**: Chat message entry point and main link scheduling. Includes `ChatBot` (message processing entry), `ChatManager` (session management), `HeartFlow` (HeartFlow message processor), etc.
- **maisaka/**: Core AI runtime. Centered around `ChatLoopService`, responsible for LLM conversation loops, tool call planning, context message management, etc.
- **A_memorix/**: Long-term memory engine, responsible for persisting user preferences, conversation memory, and other psychological dimension data.
- **plugin_runtime/**: Plugin runtime system. Adopts Host (main process) / Runner (subprocess) IPC architecture, uses msgpack encoding/decoding, supports Hook mechanisms, component registration, and hot reload.
- **platform_io/**: Platform abstraction layer. Implements unified management of multi-platform message sending/receiving through the `RouteKey` routing mechanism, supports driver registration, route binding, inbound deduplication, and outbound tracking.
- **llm_models/**: LLM client implementations, encapsulating the calling logic of various model APIs.
- **services/**: Business service layer, including core services such as `SendService` (outbound message sending).
- **webui/**: FastAPI-driven Web management backend, providing features like plugin management, configuration editing, authentication and authorization, bound to `127.0.0.1:8001` by default.
- **core/**: Core type definitions, including `ComponentType`, `ActionInfo`, `CommandInfo`, `ToolInfo`, `MaiMessages`, etc., as well as the event bus (`EventBus`) and tool registry (`ToolRegistry`).
- **learners/**: Expression learning and slang mining, automatically learns new words and expression habits by analyzing chat content.
- **emoji_system/**: Sticker management and distribution system, supporting sticker loading, matching, collage filtering, and sending.
- **mcp_module/**: Model Context Protocol integration, supporting external tool calls using the MCP Server/Client protocol.
- **common/**: Shared utility module, including public infrastructure like database models (`SQLModel`), logging system, internationalization (`i18n`), and message data models (`MaimMessage`).
- **prompt/**: Prompt template management system, supporting multi-language Prompt loading, variable substitution, and template hot reload.
- **manager/**: Global manager module, managing application-level singleton services (such as emoji manager, etc.).
- **person_info/**: User profile information module, responsible for querying and displaying user profile data.

## Development Environment Setup

### Prerequisites

- Python 3.10 or higher
- [uv](https://github.com/astral-sh/uv) package manager

### Install Dependencies

```bash
uv sync
```

### Start the Project

```bash
uv run python bot.py
```

`bot.py` adopts a Runner/Worker dual-process model: the Runner process is responsible for guarding and restarting (exit code 42 triggers restart), while the Worker process executes the actual `MainSystem` initialization and task scheduling.

### Run Tests

```bash
uv run pytest
```

### Linting and Formatting

```bash
# Lint check
uv run ruff check .

# Auto format
uv run ruff format .
```

## Architecture Details

Deep dive into the internal architecture and implementation principles of each subsystem:

### Foundation Domain (Wave 1) — Low-level Infrastructure

Low-level infrastructure, providing communication, tool abstraction, and the system runtime base.

- [Event Bus Architecture](./architecture/event-bus.md): MaiBot's system-wide event communication hub, providing a publish/subscribe model and two types of event handlers: intercepting and non-intercepting
- [Tool System Architecture](./architecture/tool-system.md): Unified abstraction layer for four tool sources, integrating plugins, legacy Actions, MaiSaka built-in tools, and MCP tools via ToolProvider

### Core Functionality Domain (Wave 2) — Main Business Links

Message processing, reasoning, memory, WebUI, and service encapsulation form MaiBot's main business links.

- [Message Pipeline](./architecture/message-pipeline.md): The complete processing flow of inbound messages — from platform adapters to Hook interception, filtering, command dispatching, HeartFlow, and outbound sending
- [Maisaka Reasoning Engine](./architecture/maisaka-reasoning.md): The core of conversational reasoning — Timing Gate rhythm control, Planner planning loop, tool calling, and interruption mechanisms
- [Memory System](./architecture/memory-system.md): A-Memorix long-term memory engine — dual-path retrieval, storage layer, memory strategies, and user profiles
- [WebUI Internals](./architecture/webui-internals.md): FastAPI backend architecture — authentication security, WebSocket communication, plugin management, and configuration hot reload
- [Service Layer Architecture](./architecture/service-layer.md): Encapsulates business services such as LLM calls, memory operations, message sending, database access, and statistics aggregation for reuse by upper-level modules

### Auxiliary Functionality Domain (Wave 3) — Enhanced Capability Modules

Enhanced capability modules that can be enabled, replaced, or extended according to deployment needs.

- [Expression Learning Architecture](./architecture/expression-learning.md): Learns behavioral patterns, slang, and expression preferences from conversations, providing continuously updated style materials for personalized replies
- [Emoji System Internals](./architecture/emoji-internals.md): Manages sticker loading, matching, and generation, providing visual expression materials for message understanding and reply generation
- [MCP Integration Architecture](./architecture/mcp-integration.md): Connects to external MCP Servers, integrating remote tool capabilities into the unified Tool System
- [Prompt Template System](./architecture/prompt-templates.md): Manages Prompt template loading, parameterization, and runtime updates, supporting the context organization of the reasoning engine
- [Global Manager Architecture](./architecture/global-managers.md): Centrally manages cross-module async tasks, configuration states, and runtime services, reducing entry-point orchestration complexity

## Next Steps

- [Architecture Design](./architecture.md): Learn about the Runner/Worker process model and message processing pipeline
- [Contributing Guide](./contributing.md): Learn about code standards and contribution processes
- [Plugin Development](../plugin/): Learn how to develop MaiBot plugins
- [Adapter Development](./adapter-dev/): Learn how to develop platform adapters