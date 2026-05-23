---
title: Maisaka Reasoning Engine
---

# Maisaka Reasoning Engine

Maisaka is MaiBot's core AI runtime, responsible for dialogue reasoning, pacing control, and tool invocation. This document details its internal architecture, state machine, and execution flow.

## Architecture Overview

```mermaid
graph TD
    subgraph "MaisakaHeartFlowChatting (runtime.py)"
        A[message_cache] --> B[_schedule_message_turn]
        B --> C[_internal_turn_queue]
        C --> D["MaisakaReasoningEngine.run_loop()"]
    end
    subgraph "Reasoning Loop (reasoning_engine.py)"
        D --> E[Collect Pending Messages]
        E --> F[Message Debounce Wait]
        F --> G{Timing Gate Required?}
        G -->|Yes| H["Timing Gate Sub-agent"]
        G -->|No| I["Planner (Action Loop)"]
        H -->|continue| I
        H -->|wait/no_reply| J[End This Cycle]
        I --> K[Execute Tool Calls]
        K --> L{Paused?}
        L -->|Yes| J
        L -->|No| M{Max Rounds Reached?}
        M -->|Yes| J
        M -->|No| G
    end
    subgraph "ChatLoopService (chat_loop_service.py)"
        H -.->|sub_agent| N[Context Selection + Prompt Building]
        I -.->|planner| N
        N --> O[LLM Request]
        O --> P["Hook: before_request / after_response"]
    end
```

## MaisakaHeartFlowChatting

Source location: `src/maisaka/runtime.py`

Each chat session corresponds to a `MaisakaHeartFlowChatting` instance, managed by `HeartflowManager`.

### State Machine

The runtime has three states:

```mermaid
stateDiagram-v2
    [*] --> stop: Initialization
    stop --> running: New Message / Timeout
    running --> running: Processing Message
    running --> wait: wait Tool Triggered
    running --> stop: Completed / finish / no_reply
    wait --> running: Timeout / New Message Arrived
```

- **`running`** — Executing reasoning loop
- **`wait`** — Waiting state, wait tool set a timeout
- **`stop`** — Idle state, waiting for new external message trigger

### Core Properties

- **`session_id`** `str` — Session ID
- **`_chat_history`** `list[LLMContextMessage]` — Internal context history
- **`message_cache`** `list[SessionMessage]` — Pending message cache
- **`_internal_turn_queue`** `asyncio.Queue` — Internal loop trigger queue ("message" / "timeout")
- **`_tool_registry`** `ToolRegistry` — Unified tool registry
- **`_reasoning_engine`** `MaisakaReasoningEngine` — Reasoning engine
- **`_chat_loop_service`** `MaisakaChatLoopService` — Chat loop service
- **`_max_internal_rounds`** `int` — Max internal rounds (default 6)
- **`_max_context_size`** `int` — Max context message count
- **`_message_debounce_seconds`** `float` — Message debounce seconds (default 1.0)
- **`_talk_frequency_adjust`** `float` — Talk frequency multiplier
- **`deferred_tool_specs_by_name`** `dict[str, ToolSpec]` — Deferred discovery tool pool
- **`discovered_tool_names`** `set[str]` — Discovered deferred tools

### Message Trigger Mechanism

```mermaid
flowchart TD
    A[New Message Arrives register_message] --> B{Current State?}
    B -->|running + planner active| C{Consecutive Interrupt Limit?}
    C -->|No| D["Set planner_interrupt_flag"]
    C -->|Yes| E[Wait for Current Request to Complete]
    B -->|running + no planner| F[Mark Debounce]
    B -->|Other| G[_schedule_message_turn]
    G --> H{Pending >= Trigger Threshold?}
    H -->|Yes| I[Put message into Queue]
    H -->|No| J{Gap Compensation Satisfied?}
    J -->|Yes| I
    J -->|No| K[Schedule Delayed Check Task]
```

Trigger threshold calculation:
```python
effective_frequency = talk_value * _talk_frequency_adjust  # Reply frequency
trigger_threshold = ceil(1.0 / effective_frequency)  # Required message count
```

