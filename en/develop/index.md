---
title: Development Guide
---# Development Guide

MaiBot (MaiMai / MaiSaka) is an interactive intelligent agent based on Large Language Models. This section is intended for developers who wish to participate in development or write plugins, introducing the project's technology stack, directory structure, and development environment setup.

## Technology Stack

| Category | Technology |
|------|------|
| Language | Python 3.10+ |
| Web Framework | FastAPI |
| ORM | SQLModel |
| ASGI Server | Uvicorn |
| Configuration Management | Pydantic + TOML + Hot Reload |
| Plugin IPC | msgpack over UDS / TCP / Named Pipe |
| Package Management | uv |
| Linting | Ruff |
| License | GPL-3.0 |

## Project Structure

```
MaiBot/
├── src/                    # 核心源码
│   ├── config/             # 配置管理（TOML + Pydantic + 热重载）
│   ├── chat/               # 聊天处理、心流引擎、回复生成
│   ├── maisaka/             # 核心 AI 运行时（规划器、推理引擎、工具调用）
│   ├── A_memorix/           # 长期记忆引擎
│   ├── plugin_runtime/      # 插件运行时（Host/Runner IPC 架构）
│   ├── platform_io/         # 平台抽象层（路由、驱动、去重）
│   ├── llm_models/          # LLM 客户端实现
│   ├── services/            # 业务服务层（发送服务、记忆流等）
│   ├── webui/               # FastAPI Web 管理后端
│   ├── learners/            # 表达方式学习与黑话挖掘
│   ├── emoji_system/        # Emoji 管理
│   ├── mcp_module/          # Model Context Protocol 集成
│   ├── manager/              # 全局管理器（表情管理等）
│   ├── person_info/          # 人物画像信息模块
│   ├── common/              # 共享工具（数据库、日志、i18n、消息模型）
│   ├── prompt/              # Prompt 模板管理
│   └── core/                # 核心类型定义、事件总线、工具注册
├── dashboard/               # 前端（独立仓库构建，禁止修改）
├── plugins/                 # 第三方插件目录
├── src/plugins/built_in/    # 内置插件目录
├── pytests/                 # 测试
└── data/                    # 运行时数据（gitignore）
```

### Core Module Descriptions

