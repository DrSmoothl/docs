---
title: Architecture Design
---

# Architecture Design

This article introduces MaiBot's core architecture, including process model, system initialization flow, message processing pipeline, and key components.

## Runner/Worker Process Model

MaiBot implements a Runner/Worker dual-process model through `bot.py`:

```mermaid
graph TD
    A[User runs bot.py] --> B{Environment variable check}
    B -->|MAIBOT_WORKER_PROCESS != 1| C[Runner process]
    B -->|MAIBOT_WORKER_PROCESS == 1| D[Worker process]
    C -->|subprocess.Popen| E[Start Worker subprocess]
    E -->|Return code 42| C
    E -->|Other return codes| F[Exit]
    D --> G[MainSystem initialization]
    G --> H[Schedule async tasks]
```

- **Runner process**: Daemon process responsible for starting and monitoring Worker subprocess. When Worker exits with exit code 42, Runner automatically restarts Worker (hot restart mechanism). When Runner receives Ctrl+C signal, it gracefully terminates Worker.
- **Worker process**: Process that actually executes business logic. After setting environment variable `MAIBOT_WORKER_PROCESS=1`, it enters Worker mode and executes `MainSystem` initialization and task scheduling.

## MainSystem Initialization Flow

`MainSystem.initialize()` initializes each component in parallel through `asyncio.gather`:

```mermaid
graph LR
    A[MainSystem.initialize] --> B[_init_components]
    B --> C[Configuration file hot reload startup]
    B --> D[Async task manager register scheduled tasks]
    B --> E[Plugin runtime startup]
    B --> F[A_memorix long-term memory startup]
    B --> G[Emoji manager loading]
    B --> H[Chat manager initialization]
    B --> I[Memory automation service startup]
    B --> J[Prompt template loading]
    B --> K[Message processor registration]
    B --> L[ON_START event distribution]
```

Core initialization sequence:

1. Start configuration file hot reload monitor
2. Register scheduled tasks (online time statistics, statistics output, telemetry heartbeat, expression method automatic check)
3. Start plugin runtime (`PluginRuntimeManager.start()`), establish twin processes (built-in plugins + third-party plugins)
4. Start A_memorix long-term memory service
5. Load emoji manager
6. Initialize chat manager
7. Register `ChatBot.message_process` to message API server
8. Load Prompt templates
9. Trigger `ON_START` event and distribute to plugin runtime

`schedule_tasks()` then starts continuously running services: emoji regular maintenance, message API server, message server, WebUI server.

## Message Processing Pipeline

MaiBot's message processing is a complete pipeline from inbound reception to outbound sending:

```mermaid
flowchart TD
    A[Platform message arrives] --> B[maim-message MessageServer]
    B --> C[ChatBot.message_process]
    C --> D[Hook: chat.receive.before_process]
    D -->|Not aborted| E[SessionMessage.process preprocessing]
    E --> F[Hook: chat.receive.after_process]
    F -->|Not aborted| G[Filter: ban_words / ban_regex]
    G --> H[Session management: find or create session]
    H --> I{Hit command?}
    I -->|Yes| J[Hook: chat.command.before_execute]
    J -->|Not aborted| K[Command execution RPC]
    K --> L[Hook: chat.command.after_execute]
    L --> M{Continue processing?}
    M -->|Yes| N[HeartFlow message processor]
    M -->|No| O[Return command result]
    I -->|No| N
    N --> P[MaisakaChatLoopService reasoning engine]
    P --> Q[Hook: maisaka.planner.before_request]
    Q --> R[LLM request and tool call loop]
    R --> S[Hook: maisaka.planner.after_response]
    S --> T[Reply generation]
    T --> U[SendService]
    U --> V[Hook: send_service.after_build_message]
    V -->|Not aborted| W[Hook: send_service.before_send]
    W -->|Not aborted| X[PlatformIOManager.send_message]
    X --> Y[Adapter driver sending]
    Y --> Z[Hook: send_service.after_send]
```

### Pipeline Stages in Detail

#### 1. Message Inbound

Messages arrive through maim-message `MessageServer`, and the registered `ChatBot.message_process` processing function is called.

#### 2. Hook Interception Chain

