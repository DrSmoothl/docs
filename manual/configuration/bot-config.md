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
- **`[A_memorix]`** — 长期记忆系统（存储、向量化、检索、画像、演化等）→ [详见 A_Memorix 配置](./amemorix-config.md)
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
# 图片超过该大小(MB)视为过大，0 不限制
max_image_size_mb = 30.0
# 过大图片处理方法：compress(压缩) / discard(丢弃)
oversized_image_handle_method = "compress"
```

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
# 模拟打字时间倍乘：0=不等待, 1=默认, 2=两倍, 范围 0-2
typing_speed = 1.0
# Planner 连续被打断的最大次数，0 表示不启用打断
planner_interrupt_max_consecutive_count = 0
# Timing Gate 判断频率平滑值，越大判断越平滑但反应可能变慢
timing_gate_non_continue_cooldown_seconds = 8
# 群聊通用注意事项
group_chat_prompt = "你正在qq群里聊天，下面是群里正在聊的内容，其中包含聊天记录和聊天中的图片和表情包。\n回复尽量简短一些。最好一次对一个话题进行回复，但必须考虑不同群友发言之间的交互，免得啰嗦或者回复内容太乱。请注意把握聊天内容。\n不要总是提及自己的身份背景，根据聊天内容自由发挥，但是要日常不浮夸，不要刻意找话题，。\n不用刻意回复其他人发送的表情包，只要关注表情包表达的含义。你可以适当发送表情包表达情绪。控制回复的频率，不要每个人的消息都回复，优先回复你感兴趣的或者主动提及你的，适当回复其他话题。\n"
# 私聊通用注意事项
private_chat_prompts = "你正在聊天，下面是正在聊的内容，其中包含聊天记录和聊天中的图片。\n回复尽量简短一些。请注意把握聊天内容。\n请考虑对方的发言频率，想法，思考自己何时回复以及回复内容。\n"
# 按平台/聊天流附加的额外提示词列表
chat_prompts = []
# 是否启用动态发言频率规则
enable_talk_value_rules = true
```

> 以上为默认配置。`group_chat_prompt` 和 `private_chat_prompts` 有较长的默认文本，生成配置文件时会自动填充完整内容。

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


## 长期记忆 [A_memorix]

**说明**：A_Memorix 是 MaiBot 的长期记忆系统，负责记忆存储、向量化、检索、人物画像、记忆演化和 Web 运维。它替代了旧版 `[memory]` 配置段落，提供了更细粒度的控制。

A_Memorix 配置包含 12 个子段落，完整说明请移步：

→ **[A_Memorix 配置详解](./amemorix-config.md)**

### 快速启用

```toml
[A_memorix]

[A_memorix.plugin]
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


## 黑话 [jargon]

**说明**：控制黑话学习和黑话互通组配置，从旧版 `[expression]` 中独立出来。

```toml
[jargon]
# 黑话学习配置列表，platform 或 item_id 可使用 * 通配，默认 1 条全局规则
learning_list = []
# 黑话学习互通组，默认不互通
jargon_groups = []
```

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

- **`keywords`** — 关键词列表。默认为空列表
- **`regex`** — 正则表达式列表。默认为空列表
- **`reaction`** — 触发后的反应内容。默认为空字符串


## 回复后处理 [response_post_process]

**说明**：回复后处理总开关配置。

```toml
[response_post_process]
# 是否启用回复后处理（包括错别字生成器和回复分割器）
enable_response_post_process = true
```


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


## 日志 [log]

**说明**：日志输出格式、级别和文件管理配置。

```toml
[log]
# 日志日期格式
date_style = "m-d H:i:s"
# 日志等级显示样式：lite / compact / full
log_level_style = "lite"
# 控制台日志颜色模式：none / title / full
color_text = "full"
# 全局日志级别：DEBUG / INFO / WARNING / ERROR / CRITICAL
log_level = "INFO"
# 控制台日志级别
console_log_level = "INFO"
# 文件日志级别
file_log_level = "DEBUG"
# 单个日志文件最大字节数，默认 5MB
log_file_max_bytes = 5242880
# 最多保留的主日志文件数量
max_log_files = 30
# 主日志文件保留天数
log_cleanup_days = 30
# 失败请求快照最多保留数量
llm_request_snapshot_limit = 128
# 每个会话最多保留的 Maisaka Prompt 预览组数
maisaka_prompt_preview_limit = 256
# 每个会话最多保留的 Maisaka 回复效果记录数
maisaka_reply_effect_limit = 256
# 完全屏蔽日志的第三方库列表
suppress_libraries = ["faiss", "httpx", "urllib3", "asyncio", "websockets", "httpcore", "requests", "sqlalchemy", "openai", "uvicorn", "jieba"]
# 特定第三方库的日志级别
library_log_levels = { aiohttp = "WARNING" }
```


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


## 遥测 [telemetry]

**说明**：遥测开关配置。

```toml
[telemetry]
# 是否启用遥测
enable = true
```


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

## 数据库 [database]

**说明**：消息二进制数据保存策略配置。

```toml
[database]
# 是否将消息中的二进制数据保存为独立文件（只影响新存储的消息）
save_binary_data = false
```


## MCP [mcp]

**说明**：MCP 客户端宿主能力和外部 MCP 服务器连接配置。

详细的 MCP 配置指南请移步 → [MCP 配置详解](./mcp-config.md)

```toml
[mcp]
# 是否启用 MCP
enable = true
```

### 快速示例

连接一个 Playwright MCP 服务：

```toml
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
hook_blocking_timeout_sec = 30
# 自定义 IPC Socket 路径，仅 Linux/macOS 生效，留空自动生成
ipc_socket_path = ""
```

### plugin_runtime.render

```toml
[plugin_runtime.render]
# 是否启用浏览器渲染能力
enabled = true
# 优先复用的现有 Chromium CDP 地址
browser_ws_endpoint = ""
# 浏览器可执行文件路径，留空自动探测
executable_path = ""
# Playwright 托管浏览器目录
browser_install_root = "data/playwright-browsers"
# 是否以无头模式启动浏览器
headless = true
# 浏览器启动参数
launch_args = ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"]
# 同时允许进行的最大渲染任务数
concurrency_limit = 2
# 浏览器连接或启动超时时间，单位秒
startup_timeout_sec = 20.0
# 单次渲染默认超时时间，单位秒
render_timeout_sec = 15.0
# 未检测到可用浏览器时是否自动下载 Playwright Chromium
auto_download_chromium = true
# 自动下载 Chromium 时的连接超时时间，单位秒
download_connection_timeout_sec = 120.0
# 累计渲染指定次数后自动重建浏览器，0 表示关闭
restart_after_render_count = 200
```


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

[A_memorix]

[A_memorix.plugin]
enabled = true

[A_memorix.integration]
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
