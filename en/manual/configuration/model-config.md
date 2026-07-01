---
title: Model Configuration
titleTemplate: :title · 模型配置
---# Model Configuration

`model_config.toml` Configure the "AI Brain" for MaiMai—determining which LLM model different components use and how to connect to API providers.

At minimum, only one LLM model and one API provider are required for startup (`models` and `api_providers` must both be non-empty). Full functionality also requires a VLM model (for image recognition) and an embedding models (for memory search).

## API Providers

Each `[[api_providers]]` block defines an API provider. A configuration file can contain multiple providers.

```toml
[[api_providers]]
name = "deepseek"                          # [必填] API 服务商名称，在 models 的 api_provider 中需使用这个命名
base_url = "https://api.deepseek.com/v1"   # [必填] API 服务商的 BaseURL
api_key = "your-api-key"                   # [必填] API 密钥。若 auth_type 为 none 则不需要
client_type = "openai"                     # [可选] 客户端类型：openai(默认) / google
auth_type = "bearer"                       # [可选] 鉴权方式：bearer(默认) / header / query / none
auth_header_name = "Authorization"         # [可选] 当 auth_type 为 header 时使用的请求头名称
auth_header_prefix = "Bearer"              # [可选] 当 auth_type 为 header 时的请求头前缀，留空表示直接发送原始密钥
auth_query_name = "api_key"                # [可选] 当 auth_type 为 query 时使用的查询参数名称
default_headers = {}                       # [可选] 所有请求默认附带的 HTTP Header
default_query = {}                         # [可选] 所有请求默认附带的查询参数
# organization = "org-xxxx"                # [可选] OpenAI 官方接口可选的 organization
# project = "proj-xxxx"                    # [可选] OpenAI 官方接口可选的 project
model_list_endpoint = "/models"            # [可选] 模型列表端点路径
reasoning_parse_mode = "auto"              # [可选] 推理内容解析模式：auto(默认) / native / think_tag / none
tool_argument_parse_mode = "auto"          # [可选] 工具参数解析模式：auto(默认) / strict / repair / double_decode
max_retry = 3                              # [可选] 最大重试次数
timeout = 60                               # [可选] API 调用超时，单位秒
retry_interval = 5                         # [可选] 重试间隔，单位秒
```

**Key Points:**

