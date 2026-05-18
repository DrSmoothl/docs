---
title: Maisaka 推理引擎
---

# Maisaka 推理引擎

Maisaka 是 MaiBot 的核心 AI 运行时，负责对话推理、节奏控制和工具调用。本文详述其内部架构、状态机和执行流程。

## 架构总览

```mermaid
graph TD
    subgraph "MaisakaHeartFlowChatting (runtime.py)"
        A[message_cache 消息缓存] --> B[_schedule_message_turn 触发调度]
        B --> C[_internal_turn_queue 异步队列]
        C --> D["MaisakaReasoningEngine.run_loop()"]
    end
    subgraph "推理循环 (reasoning_engine.py)"
        D --> E[收集待处理消息]
        E --> F[消息静默等待]
        F --> G{需要 Timing Gate?}
        G -->|是| H["Timing Gate 子代理"]
        G -->|否| I["Planner (Action Loop)"]
        H -->|continue| I
        H -->|wait/no_action| J[结束本轮]
        I --> K[执行工具调用]
        K --> L{暂停?}
        L -->|是| J
        L -->|否| M{达到最大轮次?}
        M -->|是| J
        M -->|否| G
    end
    subgraph "ChatLoopService (chat_loop_service.py)"
        H -.->|sub_agent| N[context 选择 + prompt 构建]
        I -.->|planner| N
        N --> O[LLM 请求]
        O --> P["Hook: before_request / after_response"]
    end
```

## MaisakaHeartFlowChatting

源码位置：`src/maisaka/runtime.py`

每个聊天会话对应一个 `MaisakaHeartFlowChatting` 实例，由 `HeartflowManager` 管理生命周期。

### 状态机

运行时具有三种状态：

```mermaid
stateDiagram-v2
    [*] --> stop: 初始化
    stop --> running: 收到新消息/超时
    running --> running: 消息处理中
    running --> wait: wait 工具触发
    running --> stop: 处理完成/finish/no_action
    wait --> running: 等待超时/新消息到达
```

| 状态 | 说明 |
|------|------|
| `running` | 正在执行推理循环 |
| `wait` | 等待状态，wait 工具设定了超时时间 |
| `stop` | 空闲状态，等待新的外部消息触发 |

### 核心属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `session_id` | `str` | 会话 ID |
| `_chat_history` | `list[LLMContextMessage]` | 内部上下文历史 |
| `message_cache` | `list[SessionMessage]` | 待处理消息缓存 |
| `_internal_turn_queue` | `asyncio.Queue` | 内部循环触发队列（"message" / "timeout"） |
| `_tool_registry` | `ToolRegistry` | 统一工具注册表 |
| `_reasoning_engine` | `MaisakaReasoningEngine` | 推理引擎 |
| `_chat_loop_service` | `MaisakaChatLoopService` | 对话循环服务 |
| `_max_internal_rounds` | `int` | 最大内部轮次（默认 10） |
| `_max_context_size` | `int` | 最大上下文消息数 |
| `_message_debounce_seconds` | `float` | 消息防抖秒数（默认 1.0） |
| `_talk_frequency_adjust` | `float` | 说话频率倍率 |
| `deferred_tool_specs_by_name` | `dict[str, ToolSpec]` | 延迟发现工具池 |
| `discovered_tool_names` | `set[str]` | 已发现的延迟工具 |

### 消息触发机制

```mermaid
flowchart TD
    A[新消息到达 register_message] --> B{当前状态?}
    B -->|running + planner 活跃| C{连续打断超限?}
    C -->|否| D["设置 planner_interrupt_flag"]
    C -->|是| E[等待当前请求自然完成]
    B -->|running + 无 planner| F[标记 debounce]
    B -->|其他| G[_schedule_message_turn]
    G --> H{待处理 >= 触发阈值?}
    H -->|是| I[投递 message 到队列]
    H -->|否| J{空窗补偿满足?}
    J -->|是| I
    J -->|否| K[调度延迟检查任务]
```

触发阈值计算：
```python
effective_frequency = talk_value * _talk_frequency_adjust  # 回复频率
trigger_threshold = ceil(1.0 / effective_frequency)  # 所需消息数
```

空窗补偿：当新消息数不足但空窗时间较长时，按最近平均回复时长折算等价消息数。

### 强制 continue 机制

当检测到 @ 或提及时，`_arm_force_next_timing_continue()` 设置标记，使下一次 Timing Gate 直接返回 `continue`，确保 bot 回应直接呼叫。

## MaisakaReasoningEngine

