# 聊天控制系统

## 概述

这是麦麦回复的主要逻辑，负责决定何时回复以及使用动作。
能够根据聊天内容、兴趣、时间等因素进行回复。

## 配置入口

- 文件：`config/bot_config.toml`
- 区块：`[chat]`

借助该区块可以控制上下文窗口、planner 工作方式、被提及时的响应策略与动态发言频率。

```toml
[chat] #麦麦的聊天设置
talk_value = 1 #聊天频率，越小越沉默，范围0-1
mentioned_bot_reply = true # 是否启用提及必回复
max_context_size = 30 # 上下文长度
planner_smooth = 2 #规划器平滑，增大数值会减小planner负荷，略微降低反应速度，推荐1-5，0为关闭，必须大于等于0

enable_talk_value_rules = true # 是否启用动态发言频率规则

# 动态发言频率规则：按时段/按chat_id调整 talk_value（优先匹配具体chat，再匹配全局）
# 推荐格式（对象数组）：{ target="platform:id:type" 或 "", time="HH:MM-HH:MM", value=0.5 }
# 说明:
# - target 为空字符串表示全局；type 为 group/private，例如："qq:1919810:group" 或 "qq:114514:private"；
# - 支持跨夜区间，例如 "23:00-02:00"；数值范围建议 0-1。
talk_value_rules = [
    { target = "", time = "00:00-08:59", value = 0.8 },
    { target = "", time = "09:00-22:59", value = 1.0 },
    { target = "qq:1919810:group", time = "20:00-23:59", value = 0.6 },
    { target = "qq:114514:private", time = "00:00-23:59", value = 0.3 },
]

include_planner_reasoning = false # 是否将planner推理加入replyer，默认关闭（不加入）

# 以下为可选配置项（代码支持但模板中未默认显示）：
# interest_rate_mode = "fast"   # 兴趣值计算模式："fast" 走缓存策略、低开销，"accurate" 更精确但会增加算力占用
# planner_size = 1.5            # 副规划器大小，越小动作执行能力越精细但消耗更多token，调大可缓解429/速率压力
# at_bot_inevitable_reply = 1.0 # @bot时额外增益，1为100%回复，0为不额外增幅
```

## 核心参数说明

- **talk_value**：全局基础思考频率，默认 1.0，范围 0-1，越小越沉默。
- **mentioned_bot_reply**：是否启用提及必回复，打开后被 @ 时必定进入 planner。
- **max_context_size**：一次推理可读取的历史消息数量，越大越贴近上下文，越小响应更快。默认 30。
- **planner_smooth**：用于平滑 planner 决策，提升稳定性；增大数值会减小 planner 负荷，略微降低反应速度。推荐 1-5，设为 0 等于关闭，必须大于等于 0。默认 2。
- **enable_talk_value_rules**：是否启用动态发言频率规则，开启后进入"按聊天流 + 时间段"的动态调度。
- **talk_value_rules**：动态发言频率规则列表，支持按时段/按 chat_id 调整 talk_value（优先匹配具体 chat，再匹配全局）。
- **include_planner_reasoning**：若为 `true`，planner 的推理链会传递给 replyer，用于调试或暴露动作依据。默认关闭。

### 可选参数（代码支持但模板中未默认显示）

- **interest_rate_mode**：兴趣值计算模式；`fast` 走缓存策略、低开销（默认），`accurate` 则更精确但会增加算力占用。
- **planner_size**：副规划器大小，决定 planner 在每轮思考中有多大动作搜索空间；调小会更细腻也更费 Token，调大可缓解 429/速率压力。默认 1.5。
- **at_bot_inevitable_reply**：@bot 时额外增益，1 为 100% 回复，0 为不额外增幅。默认 1.0。

## 为什么不说话/说话很少？

### 可能原因

- 新消息较少
- planner决定选择no_reply：可以修改配置文件中的plan_style和interest，此配置会明显影响麦麦的回复和其他动作行为
- talk_value较低，或者动态规则命中了较安静的时段/聊天流

## 动态发言频率（talk_value 与 talk_value_rules）

- **talk_value**：全局基础思考频率，默认 1.0，范围 0-1，越小越沉默。
- **enable_talk_value_rules**：开启后进入"按聊天流 + 时间段"的动态调度。
- **talk_value_rules**：规则列表，字典结构 `{ target, time, value }`。
  - **target**：`""` 表示全局，否则写成 `platform:id:type`（如 `qq:123456:group` 或 `qq:114514:private`）。
  - **time**：`HH:MM-HH:MM`，支持跨夜，如 `23:00-02:00`。
  - **value**：命中该规则时临时替换 `talk_value`，数值范围建议 0-1。
