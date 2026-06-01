---
title: Bot 配置
---

# Bot 配置

`bot_config.toml` 是 MaiBot 的主配置文件，包含机器人身份、人设、聊天行为、记忆、表达学习、黑话、消息连接、WebUI、MCP、插件和知识库等设置。

当前文档按代码中的 `src/config/official_configs.py` 整理。配置文件由 MaiBot 自动生成和升级，不建议手动新增不存在的字段。

## 配置文件结构

`bot_config.toml` 顶层包含以下主要段落（按一级键分类）：

- **`[bot]`** — 机器人身份、平台、昵称、别名
- **`[personality]`** — 人设和回复风格
- **`[visual]`** — 图片理解模式和识图提示词
- **`[chat]`** — 回复频率、上下文、聊天提示词
- **`[message_receive]`** — 图片解析阈值、消息过滤
- **`[a_memorix]`** — 长期记忆系统（存储、向量化、检索、画像、演化等）→ [详见 A_Memorix 配置](./amemorix-config.md)
- **`[expression]`** — 表达学习、表达检查、互通组
- **`[jargon]`** — 黑话学习、黑话互通组
- **`[voice]`** — 语音识别
- **`[emoji]`** — 表情包收集、过滤、发送
- **`[keyword_reaction]`** — 关键词/正则触发反应
- **`[response_post_process]`** — 回复后处理总开关
- **`[chinese_typo]`** — 中文错别字生成
- **`[log]`** — 日志配置
- **`[response_splitter]`** — 回复分割
- **`[telemetry]`** — 遥测开关
- **`[debug]`** — 调试显示和追踪
- **`[maim_message]`** — maim_message WebSocket/API Server
- **`[webui]`** — WebUI 服务和安全设置
- **`[database]`** — 消息二进制数据保存策略
- **`[mcp]`** — MCP 客户端和服务器配置
- **`[plugin]`** — 插件管理权限
- **`[plugin_runtime]`** — 插件运行时和浏览器渲染配置

::: tip
配置文件开头的 `[inner] version` 由程序管理。需要修改配置模板时，应更新模板版本；普通用户不需要手动改这个版本号。
:::


## 基础 [bot]

**说明**：机器人身份信息配置，包含平台、账号、昵称等基础设置。

```toml
[bot]
# 平台标识，例如 qq
platform = ""
# 机器人登录的 QQ 号（字符串），用于识别 @ 和自身消息
qq_account = ""
# 其他平台标识列表，多平台场景使用
platforms = []
# 机器人昵称
nickname = "麦麦"
# 别名列表，被提及时可参与回复判断
alias_names = []
```

### 选项说明

- **`platform`** — 平台标识。默认为空字符串。填写平台名称，如 `qq`、`wechat` 等。
- **`qq_account`** — QQ 账号。默认为空字符串。填写机器人登录的 QQ 号（字符串格式），用于识别 @ 消息和自身发送的消息。
- **`platforms`** — 其他平台列表。默认为空列表。多平台部署场景下填写其他平台标识。
- **`nickname`** — 机器人昵称。默认为 `麦麦`。自由填写，用于聊天中显示的名称。
- **`alias_names`** — 别名列表。默认为空列表。填写多个别名，当用户提及这些别名时麦麦会参与回复判断。


## 人格 [personality]

**说明**：控制 MaiBot 的人设和语言风格配置。

```toml
[personality]
# 人格设定，建议 200 字以内，描述人格特质和身份特征。要求第二人称
personality = "你是一个大二女大学生，现在正在上网和群友聊天。"
# 默认表达风格，描述说话的表达风格和习惯，建议 1-2 行
reply_style = "你的风格平淡简短。可以参考贴吧，知乎和微博的回复风格。不浮夸不长篇大论，不要过分修辞和复杂句。尽量回复的简短一些，平淡一些"
# 可选的多种表达风格列表，不为空时可按概率随机替换 reply_style
multiple_reply_style = [
  "你的风格平淡但不失讽刺，很简短，很白话。可以参考贴吧，微博的回复风格。",
  "用 1-2 个字进行回复",
  "用 1-2 个符号进行回复",
  "言辭凝練古雅，穿插《論語》經句卻不晦澀，以文言短句為基，輔以淺白語意，持長者溫和風範，全用繁體字表達，具先秦儒者談吐韻致。",
  "带点翻译腔，但不要太长",
]
# 每次从 multiple_reply_style 随机替换 reply_style 的概率，范围 0.0-1.0
multiple_probability = 0
```

### 选项说明

**`personality`** — 人格设定。默认值：`"你是一个大二女大学生，现在正在上网和群友聊天。"`。建议 200 字以内，使用第二人称描述麦麦的人格特质和身份特征。