源码位置：`src/maisaka/reasoning_engine.py`

核心推理引擎，负责内部思考循环和工具执行。

### 关键常量

| 常量 | 值 | 说明 |
|------|-----|------|
| `TIMING_GATE_CONTEXT_LIMIT` | `_max_context_size`（可配置） | Timing Gate 上下文消息上限（读取 `global_config.chat.max_context_size` / `max_private_context_size`） |
| `TIMING_GATE_MAX_TOKENS` | 384 | Timing Gate 最大输出 token |
| `TIMING_GATE_TOOL_NAMES` | `{"continue", "no_action", "wait"}` | Timing Gate 可用工具 |
| `ACTION_HIDDEN_TOOL_NAMES` | `{"continue", "no_action"}` | Action Loop 隐藏的工具 |
| `MAX_INTERNAL_ROUNDS` | 10 | 最大内部思考轮次 |

### run_loop 主循环

```python
async def run_loop(self) -> None:
    while runtime._running:
        # 1. 等待触发信号
        queued_trigger = await runtime._internal_turn_queue.get()
        message_triggered, timeout_triggered = _drain_ready_turn_triggers(queued_trigger)

        # 2. 消息防抖
        if message_triggered:
            await runtime._wait_for_message_quiet_period()

        # 3. 收集待处理消息
        cached_messages = runtime._collect_pending_messages()

        # 4. 消息注入历史
        await _ingest_messages(cached_messages)

        # 5. 内部思考循环
        for round_index in range(max_internal_rounds):
            # 5a. Timing Gate（如果需要）
            if timing_gate_required:
                timing_action = await _run_timing_gate(anchor_message)
            if timing_action != "continue":
                break  # wait 或 no_action，结束本轮

            # 5b. Planner（Action Loop）
            response = await _run_interruptible_planner()

            # 5c. 相似度检测
            if _should_replace_reasoning(response.content):
                # 替换为重新思考提示
                response.content = "我应该根据我上面思考的内容进行反思..."

            # 5d. 工具执行
            if response.tool_calls:
                should_pause, summaries, monitors = await _handle_tool_calls(...)
                if should_pause:
                    break
                continue  # 工具执行后有新信息，继续循环

            break  # 无工具调用且无内容，结束
```

### Timing Gate

Timing Gate 是一个独立的子代理，决定对话节奏：

```mermaid
flowchart TD
    A[Timing Gate 启动] --> B{强制 continue 标记?}
    B -->|是| C["直接返回 continue"]
    B -->|否| D["运行子代理 (24条上下文, 384 tokens)"]
    D --> E{模型返回了哪个工具?}
    E -->|wait| F["进入等待状态 (N秒)"]
    E -->|no_action| G["结束本轮，等待新消息"]
    E -->|continue| H["继续进入 Planner"]
    E -->|无有效工具| H
```

Timing Gate 系统提示词：
- 优先从 `maisaka_timing_gate` 模板加载
- 兜底提示词强调 **只调用一个工具**，不要输出普通文本
- 可用工具仅 `wait`、`no_action`、`continue` 三个

### Planner（Action Loop）

Planner 是主要的推理和工具执行阶段：

1. **构建工具定义**：`_build_action_tool_definitions()`
   - 过滤 `ACTION_HIDDEN_TOOL_NAMES`（continue、no_action）
   - 内置 Action 工具直接暴露
   - 默认第三方/插件工具放入 deferred 池，通过 `tool_search` 发现；声明 `core_tool=True` 或 `visibility="visible"` 的插件工具会直接暴露

2. **运行可打断 Planner**：`_run_interruptible_planner()`
   - 绑定 `asyncio.Event` 中断标记
   - 新消息到达时设置标记 → LLM 请求中止（`ReqAbortException`）
   - 连续打断有上限（`planner_interrupt_max_consecutive_count`）

3. **思考去重**：`_should_replace_reasoning()`
   - 当前后思考与上一轮相似度 > 90% 时
   - 替换为"重新思考"提示，避免循环空转

### Planner 打断机制

```mermaid
sequenceDiagram
    participant R as ReasoningEngine
    participant P as Planner (LLM)
    participant M as MaisakaRuntime

    R->>P: 发起 LLM 请求 (绑定 interrupt_flag)
    M->>M: 新消息到达
    M->>P: interrupt_flag.set()
    P-->>R: ReqAbortException
    R->>M: 等待消息安静期
    R->>M: 收集新消息
    R->>R: 跳过 Timing Gate 直接重试 Planner
```

