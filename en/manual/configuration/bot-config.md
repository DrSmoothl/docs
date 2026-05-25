---
title: Bot Configuration
---

# Bot Configuration

`bot_config.toml` is MaiBot's main configuration file. It contains bot identity, personality, chat behavior, memory, expression learning, message connection, WebUI, MCP, plugin runtime, and more.

This document is organized according to `src/config/official_configs.py` and `src/config/config.py`. The configuration file is generated and upgraded by MaiBot automatically. Do not manually add fields that do not exist in the code.

## Configuration File Structure

`bot_config.toml` contains these top-level sections:

- **`[bot]`** — Bot identity, platform, nickname, aliases
- **`[personality]`** — Character setting and reply style
- **`[visual]`** — Image understanding mode and visual prompt
- **`[chat]`** — Reply frequency, context, chat prompts
- **`[message_receive]`** — Image parsing threshold and message filtering
- **`[a_memorix]`** — Long-term memory system: storage, vectorization, retrieval, profiles, evolution, and Web operations
- **`[expression]`** — Expression learning, jargon learning, expression checking
- **`[voice]`** — Speech recognition
- **`[emoji]`** — Emoji collection, filtering, sending
- **`[keyword_reaction]`** — Keyword/regex triggered reactions
- **`[response_post_process]`** — Global response post-processing switch
- **`[chinese_typo]`** — Chinese typo generation
- **`[log]`** — Log configuration
- **`[response_splitter]`** — Response splitting
- **`[telemetry]`** — Telemetry switch
- **`[debug]`** — Debug display and tracking
- **`[maim_message]`** — maim_message WebSocket/API Server
- **`[webui]`** — WebUI service and security settings
- **`[database]`** — Message binary data saving policy
- **`[mcp]`** — MCP client and server configuration
- **`[plugin_runtime]`** — Plugin runtime and browser rendering configuration

::: tip
The `[inner] version` at the top of the configuration file is managed by the program. Users usually do not need to edit this version manually.
:::

## Basic Information [bot]

`[bot]` contains the bot's identity information. The most commonly used fields are `platform`, `qq_account`, `nickname`, and `alias_names`.

```toml
[bot]
platform = "qq"
qq_account = 123456789
platforms = []
nickname = "MaiMai"
alias_names = ["XiaoMai", "MaiZi"]
```

- **`platform`** — Main platform identifier, such as qq. Default: empty
- **`qq_account`** — QQ account used by the bot, used to identify @mentions and self messages. Default: 0
- **`platforms`** — Other platform identifiers, used in multi-platform scenarios. Default: empty
- **`nickname`** — Bot nickname. Default: `麦麦`
- **`alias_names`** — Bot aliases, used when detecting mentions. Default: empty

## Personality [personality]

`[personality]` controls MaiBot's character setting and language style.

```toml
[personality]
personality = "你是一个大二女大学生，现在正在上网和群友聊天。"
reply_style = "请不要刻意突出自身学科背景。可以参考贴吧，知乎和微博的回复风格。"
multiple_reply_style = []
multiple_probability = 0.2
```

- **`personality`** — Character setting, recommended within 100 Chinese characters. See default config
- **`reply_style`** — Default expression style, recommended 1-2 lines. See default config
- **`multiple_reply_style`** — Optional style list; can randomly replace reply_style when not empty. Default: empty
- **`multiple_probability`** — Probability of using multiple_reply_style, range 0.0-1.0. Default: 0.2

## Visual [visual]

`[visual]` controls how image messages are handled by the planner and replyer.

```toml
[visual]
planner_mode = "auto"
replyer_mode = "auto"
```

The image description prompt is managed by the Prompt template `prompts/<locale>/image_description.prompt`.

- **`planner_mode`** — Planner visual mode, options are text, multimodal, or auto; auto chooses based on model metadata. Default: `auto`
- **`replyer_mode`** — Replyer visual mode, options are text, multimodal, or auto; auto chooses based on model metadata. Default: `auto`

## Chat [chat]