**`reply_style`** — 默认表达风格。默认值：`"你的风格平淡简短。可以参考贴吧，知乎和微博的回复风格。不浮夸不长篇大论，不要过分修辞和复杂句。尽量回复的简短一些，平淡一些"`。描述麦麦说话的表达风格和习惯，建议 1-2 行。

**`multiple_reply_style`** — 备用表达风格列表。默认包含 5 种风格。当配置不为空时，系统会按 `multiple_probability` 的概率从此列表中随机选择一种风格临时替换 `reply_style`。

**`multiple_probability`** — 风格替换概率。默认值：`0`。取值范围：`0.0-1.0`。每次构建回复时，从 `multiple_reply_style` 中随机替换 `reply_style` 的概率。设为 0 时不替换，设为 1 时每次都替换。


## 视觉 [visual]

**说明**：控制图片消息进入规划器和回复器时的处理模式配置。

```toml
[visual]
# 规划器视觉模式：text(纯文本) / multimodal(多模态) / auto(自动选择)
planner_mode = "auto"
# 回复器视觉模式：text(纯文本) / multimodal(多模态) / auto(自动选择)
replyer_mode = "auto"
# 非视觉 planner 请求前等待图片识别完成的最长秒数，0 时不等待
wait_image_recognize_max_time = 10
# 是否检查并处理过大图片
handle_oversized_images = true
# 图片超过该大小 (MB) 视为过大，0 不限制
max_image_size_mb = 30.0
# 过大图片处理方法：compress(压缩) / discard(丢弃)
oversized_image_handle_method = "compress"
```

### 选项说明

**`planner_mode`** — 规划器视觉模式。默认值：`"auto"`。可选值：
- `"auto"` — 根据模型信息自动选择文本或多模态模式
- `"text"` — 纯文本模式，不向模型发送视觉输入
- `"multimodal"` — 多模态模式，会向模型发送视觉输入

**`replyer_mode`** — 回复器视觉模式。默认值：`"auto"`。可选值：
- `"auto"` — 根据模型信息自动选择文本或多模态模式
- `"text"` — 纯文本模式，不向模型发送视觉输入
- `"multimodal"` — 多模态模式，会向模型发送视觉输入

**`wait_image_recognize_max_time`** — 识图最长等待时间。默认值：`10`。取值范围：`≥0`。非视觉 planner 请求前等待图片识别完成的最长秒数；设为 0 时不等待，保持占位请求。

**`handle_oversized_images`** — 处理过大图片。默认值：`true`。开启后，接收图片会检查大小并按配置处理过大图片；关闭后跳过检查和处理。

**`max_image_size_mb`** — 最大图片大小 (MB)。默认值：`30.0`。取值范围：`≥0`。接收图片超过该大小时视为过大图片；设为 0 时不限制图片大小。

**`oversized_image_handle_method`** — 过大图片处理方法。默认值：`"compress"`。可选值：
- `"compress"` — 压缩图片并继续处理
- `"discard"` — 丢弃超过最大大小的图片组件


## 聊天 [chat]

**说明**：控制回复频率、上下文长度、群聊/私聊提示词，以及按时间和聊天流动态调整发言频率。

```toml
[chat]
# 群聊聊天频率，越小越沉默，范围 0-1
talk_value = 1
# 私聊聊天频率，越小越沉默，范围 0-1
private_talk_value = 1
# 是否启用提及必回复
mentioned_bot_reply = false
# 是否启用 @ 必回复
inevitable_at_reply = true
# 群聊上下文消息数量
max_context_size = 40
# 私聊上下文长度
max_private_context_size = 60
# 优化 50% 左右的 Planner 上下文消耗（可能影响缓存）
enable_context_optimization = true
# 上下文裁切时是否用 utils 模型生成中期聊天摘要
mid_term_memory = true
# 最多保留多少条中期聊天摘要消息
mid_term_memory_lenth = 10
# 是否启用独立 Timing Gate（关闭后合并到 Planner）
enable_independent_timing_gate = true
# 是否允许 replyer 使用 at[msg_id] 标记发送真正的 at 消息
enable_at = true
# 是否启用回复时附带引用回复
enable_reply_quote = true
# 模拟打字时间倍乘：0=不等待，1=默认，2=两倍，范围 0-2
typing_speed = 1.0
# Planner 连续被打断的最大次数，0 表示不启用打断
planner_interrupt_max_consecutive_count = 0
# Timing Gate 判断频率平滑值，越大判断越平滑但反应可能变慢
timing_gate_non_continue_cooldown_seconds = 8
# 群聊通用注意事项
group_chat_prompt = "你正在 qq 群里聊天，下面是群里正在聊的内容，其中包含聊天记录和聊天中的图片和表情包。\n回复尽量简短一些。最好一次对一个话题进行回复，但必须考虑不同群友发言之间的交互，免得啰嗦或者回复内容太乱。请注意把握聊天内容。\n不要总是提及自己的身份背景，根据聊天内容自由发挥，但是要日常不浮夸，不要刻意找话题，。\n不用刻意回复其他人发送的表情包，只要关注表情包表达的含义。你可以适当发送表情包表达情绪。控制回复的频率，不要每个人的消息都回复，优先回复你感兴趣的或者主动提及你的，适当回复其他话题。\n"
# 私聊通用注意事项
private_chat_prompts = "你正在聊天，下面是正在聊的内容，其中包含聊天记录和聊天中的图片。\n回复尽量简短一些。请注意把握聊天内容。\n请考虑对方的发言频率，想法，思考自己何时回复以及回复内容。\n"
# 按平台/聊天流附加的额外提示词列表
chat_prompts = []
# 是否启用动态发言频率规则
enable_talk_value_rules = true
```