- **config/**: Manages configurations using Pydantic models, supporting TOML file hot reloading. Configuration changes are published via templates + version numbers rather than directly editing runtime configurations.
- **chat/**: Chat message entry point and main pipeline scheduling. Includes `ChatBot` (message processing entry), `ChatManager` (session management), `HeartFlow` (HeartFlow message processor), etc.
- **maisaka/**: Core AI runtime. Centered around `ChatLoopService`, responsible for the LLM conversation loop, tool call planning, context message management, etc.
- **A_memorix/**: Long-term memory engine, responsible for persisting user preferences, conversation memories, and other psychological dimension data.
- **plugin_runtime/**: Plugin runtime system. Employs a Host (main process) / Runner (child process) IPC architecture using msgpack encoding/decoding, supporting Hook mechanisms, component registration, and hot reloading.
- **platform_io/**: Platform abstraction layer. Implements unified management of multi-platform message sending and receiving through the `RouteKey` routing mechanism, supporting driver registration, route binding, inbound deduplication, and outbound tracking.
- **llm_models/**: LLM client implementations, encapsulating the call logic for various model APIs.
- **services/**: Business service layer, containing core services such as `SendService` (outbound message sending).
- **webui/**: FastAPI-driven Web management backend, providing plugin management, configuration editing, authentication, and authorization, bound to `127.0.0.1:8001` by default.
- **core/**: Core type definitions, including `ComponentType`, `ActionInfo`, `CommandInfo`, `ToolInfo`, `MaiMessages`, etc., as well as the event bus (`EventBus`) and tool registration center (`ToolRegistry`).
- **learners/**: Expression learning and slang mining, automatically learning new words and expression habits by analyzing chat content.
- **emoji_system/**: Emoji pack management and distribution system, supporting loading, matching, puzzle filtering, and sending of emojis.
- **mcp_module/**: Model Context Protocol integration, supporting external tool calls via MCP Server/Client protocols.
- **common/**: Shared utility modules, including database models (`SQLModel`), logging system, internationalization (`i18n`), message data models (`MaimMessage`), and other public infrastructure.
- **prompt/**: Prompt template management system, supporting multi-language Prompt loading, variable replacement, and template hot reloading.
- **manager/**: Global manager module, managing application-level singleton services (such as the emoji manager).
- **person_info/**: Persona information module, responsible for querying and displaying user persona data.

## Development Environment Setup

### Prerequisites

- Python 3.10 or higher
- [uv](https://github.com/astral-sh/uv) package management tool

### Install Dependencies

```bash
uv sync
```

### Start Project

```bash
uv run python bot.py
```

`bot.py` adopts a Runner/Worker dual-process model: the Runner process is responsible for guarding and restarting (exit code 42 triggers a restart), while the Worker process executes the actual `MainSystem` initialization and task scheduling.

### Run Tests

```bash
uv run pytest
```

### Linting and Formatting

```bash
# Lint 检查
uv run ruff check .

# 自动格式化
uv run ruff format .
```

## Architecture Details

Deep dive into the internal architecture and implementation principles of each subsystem:

### Base Domain (Wave 1) — Underlying Infrastructure

Underlying infrastructure providing communication, tool abstraction, and the system runtime foundation.

- [Event Bus Architecture](./architecture/event-bus.md): The central event communication hub for the entire MaiBot system, providing a publish/subscribe model and two types of event handlers: intercepting and non-intercepting.
- [Tool System Architecture](./architecture/tool-system.md): A unified abstraction layer for four types of tool sources, integrating plugins, legacy Actions, MaiSaka built-in tools, and MCP tools via ToolProvider.

### Core Functional Domain (Wave 2) — Main Business Pipelines

Message processing, reasoning, memory, WebUI, and service encapsulation constitute the main business pipelines of MaiBot.

- [Message Pipeline](./architecture/message-pipeline.md): The complete processing flow for inbound messages—from platform adapters to Hook interception, filtering, command dispatch, HeartFlow, and outbound sending.
- [Maisaka Reasoning Engine](./architecture/maisaka-reasoning.md): The core of conversation reasoning—Timing Gate rhythm control, Planner planning loops, tool calls, and interruption mechanisms.
- [Memory System](./architecture/memory-system.md): A-Memorix long-term memory engine—dual-path retrieval, storage layer, memory strategies, and user personas.
- [WebUI Internal Mechanisms](./architecture/webui-internals.md): FastAPI backend architecture—authentication security, WebSocket communication, plugin management, and configuration hot reloading.
- [Service Layer Architecture](./architecture/service-layer.md): Encapsulates business services such as LLM calls, memory operations, message sending, database access, and statistical aggregation for reuse by upper-layer modules.

### Auxiliary Functional Domain (Wave 3) — Enhancement Modules

Enhancement modules that can be enabled, replaced, or extended based on deployment needs.

- [Expression Learning Architecture](./architecture/expression-learning.md): Learns behavioral patterns, slang, and expression preferences from conversations to provide continuously updated style materials for personalized replies.
- [Emoji System Internal Architecture](./architecture/emoji-internals.md): Manages emoji pack loading, matching, and generation, providing visual expression materials for message understanding and reply generation.
- [MCP Integration Architecture](./architecture/mcp-integration.md): Connects to external MCP Servers, integrating remote tool capabilities into the unified Tool System.
- [Prompt Template System](./architecture/prompt-templates.md): Manages Prompt template loading, parameterization, and runtime updates, supporting the context organization of the reasoning engine.
- [Global Manager Architecture](./architecture/global-managers.md): Centrally manages cross-module asynchronous tasks, configuration states, and runtime services to reduce entry orchestration complexity.

## Next Steps

- [Architecture Design](./architecture.md): Learn about the Runner/Worker process model and the message processing pipeline.
- [Contribution Guide](./contributing.md): Learn about code standards and the contribution process.
- [Plugin Development](./plugin-dev/): Learn how to develop MaiBot plugins.
- [Adapter Development](./adapter-dev/): Learn how to develop platform adapters.