- **Required**: `name` (Provider name), `base_url` (Endpoint address), `api_key` (API Key, except when `auth_type = "none"`)
- **Authentication**: `bearer` is the default and applies to most providers. Other options include `header` / `query` / `none`
- **Client**: Default is `openai`. Use `"google"` for Google Gemini; see [Model Extra Parameters](./model-extra-params.md#gemini-native-api)
- **Timeout & Retries**: `timeout` defaults to 60s, `max_retry` defaults to 3 times, `retry_interval` defaults to 5s
- For other fields, refer to the comments above; all have reasonable default values.

## Models

Each `[[models]]` block defines a specific LLM model associated with a particular API provider.

```toml
[[models]]
model_identifier = "deepseek-v4-flash"       # [必填] API 服务商提供的模型标识符
name = "deepseek-v4-flash"                   # [必填] 模型名称，在 model_task_config 中需使用这个命名
api_provider = "deepseek"                    # [必填] 对应 api_providers 中配置的服务商名称
price_in = 1.0                               # [可选] 输入价格，单位：元/M token
cache = false                                # [可选] 是否启用缓存计费
cache_price_in = 0.0                         # [可选] 缓存命中输入价格，仅 cache=true 时使用
price_out = 2.0                              # [可选] 输出价格，单位：元/M token
# temperature = 0.7                          # [可选] 模型级别温度，会覆盖任务配置中的 temperature
# max_tokens = 4096                          # [可选] 模型级别最大 token 数，会覆盖任务配置中的 max_tokens
force_stream_mode = false                    # [可选] 强制流式输出模式，模型不支持非流式输出时设为 true
visual = false                               # [可选] 是否为多模态模型（支持视觉输入）
extra_params = {}                            # [可选] 额外参数，详见 模型额外参数
```

**Key Points:**

- **Required**: `model_identifier` (API identifier), `name` (Custom name), `api_provider` (Associated provider)
- **Pricing**: `price_in` / `price_out` are used for statistics, in units of CNY/million tokens. After enabling `cache`, `cache_price_in` can be set separately
- **Model-level Overrides**: `temperature` / `max_tokens` can override task configurations; if not set, the task default is used
- **Vision**: `visual = true` indicates support for image input, used for `vlm` tasks
- **`extra_params`**: Provider-specific parameters (thinking mode, reasoning intensity, etc.), see [Model Extra Parameters](./model-extra-params.md) for details

## Task Configuration

Assign different models to each task based on task characteristics to achieve optimal performance and efficiency.

MaiMai divides model calls into three roles: the **Planner** is the strategic core, deciding when to speak and which tools to call (requires strong reasoning capabilities to schedule MCP and toolchains); the **Replyer** is responsible for transforming the information collected by the Planner into the final response text, prioritizing language quality; other auxiliary tasks use low-cost flash models for speed. A typical "Receive Message $\rightarrow$ Send Reply" trigger involves 3–6 LLM calls.

::: code-group

```toml [replyer（智能模型）]
# [必填] 回复器：将 Planner 收集的信息转为最终回复文本。追求语言质量和表达风格，推荐 pro 模型 + 思考模式。
[model_task_config.replyer]
model_list = ["deepseek-v4-pro-think"]        # [必填] 模型名称列表
max_tokens = 4096                             # [可选] 最大输出 token 数
temperature = 1.0                             # [可选] 模型温度，0.3 保守 / 0.7 有创意 / 1.0 随机
slow_threshold = 120.0                        # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略：balance / random / sequential
hard_timeout = 240.0                          # [可选] 硬超时（秒）
```

```toml [planner（快模型）]
# [必填] 规划器：战略核心——决定何时说话、回复谁、调用哪些工具（MCP/插件）。需较强推理和 tool 调用能力。
[model_task_config.planner]
model_list = ["deepseek-v4-flash"]            # [必填] 模型名称列表
max_tokens = 8000                             # [可选] 最大输出 token 数
temperature = 0.7                             # [可选] 模型温度
slow_threshold = 12.0                         # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略
hard_timeout = 180.0                          # [可选] 硬超时（秒）
```

```toml [utils（快模型）]
# [必填] 组件模型：表情包分析、学习分析、取名、关系模块、情绪变化等。麦麦必须的模型。
[model_task_config.utils]
model_list = ["deepseek-v4-flash"]            # [必填] 模型名称列表
max_tokens = 4096                             # [可选] 最大输出 token 数
temperature = 0.5                             # [可选] 模型温度
slow_threshold = 15.0                         # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略
hard_timeout = 120.0                          # [可选] 硬超时（秒）
```

```toml [memory（长期记忆）]
# [可选] 长期记忆：记忆总结、抽取、写回等高质量任务（A_Memorix 子系统）。
# 默认 model_list 为空（不自动回退），未配置时调用方按需处理。
[model_task_config.memory]
model_list = []                               # [可选] 模型名称列表
max_tokens = 8192                             # [可选] 最大输出 token 数
temperature = 0.5                             # [可选] 模型温度
slow_threshold = 30.0                         # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略
hard_timeout = 240.0                          # [可选] 硬超时（秒）
```

```toml [mid_memory（中期摘要）]
# [可选] 中期摘要：上下文裁切时将历史聊天压缩为摘要。留空时自动回退到 planner。
[model_task_config.mid_memory]
model_list = []                               # [可选] 模型名称列表（→回退 planner）
max_tokens = 8000                             # [可选] 最大输出 token 数
temperature = 0.7                             # [可选] 模型温度
slow_threshold = 12.0                         # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略
hard_timeout = 180.0                          # [可选] 硬超时（秒）
```

```toml [timing_gate（节奏控制）]
# [可选] 节奏控制：独立判断是否该在此时说话。留空时自动回退到 planner。
[model_task_config.timing_gate]
model_list = []                               # [可选] 模型名称列表（→回退 planner）
max_tokens = 4096                             # [可选] 最大输出 token 数
temperature = 0.3                             # [可选] 模型温度
slow_threshold = 12.0                         # [可选] 慢请求阈值（秒）
selection_strategy = "random"                 # [可选] 模型选择策略
hard_timeout = 120.0                          # [可选] 硬超时（秒）
```

```toml [learner（学习）]
# [可选] 学习模型：表达方式学习和黑话学习。留空时自动回退到 utils。
[model_task_config.learner]
model_list = []                               # [可选] 模型名称列表（→回退 utils）
max_tokens = 4096                             # [可选] 最大输出 token 数
hard_timeout = 120.0                          # [可选] 硬超时（秒）
```

```toml [emoji（表情包选择）]
# [可选] 表情包选择：从候选表情包中选出合适的一张发送。
# 选择优先级：emoji 有模型→用 emoji，planner 全视觉→用 planner，否则→用 vlm
[model_task_config.emoji]
model_list = []                               # [可选] 模型名称列表
max_tokens = 4096                             # [可选] 最大输出 token 数
hard_timeout = 120.0                          # [可选] 硬超时（秒）
```

```toml [vlm（看图）]
# [强烈建议] 看图说话：理解图片内容。需 visual=true 的多模态模型。
[model_task_config.vlm]
model_list = ["qwen-vl"]                      # [必填] 模型名称列表，需 visual=true 的多模态模型
max_tokens = 4096                             # [可选] 最大输出 token 数
hard_timeout = 240.0                          # [可选] 硬超时（秒）
```

```toml [voice（语音识别）]
# [可选] 语音识别：语音转文字。
[model_task_config.voice]
model_list = []                               # [可选] 模型名称列表
max_tokens = 4096                             # [可选] 最大输出 token 数
hard_timeout = 120.0                          # [可选] 硬超时（秒）
```

```toml [embedding（嵌入模型）]
# [强烈建议] 嵌入模型：生成文本向量，用于长期记忆的语义搜索。
# 推荐专门的嵌入模型（如 text-embedding-3-small）。未配置时记忆搜索不可用。
[model_task_config.embedding]
model_list = ["text-embedding-3-small"]       # [必填] 模型名称列表，推荐专门的嵌入模型
max_tokens = 4096                             # [可选] 最大输出 token 数
hard_timeout = 60.0                           # [可选] 硬超时（秒）
```

:::

**Key Points:**

- **Three Essentials**: Once `replyer`, `planner`, and `utils` are configured, it can run; others can be left blank to fall back automatically
- **Planner as Strategic Core**: Decides when to speak and which tools (MCP/plugins) to call; requires a certain level of reasoning capability. A balanced model is recommended
- **Replyer for Language Quality**: Converts information collected by the Planner into the final reply; a pro model + thinking mode is recommended
- **Vision**: `vlm` requires a multimodal model from `visual = true`; `qwen-vl` is recommended
- **Embedding**: `embedding` recommends a dedicated embedding model (e.g., `text-embedding-3-small`); if not configured, memory search will be unavailable
- `temperature` / `max_tokens` in the model configuration will override the settings here

### Fallback Rules

When the `model_list` of certain tasks is empty, they automatically reuse other tasks:

```
         ┌──────────┐
         │  planner │◄──── mid_memory（留空时回退）
         │          │◄──── timing_gate（留空时回退）
         └──────────┘
              ▲
              │
         ┌──────────┐
         │  utils   │◄──── learner（留空时回退）
         └──────────┘

memory · emoji · vlm · voice · embedding → 留空不自动回退，调用方会跳过或报错

emoji 特殊逻辑：emoji 有模型→用 emoji，planner 全视觉→用 planner，否则→用 vlm
```

## Next Steps

- Advanced model parameters (thinking mode, reasoning intensity): [Model Extra Parameters](./model-extra-params.md)
- Configure the bot: See [Bot Configuration](./bot-config.md)
- Connect to QQ: [NapCat Adapter](../adapters/napcat.md)
- Manage WebUI: [WebUI Configuration Management](../webui/config-management.md)