### 选项说明

- **`talk_value`** — 群聊频率。默认为 `1`。范围 `0-1`。越小越沉默。
- **`private_talk_value`** — 私聊频率。默认为 `1`。范围 `0-1`。越小越沉默。
- **`mentioned_bot_reply`** — 提及必回复开关。默认为 `false`。开启后，当用户提及麦麦时必定回复。
- **`inevitable_at_reply`** — @ 必回复开关。默认为 `true`。开启后，当用户 @ 麦麦时必定回复。
- **`max_context_size`** — 群聊上下文长度。默认为 `40` 条消息。
- **`max_private_context_size`** — 私聊上下文长度。默认为 `60` 条消息。
- **`enable_context_optimization`** — 优化上下文开关。默认为 `true`。开启后优化 50% 左右的 Planner 上下文消耗，但可能影响缓存，轻微影响性能表现。
- **`mid_term_memory`** — 中期聊天摘要开关。默认为 `true`。开启后，上下文裁切时使用 `mid_memory` 任务配置的模型生成中期聊天摘要，并以可展开复杂消息保留在历史中。`mid_memory` 任务默认回退到 `planner` 模型。
- **`mid_term_memory_lenth`** — 中期摘要保留数。默认为 `10` 条。范围 `≥0`。最多保留多少条中期聊天摘要消息，超出后移除最早的摘要。
- **`enable_independent_timing_gate`** — 独立时间感知开关。默认为 `true`。开启后启用独立 Timing Gate；关闭后不再单独运行 Timing Gate，并将节奏控制工具合并到 Planner。
- **`enable_at`** — 允许发送 @ 开关。默认为 `true`。是否允许 replyer 使用 `at[msg_id]` 标记来发送真正的 @ 消息。
- **`enable_reply_quote`** — 启用引用回复开关。默认为 `true`。是否启用回复时附带引用回复。
- **`typing_speed`** — 聊天速度。默认为 `1.0`。范围 `0-2`。模拟打字时间倍乘，`0` 表示不等待，`1` 保持默认等待时间，`2` 表示等待时间变为默认的两倍。
- **`planner_interrupt_max_consecutive_count`** — Planner 连续打断上限。默认为 `0`。范围 `≥0`。Planner 连续被新消息打断的最大次数，`0` 表示不启用打断。
- **`timing_gate_non_continue_cooldown_seconds`** — Timing Gate 平滑值。默认为 `8` 秒。范围 `≥0`。这个值决定了 timing gate 判断的频率，值越大，timing gate 的判断越平滑，但也可能导致反应变慢。
- **`group_chat_prompt`** — 群聊提示词。默认为较长的默认文本。群聊通用注意事项，指导麦麦如何在群聊中回复。
- **`private_chat_prompts`** — 私聊提示词。默认为较长的默认文本。私聊通用注意事项，指导麦麦如何在私聊中回复。
- **`chat_prompts`** — 额外提示词列表。默认为空列表。按平台/聊天流附加的额外提示词，用于针对特定群或私聊对象定制回复风格。
- **`enable_talk_value_rules`** — 启用动态发言频率规则开关。默认为 `true`。是否启用按聊天流/按日内时段配置发言频率的规则。

### talk_value_rules

按聊天流/按日内时段配置发言频率，默认 2 条规则：

```toml
[[chat.talk_value_rules]]
# 平台，与 item_id 一起留空表示全局
platform = ""
# 用户/群 ID，与 platform 一起留空表示全局
item_id = ""
# 聊天流类型：group(群聊) / private(私聊)
rule_type = "group"
# 时间段，格式 HH:MM-HH:MM，支持跨夜
time = "00:00-08:59"
# 该时间段的聊天频率值，范围 0-1
value = 0.8

[[chat.talk_value_rules]]
platform = ""
item_id = ""
rule_type = "group"
time = "09:00-18:59"
value = 1.0
```