- **chat.receive.before_process**: Triggered before `SessionMessage.process()`, can intercept or rewrite original messages.
- **chat.receive.after_process**: Triggered after message preprocessing is complete, can rewrite text, message body, or abort subsequent pipeline.

#### 3. Message Filtering

Filter inappropriate content through `ban_words` (blocked words) and `ban_regex` (blocked regex) in the configuration.

#### 4. Session Management

`ChatManager` finds or creates corresponding sessions, maintaining session context and state.

#### 5. Command Processing

`ComponentQueryService.find_command_by_text()` finds matching commands in the plugin component registry. After command matching, sequentially trigger `chat.command.before_execute` and `chat.command.after_execute` Hooks, then call the command executor in the Runner subprocess through RPC.

#### 6. HeartFlow Processing

Messages not intercepted by commands enter `HeartFCMessageReceiver`, scheduled to the Maisaka reasoning engine by the HeartFlow message processor.

#### 7. Maisaka Reasoning Engine

`ChatLoopService` builds context message windows, candidate tool lists, and makes requests to LLM:
- **maisaka.planner.before_request**: Can rewrite message windows and tool definitions
- LLM request and tool call loop
- **maisaka.planner.after_response**: Can adjust text results and tool call lists
- **maisaka.replyer.before_request**: Before replyer builds the model request; can rewrite task, model, extra prompt, and `reply_tool_args`
- **maisaka.replyer.before_model_request**: After replyer builds final `messages` and before requesting the model; can rewrite the actual message list sent to the model
- **maisaka.replyer.after_response**: After replyer receives the model response; can rewrite the reply or request regeneration

#### 8. Outbound Sending

`SendService` builds outbound messages, and after multi-level Hooks, routes to specific platform drivers through `PlatformIOManager`:
- **send_service.after_build_message**: Can rewrite message body or cancel sending
- **send_service.before_send**: Final interception point before sending
- Platform IO routing decision and driver sending
- **send_service.after_send**: Observe final sending results

## Plugin Runtime Architecture

```mermaid
graph TD
    subgraph Host Main Process
        A[PluginRuntimeManager] --> B[HookSpecRegistry]
        A --> C[HookDispatcher]
        A --> D[Builtin Supervisor]
        A --> E[Third-party Supervisor]
        D --> F[ComponentRegistry]
        E --> G[ComponentRegistry]
        D --> H[RPCServer]
        E --> I[RPCServer]
    end
    subgraph Runner Subprocess 1
        J[Builtin Plugin Runner] --> K[Plugin A]
        J --> L[Plugin B]
    end
    subgraph Runner Subprocess 2
        M[Third-party Plugin Runner] --> N[Plugin C]
        M --> O[Plugin D]
    end
    H <-->|msgpack IPC| J
    I <-->|msgpack IPC| M
```

- **PluginRuntimeManager**: Singleton manager managing two `PluginSupervisor` (built-in plugins + third-party plugins).
- **PluginSupervisor**: Each Supervisor manages one Runner subprocess, responsible for lifecycle, RPC communication, health checks, and plugin reloading.
- **Runner subprocess**: Independent process loads and runs plugin code, communicates with Host through msgpack-encoded IPC.
- **ComponentRegistry**: Component registry managing registration information for Action, Command, Tool three types of components.

## Platform IO Architecture

```mermaid
graph TD
    subgraph Platform IO Middleware Layer
        A[PlatformIOManager] --> B[DriverRegistry]
        A --> C[SendRouteTable]
        A --> D[ReceiveRouteTable]
        A --> E[MessageDeduplicator]
        A --> F[OutboundTracker]
    end
    G[LegacyPlatformDriver] --> A
    H[PluginPlatformDriver] --> A
    I[Custom PlatformIODriver] --> A
    A -->|Routing decision| J[RouteKey parsing]
    J -->|Match driver| K[Driver sends message]
```

- **PlatformIOManager**: Broker manager maintaining send/receive route tables, driver registry, inbound deduplication, and outbound tracking.
- **RouteKey**: Routing key composed of `platform` (platform), `account_id` (account), `scope` (scope), supporting fallback matching from most specific to most general.
- **PlatformIODriver**: Driver abstract base class defining interfaces such as `send_message()`, `start()`, `stop()`, `emit_inbound()`.
