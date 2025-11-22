# 记忆检索系统（Memory Retrieval）

---

## 功能概述

- 让麦麦在回复前主动回忆历史记录、黑话、知识库条目，保持上下文一致性。
- 采用“两段式”决策：先判断是否需要检索，再通过 ReAct Agent 调用多种工具搜集信息。
- 内建缓存（`ThinkingBack` 表），可复用近期问题答案，并避免重复查询。
- 可扩展工具仓（chat history / jargon / person info / LPMM），配置灵活。

---

## 触发流程

1. **检测阶段**：`build_memory_retrieval_prompt` 汇总最近聊天与“最近已查询的问题”，让模型输出：
   - `concepts`：疑似需要查询的关键词，常用于黑话/人名/梗语。
   - `questions`：最多一个关键问题；若为空则只返回概念检索与缓存回忆。
2. **概念检索**：对 `concepts` 调用 `query_jargon`，优先提供黑话解释，作为 ReAct Agent 的初始信息。
3. **ReAct 检索**：
   - 初始化工具注册器（`query_chat_history`、`query_jargon`、`query_person_info`，以及在 `[lpmm_knowledge]` 设置为 `agent` 时的知识库工具）。
   - 依据 `[memory].max_agent_iterations` 控制循环轮数，每轮先“思考”再决定是否调用工具。
   - 工具返回写入 `collected_info`，下一步继续推理；最后一轮必须输出 `found_answer(answer="...")` 或 `not_enough_info(reason="...")`。
4. **缓存与分类**：
   - 查询结果写入 `ThinkingBack`，found_answer=1 的条目可在下次 50% 概率复用。
   - 异步调用 `_analyze_question_answer`，将问答归类为“黑话/人物/其他”，并回写黑话库或（未来）人物记忆。

---

## 配置入口

- 文件：`config/bot_config.toml`
- 核心小节：

```toml
[memory]
max_agent_iterations = 3  # ReAct 最大查询轮数，最低1

[lpmm_knowledge]
enable = false
lpmm_mode = "agent"       # 设为 agent 时注册 LPMM 检索工具

[debug]
show_memory_prompt = false  # 打开后，日志输出全部提示词/思考过程
```

- `max_agent_iterations` 过大将显著增加 token 消耗；建议结合延迟与回答质量酌情调整。
- 部署了 LPMM 知识库时，`enable=true` 且 `lpmm_mode="agent"` 才会将知识库纳入 ReAct 工具集。

---

## 可用检索工具

| 工具名 | 说明 | 常用参数 |
| --- | --- | --- |
| `query_chat_history` | 查询历史消息，支持关键词 / 时间点 / 时间段 | `keyword`、`time_point`、`time_range` |
| `query_jargon` | 查黑话/俚语含义 | `keyword` |
| `query_person_info` | 查询已记录的人物信息与记忆点 | `person_name` |
| `query_lpmm_knowledge` | （可选）从 LPMM RAG 知识库检索 | `query` |

> 所有工具均通过 `MemoryRetrievalToolRegistry` 注册，符合 `async` 接口；新增工具时只需按 README 指南注册即可被 ReAct 自动识别。

---

## 结果注入方式

- 当检索到答案时，函数返回格式化字符串：
  ```
  你回忆起了以下信息：
  问题：xxx
  答案：yyy
  ...
  ```
  回复器会将其作为追加上下文，提示 LLM 在组织回复时引用。
- 如仅命中缓存或概念解释，也会返回对应段落，提醒模型选择性参考。
- 如果完全未找到信息，则返回空字符串，避免干扰正常对话。

---

## 使用建议

- **Prompt 调教**：在 `plan_style`/`reply_style` 中加入“遇到不确定要主动回忆”的描述，提升触发率。
-.Maximized**避免刷屏**：若群聊极其活跃，可适当降低 `max_agent_iterations`，并在工具实现中增加速率限制。
- **缓存维护**：`ThinkingBack` 表会定期清理 10 小时前的“未找到答案”记录；如需更长记忆，可调节 `THINKING_BACK_NOT_FOUND_RETENTION_SECONDS` 常量。
- **扩展场景**：可为赛事、日程等专用数据写自定义检索工具，再通过 `init_all_tools` 注册，实现一键回忆。

