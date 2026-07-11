---
title: Development Guide
---
# Development Guide

MaiBot (Mai / MaiSaka) is an interactive agent based on large language models. This section is aimed at developers who wish to participate in development or write plugins, introducing the project's technology stack, directory structure, and development environment setup.

## Tech Stack

| Category | Technology |
|------|------|
| Language | Python 3.10+ |
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

`bot.py` adopts a Runner/Worker dual-process model: the Runner process is responsible for guarding and restarting (exit code 42 triggers a restart), while the Worker process executes the actual `MainSystem` initialization and task scheduling.

### Run Tests

```bash
uv run pytest
```

### Code Checking and Formatting

```bash
# Lint check
uv run ruff check .

# Auto-format
uv run ruff format .
```

## Architecture Overview

Deep dive into the internal architecture and implementation principles of each subsystem:

### Foundation Domain (Wave 1) — Core Infrastructure

Core infrastructure providing communication, tool abstraction, and the system runtime foundation.

- [Event Bus Architecture](./architecture/event-bus.md): The central event communication hub for the entire MaiBot system, providing a publish/subscribe model and two types of event handlers: intercepting and non-intercepting.
- [Tool System Architecture](./architecture/tool-system.md): A unified abstraction layer for four categories of tool sources, integrating plugins, legacy Actions, built-in MaiSaka tools, and MCP tools via ToolProvider.

### Core Functionality Domain (Wave 2) — Primary Business Flows

Message processing, reasoning, memory, WebUI, and service encapsulation constitute the primary business flows of MaiBot.

- [Message Pipeline](./architecture/message-pipeline.md): The complete inbound message processing flow—from platform adapters to Hook interception, filtering, command dispatching, HeartFlow, and outbound sending.
- [Maisaka Reasoning Engine](./architecture/maisaka-reasoning.md): The core of conversational reasoning—featuring Timing Gate rhythm control, Planner planning loops, tool invocation, and interruption mechanisms.
- [Memory System](./architecture/memory-system.md): The A-Memorix long-term memory engine—featuring dual-path retrieval, storage layers, memory strategies, and character profiles.
- [WebUI Internal Mechanisms](./architecture/webui-internals.md): FastAPI backend architecture—covering authentication security, WebSocket communication, plugin management, and configuration hot-reloading.
- [Service Layer Architecture](./architecture/service-layer.md): Encapsulates business services such as LLM invocation, memory operations, message sending, database access, and statistical aggregation for reuse by upper-layer modules.

### Auxiliary Functionality Domain (Wave 3) — Enhancement Modules

Enhancement modules that can be enabled, replaced, or extended based on deployment requirements.

- [Expression Learning Architecture](./architecture/expression-learning.md): Learns behavioral patterns, slang, and expression preferences from conversations to provide continuously updated style materials for personalized responses.
- [Emoji System Internal Architecture](./architecture/emoji-internals.md): Manages emoji pack loading, matching, and generation, providing visual expression materials for message understanding and response generation.
- [MCP Integration Architecture](./architecture/mcp-integration.md): Connects to external MCP Servers to integrate remote tool capabilities into the unified Tool System.
- [Prompt Template System](./architecture/prompt-templates.md): Manages prompt template loading, parameterization, and runtime updates, supporting the context organization of the reasoning engine.
- [Global Manager Architecture](./architecture/global-managers.md): Centrally manages cross-module asynchronous tasks, configuration states, and runtime services to reduce entry-point orchestration complexity.

## Next Steps

- [Architecture Design](./architecture.md): Understand the Runner/Worker process model and message processing pipeline
- [Contributing Guide](./contributing.md): Learn about coding standards and contribution workflow
- [Plugin Development](../plugin/): Learn how to develop MaiBot plugins
- [Adapter Development](./adapter-dev/): Learn how to develop platform adapters