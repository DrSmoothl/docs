---
title: Bot 配置
titleTemplate: :title · 配置
---

# Bot 配置

`bot_config.toml` 是 MaiBot 的主配置文件，包含机器人身份、人设、聊天行为、记忆、学习、表情、WebUI、MCP、插件等全部主设置。

配置文件由 MaiBot 自动生成和升级，不建议手动新增不存在的字段。

---

# 基础

机器人身份信息，包含平台、账号、昵称等。

```toml
[bot]
platform = ""
qq_account = ""
platforms = []
nickname = "麦麦"
alias_names = []
```

**`platform`** — 平台标识。**类型**：`str`。**默认值**：`""`。填写平台名称，如 `qq`。

**`qq_account`** — QQ 账号。**类型**：`str`。**默认值**：`""`。机器人登录的 QQ 号（字符串格式），用于识别 @ 消息和自身消息。

**`platforms`** — 其他平台列表。**类型**：`list[str]`。**默认值**：`[]`。多平台部署场景填写。

**`nickname`** — 机器人昵称。**类型**：`str`。**默认值**：`"麦麦"`。聊天中显示的名称。

**`alias_names`** — 别名列表。**类型**：`list[str]`。**默认值**：`[]`。被提及时参与回复判断。

---

# 人格

控制麦麦的人设和语言风格。

```toml
[personality]
personality = "你是一个大二女大学生，现在正在上网和群友聊天。"
reply_style = "你的风格平淡简短。可以参考贴吧，知乎和微博的回复风格。不浮夸不长篇大论，不要过分修辞和复杂句。尽量回复的简短一些，平淡一些"
multiple_reply_style = [
  "你的风格平淡但不失讽刺，很简短，很白话。可以参考贴吧，微博的回复风格。",
  "用 1-2 个字进行回复",
  "用 1-2 个符号进行回复",
  "言辭凝練古雅，穿插《論語》經句卻不晦澀，以文言短句為基，輔以淺白語意，持長者溫和風範，全用繁體字表達，具先秦儒者談吐韻致。",
  "带点翻译腔，但不要太长",
]
multiple_probability = 0
```

**`personality`** — 人格设定。**类型**：`str`。**默认值**：`"你是一个大二女大学生，现在正在上网和群友聊天。"`。建议 200 字以内，使用第二人称描述人格特质和身份特征。

**`reply_style`** — 默认表达风格。**类型**：`str`。**默认值**：见上方配置。描述说话的表达风格和习惯，建议 1-2 行。

**`multiple_reply_style`** — 备用表达风格列表。**类型**：`list[str]`。**默认值**：包含 5 种默认风格。按 `multiple_probability` 的概率从中随机选择一种临时注入。

**`multiple_probability`** — 风格替换概率。**类型**：`float`。**默认值**：`0`。取值范围：`0.0-1.0`。每次构建回复时从备用列表中随机替换的概率。`0` 表示不替换，`1` 表示每次都替换。

---

# 视觉

控制图片消息进入规划器和回复器时的处理模式。

```toml
[visual]
planner_mode = "auto"
replyer_mode = "auto"
wait_image_recognize_max_time = 10
handle_oversized_images = true
max_image_size_mb = 30.0
oversized_image_handle_method = "compress"
```

**`planner_mode`** — 规划器视觉模式。**类型**：`str`（枚举）。**默认值**：`"auto"`。**可选值**：
- `"auto"` — 根据模型信息自动选择
- `"text"` — 纯文本模式，不发送视觉输入
- `"multimodal"` — 多模态模式，发送视觉输入

**`replyer_mode`** — 回复器视觉模式。**类型**：`str`（枚举）。**默认值**：`"auto"`。可选值同上。

**`wait_image_recognize_max_time`** — 识图最长等待。**类型**：`float`。**默认值**：`10`。**单位**：秒。非视觉 planner 请求前等待图片识别完成的最长秒数；设为 `0` 不等待。

**`handle_oversized_images`** — 处理过大图片。**类型**：`bool`。**默认值**：`true`。

**`max_image_size_mb`** — 最大图片大小。**类型**：`float`。**默认值**：`30.0`。**单位**：MB。设为 `0` 不限制。

