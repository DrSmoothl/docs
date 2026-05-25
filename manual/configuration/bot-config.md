---
title: Bot 配置
---

# Bot 配置

`bot_config.toml` 是 MaiBot 的主配置文件，包含机器人身份、人设、聊天行为、记忆、表达学习、黑话、消息连接、WebUI、MCP、插件和知识库等设置。

当前文档按代码中的 `src/config/official_configs.py` 和 `src/config/config.py` 整理。配置文件由 MaiBot 自动生成和升级，不建议手动新增不存在的字段。

## 配置文件结构

`bot_config.toml` 顶层包含以下主要段落：

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

## 基本信息 [bot]

`[bot]` 是机器人的身份信息。最常用的是 `platform`、`qq_account`、`nickname` 和 `alias_names`。

```toml
[bot]
platform = "qq"
qq_account = "123456789"
platforms = []
nickname = "麦麦"
alias_names = ["小麦", "麦子"]
```

- **`platform`** — 当前主要平台标识，例如 qq。默认为空
- **`qq_account`** — 机器人登录的 QQ 号（字符串），用于识别 @ 和自身消息。默认为空
- **`platforms`** — 其他平台标识列表，多平台场景使用。默认为空
- **`nickname`** — 机器人昵称。默认 `麦麦`
- **`alias_names`** — 机器人别名，被提及时可参与回复判断。默认为空

## 人格 [personality]

`[personality]` 控制 MaiBot 的人设和语言风格。

```toml
[personality]
personality = "你是一个大二女大学生，现在正在上网和群友聊天。"
reply_style = "请不要刻意突出自身学科背景。可以参考贴吧，知乎和微博的回复风格。"
multiple_reply_style = [
  "你的风格平淡但不失讽刺，很简短,很白话。可以参考贴吧，微博的回复风格。",
  "用1-2个字进行回复",
  "用1-2个符号进行回复",
  "言辭凝練古雅，穿插《論語》經句卻不晦澀，以文言短句為基，輔以淺白語意，持長者溫和風範，全用繁體字表達，具先秦儒者談吐韻致。",
  "带点翻译腔，但不要太长",
]
multiple_probability = 0
```

- **`personality`** — 人格设定，建议 100 字以内，描述身份和人格特质。见默认配置
- **`reply_style`** — 默认表达风格，建议 1-2 行。见默认配置
- **`multiple_reply_style`** — 可选表达风格列表，不为空时可随机替换 reply_style。5 条备选风格
- **`multiple_probability`** — 随机使用 multiple_reply_style 的概率，范围 0.0-1.0。默认 0

## 视觉 [visual]

`[visual]` 控制图片消息进入规划器和回复器时的处理模式。

```toml
[visual]
planner_mode = "auto"
replyer_mode = "auto"
```

识图提示词由 Prompt 模板 `prompts/<locale>/image_description.prompt` 管理。

- **`planner_mode`** — 规划器视觉模式，可选 text、multimodal 或 auto；auto 会根据模型信息自动选择。默认 `auto`
- **`replyer_mode`** — 回复器视觉模式，可选 text、multimodal 或 auto；auto 会根据模型信息自动选择。默认 `auto`
- **`wait_image_recognize_max_time`** — 非视觉 planner 请求前等待图片识别完成的最长秒数；0 时不等待，保持占位请求。默认 10

## 聊天 [chat]

`[chat]` 控制回复频率、上下文长度、群聊/私聊提示词，以及按时间和聊天流动态调整发言频率。

```toml
[chat]
talk_value = 1.0
private_talk_value = 1.0
mentioned_bot_reply = false
inevitable_at_reply = true
enable_at = true
enable_reply_quote = true
max_context_size = 40
max_private_context_size = 60
enable_context_optimization = true
mid_term_memory = true
mid_term_memory_lenth = 5
enable_independent_timing_gate = true
typing_speed = 1.0
planner_interrupt_max_consecutive_count = 0
timing_gate_non_continue_cooldown_seconds = 8
group_chat_prompt = "..."
private_chat_prompts = "..."
chat_prompts = []
enable_talk_value_rules = true
```