打断后行为：
- 如果 `has_pending_messages` 且未达最大轮次 → 跳过 Timing Gate，重新进入 Planner
- 否则 → 结束当前循环

### 工具执行

工具调用通过统一 `ToolRegistry` 路由：

```mermaid
graph TD
    A[Planner 返回 tool_calls] --> B["构建 ToolInvocation"]
    B --> C["构建 ToolExecutionContext"]
    C --> D["ToolRegistry.invoke()"]
    D --> E{Provider 类型?}
    E -->|maisaka_builtin| F["MaisakaBuiltinToolProvider"]
    E -->|plugin| G["PluginToolProvider"]
    E -->|mcp| H["MCPToolProvider"]
    F --> I[执行内置工具处理器]
    G --> J[RPC 调用插件子进程]
    H --> K[MCP 协议调用]
    I --> L["ToolExecutionResult"]
    J --> L
    K --> L
    L --> M["追加 ToolResultMessage 到历史"]
```

## 内置工具定义

源码位置：`src/maisaka/builtin_tool/`

### Timing Gate 工具

| 工具名 | 源文件 | 说明 | 关键参数 |
|--------|--------|------|---------|
| `continue` | `continue_tool.py` | 允许继续进入下一轮思考 | 无 |
| `no_action` | `no_action.py` | 停止当前循环，等待新外部消息 | 无 |
| `wait` | `wait.py` | 暂停对话 N 秒后重新判断 | `seconds`（默认 30） |

### Action 工具

| 工具名 | 源文件 | 说明 | 关键参数 |
|--------|--------|------|---------|
| `reply` | `reply.py` | 生成并发送回复消息 | `msg_id`、`set_quote`、`reference_info` |
| `send_emoji` | `send_emoji.py` | 发送表情包 | 无（自动根据上下文选择） |
| `finish` | `finish.py` | 结束当前思考轮次 | 无 |
| `query_jargon` | `query_jargon.py` | 查询黑话/词条 | `words` |
| `query_memory` | `query_memory.py` | 查询长期记忆 | `query`、`mode`、`limit` |
| `query_person_profile` | `query_person_profile.py` | 查询人物画像 | `person_name` |
| `view_complex_message` | `view_complex_message.py` | 查看完整转发消息 | `message_id` |
| `tool_search` | `tool_search.py` | 搜索延迟发现的工具 | `query`、`limit` |

### Deferred Tool 发现机制

Action Loop 中，普通第三方/插件工具默认不直接暴露给 Planner，而是通过两步发现：

1. **tool_search**：搜索 deferred 工具池，匹配到的工具名标记为"已发现"
2. **下一轮 Planner**：已发现的工具加入可见工具列表

这减少了 Planner 一次看到的工具数量，避免选择困难。

插件 Tool 如果声明了 `core_tool=True` 或 `visibility="visible"`，会跳过 deferred 发现流程，直接进入 Planner 可见工具列表。该机制适合高频、低风险、上下文强相关的工具；普通插件工具仍建议保持默认 deferred 行为。

## MaisakaChatLoopService

源码位置：`src/maisaka/chat_loop_service.py`

负责单步 LLM 请求的封装，包括上下文选择、Prompt 构建和 Hook 触发。

### chat_loop_step 流程

```mermaid
flowchart TD
    A["chat_loop_step()"] --> B["确保 Prompt 已加载"]
    B --> C["select_llm_context_messages()"]
    C --> D["_build_request_messages()"]
    D --> E["Hook: maisaka.planner.before_request"]
    E --> F["LLM generate_response"]
    F --> G["Hook: maisaka.planner.after_response"]
    G --> H["返回 ChatResponse"]
```

### 上下文选择策略

`select_llm_context_messages()` 从历史中选择给 LLM 的上下文：

1. 按 `request_kind` 过滤（`planner` 请求隐藏 Timing Gate 工具链）
2. 从末尾向前遍历，选择能成功转换为 LLM 消息的条目
3. 计数仅计算 `count_in_context=True` 的消息（`ToolResultMessage` 和 `ReferenceMessage` 不占窗口）
4. 达到 `max_context_size` 后停止
5. 隐藏最早 50% 的 assistant 文本消息（保留工具调用链路）

### Hook Specs

| Hook | 可中止 | 可改写 | 说明 |
|------|--------|--------|------|
| `maisaka.planner.before_request` | ✗ | ✓ | 可改写消息列表和工具定义 |
| `maisaka.planner.after_response` | ✗ | ✓ | 可调整文本结果和工具调用列表 |

## 上下文消息类型