`[chat]` controls reply frequency, context length, group/private chat prompts, and dynamic talk frequency rules.

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
planner_interrupt_max_consecutive_count = 2
group_chat_prompt = "..."
private_chat_prompts = "..."
chat_prompts = []
enable_talk_value_rules = true
```

- **`talk_value`** — Chat frequency. Smaller means quieter, range 0-1. Default: 1.0
- **`private_talk_value`** — Private chat frequency. Smaller means quieter, range 0-1. Default: 1.0
- **`mentioned_bot_reply`** — Whether to tend to reply when the bot name is mentioned in plain text. Default: disabled
- **`inevitable_at_reply`** — Whether to always reply when @mentioned. Default: enabled
- **`enable_at`** — Whether to allow using at mentions. Default: enabled
- **`enable_reply_quote`** — Whether to include quoted replies. Default: enabled
- **`max_context_size`** — Number of context messages sent to the model. Default: 40
- **`max_private_context_size`** — Private chat context length. Default: 60
- **`enable_context_optimization`** — Whether to optimize Planner context usage, with possible cache impact. Default: enabled
- **`mid_term_memory`** — Whether to summarize trimmed chat history with the utils model and keep it as an expandable complex message. Default: enabled
- **`mid_term_memory_lenth`** — Maximum number of mid-term summary messages to retain; the oldest one is removed when exceeded. Default: 5
- **`enable_independent_timing_gate`** — Whether to use an independent Timing Gate; when disabled, pacing tools are merged into Planner. Default: enabled
- **`planner_interrupt_max_consecutive_count`** — Maximum consecutive planner interruptions by new messages. 0 disables interruption protection. Default: 2
- **`group_chat_prompt`** — General group chat instructions. See default config
- **`private_chat_prompts`** — General private chat instructions. See default config
- **`chat_prompts`** — Extra prompts by platform/chat flow. Default: empty
- **`enable_talk_value_rules`** — Whether to enable dynamic talk frequency rules. Default: enabled
- **`talk_value_rules`** — Adjusts talk_value by chat flow and time range. Two default rules

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

- **`platform`** — Platform. Empty together with item_id means global
- **`item_id`** — User/group ID. Empty together with platform means global
- **`rule_type`** — Chat flow type, group or private
- **`time`** — Time range in `HH:MM-HH:MM` format. Overnight ranges are supported
- **`value`** — Chat frequency value for this range, 0-1

### chat_prompts

```toml
[[chat.chat_prompts]]
platform = "qq"
item_id = "123456"
rule_type = "group"
prompt = "Speak more briefly in this group."
```

`platform`, `item_id`, and `prompt` must all be filled in; otherwise the extra prompt entry is invalid.

## Message Receiving [message_receive]

`[message_receive]` controls image parsing and message filtering.

- **`image_parse_threshold`** — Parse images only when image count in one message does not exceed this threshold. Default: 5
- **`ban_words`** — Filter word list. Default: empty
- **`ban_msgs_regex`** — Filter regex list. Invalid regex causes configuration validation failure. Default: empty

## Memory [a_memorix]

A_Memorix is MaiBot's long-term memory system. It handles memory storage, vectorization, retrieval, person profiles, memory evolution, and WebUI operations. It replaces the old `[memory]` section with finer-grained controls.

Use lowercase `[a_memorix]` in `bot_config.toml`; TOML section names are case-sensitive.

```toml
[a_memorix]

[a_memorix.plugin]
enabled = true

[a_memorix.integration]
enable_memory_query_tool = true
memory_query_default_limit = 5
person_fact_writeback_enabled = true
chat_summary_writeback_enabled = true
```

Main subsections include `integration`, `plugin`, `storage`, `embedding`, `retrieval`, `threshold`, `filter`, `episode`, `person_profile`, `memory`, `advanced`, and `web`.

Legacy `[memory]` fields migrate into `[a_memorix.integration]` and `[a_memorix.filter]`. For example, old `global_memory_blacklist` is now represented by `filter.mode = "blacklist"` and `filter.chats`.

## Expression Learning [expression]

`[expression]` controls expression learning, jargon learning, expression auto-checking, and shared expression groups.

- **`learning_list`** — Expression learning configuration by chat flow
- **`advanced_chosen`** — Whether to enable sub-agent based second-stage expression selection
- **`expression_groups`** — Shared expression learning groups
- **`expression_checked_only`** — Whether to select only checked and non-rejected expressions
- **`expression_self_reflect`** — Whether to enable automatic expression optimization
- **`expression_auto_check_interval`** — Auto-check interval in seconds
- **`expression_auto_check_count`** — Number of expressions randomly selected for each auto-check
- **`expression_auto_check_custom_criteria`** — Additional custom evaluation criteria
- **`all_global_jargon`** — Whether to enable global jargon mode

### learning_list

```toml
[[expression.learning_list]]
platform = ""
item_id = ""
rule_type = "group"
use_expression = true
enable_learning = true
enable_jargon_learning = true
```

- **`platform`** — Platform. Empty together with item_id means global
- **`item_id`** — User/group ID. Empty together with platform means global
- **`rule_type`** — Chat flow type, group or private
- **`use_expression`** — Whether to use learned expressions
- **`enable_learning`** — Whether to enable expression optimization learning
- **`enable_jargon_learning`** — Whether to enable jargon learning

## Voice [voice]

- **`enable_asr`** — Whether to enable speech recognition. See default config

## Emoji [emoji]

- **`emoji_send_num`** — Number of emoji candidates to choose from when sending, maximum 64
- **`max_reg_num`** — Maximum number of registered emojis
- **`do_replace`** — Whether to replace old emojis after reaching the maximum
- **`check_interval`** — Emoji check interval in minutes
- **`steal_emoji`** — Whether to collect emojis from chat
- **`content_filtration`** — Whether to enable emoji filtering
- **`filtration_prompt`** — Emoji filtering requirement

## Keyword Reaction [keyword_reaction]

```toml
[[keyword_reaction.keyword_rules]]
keywords = ["keyword"]
reaction = "reaction after trigger"