**`oversized_image_handle_method`** — 过大图片处理方法。**类型**：`str`（枚举）。**默认值**：`"compress"`。**可选值**：
- `"compress"` — 压缩后继续处理
- `"discard"` — 丢弃该图片组件

---

# 聊天

控制回复频率、上下文长度、群聊 / 私聊提示词、no_action 退避策略、动态发言频率。

```toml
[chat]
talk_value = 1
private_talk_value = 1
mentioned_bot_reply = false
inevitable_at_reply = true
self_message_special_mark = true
max_context_size = 40
max_private_context_size = 60
enable_context_optimization = true
mid_term_memory = true
mid_term_memory_lenth = 10
enable_reply_quote = true
typing_speed = 1.0
planner_interrupt_max_consecutive_count = 0
no_action_backoff_base_seconds = 15
no_action_backoff_cap_seconds = 300
no_action_backoff_start_count = 2
no_action_backoff_bypass_pending_count = 6
group_chat_prompt = "你正在 qq 群里聊天，下面是群里正在聊的内容..."
private_chat_prompts = "你正在聊天，下面是正在聊的内容..."
chat_prompts = []
enable_talk_value_rules = false
```

## 字段说明

**`talk_value`** — 群聊频率。**类型**：`float`。**默认值**：`1`。取值范围：`0-1`。越小越沉默。

**`private_talk_value`** — 私聊频率。**类型**：`float`。**默认值**：`1`。取值范围：`0-1`。

**`mentioned_bot_reply`** — 提及必回复。**类型**：`bool`。**默认值**：`false`。

**`inevitable_at_reply`** — @ 必回复。**类型**：`bool`。**默认值**：`true`。

**`self_message_special_mark`** — 自身消息特殊标注。**类型**：`bool`。**默认值**：`true`。进一步强调哪些消息是自己发送的，减少 bot 认错的情况。

**`max_context_size`** — 群聊上下文长度。**类型**：`int`。**默认值**：`40`。条消息。

**`max_private_context_size`** — 私聊上下文长度。**类型**：`int`。**默认值**：`60`。条消息。

**`enable_context_optimization`** — 优化上下文。**类型**：`bool`。**默认值**：`true`。优化约 50% 的 Planner 上下文消耗，可能影响缓存。

**`mid_term_memory`** — 中期聊天摘要。**类型**：`bool`。**默认值**：`true`。上下文裁切时生成中期摘要，以可展开复杂消息保留。使用的模型回退到 `planner`。

**`mid_term_memory_lenth`** — 中期摘要保留数。**类型**：`int`。**默认值**：`10`。超出后移除最早的摘要。

**`enable_reply_quote`** — 启用引用回复。**类型**：`bool`。**默认值**：`true`。

**`typing_speed`** — 聊天速度。**类型**：`float`。**默认值**：`1.0`。取值范围：`0-2`。模拟打字时间倍乘。`0` 表示不等待，`1` 保持默认等待时间，`2` 表示两倍。

**`planner_interrupt_max_consecutive_count`** — Planner 连续打断上限。**类型**：`int`。**默认值**：`0`。Planner 遇到新消息重新思考的次数，`0` 表示不限制。

## no_action 退避策略

当麦麦连续沉默（no_action）时，自动逐步增加等待间隔，避免频繁无意义轮询。

**`no_action_backoff_base_seconds`** — 退避基准秒数。**类型**：`float`。**默认值**：`15`。`0` 表示不启用退避。

**`no_action_backoff_cap_seconds`** — 退避上限秒数。**类型**：`float`。**默认值**：`300`。

**`no_action_backoff_start_count`** — 退避起点。**类型**：`int`。**默认值**：`2`。连续第几次 no_action 后开始退避。

**`no_action_backoff_bypass_pending_count`** — 退避绕过消息数。**类型**：`int`。**默认值**：`6`。退避期间待处理消息达到该数量直接绕过，`0` 表示不按消息数绕过。

**`group_chat_prompt`** — 群聊提示词。**类型**：`str`。**默认值**：较长默认文本。群聊通用注意事项。