#### 选项说明

- **`platform`** — 平台。默认为空字符串。与 `item_id` 一起留空表示全局规则。
- **`item_id`** — 用户/群 ID。默认为空字符串。与 `platform` 一起留空表示全局规则。
- **`rule_type`** — 聊天流类型。默认为 `"group"`。可选：`"group"`（群聊聊天流，`item_id` 填群号或群聊 ID） / `"private"`（私聊聊天流，`item_id` 填用户 ID）。
- **`time`** — 时间段。默认为空字符串。格式为 `"HH:MM-HH:MM"`，支持跨夜区间。
- **`value`** — 发言频率。默认为 `0.5`。范围 `0-1`。该时间段的聊天频率值，越小越沉默。

### chat_prompts

```toml
[[chat.chat_prompts]]
platform = "qq"
item_id = "123456"
rule_type = "group"
prompt = "这个群里说话要更简短。"
```

`platform`、`item_id` 和 `prompt` 都需要填写，否则该条额外提示词无效。

#### 选项说明

- **`platform`** — 平台。必须填写。指定该提示词适用的平台。
- **`item_id`** — 用户/群 ID。必须填写。指定该提示词适用的具体群号或用户 ID。
- **`rule_type`** — 聊天流类型。必须填写。可选：`"group"` / `"private"`。
- **`prompt`** — 提示词内容。必须填写。针对该聊天流的额外注意事项。


## 消息接收 [message_receive]

**说明**：控制图片解析和消息过滤配置。

```toml
[message_receive]
# 消息中图片数量不超过此阈值时启用图片解析，超过则跳过
image_parse_threshold = 5
# 过滤词集合
ban_words = []
# 过滤正则表达式集合（正则非法会导致配置校验失败）
ban_msgs_regex = []
```

### 选项说明

- **`image_parse_threshold`** — 图片解析阈值。默认为 `5`。当消息中图片数量不超过此阈值时，启用图片解析功能，将图片内容解析为文本后再进行处理；当消息中图片数量超过此阈值时，为了避免过度解析导致的性能问题，将跳过图片解析，直接进行处理。
- **`ban_words`** — 过滤词列表。默认为空集合。填写需要过滤的词汇，包含这些词汇的消息会被过滤。
- **`ban_msgs_regex`** — 过滤正则表达式列表。默认为空集合。填写正则表达式，匹配这些正则的消息会被过滤。正则表达式非法会导致配置校验失败。


## 记忆 [a_memorix]

**说明**：A_Memorix 是 MaiBot 的长期记忆系统，负责记忆存储、向量化、检索、人物画像、记忆演化和 Web 运维。它替代了旧版 `[memory]` 配置段落，提供了更细粒度的控制。

A_Memorix 配置包含 12 个子段落，完整说明请移步：

→ **[A_Memorix 配置详解](./amemorix-config.md)**

### 快速启用

```toml
[a_memorix]

[a_memorix.plugin]
# 是否启用长期记忆系统
enabled = true
```

### 从旧版 [memory] 迁移