Gap Compensation: When new messages are insufficient but the gap time is long, calculate equivalent message count based on recent average reply time.

### Force Continue Mechanism

When @ or mention is detected, `_arm_force_next_timing_continue()` sets a flag so that the next Timing Gate directly returns `continue`, ensuring the bot responds to direct mentions.

## MaisakaReasoningEngine

Source location: `src/maisaka/reasoning_engine.py`

Core reasoning engine, responsible for internal thinking loops and tool execution.

### Key Constants

- **`TIMING_GATE_CONTEXT_LIMIT`** — 24 · Timing Gate context message limit
- **`TIMING_GATE_MAX_TOKENS`** — 384 · Timing Gate max output tokens
- **`TIMING_GATE_TOOL_NAMES`** — `{"continue", "no_reply", "wait"}` · Timing Gate available tools
- **`ACTION_HIDDEN_TOOL_NAMES`** — `{"continue", "no_reply"}` · Action Loop hidden tools
- **`MAX_INTERNAL_ROUNDS`** — 6 · Max internal thinking rounds

### run_loop Main Loop

```python
async def run_loop(self) -> None:
    while runtime._running:
        # 1. Wait for trigger signal
        queued_trigger = await runtime._internal_turn_queue.get()
        message_triggered, timeout_triggered = _drain_ready_turn_triggers(queued_trigger)

        # 2. Message debounce
        if message_triggered:
            await runtime._wait_for_message_quiet_period()

        # 3. Collect pending messages
        cached_messages = runtime._collect_pending_messages()

        # 4. Inject messages to history
        await _ingest_messages(cached_messages)

        # 5. Internal thinking loop
        for round_index in range(max_internal_rounds):
            # 5a. Timing Gate (if needed)
            if timing_gate_required:
                timing_action = await _run_timing_gate(anchor_message)
                if timing_action != "continue":
                    break  # wait or no_reply, end this cycle

            # 5b. Planner (Action Loop)
            response = await _run_interruptible_planner()

            # 5c. Similarity detection
            if _should_replace_reasoning(response.content):
                # Replace with rethinking prompt
                response.content = "I should reflect on my thinking above..."

            # 5d. Tool execution
            if response.tool_calls:
                should_pause, summaries, monitors = await _handle_tool_calls(...)
                if should_pause:
                    break
                continue  # New info after tool execution, continue loop

            break  # No tool call and no content, end
```

### Timing Gate

Timing Gate is an independent sub-agent that decides dialogue pacing:

```mermaid
flowchart TD
    A[Timing Gate Start] --> B{Force Continue Flag?}
    B -->|Yes| C["Return continue directly"]
    B -->|No| D["Run Sub-agent (24 context, 384 tokens)"]
    D --> E{Which tool did model return?}
    E -->|wait| F["Enter wait state (N seconds)"]
    E -->|no_reply| G["End this cycle, wait for new message"]
    E -->|continue| H["Continue to Planner"]
    E -->|No valid tool| H
```

Timing Gate system prompt:
- Primarily loads from `maisaka_timing_gate` template
- Fallback prompt emphasizes **call only one tool**, do not output plain text
- Available tools are only `wait`, `no_reply`, `continue`

### Planner (Action Loop)

Planner is the main reasoning and tool execution phase:

1. **Build Tool Definitions**: `_build_action_tool_definitions()`
   - Filter `ACTION_HIDDEN_TOOL_NAMES` (continue, no_reply)
   - Built-in Action tools directly exposed
   - Third-party/plugin tools are placed in the deferred pool by default and discovered via `tool_search`; plugin tools declared with `core_tool=True` or `visibility="visible"` are exposed directly

2. **Run Interruptible Planner**: `_run_interruptible_planner()`
   - Bind `asyncio.Event` interrupt flag
   - When new message arrives → set flag → LLM request aborts (`ReqAbortException`)
   - Consecutive interrupts have a limit (`planner_interrupt_max_consecutive_count`)

3. **Thought Deduplication**: `_should_replace_reasoning()`
   - When current and previous thoughts have similarity > 90%
   - Replace with "rethink" prompt to avoid circular idle

### Planner Interrupt Mechanism