- **`talk_value`** — 聊天频率，越小越沉默，范围 0-1。默认 1.0
- **`private_talk_value`** — 私聊聊天频率，越小越沉默，范围 0-1。默认 1.0
- **`mentioned_bot_reply`** — 是否在普通文本提到机器人名字时倾向回复。默认关闭
- **`inevitable_at_reply`** — 是否在被 @ 时必回复。默认开启
- **`enable_at`** — 是否允许使用 at 标记。默认开启
- **`enable_reply_quote`** — 回复时是否附带引用回复。默认开启
- **`max_context_size`** — 发送给模型的群聊上下文消息数量。默认 40
- **`max_private_context_size`** — 私聊上下文长度。默认 60
- **`enable_context_optimization`** — 是否优化约 50% 的 Planner 上下文消耗，可能影响缓存。默认开启
- **`mid_term_memory`** — 上下文裁切时是否使用 utils 模型生成中期聊天摘要，并作为可展开复杂消息保留。默认开启
- **`mid_term_memory_lenth`** — 最多保留的中期聊天摘要消息数；超出后移除最早一条。默认 5
- **`enable_independent_timing_gate`** — 是否启用独立 Timing Gate；关闭后节奏控制工具合并到 Planner。默认开启
- **`typing_speed`** — 模拟打字时间倍乘，0 不等待，1 默认等待时间，2 两倍。默认 1.0
- **`planner_interrupt_max_consecutive_count`** — Planner 连续被新消息打断的最大次数，0 表示不启用打断。默认 0
- **`timing_gate_non_continue_cooldown_seconds`** — Timing Gate 判断频率平滑值，值越大判断越平滑但可能反应变慢。默认 8
- **`group_chat_prompt`** — 群聊通用注意事项。见默认配置
- **`private_chat_prompts`** — 私聊通用注意事项。见默认配置
- **`chat_prompts`** — 按平台/聊天流附加的额外提示词。默认为空
- **`enable_talk_value_rules`** — 是否启用动态发言频率规则。默认开启
- **`talk_value_rules`** — 按聊天流和时间段调整 talk_value。两条默认规则

### talk_value_rules

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

- **`platform`** — 平台；和 item_id 一起留空表示全局
- **`item_id`** — 用户/群 ID；和 platform 一起留空表示全局
- **`rule_type`** — 聊天流类型，group 或 private
- **`time`** — 时间段，格式 `HH:MM-HH:MM`，支持跨夜
- **`value`** — 该时间段的聊天频率，范围 0-1

### chat_prompts

```toml
[[chat.chat_prompts]]
platform = "qq"
item_id = "123456"
rule_type = "group"
prompt = "这个群里说话要更简短。"
```

`platform`、`item_id` 和 `prompt` 都需要填写，否则该条额外提示词无效。

## 消息接收 [message_receive]

`[message_receive]` 控制图片解析和消息过滤。

- **`image_parse_threshold`** — 单条消息图片数量不超过该阈值时解析图片，超过时跳过解析。默认 5
- **`ban_words`** — 过滤词列表。默认为空
- **`ban_msgs_regex`** — 过滤正则表达式列表；正则非法会导致配置校验失败。默认为空

## 记忆 [a_memorix]

A_Memorix 是 MaiBot 的长期记忆系统，负责记忆存储、向量化、检索、人物画像、记忆演化和 Web 运维。它替代了旧版 `[memory]` 配置段落，提供了更细粒度的控制。

A_Memorix 配置包含 12 个子段落（integration、plugin、storage、embedding、retrieval、threshold、filter、episode、person_profile、memory、advanced、web），由于配置项较多，完整说明请移步：

→ **[A_Memorix 配置详解](./amemorix-config.md)**

### 快速启用

最简单的配置——仅启用记忆系统并使用全部默认值：

