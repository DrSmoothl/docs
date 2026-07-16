---
title: 开发指南
---

# 开发指南

MaiBot（麦麦 / MaiSaka）是基于大语言模型的可交互智能体。本节面向希望参与开发或编写插件的开发者，介绍项目的技术栈、目录结构与开发环境搭建。

## 技术栈

| 类别 | 技术 |
|------|------|
| 语言 | Python 3.12+ |
| Web 框架 | FastAPI |
| ORM | SQLModel |
| ASGI 服务器 | Uvicorn |
| 配置管理 | Pydantic + TOML + 热重载 |
| 插件 IPC | msgpack over UDS / TCP / Named Pipe |
| 包管理 | uv |
| 代码检查 | Ruff |
| 许可证 | GPL-3.0 |

## 项目结构

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

### 核心模块说明

- **config/**：使用 Pydantic 模型管理配置，支持 TOML 文件热重载，配置修改通过模版+版本号方式发布，不直接编辑运行时配置。
- **chat/**：聊天消息入口与主链路调度。包含 `ChatBot`（消息处理入口）、`ChatManager`（会话管理）、`HeartFlow`（心流消息处理器）等。
- **maisaka/**：核心 AI 运行时。以 `ChatLoopService` 为中心，负责 LLM 对话循环、工具调用规划、上下文消息管理等。
- **A_memorix/**：长期记忆引擎，负责持久化用户偏好、对话记忆等心理学维度数据。
- **plugin_runtime/**：插件运行时系统。采用 Host（主进程）/ Runner（子进程）IPC 架构，使用 msgpack 编解码，支持 Hook 机制、组件注册与热重载。
- **platform_io/**：平台抽象层。通过 `RouteKey` 路由机制实现多平台消息收发的统一管理，支持驱动的注册、路由绑定、入站去重与出站跟踪。
- **llm_models/**：LLM 客户端实现，封装各模型 API 的调用逻辑。
- **services/**：业务服务层，包含 `SendService`（出站消息发送）等核心服务。
- **webui/**：FastAPI 驱动的 Web 管理后端，提供插件管理、配置编辑、认证鉴权等功能，默认绑定 `127.0.0.1:8001`。
- **core/**：核心类型定义，包括 `ComponentType`、`ActionInfo`、`CommandInfo`、`ToolInfo`、`MaiMessages` 等，以及事件总线 (`EventBus`) 和工具注册中心 (`ToolRegistry`)。
- **learners/**：表达方式学习与黑话挖掘，通过分析聊天内容自动学习新词和表达习惯。
- **emoji_system/**：表情包管理与分发系统，支持表情包的加载、匹配、拼图筛选和发送。
- **mcp_module/**：Model Context Protocol 集成，支持 MCP Server/Client 协议的外部工具调用。
- **common/**：共享工具模块，包括数据库模型 (`SQLModel`)、日志系统、国际化 (`i18n`)、消息数据模型 (`MaimMessage`) 等公共基础设施。
- **prompt/**：Prompt 模板管理系统，支持多语言 Prompt 的加载、变量替换和模板热重载。
- **manager/**：全局管理器模块，管理应用级别的单例服务（如表情管理器等）。
- **person_info/**：人物画像信息模块，负责用户画像数据的查询与展示。

## 开发环境搭建

### 前置条件

- Python 3.12 或更高版本
- [uv](https://github.com/astral-sh/uv) 包管理工具

### 安装依赖

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv sync
```

:::

### 启动项目

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv run python bot.py
```

:::

`bot.py` 采用 Runner/Worker 双进程模型：Runner 进程负责守护与重启（退出码 42 触发重启），Worker 进程执行实际的 `MainSystem` 初始化与任务调度。

### 运行测试

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv run pytest
```

:::

### 代码检查与格式化

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# Lint 检查
uv run ruff check .

# 自动格式化
uv run ruff format .
```

:::

## 架构详解

深入了解各子系统的内部架构和实现原理：

### 基础域（Wave 1）—— 底层基础设施

底层基础设施，提供通信、工具抽象和系统运行底座。

- [事件总线架构](./architecture/event-bus.md)：MaiBot 全系统事件通信中枢，提供发布/订阅模型和拦截型、非拦截型两类事件处理器
- [工具系统架构](./architecture/tool-system.md)：四类工具来源的统一抽象层，通过 ToolProvider 接入插件、旧 Action、MaiSaka 内置工具和 MCP 工具

### 核心功能域（Wave 2）—— 主要业务链路

消息处理、推理、记忆、WebUI 和服务封装构成 MaiBot 的主要业务链路。

- [消息管线](./architecture/message-pipeline.md)：入站消息的完整处理流程——从平台适配器到 Hook 拦截、过滤、命令分发、HeartFlow 和出站发送
- [Maisaka 推理引擎](./architecture/maisaka-reasoning.md)：对话推理的核心——消息 Turn Gate、Planner 规划循环、工具调用和打断机制
- [记忆系统](./architecture/memory-system.md)：A-Memorix 长期记忆引擎——双路检索、存储层、记忆策略和人物画像
- [WebUI 内部机制](./architecture/webui-internals.md)：FastAPI 后端架构——认证安全、WebSocket 通信、插件管理和配置热重载
- [服务层架构](./architecture/service-layer.md)：封装 LLM 调用、记忆操作、发送消息、数据库访问和统计聚合等业务服务，供上层模块复用

### 辅助功能域（Wave 3）—— 增强能力模块

增强能力模块，可按部署需求启用、替换或扩展。

- [表达学习架构](./architecture/expression-learning.md)：从对话中学习行为模式、俚语和表达偏好，为个性化回复提供持续更新的风格素材
- [表情系统内部架构](./architecture/emoji-internals.md)：管理表情包加载、匹配和生成，为消息理解与回复生成提供视觉表达素材
- [MCP 集成架构](./architecture/mcp-integration.md)：连接外部 MCP Server，将远程工具能力接入统一 Tool System
- [Prompt 模板系统](./architecture/prompt-templates.md)：管理 Prompt 模板加载、参数化和运行时更新，支撑推理引擎的上下文组织
- [全局管理器架构](./architecture/global-managers.md)：集中管理跨模块异步任务、配置状态和运行时服务，减少入口编排复杂度

## 下一步

- [架构设计](./architecture.md)：了解 Runner/Worker 进程模型与消息处理管线
- [贡献指南](./contributing.md)：了解代码规范与贡献流程
- [插件开发](../plugin/)：学习如何开发 MaiBot 插件
- [适配器开发](./adapter-dev/)：学习如何开发平台适配器