如果你之前使用过 `[memory]`，请参阅 [A_Memorix 配置详解 - 从旧版迁移](./amemorix-config.md#从旧版-memory-迁移)。


## 表达学习 [expression]

**说明**：控制表达方式学习、表达方式自动检查和互通组配置。

```toml
[expression]
# 是否仅选择已由用户人工检查的表达方式
expression_checked_only = true
# 是否在表达学习写入前进行 AI 审核
expression_self_reflect = true
# 是否启用精细表达选择（replyer 用子代理挑选更贴合语境的表达方式）
enable_precise_expression_selection = false
# 所有聊天流合计允许同时运行的表达学习批次数（同一聊天流始终只允许一个批次）
max_expression_learner = 3
# 表达学习配置列表，默认 1 条全局规则
learning_list = []
# 表达学习互通组
expression_groups = []
```

### 选项说明

- **`expression_checked_only`** — 仅选择已人工检查的表达方式开关。默认为 `true`。开启后，只有经过用户人工检查的表达方式会被选择。
- **`expression_self_reflect`** — 表达学习 AI 审核开关。默认为 `true`。开启后，在表达学习写入前进行 AI 审核；开启后只有审核通过的表达方式会被写入。
- **`enable_precise_expression_selection`** — 精细表达选择开关。默认为 `false`。开启后，replyer 会使用子代理从候选表达中挑选更贴合当前语境的表达方式。
- **`max_expression_learner`** — 表达学习批次数上限。默认为 `3`。所有聊天流合计允许同时运行的表达学习批次数；同一聊天流始终只允许一个批次。
- **`learning_list`** — 表达学习配置列表。默认为空列表。支持按聊天流配置表达学习规则。
- **`expression_groups`** — 表达学习互通组。默认为空列表。配置互通组后，组内的表达学习结果可以共享。

### learning_list

```toml
[[expression.learning_list]]
# 平台，与 item_id 一起留空表示全局
platform = ""
# 用户/群 ID，与 platform 一起留空表示全局
item_id = ""
# 聊天流类型：group(群聊) / private(私聊)
type = "group"
# 是否使用表达学习结果
use = true
# 是否启用表达优化学习
learn = true
```

#### 选项说明

- **`platform`** — 平台。默认为空字符串。与 `item_id` 一起留空表示全局规则。
- **`item_id`** — 用户/群 ID。默认为空字符串。与 `platform` 一起留空表示全局规则。
- **`type`** — 聊天流类型。默认为 `"group"`。可选：`"group"`（群聊） / `"private"`（私聊）。
- **`use`** — 是否使用表达学习结果。默认为 `true`。开启后使用表达学习结果。
- **`learn`** — 是否启用表达优化学习。默认为 `true`。开启后启用表达优化学习。


## 黑话 [jargon]

**说明**：控制黑话学习和黑话互通组配置，从旧版 `[expression]` 中独立出来。

```toml
[jargon]
# 黑话学习配置列表，platform 或 item_id 可使用 * 通配，默认 1 条全局规则
learning_list = []
# 黑话学习互通组，默认不互通
jargon_groups = []
```

### 选项说明

- **`learning_list`** — 黑话学习配置列表。默认为空列表。支持按聊天流配置黑话学习规则，`platform` 或 `item_id` 可使用 `*` 通配。
- **`jargon_groups`** — 黑话学习互通组。默认为空列表。配置互通组后，组内的黑话学习结果可以共享；默认不互通；`platform` 或 `item_id` 可使用 `*` 通配。

### learning_list

```toml
[[jargon.learning_list]]
platform = ""
item_id = ""
type = "group"
use = true
learn = true
```

`LearningItem` 字段含义与 [expression.learning_list](#learning-list) 相同。


## 语音 [voice]

**说明**：语音识别配置。

```toml
[voice]
# 是否启用语音识别，启用后可以识别语音消息
enable_asr = false
```

### 选项说明

- **`enable_asr`** — 语音识别开关。默认为 `false`。开启后启用语音识别，麦麦可以识别语音消息。


## 表情包 [emoji]

**说明**：表情包收集、过滤、发送配置。

```toml
[emoji]
# 一次从多少个表情包中选择发送，范围 1-64
emoji_send_num = 25
# 表情包最大注册数量
max_reg_num = 64
# 满额后是否替换旧表情包（关闭则不再收集）
do_replace = true
# 表情包检查间隔，单位分钟
check_interval = 10
# 是否偷取聊天中的表情包
steal_emoji = true
# 是否启用表情包过滤（只有符合要求的才会被保存）
content_filtration = false
```

### 选项说明

- **`emoji_send_num`** — 表情包发送选择数。默认为 `25`。范围 `1-64`。一次从多少个表情包中选择发送。
- **`max_reg_num`** — 表情包最大注册数量。默认为 `64`。表情包的最大注册数量上限。
- **`do_replace`** — 替换旧表情包开关。默认为 `true`。达到最大注册数量时替换旧表情包，关闭则达到最大数量时不会继续收集表情包。
- **`check_interval`** — 表情包检查间隔。默认为 `10` 分钟。定期检查表情包的间隔时间。
- **`steal_emoji`** — 偷取表情包开关。默认为 `true`。开启后麦麦可以将聊天中的表情包据为己有。
- **`content_filtration`** — 表情包过滤开关。默认为 `false`。开启后只有符合要求的表情包才会被保存。


## 关键词反应 [keyword_reaction]

**说明**：关键词/正则表达式触发反应配置。

```toml
# 关键词规则
[[keyword_reaction.keyword_rules]]
keywords = ["关键词"]
reaction = "触发后的反应"

# 正则规则
[[keyword_reaction.regex_rules]]
regex = ["^正则.*"]
reaction = "触发后的反应"
```

### 选项说明

- **`keyword_rules`** — 关键词规则列表。默认为空列表。每个规则包含：
  - `keywords` — 关键词列表。默认为空列表。填写触发反应的关键词。
  - `reaction` — 触发后的反应内容。默认为空字符串。自由填写触发后的回复内容。
- **`regex_rules`** — 正则规则列表。默认为空列表。每个规则包含：
  - `regex` — 正则表达式列表。默认为空列表。填写触发反应的正则表达式。
  - `reaction` — 触发后的反应内容。默认为空字符串。


## 回复后处理 [response_post_process]

**说明**：回复后处理总开关配置。

```toml
[response_post_process]
# 是否启用回复后处理（包括错别字生成器和回复分割器）
enable_response_post_process = true
```

### 选项说明

- **`enable_response_post_process`** — 启用回复后处理。默认为 `true`。布尔类型：
  - `true` — 启用回复后处理，包括错别字生成器和回复分割器
  - `false` — 不启用回复后处理


## 中文错别字 [chinese_typo]

**说明**：中文错别字生成器配置。

```toml
[chinese_typo]
# 是否启用中文错别字生成器
enable = true
# 单字替换概率，范围 0-1
error_rate = 0.01
# 最小字频阈值
min_freq = 9
# 声调错误概率，范围 0-1
tone_error_rate = 0.1
# 整词替换概率，范围 0-1
word_replace_rate = 0.006
```

### 选项说明

- **`enable`** — 启用中文错别字生成器。默认为 `true`。布尔类型：
  - `true` — 启用中文错别字生成器
  - `false` — 不启用
- **`error_rate`** — 单字替换概率。默认为 `0.01`。取值范围 `0-1`。单个汉字被替换为错别字的概率。
- **`min_freq`** — 最小字频阈值。默认为 `9`。自由填写整数。只有字频高于该阈值的字才会被替换。
- **`tone_error_rate`** — 声调错误概率。默认为 `0.1`。取值范围 `0-1`。生成声调错误的概率。
- **`word_replace_rate`** — 整词替换概率。默认为 `0.006`。取值范围 `0-1`。整个词语被替换为错别字的概率。


## 回复分割 [response_splitter]

**说明**：回复分割器配置。

```toml
[response_splitter]
# 是否启用回复分割器
enable = true
# 回复允许的最大长度
max_length = 512
# 回复允许的最大句子数
max_sentence_num = 8
# 是否启用颜文字保护
enable_kaomoji_protection = false
# 句子数量超出上限时是否一次性返回全部内容
enable_overflow_return_all = false
```

### 选项说明

**`enable`** — 启用回复分割器。默认为 `true`。是否启用回复分割器。

**`max_length`** — 回复允许的最大长度。默认为 `512`。单条回复的最大字符数。

**`max_sentence_num`** — 回复允许的最大句子数。默认为 `8`。单条回复的最大句子数量。

**`enable_kaomoji_protection`** — 启用颜文字保护。默认为 `false`。开启后分割时会保护颜文字不被拆分。

**`enable_overflow_return_all`** — 句子数量超出上限时一次性返回全部。默认为 `false`。开启后当句子数量超出上限时一次性返回全部内容，不进行分割。


## 遥测 [telemetry]

**说明**：遥测开关配置。

```toml
[telemetry]
# 是否启用遥测
enable = true
```

### 选项说明

**`enable`** — 启用遥测。默认为 `true`。是否启用遥测功能，用于收集使用统计数据。


## 调试 [debug]

**说明**：调试显示和追踪配置。

```toml
[debug]
# 是否显示回复器推理
show_maisaka_thinking = true
# 是否折叠 Maisaka prompt 展示入口
fold_maisaka_thinking = true
# 是否显示黑话相关提示词
show_jargon_prompt = false
# 是否显示记忆检索相关 prompt
show_memory_prompt = false
# 是否开启回复效果评分追踪
enable_reply_effect_tracking = false
# 是否记录 Replyer 请求体
record_reply_request = false
# 是否记录 Planner 完整请求体和回复体
record_planner_request = false
# 是否记录 LLM prompt cache 调试统计
enable_llm_cache_stats = false
```

### 选项说明

**`show_maisaka_thinking`** — 显示回复器推理。默认为 `true`。是否在 WebUI 中显示 Maisaka 回复器的推理过程。

**`fold_maisaka_thinking`** — 折叠 Maisaka prompt 展示入口。默认为 `true`。是否折叠 Maisaka prompt 的展示入口。

**`show_jargon_prompt`** — 显示 jargon 相关提示词。默认为 `false`。是否显示黑话相关的提示词。

**`show_memory_prompt`** — 显示记忆检索相关 prompt。默认为 `false`。是否显示记忆检索相关的 prompt。

**`enable_reply_effect_tracking`** — 开启回复效果评分追踪。默认为 `false`。是否开启回复效果评分追踪，默认关闭，需要手动打开。

**`record_reply_request`** — 记录 Replyer 请求体。默认为 `false`。是否记录 Replyer 请求体，默认关闭。

**`record_planner_request`** — 记录 Planner 完整请求体和回复体。默认为 `false`。是否记录 Planner 完整请求体和完整回复体，默认关闭。

**`enable_llm_cache_stats`** — 记录 LLM prompt cache 调试统计。默认为 `false`。是否记录 LLM prompt cache 调试统计，默认关闭。


## 消息服务 [maim_message]

**说明**：maim_message WebSocket / API Server 配置。

```toml
[maim_message]
# 旧版基于 WS 的服务器主机地址
ws_server_host = "127.0.0.1"
# 旧版基于 WS 的服务器端口号
ws_server_port = 8000
# 认证令牌列表，为空则不启用验证
auth_token = []
# 是否启用额外的新版 API Server
enable_api_server = false
# 新版 API Server 主机地址
api_server_host = "0.0.0.0"
# 新版 API Server 端口号
api_server_port = 8090
# 新版 API Server 是否启用 WSS
api_server_use_wss = false
# 新版 API Server SSL 证书文件路径
api_server_cert_file = ""
# 新版 API Server SSL 密钥文件路径
api_server_key_file = ""
# 新版 API Server 允许的 API Key 列表，为空则允许所有连接
api_server_allowed_api_keys = []
```

### 选项说明

**`ws_server_host`** — 旧版基于 WS 的服务器主机地址。默认为 `"127.0.0.1"`。

**`ws_server_port`** — 旧版基于 WS 的服务器端口号。默认为 `8000`。

**`auth_token`** — 认证令牌列表。默认为空列表。用于旧版 API 验证，为空则不启用验证。

**`enable_api_server`** — 启用额外的新版 API Server。默认为 `false`。是否启用额外的新版 API Server。

**`api_server_host`** — 新版 API Server 主机地址。默认为 `"0.0.0.0"`。

**`api_server_port`** — 新版 API Server 端口号。默认为 `8090`。

**`api_server_use_wss`** — 新版 API Server 是否启用 WSS。默认为 `false`。

**`api_server_cert_file`** — 新版 API Server SSL 证书文件路径。默认为空字符串。

**`api_server_key_file`** — 新版 API Server SSL 密钥文件路径。默认为空字符串。

**`api_server_allowed_api_keys`** — 新版 API Server 允许的 API Key 列表。默认为空列表。为空则允许所有连接。


## WebUI [webui]

**说明**：WebUI 服务和安全设置配置。

```toml
[webui]
# 是否启用 WebUI
enabled = true
# WebUI 绑定主机地址
host = "127.0.0.1"
# WebUI 绑定端口
port = 8001
# 运行模式：development / production
mode = "production"
# 防爬虫模式：false(禁用) / strict(严格) / loose(宽松) / basic(基础)
anti_crawler_mode = "basic"
# IP 白名单，逗号分隔，支持精确 IP、CIDR 和通配符
allowed_ips = "127.0.0.1"
# 信任的代理 IP 列表，逗号分隔
trusted_proxies = ""
# 是否启用 X-Forwarded-For 代理解析
trust_xff = false
# 是否启用安全 Cookie（仅 HTTPS 传输）
secure_cookie = false
# 是否强制公网出站 URL 校验（关闭后允许内网/TUN 代理地址）
enforce_public_outbound_url = true
# 是否在知识图谱中加载段落完整内容（会占用额外内存）
enable_paragraph_content = false
```

### 选项说明

- **`enabled`** — 启用 WebUI。默认为 `true`。布尔类型：
  - `true` — 启用 WebUI
  - `false` — 不启用
- **`host`** — WebUI 绑定主机地址。默认为 `127.0.0.1`。自由填写 IP 地址。
- **`port`** — WebUI 绑定端口。默认为 `8001`。自由填写整数。
- **`mode`** — 运行模式。默认为 `production`。可选值：
  - `development` — 开发模式
  - `production` — 生产模式
- **`anti_crawler_mode`** — 防爬虫模式。默认为 `basic`。可选值：
  - `false` — 禁用防爬虫
  - `strict` — 严格模式
  - `loose` — 宽松模式
  - `basic` — 基础模式（只记录不阻止）
- **`allowed_ips`** — IP 白名单。默认为 `127.0.0.1`。逗号分隔的字符串，支持精确 IP、CIDR 格式和通配符。
- **`trusted_proxies`** — 信任的代理 IP 列表。默认为空字符串。逗号分隔的字符串，只有来自这些 IP 的 X-Forwarded-For 才被信任。
- **`trust_xff`** — 启用 X-Forwarded-For 代理解析。默认为 `false`。布尔类型：
  - `true` — 启用 X-Forwarded-For 代理解析（默认 false）
  - `false` — 不启用
- **`secure_cookie`** — 启用安全 Cookie。默认为 `false`。布尔类型：
  - `true` — 启用安全 Cookie（仅通过 HTTPS 传输，默认 false）
  - `false` — 不启用
- **`enforce_public_outbound_url`** — 强制公网出站 URL 校验。默认为 `true`。布尔类型：
  - `true` — 要求 WebUI 出站 URL 解析到公网地址；关闭后允许内网、本机或 TUN 代理地址，用于内网 LLM、反向代理等场景
  - `false` — 不强制校验
- **`enable_paragraph_content`** — 加载段落完整内容。默认为 `false`。布尔类型：
  - `true` — 在知识图谱中加载段落完整内容（需要加载 embedding store，会占用额外内存）
  - `false` — 不加载


## 数据库 [database]

**说明**：消息二进制数据保存策略配置。

```toml
[database]
# 是否将消息中的二进制数据保存为独立文件（只影响新存储的消息）
save_binary_data = false
```

### 选项说明

- **`save_binary_data`** — 保存二进制数据。默认为 `false`。布尔类型：
  - `true` — 将消息中的二进制数据保存为独立文件。若启用，消息中的语音等二进制数据将会保存为独立文件，并在消息中以特殊标记替代。启用会导致数据文件夹体积增大，但可以实现二次识别等功能。
  - `false` — 消息中的二进制将会在识别后删除，并在消息中使用识别结果替代，无法二次识别。该配置项仅影响新存储的消息，已有消息不会受到影响。


## MCP [mcp]

**说明**：MCP 客户端宿主能力和外部 MCP 服务器连接配置。

详细的 MCP 配置指南请移步 → [MCP 配置详解](./mcp-config.md)

```toml
[mcp]
# 是否启用 MCP
enable = true
```

### 选项说明

- **`enable`** — 启用 MCP。默认为 `true`。布尔类型：
  - `true` — 启用 MCP（Model Context Protocol）
  - `false` — 不启用

::: tip 🛠️ 更多配置方式
详细的字段说明、传输方式对比、Sampling/Roots/Elicitation 高级配置、常见问题解答，请参阅 [MCP 配置详解](./mcp-config.md)。
:::


## 插件管理 [plugin]

**说明**：插件管理权限配置。

```toml
[plugin]
# 允许使用内置插件管理命令的用户 ID 列表，格式 platform:id，例如 qq:123456789
permission = []
```

### 选项说明

- **`permission`** — 插件管理权限列表。默认为空列表。允许使用内置插件管理命令的用户 ID 列表，格式为 `platform:id`，例如 `qq:123456789`。


## 插件运行时 [plugin_runtime]

**说明**：插件 Runner 和插件运行时浏览器渲染能力配置。

```toml
[plugin_runtime]
# 是否启用插件系统
enabled = true
# 健康检查间隔，单位秒
health_check_interval_sec = 30.0
# Runner 崩溃后最大自动重启次数
max_restart_attempts = 3
# 等待 Runner 子进程启动并注册的超时时间，单位秒
runner_spawn_timeout_sec = 30.0
# Hook 阻塞步骤的全局超时上限，单位秒
hook_blocking_timeout_sec = 60
# 自定义 IPC Socket 路径，仅 Linux/macOS 生效，留空自动生成
ipc_socket_path = ""
```

### 选项说明

- **`enabled`** — 启用插件系统。默认为 `true`。布尔类型：
  - `true` — 启用插件系统
  - `false` — 不启用
- **`health_check_interval_sec`** — 健康检查间隔。默认为 `30.0` 秒。自由填写浮点数。
- **`max_restart_attempts`** — Runner 崩溃后最大自动重启次数。默认为 `3`。自由填写整数。
- **`runner_spawn_timeout_sec`** — 等待 Runner 子进程启动并注册的超时时间。默认为 `30.0` 秒。自由填写浮点数。
- **`hook_blocking_timeout_sec`** — Hook 阻塞步骤的全局超时上限。默认为 `60` 秒。自由填写整数。
- **`ipc_socket_path`** — 自定义 IPC Socket 路径。默认为空字符串。仅 Linux/macOS 生效，留空自动生成。


## 常用配置示例

### 新手最小配置

```toml
[bot]
platform = "qq"
qq_account = "123456789"
nickname = "麦麦"
alias_names = ["小麦"]

[chat]
talk_value = 0.7
inevitable_at_reply = true
max_context_size = 40

[a_memorix]

[a_memorix.plugin]
enabled = true

[a_memorix.integration]
enable_memory_query_tool = true
person_fact_writeback_enabled = true
chat_summary_writeback_enabled = true
```

### 连接适配器

```toml
[maim_message]
ws_server_host = "127.0.0.1"
ws_server_port = 8000
auth_token = []
```

如果适配器运行在 Docker 网络或其他机器上，需要结合部署方式调整监听地址和端口。


## 下一步

- 配置模型：看 [模型配置](./model-config.md)
- 连接 QQ：看 [NapCat 适配器](../adapters/napcat.md)
- 管理 WebUI：看 [WebUI 配置管理](../webui/config-management.md)
- 记忆系统详解：看 [A_Memorix 配置](./amemorix-config.md)
- MCP 配置详解：看 [MCP 配置](./mcp-config.md)
