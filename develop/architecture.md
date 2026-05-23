---
title: 架构设计
---

# 架构设计

本文介绍 MaiBot 的核心架构，包括进程模型、系统初始化流程、消息处理管线和关键组件。

## Runner/Worker 进程模型

MaiBot 通过 `bot.py` 实现 Runner/Worker 双进程模型：

```mermaid
graph TD
    A[用户运行 bot.py] --> B{环境变量检查}
    B -->|MAIBOT_WORKER_PROCESS != 1| C[Runner 进程]
    B -->|MAIBOT_WORKER_PROCESS == 1| D[Worker 进程]
    C -->|subprocess.Popen| E[启动 Worker 子进程]
    E -->|返回码 42| C
    E -->|其他返回码| F[退出]
    D --> G[MainSystem 初始化]
    G --> H[调度异步任务]
```

- **Runner 进程**：守护进程，负责启动、监控 Worker 子进程。当 Worker 以退出码 42 退出时，Runner 会自动重新启动 Worker（热重启机制）。当 Runner 收到 Ctrl+C 信号时，会优雅终止 Worker。
- **Worker 进程**：实际执行业务逻辑的进程。设置环境变量 `MAIBOT_WORKER_PROCESS=1` 后进入 Worker 模式，执行 `MainSystem` 的初始化和任务调度。

## MainSystem 初始化流程

`MainSystem.initialize()` 通过 `await` 串行初始化各组件：

```mermaid
graph LR
    A[MainSystem.initialize] --> B[_init_components]
    B --> C[配置文件热重载启动]
    B --> D[注册记忆配置重载回调]
    B --> E[Prompt 模板加载]
    B --> F[异步任务管理器注册定时任务]
    B --> G[插件运行时启动]
    B --> H[A_memorix 长期记忆启动]
    B --> I[表情管理器加载]
    B --> J[聊天管理器初始化]
    B --> K[记忆自动化服务启动]
    B --> L[消息处理器注册]
    B --> M[ON_START 事件分发]
```

核心初始化顺序：

1. 启动配置文件热重载监视器
2. 注册 A_memorix 配置重载回调（`register_config_reload_callback()`）
3. 加载 Prompt 模板
4. 注册定时任务（在线时间统计、统计输出、遥测心跳）
5. 启动插件运行时（`PluginRuntimeManager.start()`），建立双子进程（内置插件 + 第三方插件）
6. 启动 A_memorix 长期记忆服务
7. 加载表情管理器
8. 初始化聊天管理器
9. 启动记忆自动化服务（`memory_automation_service.start()`）
10. 将 `ChatBot.message_process` 注册到消息 API 服务器
11. 触发 `ON_START` 事件（`event_bus.emit`）并分发到插件运行时（`bridge_event`）

`schedule_tasks()` 随后启动持续运行的服务：表情定期维护、消息 API 服务器、消息服务器。

## 消息处理管线

MaiBot 的消息处理是从入站接收到出站发送的完整管线：

```mermaid
flowchart TD
    A[平台消息到达] --> B[maim-message MessageServer]
    B --> C[ChatBot.message_process]
    C --> D[Hook: chat.receive.before_process]
    D -->|未被中止| E[SessionMessage.process 预处理]
    E --> F[Hook: chat.receive.after_process]
    F -->|未被中止| G[过滤器：ban_words / ban_regex]
    G --> H[会话管理：查找或创建会话]
    H --> I{是否命中命令?}
    I -->|是| J[Hook: chat.command.before_execute]
    J -->|未被中止| K[命令执行 RPC]
    K --> L[Hook: chat.command.after_execute]
    L --> M{是否继续处理?}
    M -->|是| N[HeartFlow 心流消息处理器]
    M -->|否| O[返回命令结果]
    I -->|否| N
    N --> P[MaisakaChatLoopService 推理引擎]
    P --> Q[Hook: maisaka.planner.before_request]
    Q --> R[LLM 请求与工具调用循环]
    R --> S[Hook: maisaka.planner.after_response]
    S --> T[回复生成]
    T --> U[SendService]
    U --> V[Hook: send_service.after_build_message]
    V -->|未被中止| W[Hook: send_service.before_send]
    W -->|未被中止| X[PlatformIOManager.send_message]
    X --> Y[适配器驱动发送]
    Y --> Z[Hook: send_service.after_send]
```

### 管线各阶段详解

#### 1. 消息入站

消息通过 maim-message `MessageServer` 到达，已注册的 `ChatBot.message_process` 处理函数被调用。