**`private_chat_prompts`** — 私聊提示词。**类型**：`str`。**默认值**：较长默认文本。私聊通用注意事项。

**`chat_prompts`** — 额外提示词列表。**类型**：`list[ExtraPromptItem]`。**默认值**：`[]`。按平台 / 聊天流附加的额外提示词。

**`enable_talk_value_rules`** — 启用动态发言频率规则。**类型**：`bool`。**默认值**：`false`。

## talk_value_rules

按聊天流 / 日内时段配置发言频率，默认 2 条全局规则：

```toml
[[chat.talk_value_rules]]
platform = ""
item_id = ""
rule_type = "group"
time = "00:00-08:59"
value = 0.8

[[chat.talk_value_rules]]
platform = ""
item_id = ""
rule_type = "group"
time = "09:00-18:59"
value = 1.0
```

**`platform`** — 平台。**类型**：`str`。**默认值**：`""`。与 `item_id` 一起留空表示全局。

**`item_id`** — 用户 / 群 ID。**类型**：`str`。**默认值**：`""`。

**`rule_type`** — 聊天流类型。**类型**：`str`（枚举）。**默认值**：`"group"`。**可选值**：`"group"` / `"private"`。

**`time`** — 时间段。**类型**：`str`。格式：`"HH:MM-HH:MM"`，支持跨夜。

**`value`** — 发言频率。**类型**：`float`。取值范围：`0-1`。

## chat_prompts

```toml
[[chat.chat_prompts]]
platform = "qq"
item_id = "123456"
rule_type = "group"
prompt = "这个群里说话要更简短。"
```

`platform`、`item_id`、`rule_type` 和 `prompt` 均需填写，否则该条无效。

---

# 实验性功能

实验性功能，默认全部关闭。

```toml
[experimental]
enable_behavior_learning = false
enable_replyer_format_output = false
focus_mode = false
focus_on_private = false
focus_groups = []
focus_cool_time = 120
```

**`enable_behavior_learning`** — 启用行为学习。**类型**：`bool`。**默认值**：`false`。关闭后不再从裁切历史中抽取和写入行为经验。

**`enable_replyer_format_output`** — Replyer 格式化输出。**类型**：`bool`。**默认值**：`false`。允许 replyer 输出 `<text>`、`<at>`、`<emoji>`、`<image>` 等格式化片段，并在发送前解析为真实消息组件，可能影响回复表现。

**`focus_mode`** — Focus 模式。**类型**：`bool`。**默认值**：`false`。开启后同一时间只有一个 Maisaka 处于活跃关注状态，忽略聊天频率控制。

**`focus_on_private`** — 私聊启用 Focus。**类型**：`bool`。**默认值**：`false`。关闭时 Focus 仅作用于群聊。

**`focus_groups`** — Focus 互通组。**类型**：`list[ChatStreamGroup]`。**默认值**：`[]`。不配置时所有启用 Focus 的聊天共享一个 Focus；配置后同组互通，不同组可同时 Focus。

**`focus_cool_time`** — Focus 冷却时间。**类型**：`int`。**默认值**：`120`。**单位**：秒。Focus 超过该秒数没有进入循环时，会被其他聊天的新消息唤醒一次。

---

# 消息接收

控制图片解析和消息过滤。

```toml
[message_receive]
image_parse_threshold = 5
ban_words = []
ban_msgs_regex = []
```

**`image_parse_threshold`** — 图片解析阈值。**类型**：`int`。**默认值**：`5`。消息中图片数量不超过此值启用图片解析，超过则跳过。

**`ban_words`** — 过滤词列表。**类型**：`set[str]`。**默认值**：`{}`。包含这些词汇的消息会被过滤。

**`ban_msgs_regex`** — 过滤正则列表。**类型**：`set[str]`。**默认值**：`{}`。正则非法会导致配置校验失败。

---

# 记忆

A_Memorix 是 MaiBot 的长期记忆系统，负责记忆存储、向量化、检索、人物画像、记忆演化和 Web 运维。

完整说明（12 个子段落）请移步 → **[A_Memorix 配置详解](./amemorix-config.md)**

```toml
# 快速启用
[a_memorix]

[a_memorix.plugin]
enabled = true
```