源码位置：`src/maisaka/context_messages.py`

```mermaid
classDiagram
    class LLMContextMessage {
        <<abstract>>
        +role: str
        +processed_plain_text: str
        +count_in_context: bool
        +source: str
        +to_llm_message(enable_visual: bool) Message
        +consume_once() bool
    }
    class SessionBackedMessage {
        +raw_message: MessageSequence
        +visible_text: str
        +timestamp: datetime
        +message_id: str
        +source_kind: str
        +count_in_context = True
    }
    class ComplexSessionMessage {
        +prompt_text: str
        +complex_message_type: str
        +count_in_context = True
    }
    class ReferenceMessage {
        +content: str
        +reference_type: ReferenceMessageType
        +remaining_uses_value: int
        +display_prefix: str
        +count_in_context = False
    }
    class AssistantMessage {
        +content: str
        +tool_calls: list~ToolCall~
        +source_kind: str
        +count_in_context: bool
    }
    class ToolResultMessage {
        +content: str
        +tool_call_id: str
        +tool_name: str
        +success: bool
        +count_in_context = False
    }
    LLMContextMessage <|-- SessionBackedMessage
    LLMContextMessage <|-- ComplexSessionMessage
    SessionBackedMessage <|-- ComplexSessionMessage
    LLMContextMessage <|-- ReferenceMessage
    LLMContextMessage <|-- AssistantMessage
    LLMContextMessage <|-- ToolResultMessage
```

### ReferenceMessageType

| 值 | 说明 |
|----|------|
| `custom` | 自定义参考消息 |
| `jargon` | 黑话/词条查询结果 |
| `memory` | 长期记忆检索结果 |
| `tool_hint` | 工具提示信息（如 deferred tools 提醒） |

### 上下文窗口占用

| 消息类型 | 占用窗口 | 说明 |
|----------|---------|------|
| `SessionBackedMessage` | ✓ | 真实用户消息 |
| `ComplexSessionMessage` | ✓ | 复杂/转发消息 |
| `ReferenceMessage` | ✗ | 参考信息（不占用窗口） |
| `AssistantMessage` (assistant) | ✓ | 内部思考文本 |
| `AssistantMessage` (perception) | ✗ | 感知类文本（打断提示等） |
| `ToolResultMessage` | ✗ | 工具执行结果 |

## Planner 消息前缀

源码位置：`src/maisaka/planner_message_utils.py`

每条用户消息注入 Planner 时，会添加结构化前缀：

```
[时间]HH:MM:SS
[用户名]nickname
[用户群昵称]group_card
[msg_id]message_id
[发言内容]实际消息文本
```

`build_planner_prefix()` 构建前缀，`build_planner_user_prefix_from_session_message()` 从 `SessionMessage` 提取参数。

## 监控事件

源码位置：`src/maisaka/monitor_events.py`

通过 WebSocket 向前端监控面板广播事件：

| 事件 | 触发时机 | 关键数据 |
|------|---------|---------|
| `session.start` | 运行时启动 | session_id, session_name |
| `message.ingested` | 消息注入历史 | speaker_name, content, message_id |
| `cycle.start` | 思考循环开始 | cycle_id, round_index, max_rounds |
| `timing_gate.result` | Timing Gate 决策完成 | action, content, tool_calls, prompt_tokens |
| `planner.finalized` | 规划器完成 | 完整 cycle 数据、token 统计、耗时 |

## 完整推理流程示例

以群聊中用户发送一条 @bot 消息为例：

```mermaid
sequenceDiagram
    participant User as 用户
    participant Chat as ChatBot
    participant HF as HeartFlowManager
    participant RT as MaisakaHeartFlowChatting
    participant RE as ReasoningEngine
    participant TG as Timing Gate
    participant PL as Planner
    participant Tool as 工具执行

    User->>Chat: "@麦麦 你好"
    Chat->>HF: process_message()
    HF->>RT: register_message()
    Note over RT: 检测到 @，设置 force_continue

    RT->>RE: run_loop() 消费消息
    RE->>RE: _ingest_messages() 注入历史

    RE->>TG: _run_timing_gate()
    Note over TG: force_continue=True，跳过
    TG-->>RE: continue

    RE->>PL: _run_interruptible_planner()
    PL-->>RE: thought + [reply_tool_call]

    RE->>Tool: _invoke_tool_call("reply", ...)
    Tool-->>RE: ToolExecutionResult(success=True)
    Note over Tool: reply 工具调用 SendService 发送消息

    RE->>RE: _end_cycle() 记录循环耗时
```