```mermaid
sequenceDiagram
    participant R as ReasoningEngine
    participant P as Planner (LLM)
    participant M as MaisakaRuntime

    R->>P:发起 LLM 请求 (bind interrupt_flag)
    M->>M: New message arrives
    M->>P: interrupt_flag.set()
    P-->>R: ReqAbortException
    R->>M: Wait for message quiet period
    R->>M: Collect new messages
    R->>R: Skip Timing Gate, retry Planner
```

Post-interrupt behavior:
- If `has_pending_messages` and max rounds not reached → Skip Timing Gate, re-enter Planner
- Otherwise → End current loop

### Tool Execution

Tool calls are routed through unified `ToolRegistry`:

```mermaid
graph TD
    A[Planner returns tool_calls] --> B["Build ToolInvocation"]
    B --> C["Build ToolExecutionContext"]
    C --> D["ToolRegistry.invoke()"]
    D --> E{Provider Type?}
    E -->|maisaka_builtin| F["MaisakaBuiltinToolProvider"]
    E -->|plugin| G["PluginToolProvider"]
    E -->|mcp| H["MCPToolProvider"]
    F --> I[Execute Built-in Tool Handler]
    G --> J[RPC Call Plugin Subprocess]
    H --> K[MCP Protocol Call]
    I --> L["ToolExecutionResult"]
    J --> L
    K --> L
    L --> M["Append ToolResultMessage to History"]
```

## Built-in Tool Definitions

Source location: `src/maisaka/builtin_tool/`

### Timing Gate Tools

- **`continue`** — `continue_tool.py` · Allow continuing to next thinking round · Key Parameters: None
- **`no_reply`** — `no_reply.py` · Stop current loop, wait for new external message · Key Parameters: None
- **`wait`** — `wait.py` · Pause dialogue for N seconds then re-judge · Key Parameters: `seconds` (default 30)

### Action Tools

- **`reply`** — `reply.py` · Generate and send reply message · Key Parameters: `reply_text`, `msg_id`, `set_quote`
- **`send_emoji`** — `send_emoji.py` · Send emoji · Key Parameters: `emoji_description`, `msg_id`
- **`finish`** — `finish.py` · End current thinking round · Key Parameters: None
- **`query_jargon`** — `query_jargon.py` · Query jargon/terms · Key Parameters: `words`
- **`query_memory`** — `query_memory.py` · Query long-term memory · Key Parameters: `query`, `mode`, `limit`
- **`query_person_info`** — `query_person_info.py` · Query person information · Key Parameters: `person_name`
- **`view_complex_message`** — `view_complex_message.py` · View complete forwarded message · Key Parameters: `message_id`
- **`tool_search`** — `tool_search.py` · Search deferred discovery tools · Key Parameters: `query`, `limit`

### Deferred Tool Discovery Mechanism

In Action Loop, normal third-party/plugin tools are not directly exposed to Planner by default, but discovered in two steps:

1. **tool_search**: Search deferred tool pool, mark matched tool names as "discovered"
2. **Next round Planner**: Discovered tools added to visible tool list

This reduces the number of tools Planner sees at once, avoiding choice paralysis.

If a plugin Tool declares `core_tool=True` or `visibility="visible"`, it skips deferred discovery and enters the Planner-visible tool list directly. This is intended for high-frequency, low-risk, strongly contextual tools; regular plugin tools should usually keep the default deferred behavior.

## MaisakaChatLoopService

Source location: `src/maisaka/chat_loop_service.py`

Responsible for single-step LLM request encapsulation, including context selection, Prompt building, and Hook triggering.

### chat_loop_step Flow

```mermaid
flowchart TD
    A["chat_loop_step()"] --> B["Ensure Prompt Loaded"]
    B --> C["select_llm_context_messages()"]
    C --> D["_build_request_messages()"]
    D --> E["Hook: maisaka.planner.before_request"]
    E --> F["LLM generate_response"]
    F --> G["Hook: maisaka.planner.after_response"]
    G --> H["Return ChatResponse"]
```

### Context Selection Strategy

`select_llm_context_messages()` selects context for LLM from history:

1. Filter by `request_kind` (planner requests hide Timing Gate tool chain)
2. Traverse from end to front, select entries that can be successfully converted to LLM messages
3. Only count messages with `count_in_context=True` (`ToolResultMessage` and `ReferenceMessage` don't occupy window)
4. Stop after reaching `max_context_size`
5. Hide earliest 50% of assistant text messages (preserve tool call chains)

### Hook Specs

- **`maisaka.planner.before_request`** — Can Abort ✗ · Can Rewrite ✓ · Can rewrite message list and tool definitions
- **`maisaka.planner.after_response`** — Can Abort ✗ · Can Rewrite ✓ · Can adjust text result and tool call list
- **`maisaka.replyer.before_request`** — Can Abort ✗ · Can Rewrite ✓ · Can rewrite replyer task name, requested model, extra prompt, and `reply_tool_args`
- **`maisaka.replyer.before_model_request`** — Can Abort ✗ · Can Rewrite ✓ · Can rewrite the fully built replyer `messages` that are about to be sent to the model
- **`maisaka.replyer.after_response`** — Can Abort ✗ · Can Rewrite ✓ · Can rewrite the reply text or request replyer regeneration

## Context Message Types

Source location: `src/maisaka/context_messages.py`

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

- **`custom`** — Custom reference message
- **`jargon`** — Jargon/term query result
- **`memory`** — Long-term memory retrieval result
- **`tool_hint`** — Tool hint information (e.g., deferred tools reminder)

### Context Window Occupation

- **`SessionBackedMessage`** — Occupies Window ✓ · Real user message
- **`ComplexSessionMessage`** — Occupies Window ✓ · Complex/forwarded message
- **`ReferenceMessage`** — Occupies Window ✗ · Reference info (doesn't occupy window)
- **`AssistantMessage`** (assistant) — Occupies Window ✓ · Internal thinking text
- **`AssistantMessage`** (perception) — Occupies Window ✗ · Perception text (interrupt hints, etc.)
- **`ToolResultMessage`** — Occupies Window ✗ · Tool execution result

## Planner Message Prefix

Source location: `src/maisaka/planner_message_utils.py`

When each user message is injected into Planner, a structured prefix is added:

```
[Time]HH:MM:SS
[Username]nickname
[User Group Nickname]group_card
[msg_id]message_id
[Message Content]actual message text
```

`build_planner_prefix()` builds the prefix, `build_planner_user_prefix_from_session_message()` extracts parameters from `SessionMessage`.

## Monitor Events

Source location: `src/maisaka/monitor_events.py`

Broadcasts events to frontend monitoring panel via WebSocket:

- **`session.start`** — Runtime starts · Key Data: session_id, session_name
- **`message.ingested`** — Message injected to history · Key Data: speaker_name, content, message_id
- **`cycle.start`** — Thinking loop starts · Key Data: cycle_id, round_index, max_rounds
- **`timing_gate.result`** — Timing Gate decision completed · Key Data: action, content, tool_calls, prompt_tokens
- **`planner.finalized`** — Planner completed · Key Data: Complete cycle data, token statistics, time spent

## Complete Reasoning Flow Example

Example: User sends an @bot message in a group chat:

```mermaid
sequenceDiagram
    participant User as User
    participant Chat as ChatBot
    participant HF as HeartFlowManager
    participant RT as MaisakaHeartFlowChatting
    participant RE as ReasoningEngine
    participant TG as Timing Gate
    participant PL as Planner
    participant Tool as Tool Execution

    User->>Chat: "@麦麦 你好"
    Chat->>HF: process_message()
    HF->>RT: register_message()
    Note over RT: Detected @, set force_continue

    RT->>RE: run_loop() consume message
    RE->>RE: _ingest_messages() inject to history

    RE->>TG: _run_timing_gate()
    Note over TG: force_continue=True, skip
    TG-->>RE: continue

    RE->>PL: _run_interruptible_planner()
    PL-->>RE: thought + [reply_tool_call]

    RE->>Tool: _invoke_tool_call("reply", ...)
    Tool-->>RE: ToolExecutionResult(success=True)
    Note over Tool: reply tool calls SendService to send message

    RE->>RE: _end_cycle() record loop time spent
```