---

# 表达学习

控制表达方式学习、AI 审核和互通组。

```toml
[expression]
expression_checked_only = true
expression_self_reflect = true
enable_precise_expression_selection = false
max_expression_learner = 3
learning_list = []
expression_groups = []
```

**`expression_checked_only`** — 仅选择已人工检查的表达。**类型**：`bool`。**默认值**：`true`。

**`expression_self_reflect`** — 表达学习 AI 审核。**类型**：`bool`。**默认值**：`true`。写入前进行 AI 审核。

**`enable_precise_expression_selection`** — 精细表达选择。**类型**：`bool`。**默认值**：`false`。replyer 用子代理挑选更贴合语境的表达。

**`max_expression_learner`** — 表达学习批次数上限。**类型**：`int`。**默认值**：`3`。同一聊天流始终只允许一个批次。

**`learning_list`** — 表达学习配置列表。**类型**：`list[LearningItem]`。**默认值**：`[]`。

**`expression_groups`** — 表达学习互通组。**类型**：`list[ChatStreamGroup]`。**默认值**：`[]`。组内的表达学习结果共享。

### learning_list

```toml
[[expression.learning_list]]
platform = ""
item_id = ""
type = "group"
use = true
learn = true
```

`platform` / `item_id` 留空表示全局规则。`type` 可选 `"group"` / `"private"`。

---

# 黑话

控制黑话学习和互通组。`platform` 或 `item_id` 可使用 `*` 通配。

```toml
[jargon]
learning_list = []
jargon_groups = []
```

**`learning_list`** — 黑话学习配置列表。**类型**：`list[LearningItem]`。**默认值**：`[]`。

**`jargon_groups`** — 黑话学习互通组。**类型**：`list[ChatStreamGroup]`。**默认值**：`[]`。

### learning_list