#### 2. Hook 拦截链

- **chat.receive.before_process**：在 `SessionMessage.process()` 之前触发，可拦截或改写原始消息。
- **chat.receive.after_process**：在消息完成预处理后触发，可改写文本、消息体或中止后续链路。

#### 3. 消息过滤

通过配置中的 `ban_words`（屏蔽词）和 `ban_regex`（屏蔽正则）过滤不当内容。

#### 4. 会话管理

`ChatManager` 查找或创建对应会话，维护会话上下文与状态。

#### 5. 命令处理

`ComponentQueryService.find_command_by_text()` 在插件组件注册表中查找匹配的命令。命令匹配后，依次触发 `chat.command.before_execute` 和 `chat.command.after_execute` Hook，然后通过 RPC 调用 Runner 子进程中的命令执行器。

#### 6. HeartFlow 心流处理

未被命令拦截的消息进入 `HeartFCMessageReceiver`，由心流消息处理器调度到 Maisaka 推理引擎。

#### 7. Maisaka 推理引擎

`ChatLoopService` 构建上下文消息窗口、候选工具列表，向 LLM 发起请求：
- **maisaka.planner.before_request**：可改写消息窗口与工具定义
- LLM 请求与工具调用循环
- **maisaka.planner.after_response**：可调整文本结果与工具调用列表
- **maisaka.replyer.before_request**：replyer 构建模型请求前，可改写任务、模型、额外提示和 `reply_tool_args`
- **maisaka.replyer.before_model_request**：replyer 构造完最终 `messages` 后、请求模型前，可改写实际发送给模型的消息列表
- **maisaka.replyer.after_response**：replyer 收到模型响应后，可改写回复或要求重生成

#### 8. 出站发送

`SendService` 构建出站消息，经多级 Hook 后通过 `PlatformIOManager` 路由到具体的平台驱动：
- **send_service.after_build_message**：可改写消息体或取消发送
- **send_service.before_send**：最终发送前的拦截点
- Platform IO 路由决策与驱动发送
- **send_service.after_send**：观察最终发送结果

## 插件运行时架构

```mermaid
graph TD
    subgraph Host 主进程
        A[PluginRuntimeManager] --> B[HookSpecRegistry]
        A --> C[HookDispatcher]
        A --> D[Builtin Supervisor]
        A --> E[Third-party Supervisor]
        D --> F[ComponentRegistry]
        E --> G[ComponentRegistry]
        D --> H[RPCServer]
        E --> I[RPCServer]
    end
    subgraph Runner 子进程 1
        J[内置插件 Runner] --> K[Plugin A]
        J --> L[Plugin B]
    end
    subgraph Runner 子进程 2
        M[第三方插件 Runner] --> N[Plugin C]
        M --> O[Plugin D]
    end
    H <-->|msgpack IPC| J
    I <-->|msgpack IPC| M
```

- **PluginRuntimeManager**：单例管理器，管理两个 `PluginSupervisor`（内置插件 + 第三方插件）。
- **PluginSupervisor**：每个 Supervisor 管理一个 Runner 子进程，负责生命周期、RPC 通信、健康检查和插件重载。
- **Runner 子进程**：独立进程加载并运行插件代码，通过 msgpack 编解码的 IPC 与 Host 通信。
- **ComponentRegistry**：组件注册表，管理 Action、Command、Tool、Event Handler、Hook Handler、Message Gateway 六类组件的注册信息。

## Platform IO 架构

```mermaid
graph TD
    subgraph Platform IO 中间层
        A[PlatformIOManager] --> B[DriverRegistry]
        A --> C[SendRouteTable]
        A --> D[ReceiveRouteTable]
        A --> E[MessageDeduplicator]
        A --> F[OutboundTracker]
    end
    G[LegacyPlatformDriver] --> A
    H[PluginPlatformDriver] --> A
    I[自定义 PlatformIODriver] --> A
    A -->|路由决策| J[RouteKey 解析]
    J -->|匹配驱动| K[驱动发送消息]
```

- **PlatformIOManager**：Broker 管理器，维护发送/接收路由表、驱动注册表、入站去重和出站跟踪。
- **RouteKey**：路由键，由 `platform`（平台）、`account_id`（账号）、`scope`（作用域）组成，支持从最具体到最宽泛的回退匹配。
- **PlatformIODriver**：驱动抽象基类，定义 `send_message()`、`start()`、`stop()`、`emit_inbound()` 等接口。