[[keyword_reaction.regex_rules]]
regex = ["^regex.*"]
reaction = "reaction after trigger"
```

- **`keyword_rules`** — Keyword rule list
- **`regex_rules`** — Regex rule list

`KeywordRuleConfig` fields:

- **`keywords`** — Keyword list
- **`regex`** — Regex list
- **`reaction`** — Reaction after keyword or regex trigger

## Response Post-Processing

### response_post_process

- **`enable_response_post_process`** — Whether to enable response post-processing, including typo generation and response splitting

### chinese_typo

- **`enable`** — Whether to enable Chinese typo generation
- **`error_rate`** — Single-character replacement probability
- **`min_freq`** — Minimum character frequency threshold
- **`tone_error_rate`** — Tone error probability
- **`word_replace_rate`** — Whole-word replacement probability

### log

`[log]` controls log output format, level, and file management.

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

- **`date_style`** — Log date format. Default: `m-d H:i:s`
- **`log_level_style`** — Log level display style, options are lite, compact, or full. Default: `lite`
- **`color_text`** — Console log color mode, options are none, title, or full. Default: `full`
- **`log_level`** — Global log level, options are DEBUG, INFO, WARNING, ERROR, or CRITICAL. Default: `INFO`
- **`console_log_level`** — Console log level. Default: `INFO`
- **`file_log_level`** — File log level. Default: `DEBUG`
- **`log_file_max_bytes`** — Maximum bytes per log file, default 5MB. Default: 5242880
- **`max_log_files`** — Maximum number of main log files to keep. Default: 30
- **`log_cleanup_days`** — Main log file retention days. Default: 30
- **`llm_request_snapshot_limit`** — Maximum number of failed request snapshots to keep. Default: 128
- **`maisaka_prompt_preview_limit`** — Maximum number of Maisaka Prompt preview groups per session. Default: 256
- **`maisaka_reply_effect_limit`** — Maximum number of Maisaka reply effect records per session. Default: 256
- **`suppress_libraries`** — List of third-party libraries to completely suppress logs. 11 libraries
- **`library_log_levels`** — Log levels for specific third-party libraries. Default: `{"aiohttp": "WARNING"}`

### response_splitter

- **`enable`** — Whether to enable response splitting
- **`max_length`** — Maximum allowed response length
- **`max_sentence_num`** — Maximum allowed sentence count
- **`enable_kaomoji_protection`** — Whether to protect kaomoji
- **`enable_overflow_return_all`** — Whether to return all content when sentence count exceeds the limit

## Telemetry and Debug

### telemetry

- **`enable`** — Whether to enable telemetry

### debug

- **`enable_maisaka_stage_board`** — Whether to enable the Maisaka stage board
- **`show_maisaka_thinking`** — Whether to show replyer reasoning
- **`fold_maisaka_thinking`** — Whether to fold the Maisaka prompt display entry
- **`show_jargon_prompt`** — Whether to show jargon-related prompts
- **`show_memory_prompt`** — Whether to show memory retrieval prompts
- **`enable_reply_effect_tracking`** — Whether to enable reply effect score tracking
- **`record_reply_request`** — Whether to record Replyer request body. Disabled by default
- **`enable_llm_cache_stats`** — Whether to record LLM prompt cache debug statistics. Disabled by default

## Message Service [maim_message]

`[maim_message]` contains both the legacy WebSocket service and the additional new API Server configuration.

- **`ws_server_host`** — Legacy WebSocket server host. Default: `127.0.0.1`
- **`ws_server_port`** — Legacy WebSocket server port. Default: 8000
- **`auth_token`** — Legacy API auth tokens. Empty means no auth. Default: empty
- **`enable_api_server`** — Whether to enable the additional new API Server. See default config
- **`api_server_host`** — New API Server host. See default config
- **`api_server_port`** — New API Server port. See default config
- **`api_server_use_wss`** — Whether the new API Server uses WSS. See default config
- **`api_server_cert_file`** — SSL certificate file path. Default: empty
- **`api_server_key_file`** — SSL key file path. Default: empty
- **`api_server_allowed_api_keys`** — Allowed API key list. Empty allows all connections. Default: empty

## WebUI [webui]

- **`enabled`** — Whether to enable WebUI. Default: enabled
- **`host`** — WebUI bind host. Default: `127.0.0.1`
- **`port`** — WebUI bind port. Default: 8001
- **`mode`** — WebUI running mode, options are development or production. Default: `production`
- **`anti_crawler_mode`** — Anti-crawler mode, options are false, strict, loose, or basic. Default: `basic`
- **`allowed_ips`** — IP whitelist, comma-separated; supports exact IP, CIDR, and wildcard. Default: `127.0.0.1`
- **`trusted_proxies`** — Trusted proxy IP list. Default: empty
- **`trust_xff`** — Whether to parse `X-Forwarded-For`. Default: disabled
- **`secure_cookie`** — Whether to enable secure cookies, HTTPS only. Default: disabled
- **`enable_paragraph_content`** — Whether to load full paragraph content in the knowledge graph; uses extra memory. Default: disabled

## Database [database]

- **`save_binary_data`** — Whether to save binary data such as voice as independent files. Only affects newly stored messages. Default: disabled

## MCP [mcp]

`[mcp]` controls MaiBot's MCP client host capabilities and external MCP server connections.

- **`enable`** — Whether to enable MCP
- **`client`** — MCP client host capability configuration
- **`servers`** — MCP server configuration list

### mcp.client

- **`client_name`** — MCP client implementation name
- **`client_version`** — MCP client implementation version
- **`roots.enable`** — Whether to expose Roots capability to MCP servers
- **`roots.items`** — Roots list
- **`sampling.enable`** — Whether to declare Sampling capability
- **`sampling.task_name`** — Main model task name used for Sampling requests
- **`sampling.include_context_support`** — Whether to declare support for non-none includeContext semantics
- **`sampling.tool_support`** — Whether to declare support for continuing to use tools in Sampling
- **`elicitation.enable`** — Whether to declare Elicitation capability
- **`elicitation.allow_form`** — Whether to allow form-mode Elicitation
- **`elicitation.allow_url`** — Whether to allow URL-mode Elicitation

### mcp.servers

```toml
[[mcp.servers]]
name = "example"
enabled = true
transport = "stdio"
command = "uvx"
args = ["some-mcp-server"]
env = {}
```

- **`name`** — Server name, must be unique
- **`enabled`** — Whether to enable this server
- **`transport`** — Transport mode, stdio or streamable_http
- **`command`** — Command used to start the server in stdio mode
- **`args`** — Command arguments in stdio mode
- **`env`** — Extra environment variables in stdio mode
- **`url`** — MCP endpoint in streamable_http mode
- **`headers`** — Extra HTTP headers
- **`http_timeout_seconds`** — HTTP request timeout
- **`read_timeout_seconds`** — Session read timeout
- **`authorization.mode`** — HTTP authorization mode, none or bearer
- **`authorization.bearer_token`** — Bearer Token, only used when mode is bearer

## Plugin Runtime [plugin_runtime]

`[plugin_runtime]` controls the plugin runner and plugin runtime browser rendering capability.

- **`enabled`** — Whether to enable the plugin system
- **`health_check_interval_sec`** — Health check interval
- **`max_restart_attempts`** — Maximum auto-restarts after runner crash
- **`runner_spawn_timeout_sec`** — Timeout waiting for runner subprocess startup and registration
- **`hook_blocking_timeout_sec`** — Global timeout for blocking hook steps
- **`ipc_socket_path`** — Custom IPC socket path, Linux/macOS only; empty means auto-generated

### plugin_runtime.render

- **`enabled`** — Whether to enable browser rendering in plugin runtime
- **`browser_ws_endpoint`** — Existing Chromium CDP address to reuse first
- **`executable_path`** — Browser executable path; empty means auto-detect
- **`browser_install_root`** — Playwright-managed browser directory
- **`headless`** — Whether to launch browser in headless mode
- **`launch_args`** — Browser launch arguments
- **`concurrency_limit`** — Maximum concurrent rendering tasks
- **`startup_timeout_sec`** — Browser connection or startup timeout
- **`render_timeout_sec`** — Default timeout for a single render
- **`auto_download_chromium`** — Whether to automatically download Playwright Chromium if no browser is found
- **`download_connection_timeout_sec`** — Connection timeout when automatically downloading Chromium
- **`restart_after_render_count`** — Rebuild local browser after this many renders; 0 disables this policy

## Common Examples

### Beginner Minimal Configuration

```toml
[bot]
platform = "qq"
qq_account = 123456789
nickname = "MaiMai"
alias_names = ["XiaoMai"]

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

### Connect an Adapter

```toml
[maim_message]
ws_server_host = "127.0.0.1"
ws_server_port = 8000
auth_token = []
```

If the adapter runs in a Docker network or on another machine, adjust the listen address and port according to your deployment.

## Next Steps

- Configure models: see [Model Configuration](./model-config.md)
- Connect QQ: see [NapCat Adapter](../adapters/napcat.md)
- Manage WebUI: see [WebUI Configuration Management](../webui/config-management.md)