- **匹配顺序**：先匹配具体 `target`，再回退到 `target=""` 的规则，最后才落回基础值。
- 每次 planner 思考都会根据当前本地时间和聊天流 ID 调整频率，实现"白天活跃、夜间收敛"或"特定群更克制"的效果。

```toml
[personality]
# 麦麦的兴趣，会影响麦麦对什么话题进行回复
interest = "对技术相关话题，游戏和动漫相关话题感兴趣，也对日常话题感兴趣，不喜欢太过沉重严肃的话题"

# 麦麦的说话规则，行为风格:
plan_style = """
1.思考**所有**的可用的action中的**每个动作**是否符合当下条件，如果动作使用条件符合聊天内容就使用
2.如果相同的内容已经被执行，请不要重复执行
3.请控制你的发言频率，不要太过频繁的发言
4.如果有人对你感到厌烦，请减少回复
5.如果有人对你进行攻击，或者情绪激动，请你以合适的方法应对"""

[chat] #麦麦的聊天设置
talk_value = 1 #聊天频率，越小越沉默，范围0-1
mentioned_bot_reply = true # 是否启用提及必回复
max_context_size = 30 # 上下文长度
planner_smooth = 2 #规划器平滑，增大数值会减小planner负荷，略微降低反应速度，推荐1-5，0为关闭，必须大于等于0

enable_talk_value_rules = true # 是否启用动态发言频率规则

# 动态发言频率规则：按时段/按chat_id调整 talk_value（优先匹配具体chat，再匹配全局）
talk_value_rules = [
    { target = "", time = "00:00-08:59", value = 0.8 },
    { target = "", time = "09:00-22:59", value = 1.0 },
    { target = "qq:1919810:group", time = "20:00-23:59", value = 0.6 },
    { target = "qq:114514:private", time = "00:00-23:59", value = 0.3 },
]

include_planner_reasoning = false # 是否将planner推理加入replyer，默认关闭（不加入）
```

> 小贴士：如果希望某些群聊在高峰期更矜持，可以为该 `target` 添加 `value < 1` 的时段规则；若想在深夜完全禁言，可直接把值设置为 0。

## 自动调整说话频率系统

除了手动配置的 `talk_value` 和 `talk_value_rules`，麦麦还内置了**自动调整说话频率系统**，能够根据聊天中的用户反馈自动调整发言频率。

### 工作原理

系统会在每次思考时自动监控聊天记录，使用 LLM 分析用户是否觉得麦麦发言过于频繁或过少：

1. **触发条件**：

   - 距离上次调整至少 160 秒
   - 消息数量超过 20 条
2. **分析过程**：

   - 系统会读取最近 20 条消息
   - 使用 LLM 判断用户反馈（"过于频繁"、"过少"或"正常"）
3. **自动调整**：

   - 如果判断为"过于频繁"：调整值 × 0.8（降低频率）
   - 如果判断为"过少"：调整值 × 1.2（提高频率）
   - 调整值范围限制在 0.1-1.5 之间
4. **最终频率计算**：

   ```
   实际 talk_value = 基础 talk_value × 动态规则值 × 自动调整值
   ```

   其中：

   - 基础 `talk_value`：配置文件中的基础值
   - 动态规则值：根据 `talk_value_rules` 匹配到的值（默认为 1.0）
   - 自动调整值：系统根据用户反馈自动调整的值（初始为 1.0）

### 特点

- **自动适应**：无需手动配置，系统会根据每个聊天流的实际情况自动调整
- **独立管理**：每个聊天流（chat_id）都有独立的调整值，互不影响
- **持续生效**：调整值会持续影响该聊天流的发言频率，直到下次调整
- **智能判断**：使用 LLM 理解用户意图，而非简单的消息计数

### 手动控制

如果需要手动控制某个聊天流的频率调整值，可以使用插件命令：

```
/chat talk_frequency <数值>
或
/chat t <数值>
```

例如：

- `/chat t 0.8` - 将当前聊天的频率调整值设置为 0.8（降低频率）
- `/chat t 1.2` - 将当前聊天的频率调整值设置为 1.2（提高频率）

手动设置的值范围也是 0.1-5.0，会覆盖自动调整的值。