```toml
[a_memorix]

[a_memorix.plugin]
enabled = true
```

### 从旧版 [memory] 迁移

如果你之前使用过 `[memory]`，请参阅 [A_Memorix 配置详解 - 从旧版迁移](./amemorix-config.md#从旧版-memory-迁移)。

## 表达学习 [expression]

`[expression]` 控制表达方式学习、表达方式自动检查和互通组。

- **`expression_checked_only`** — 是否仅选择已由用户人工检查的表达方式。默认开启
- **`expression_self_reflect`** — 是否在表达学习写入前进行 AI 审核。默认开启
- **`enable_precise_expression_selection`** — 是否启用精细表达选择；开启后 replyer 使用子代理从候选表达中挑选更贴合语境的表达方式。默认关闭
- **`max_expression_learner`** — 所有聊天流合计允许同时运行的表达学习批次数；同一聊天流始终只允许一个批次。默认 3
- **`learning_list`** — 按聊天流配置表达学习。1 条默认规则
- **`expression_groups`** — 表达学习互通组。默认为空

### learning_list

```toml
[[expression.learning_list]]
platform = ""
item_id = ""
type = "group"
use = true
learn = true
```

- **`platform`** — 平台；和 item_id 一起留空表示全局
- **`item_id`** — 用户/群 ID；和 platform 一起留空表示全局
- **`type`** — 聊天流类型，group 或 private
- **`use`** — 是否使用表达学习结果
- **`learn`** — 是否启用表达优化学习

## 黑话 [jargon]

`[jargon]` 控制黑话学习和黑话互通组，从旧版 `[expression]` 中独立出来。

- **`learning_list`** — 按聊天流配置黑话学习，platform 或 item_id 可使用 `*` 通配。1 条默认规则
- **`jargon_groups`** — 黑话学习互通组，默认不互通。默认为空

### learning_list

```toml
[[jargon.learning_list]]
platform = ""
item_id = ""
type = "group"
use = true
learn = true
```

`LearningItem` 字段与 [expression.learning_list](#learning-list) 相同。

## 语音 [voice]

- **`enable_asr`** — 是否启用语音识别，启用后可识别语音消息。见默认配置

## 表情包 [emoji]

- **`emoji_send_num`** — 一次从多少个表情包中选择发送，最大 64
- **`max_reg_num`** — 表情包最大注册数量
- **`do_replace`** — 达到最大注册数量时是否替换旧表情包
- **`check_interval`** — 表情包检查间隔，单位分钟
- **`steal_emoji`** — 是否收集聊天中的表情包
- **`content_filtration`** — 是否启用表情包过滤

## 关键词反应 [keyword_reaction]

```toml
[[keyword_reaction.keyword_rules]]
keywords = ["关键词"]
reaction = "触发后的反应"

[[keyword_reaction.regex_rules]]
regex = ["^正则.*"]
reaction = "触发后的反应"
```

- **`keyword_rules`** — 关键词规则列表
- **`regex_rules`** — 正则表达式规则列表

`KeywordRuleConfig` 字段：

- **`keywords`** — 关键词列表
- **`regex`** — 正则表达式列表
- **`reaction`** — 关键词或正则触发后的反应

## 回复后处理

### response_post_process

- **`enable_response_post_process`** — 是否启用回复后处理，包括错别字生成器和回复分割器

### chinese_typo

- **`enable`** — 是否启用中文错别字生成器
- **`error_rate`** — 单字替换概率
- **`min_freq`** — 最小字频阈值
- **`tone_error_rate`** — 声调错误概率
- **`word_replace_rate`** — 整词替换概率

### log

`[log]` 控制日志输出格式、级别和文件管理。

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
library_log_levels = { aiohttp = "WARNING" }
```

- **`date_style`** — 日志日期格式。默认 `m-d H:i:s`
- **`log_level_style`** — 日志等级显示样式，可选 lite、compact 或 full。默认 `lite`
- **`color_text`** — 控制台日志颜色模式，可选 none、title 或 full。默认 `full`
- **`log_level`** — 全局日志级别，可选 DEBUG、INFO、WARNING、ERROR 或 CRITICAL。默认 `INFO`
- **`console_log_level`** — 控制台日志级别。默认 `INFO`
- **`file_log_level`** — 文件日志级别。默认 `DEBUG`
- **`log_file_max_bytes`** — 单个日志文件最大字节数，默认 5MB。默认 5242880
- **`max_log_files`** — 最多保留的主日志文件数量。默认 30
- **`log_cleanup_days`** — 主日志文件保留天数。默认 30
- **`llm_request_snapshot_limit`** — 失败请求快照最多保留数量。默认 128
- **`maisaka_prompt_preview_limit`** — 每个会话最多保留的 Maisaka Prompt 预览组数。默认 256
- **`maisaka_reply_effect_limit`** — 每个会话最多保留的 Maisaka 回复效果记录数。默认 256
- **`suppress_libraries`** — 完全屏蔽日志的第三方库列表。11 个库
- **`library_log_levels`** — 特定第三方库的日志级别。默认 `{"aiohttp": "WARNING"}`

### response_splitter

- **`enable`** — 是否启用回复分割器
- **`max_length`** — 回复允许的最大长度
- **`max_sentence_num`** — 回复允许的最大句子数
- **`enable_kaomoji_protection`** — 是否启用颜文字保护
- **`enable_overflow_return_all`** — 句子数量超出上限时是否一次性返回全部内容

## 遥测与调试

### telemetry

- **`enable`** — 是否启用遥测

### debug

- **`show_maisaka_thinking`** — 是否显示回复器推理。默认开启
- **`fold_maisaka_thinking`** — 是否折叠 Maisaka prompt 展示入口。默认开启
- **`show_jargon_prompt`** — 是否显示黑话相关提示词。默认关闭
- **`show_memory_prompt`** — 是否显示记忆检索相关 prompt。默认关闭
- **`enable_reply_effect_tracking`** — 是否开启回复效果评分追踪。默认关闭
- **`record_reply_request`** — 是否记录 Replyer 请求体。默认关闭
- **`record_planner_request`** — 是否记录 Planner 完整请求体和完整回复体。默认关闭
- **`enable_llm_cache_stats`** — 是否记录 LLM prompt cache 调试统计。默认关闭

## 消息服务 [maim_message]

`[maim_message]` 同时包含旧版 WebSocket 服务和额外新版 API Server 的配置。

- **`ws_server_host`** — 旧版 WebSocket 服务器主机地址。默认 `127.0.0.1`
- **`ws_server_port`** — 旧版 WebSocket 服务器端口。默认 8000
- **`auth_token`** — 旧版 API 验证令牌，为空则不启用验证。默认为空
- **`enable_api_server`** — 是否启用额外新版 API Server。见默认配置
- **`api_server_host`** — 新版 API Server 主机地址。见默认配置
- **`api_server_port`** — 新版 API Server 端口。见默认配置
- **`api_server_use_wss`** — 新版 API Server 是否启用 WSS。见默认配置
- **`api_server_cert_file`** — SSL 证书文件路径。默认为空
- **`api_server_key_file`** — SSL 密钥文件路径。默认为空
- **`api_server_allowed_api_keys`** — 允许的 API Key 列表，为空则允许所有连接。默认为空

## WebUI [webui]

- **`enabled`** — 是否启用 WebUI。默认开启
- **`host`** — WebUI 绑定主机地址。默认 `127.0.0.1`
- **`port`** — WebUI 绑定端口。默认 8001
- **`mode`** — WebUI 运行模式，可选 development 或 production。默认 `production`
- **`anti_crawler_mode`** — 防爬虫模式，可选 false、strict、loose 或 basic。默认 `basic`
- **`allowed_ips`** — IP 白名单，逗号分隔，支持精确 IP、CIDR 和通配符。默认 `127.0.0.1`
- **`trusted_proxies`** — 信任的代理 IP 列表。默认为空
- **`trust_xff`** — 是否启用 X-Forwarded-For 代理解析。默认关闭
- **`secure_cookie`** — 是否启用安全 Cookie，仅 HTTPS 传输。默认关闭
- **`enforce_public_outbound_url`** — 是否要求 WebUI 出站 URL 解析到公网地址；关闭后允许内网、本机或 TUN 代理地址，用于内网 LLM、反向代理等场景。默认开启
- **`enable_paragraph_content`** — 是否在知识图谱中加载段落完整内容，会占用额外内存。默认关闭

## 数据库 [database]

- **`save_binary_data`** — 是否将语音等二进制数据保存为独立文件；只影响新存储的消息。默认关闭

## MCP [mcp]

`[mcp]` 控制 MaiBot 的 MCP 客户端宿主能力和外部 MCP 服务器连接，让 MaiBot 能够调用各种外部工具。

详细的 MCP 配置指南请移步 → [MCP 配置详解](./mcp-config.md)

- **`enable`** — 是否启用 MCP
- **`client`** — MCP 客户端宿主能力配置
- **`servers`** — MCP 服务器配置列表

### 快速示例

最简单的配置——连接一个 Playwright MCP 服务：

```toml
[mcp]
enable = true

[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]
```

连接远程 HTTP 服务（带 Bearer 认证）：

```toml
[[mcp.servers]]
name = "remote-api"
transport = "streamable_http"
url = "https://mcp.example.com/api"

[mcp.servers.authorization]
mode = "bearer"
bearer_token = "sk-your-token"
```

连接远程 SSE 服务：

```toml
[[mcp.servers]]
name = "remote-sse"
transport = "sse"
url = "https://mcp.example.com/sse"
```

::: tip 🛠️ 更多配置方式
详细的字段说明、传输方式对比、Sampling/Roots/Elicitation 高级配置、常见问题解答，请参阅 [MCP 配置详解](./mcp-config.md)。
:::

## 插件管理 [plugin]

`[plugin]` 控制插件管理权限。

- **`permission`** — 允许使用内置插件管理命令的用户 ID 列表，格式为 `platform:id`，例如 `qq:123456789`。默认为空

## 插件运行时 [plugin_runtime]

`[plugin_runtime]` 控制插件 Runner 和插件运行时浏览器渲染能力。

- **`enabled`** — 是否启用插件系统
- **`health_check_interval_sec`** — 健康检查间隔
- **`max_restart_attempts`** — Runner 崩溃后最大自动重启次数
- **`runner_spawn_timeout_sec`** — 等待 Runner 子进程启动并注册的超时时间
- **`hook_blocking_timeout_sec`** — Hook 阻塞步骤的全局超时上限
- **`ipc_socket_path`** — 自定义 IPC Socket 路径，仅 Linux/macOS 生效；留空自动生成

### plugin_runtime.render

- **`enabled`** — 是否启用插件运行时浏览器渲染能力
- **`browser_ws_endpoint`** — 优先复用的现有 Chromium CDP 地址
- **`executable_path`** — 浏览器可执行文件路径，留空自动探测
- **`browser_install_root`** — Playwright 托管浏览器目录
- **`headless`** — 是否以无头模式启动浏览器
- **`launch_args`** — 浏览器启动参数
- **`concurrency_limit`** — 同时允许进行的最大渲染任务数
- **`startup_timeout_sec`** — 浏览器连接或启动超时时间
- **`render_timeout_sec`** — 单次渲染默认超时时间
- **`auto_download_chromium`** — 未检测到可用浏览器时是否自动下载 Playwright Chromium
- **`download_connection_timeout_sec`** — 自动下载 Chromium 时的连接超时时间
- **`restart_after_render_count`** — 累计渲染指定次数后自动重建浏览器，0 表示关闭

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