字段含义与 [expression.learning_list](#_5-1-learning-list) 相同。

---

# 语音

```toml
[voice]
enable_asr = false
```

**`enable_asr`** — 启用语音识别。**类型**：`bool`。**默认值**：`false`。

---

# 表情包

```toml
[emoji]
emoji_send_num = 25
max_reg_num = 64
do_replace = true
check_interval = 10
steal_emoji = true
content_filtration = false
```

**`emoji_send_num`** — 表情包发送选择数。**类型**：`int`。**默认值**：`25`。取值范围：`1-64`。

**`max_reg_num`** — 表情包最大注册数。**类型**：`int`。**默认值**：`64`。

**`do_replace`** — 满额后替换旧表情包。**类型**：`bool`。**默认值**：`true`。关闭则达到上限后不再收集。

**`check_interval`** — 表情包检查间隔。**类型**：`int`。**默认值**：`10`。**单位**：分钟。

**`steal_emoji`** — 偷取聊天中的表情包。**类型**：`bool`。**默认值**：`true`。

**`content_filtration`** — 表情包过滤。**类型**：`bool`。**默认值**：`false`。

---

# 关键词反应

```toml
[[keyword_reaction.keyword_rules]]
keywords = ["关键词"]
reaction = "触发后的反应"

[[keyword_reaction.regex_rules]]
regex = ["^正则.*"]
reaction = "触发后的反应"
```

每个规则包含 `keywords` / `regex` 列表和 `reaction` 触发回复内容。

---

# 回复后处理

```toml
[response_post_process]
enable_response_post_process = true
```

**`enable_response_post_process`** — 启用回复后处理总开关。**类型**：`bool`。**默认值**：`true`。关闭后错别字生成器和回复分割器均不生效。

---

# 中文错别字

```toml
[chinese_typo]
enable = true
error_rate = 0.01
min_freq = 9
tone_error_rate = 0.1
word_replace_rate = 0.006
```

**`enable`** — 启用错别字生成。**类型**：`bool`。**默认值**：`true`。

**`error_rate`** — 单字替换概率。**类型**：`float`。**默认值**：`0.01`。取值范围：`0-1`。

**`min_freq`** — 最小字频阈值。**类型**：`int`。**默认值**：`9`。

**`tone_error_rate`** — 声调错误概率。**类型**：`float`。**默认值**：`0.1`。取值范围：`0-1`。

**`word_replace_rate`** — 整词替换概率。**类型**：`float`。**默认值**：`0.006`。取值范围：`0-1`。

---

# 回复分割

```toml
[response_splitter]
enable = true
max_length = 512
max_sentence_num = 8
max_split_num = 3
enable_kaomoji_protection = false
enable_overflow_return_all = false
```

**`enable`** — 启用回复分割。**类型**：`bool`。**默认值**：`true`。

**`max_length`** — 单条回复最大字符数。**类型**：`int`。**默认值**：`512`。

**`max_sentence_num`** — 单条回复最大句子数。**类型**：`int`。**默认值**：`8`。

**`max_split_num`** — 最多分割条数。**类型**：`int`。**默认值**：`3`。

**`enable_kaomoji_protection`** — 颜文字保护。**类型**：`bool`。**默认值**：`false`。开启后分割时保护颜文字不被拆分。

**`enable_overflow_return_all`** — 超出上限时一次性返回全部。**类型**：`bool`。**默认值**：`false`。

---

# 日志

```toml
[log]
date_style = "m-d H:i:s"
log_level_style = "lite"
color_text = "full"
log_level = "INFO"
console_log_level = "INFO"
file_log_level = "DEBUG"
log_file_max_bytes = 5242880
max_log_files = 30
log_cleanup_days = 30
llm_request_snapshot_limit = 128
maisaka_prompt_preview_limit = 256
maisaka_reply_effect_limit = 256
suppress_libraries = ["faiss", "httpx", "urllib3", "asyncio", "websockets", "httpcore", "requests", "sqlalchemy", "openai", "uvicorn", "jieba"]
library_log_levels = {"aiohttp" = "WARNING", "PIL" = "WARNING"}
```

**`date_style`** — 日期格式。**类型**：`str`。**默认值**：`"m-d H:i:s"`。

**`log_level_style`** — 日志等级显示样式。**类型**：`str`（枚举）。**默认值**：`"lite"`。**可选值**：`"lite"` / `"compact"` / `"full"`。

**`color_text`** — 控制台颜色模式。**类型**：`str`（枚举）。**默认值**：`"full"`。**可选值**：`"none"` / `"title"` / `"full"`。

**`log_level`** — 全局日志级别。**类型**：`str`（枚举）。**默认值**：`"INFO"`。

**`console_log_level`** — 控制台日志级别。**类型**：`str`（枚举）。**默认值**：`"INFO"`。

**`file_log_level`** — 文件日志级别。**类型**：`str`（枚举）。**默认值**：`"DEBUG"`。

**`log_file_max_bytes`** — 单个日志文件最大字节数。**类型**：`int`。**默认值**：`5242880`（5MB）。

**`max_log_files`** — 最多保留主日志文件数。**类型**：`int`。**默认值**：`30`。

**`log_cleanup_days`** — 主日志文件保留天数。**类型**：`int`。**默认值**：`30`。

**`llm_request_snapshot_limit`** — 失败请求快照最多保留数。**类型**：`int`。**默认值**：`128`。

**`maisaka_prompt_preview_limit`** — 每个会话最多保留的 Maisaka Prompt 预览组数。**类型**：`int`。**默认值**：`256`。

**`maisaka_reply_effect_limit`** — 每个会话最多保留的回复效果记录数。**类型**：`int`。**默认值**：`256`。

**`suppress_libraries`** — 完全屏蔽日志的第三方库。**类型**：`list[str]`。**默认值**：包含 11 个库。

**`library_log_levels`** — 特定第三方库的日志级别。**类型**：`dict[str, str]`。**默认值**：`{"aiohttp" = "WARNING", "PIL" = "WARNING"}`。

---

# 遥测

```toml
[telemetry]
enable = true
```

**`enable`** — 启用遥测。**类型**：`bool`。**默认值**：`true`。

---

# 调试

```toml
[debug]
show_maisaka_thinking = true
show_jargon_prompt = false
show_memory_prompt = false
enable_reply_effect_tracking = false
record_reply_request = false
record_planner_request = false
enable_llm_cache_stats = false
```

**`show_maisaka_thinking`** — 显示回复器推理。**类型**：`bool`。**默认值**：`true`。

**`show_jargon_prompt`** — 显示黑话提示词。**类型**：`bool`。**默认值**：`false`。

**`show_memory_prompt`** — 显示记忆检索 prompt。**类型**：`bool`。**默认值**：`false`。

**`enable_reply_effect_tracking`** — 回复效果评分追踪。**类型**：`bool`。**默认值**：`false`。

**`record_reply_request`** — 记录 Replyer 请求体。**类型**：`bool`。**默认值**：`false`。

**`record_planner_request`** — 记录 Planner 完整请求和回复。**类型**：`bool`。**默认值**：`false`。

**`enable_llm_cache_stats`** — 记录 LLM prompt cache 统计。**类型**：`bool`。**默认值**：`false`。

---

# 消息服务

```toml
[maim_message]
ws_server_host = "127.0.0.1"
ws_server_port = 8000
auth_token = []
enable_api_server = false
api_server_host = "0.0.0.0"
api_server_port = 8090
api_server_use_wss = false
api_server_cert_file = ""
api_server_key_file = ""
api_server_allowed_api_keys = []
```

**`ws_server_host`** — 旧版 WS 服务器主机。**类型**：`str`。**默认值**：`"127.0.0.1"`。

**`ws_server_port`** — 旧版 WS 服务器端口。**类型**：`int`。**默认值**：`8000`。

**`auth_token`** — 认证令牌列表。**类型**：`list[str]`。**默认值**：`[]`。为空不启用验证。

**`enable_api_server`** — 启用新版 API Server。**类型**：`bool`。**默认值**：`false`。

**`api_server_host`** — 新版 API Server 主机。**类型**：`str`。**默认值**：`"0.0.0.0"`。

**`api_server_port`** — 新版 API Server 端口。**类型**：`int`。**默认值**：`8090`。

**`api_server_use_wss`** — 启用 WSS。**类型**：`bool`。**默认值**：`false`。

**`api_server_cert_file`** — SSL 证书路径。**类型**：`str`。**默认值**：`""`。

**`api_server_key_file`** — SSL 密钥路径。**类型**：`str`。**默认值**：`""`。

**`api_server_allowed_api_keys`** — 允许的 API Key 列表。**类型**：`list[str]`。**默认值**：`[]`。为空允许所有连接。

---

# WebUI

```toml
[webui]
enabled = true
host = "127.0.0.1"
port = 8001
mode = "production"
anti_crawler_mode = "basic"
allowed_ips = "127.0.0.1"
trusted_proxies = ""
trust_xff = false
secure_cookie = false
enforce_public_outbound_url = true
enable_paragraph_content = false
```

**`enabled`** — 启用 WebUI。**类型**：`bool`。**默认值**：`true`。

**`host`** — 绑定主机。**类型**：`str`。**默认值**：`"127.0.0.1"`。

**`port`** — 绑定端口。**类型**：`int`。**默认值**：`8001`。

**`mode`** — 运行模式。**类型**：`str`（枚举）。**默认值**：`"production"`。**可选值**：`"development"` / `"production"`。

**`anti_crawler_mode`** — 防爬虫模式。**类型**：`str`。**默认值**：`"basic"`。**可选值**：`false` / `"strict"` / `"loose"` / `"basic"`。

**`allowed_ips`** — IP 白名单。**类型**：`str`。**默认值**：`"127.0.0.1"`。逗号分隔，支持 CIDR 和通配符。

**`trusted_proxies`** — 信任的代理 IP。**类型**：`str`。**默认值**：`""`。逗号分隔。

**`trust_xff`** — 启用 X-Forwarded-For。**类型**：`bool`。**默认值**：`false`。

**`secure_cookie`** — 启用安全 Cookie。**类型**：`bool`。**默认值**：`false`。仅 HTTPS 传输。

**`enforce_public_outbound_url`** — 强制公网出站 URL 校验。**类型**：`bool`。**默认值**：`true`。关闭后允许内网 / TUN 代理地址。

**`enable_paragraph_content`** — 加载段落完整内容。**类型**：`bool`。**默认值**：`false`。会占用额外内存。

---

# 数据库

```toml
[database]
save_binary_data = false
```

**`save_binary_data`** — 保存二进制数据。**类型**：`bool`。**默认值**：`false`。开启后消息中的语音等二进制数据保存为独立文件，二次识别可用但数据文件夹体积增大。仅影响新存储的消息。

---

# MCP

```toml
[mcp]
enable = true
```

**`enable`** — 启用 MCP。**类型**：`bool`。**默认值**：`true`。

详细说明（服务器配置、Sampling、Roots、Elicitation）请移步 → **[MCP 配置详解](./mcp-config.md)**

---

# 插件管理

```toml
[plugin]
permission = []
```

**`permission`** — 插件管理权限列表。**类型**：`list[str]`。**默认值**：`[]`。格式：`platform:id`，如 `"qq:123456789"`。

---

# 插件运行时

```toml
[plugin_runtime]
enabled = true
health_check_interval_sec = 30.0
max_restart_attempts = 3
runner_spawn_timeout_sec = 30.0
hook_blocking_timeout_sec = 60
ipc_socket_path = ""
```

**`enabled`** — 启用插件系统。**类型**：`bool`。**默认值**：`true`。

**`health_check_interval_sec`** — 健康检查间隔。**类型**：`float`。**默认值**：`30.0`。**单位**：秒。

**`max_restart_attempts`** — Runner 崩溃后最大自动重启次数。**类型**：`int`。**默认值**：`3`。

**`runner_spawn_timeout_sec`** — Runner 启动超时。**类型**：`float`。**默认值**：`30.0`。**单位**：秒。

**`hook_blocking_timeout_sec`** — Hook 阻塞全局超时。**类型**：`float`。**默认值**：`60`。**单位**：秒。

**`ipc_socket_path`** — 自定义 IPC Socket 路径。**类型**：`str`。**默认值**：`""`。仅 Linux/macOS 生效，留空自动生成。

---

## 配置文件总览

`bot_config.toml` 顶层包含以下段落（按一级键分类）：

- **`[bot]`** — 机器人身份、平台、昵称、别名
- **`[personality]`** — 人设和回复风格
- **`[visual]`** — 图片理解模式和识图提示词
- **`[chat]`** — 回复频率、上下文、聊天提示词、退避策略
- **`[experimental]`** — 实验性功能（行为学习、Focus 模式）
- **`[message_receive]`** — 图片解析阈值、消息过滤
- **`[a_memorix]`** — 长期记忆系统 → [详见 A_Memorix 配置](./amemorix-config.md)
- **`[expression]`** — 表达学习、表达检查、互通组
- **`[jargon]`** — 黑话学习、黑话互通组
- **`[voice]`** — 语音识别
- **`[emoji]`** — 表情包收集、过滤、发送
- **`[keyword_reaction]`** — 关键词 / 正则触发反应
- **`[response_post_process]`** — 回复后处理总开关
- **`[chinese_typo]`** — 中文错别字生成
- **`[response_splitter]`** — 回复分割
- **`[log]`** — 日志级别、格式、文件保留策略
- **`[telemetry]`** — 遥测开关
- **`[debug]`** — 调试显示和追踪
- **`[maim_message]`** — maim_message WebSocket / API Server
- **`[webui]`** — WebUI 服务和安全设置
- **`[database]`** — 消息二进制数据保存策略
- **`[mcp]`** — MCP 客户端和服务器配置 → [详见 MCP 配置](./mcp-config.md)
- **`[plugin]`** — 插件管理权限
- **`[plugin_runtime]`** — 插件运行时和浏览器渲染配置

::: tip
配置文件开头的 `[inner] version` 由程序管理，普通用户不需要手动修改。
:::

---

## 下一步

- 配置模型：看 [模型配置](./model-config.md)
- 模型高级参数：看 [模型额外参数](./model-extra-params.md)
- 连接 QQ：看 [NapCat 适配器](../adapters/napcat.md)
- 管理 WebUI：[WebUI 配置管理](../webui/config-management.md)
- 记忆系统详解：[A_Memorix 配置](./amemorix-config.md)
- MCP 配置详解：[MCP 配置](./mcp-config.md)
