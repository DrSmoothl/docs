---
title: 模型配置
---

# 设置 AI 大脑

`model_config.toml` 是给麦麦配置"AI 大脑"的文件，决定了麦麦的不同组件使用什么 LLM 模型。

我们推荐根据不同任务的特点来分配不同的模型，实现最好的表现和最优的效率。

最少启动只需要至少一个 LLM 模型和一个 API 提供商（`models` 和 `api_providers` 均非空即可）；要完整功能还需要配置 VLM 模型（看图说话）和嵌入模型（记忆搜索）。

## 配置文件结构

```toml
[inner]
version = "1.17.0"

[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
auth_type = "bearer"                    # bearer/header/query/none

[[models]]
name = "deepseek-chat"
model_identifier = "deepseek-chat"
api_provider = "deepseek"               # 对应 api_providers 的 name
visual = false
price_in = 0.1
price_out = 0.2

[model_task_config.replyer]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"          # balance/random/sequential
```

---

## API 提供商 [[api_providers]]

**说明**：API 提供商代表提供 LLM 服务的对象，配置 API 端点、鉴权方式等。

### 基础配置

- **`name`** — API 服务商名称（可随意命名，在 models 的 api_provider 中需使用这个命名）
- **`base_url`** — API 服务商的 BaseURL
- **`api_key`** — API 密钥。对于不需要鉴权的兼容端点，可将 `auth_type` 设为 `none`
- **`client_type`** — 客户端类型，可选 `openai`（默认）或 `google`
- **`auth_type`** — OpenAI 兼容接口的鉴权方式，可选 `bearer`（默认）、`header`、`query`、`none`
- **`auth_header_name`** — 当 `auth_type` 为 `header` 时使用的请求头名称。默认 `Authorization`
- **`auth_header_prefix`** — 当 `auth_type` 为 `header` 时使用的请求头前缀。默认 `Bearer`；留空表示直接发送原始密钥
- **`auth_query_name`** — 当 `auth_type` 为 `query` 时使用的查询参数名称。默认 `api_key`
- **`default_headers`** — 所有请求默认附带的 HTTP Header 字典。默认为空字典
- **`default_query`** — 所有请求默认附带的查询参数字典。默认为空字典
- **`organization`** — OpenAI 官方接口可选的 `organization`。默认为 `None`
- **`project`** — OpenAI 官方接口可选的 `project`。默认为 `None`
- **`model_list_endpoint`** — 模型列表端点路径，适用于 OpenAI 兼容接口的探测与管理。默认 `/models`
- **`reasoning_parse_mode`** — 推理内容解析模式，可选 `auto`（默认）、`native`、`think_tag`、`none`
- **`tool_argument_parse_mode`** — 工具参数解析模式，可选 `auto`（默认）、`strict`、`repair`、`double_decode`
- **`max_retry`** — 最大重试次数（单个模型 API 调用失败时，最多重试的次数）。默认 3
- **`timeout`** — API 调用的超时时长（超过这个时长，本次请求将被视为"请求超时"，单位：秒）。默认 60
- **`retry_interval`** — 重试间隔（如果 API 调用失败，重试的间隔时间，单位：秒）。默认 5

### 常见服务商配置示例

::: code-group

```toml [DeepSeek（bearer 鉴权）]
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [自定义 Header 鉴权]
[[api_providers]]
name = "custom"
base_url = "https://api.example.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "header"
auth_header_name = "X-API-Key"
auth_header_prefix = ""
```

```toml [Query 参数鉴权]
[[api_providers]]
name = "query_auth"
base_url = "https://api.example.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "query"
auth_query_name = "key"
```

:::

- **OpenAI** — `https://api.openai.com/v1`，可选填 `organization`、`project`
- **阿里百炼** — `https://dashscope.aliyuncs.com/compatible-mode/v1`，auth_type 用 `bearer`
- **字节火山** — `https://ark.cn-beijing.volces.com/api/v3`，auth_type 用 `bearer`

> 💡 大部分国内服务商都兼容 OpenAI 接口格式，`client_type = "openai"` + `auth_type = "bearer"` 即可。

---

## 模型列表 [[models]]

**说明**：模型是具体的 LLM，比如 GPT-5.4、DeepSeek V4 等。

### 基础配置

- **`model_identifier`** — 模型标识符（API 服务商提供的模型标识符）
- **`name`** — 模型名称（可随意命名，在 model_task_config 中需使用这个命名）
- **`api_provider`** — API 服务商名称（对应在 api_providers 中配置的服务商名称）
- **`price_in`** — 输入价格（用于 API 调用统计，单位：元/M token）。默认 0.0
- **`cache`** — 是否启用模型输入缓存计费。开启后命中缓存的输入 token 使用 `cache_price_in` 计费。默认关闭
- **`cache_price_in`** — 缓存命中输入价格（用于 API 调用统计，单位：元/M token）。仅当 `cache=true` 时使用。默认 0.0
- **`price_out`** — 输出价格（用于 API 调用统计，单位：元/M token）。默认 0.0
- **`temperature`** — 模型级别温度（可选），会覆盖任务配置中的温度。默认为 `None`
- **`max_tokens`** — 模型级别最大 token 数（可选），会覆盖任务配置中的 `max_tokens`。默认为 `None`
- **`force_stream_mode`** — 强制流式输出模式（若模型不支持非流式输出，请设置为 true 启用强制流式输出）。默认关闭
- **`visual`** — 是否为多模态模型。开启后表示该模型支持视觉输入。默认关闭
- **`extra_params`** — 额外参数（用于 API 调用时的额外配置）。默认为空字典

### extra_params 说明

OpenAI 兼容客户端会将该字典拆分为请求附加项：
- `headers` 会作为请求头传入
- `query` 会作为 URL 查询参数传入
- `body` 会合并到请求体

未放入 `headers`/`query`/`body` 的普通键，也会作为请求体额外字段传入；例如 `{enable_thinking = "false"}` 会传为请求体字段 `enable_thinking`。

该字段不会以 `extra_params` 这个键整体发送给模型服务商。

`temperature` 和 `max_tokens` 也可写在此处作为模型级默认值，但更推荐使用同名独立配置项。

Gemini 客户端会按自身支持的字段筛选并映射到 GenerateContentConfig、EmbedContentConfig 或音频请求配置中。

### 模型配置示例

```toml
[[models]]
name = "deepseek-chat"
model_identifier = "deepseek-chat"
api_provider = "deepseek"
visual = false
price_in = 0.1
price_out = 0.2

[[models]]
name = "gpt-4-cache"                      # 带缓存计费 + 模型级参数覆盖
model_identifier = "gpt-4"
api_provider = "openai"
visual = false
temperature = 0.7                         # 模型级温度，覆盖任务配置
max_tokens = 2048
cache = true
cache_price_in = 0.025
price_in = 0.1
price_out = 0.2
```

---

## 任务配置 [model_task_config]

**说明**：你需要根据模型的特点分配给各种任务，实现最好的表现和最优的效率。

### 任务类型说明

- **`replyer`** — 回复器：生成实际回复。推荐质量好的模型，如 dsv4(思考)/gemini3.1
- **`planner`** — 规划器：决定行动逻辑，搜集信息，何时回复等。推荐实用的模型（需要支持 tool 调用），如 dsv4/qwen3.5-35A3B/gemini3.1
- **`memory`** — 记忆任务：长期记忆总结、抽取、写回等高质量记忆任务。留空时由调用方按需回退
- **`utils`** — 工具类：表情包、学习分析、取名模块、关系模块、麦麦的情绪变化等，是麦麦必须的模型。推荐便宜实用的模型，如 dsv4/qwen3.5-35A3B/gemini3.1-flash/gptmini
- **`learner`** — 学习模型：用于表达方式学习和黑话学习。留空时自动继用 utils 模型
- **`emoji`** — 表情包发送模型配置。留空时保持原有 planner/vlm 选择逻辑
- **`vlm`** — 看图说话：理解图片。推荐视觉模型，如 qwen3.5-35A3B/gemini3.1-flash
- **`voice`** — 语音识别：语音转文字。推荐语音模型，如 whisper-1/qwen-audio
- **`embedding`** — 生成向量：用于记忆搜索。推荐嵌入模型，如 qwen3-embedding

### 任务配置参数

每个任务类型都有以下相同的配置参数：

- **`model_list`** — 使用的模型列表，每个元素对应上面的模型名称（name）。可以写多个，自动切换。默认为空列表
- **`max_tokens`** — 任务最大输出 token 数。默认 1024
- **`temperature`** — 模型温度，范围 0-2。默认 0.3
- **`slow_threshold`** — 慢请求阈值（秒），超过此值会输出警告日志。默认 15.0
- **`selection_strategy`** — 模型选择策略，可选 `balance`（负载均衡，默认）、`random`（随机选择）、`sequential`（按配置顺序优先选择）
- **`hard_timeout`** — 任务硬超时（秒），到点未返回则取消请求并尝试切换下一个模型；防止上游代理静默排队导致主循环饥饿。默认 240.0

### 任务配置示例

```toml
[model_task_config.utils]             # 工具类，用便宜实用的
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.replyer]           # 回复器，用好一点的模型
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.7                     # 回复可以调高温度，更有创意
slow_threshold = 15.0
selection_strategy = "balance"
```

> 💡 `planner`、`vlm`、`voice` 配置结构完全相同，只需替换 `model_list` 中的模型名。例如 `vlm` 填视觉模型（如 `"qwen3.5-flash"`），`voice` 填语音模型（如 `"whisper-1"`）。

---

## 🎯 推荐配置（新手专用）

下面是一个**单模型配置**，所有任务都用同一个模型，适合快速上手：

```toml
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "your-api-key"
auth_type = "bearer"

[[models]]
name = "deepseek-chat"
model_identifier = "deepseek-chat"
api_provider = "deepseek"
visual = false

[model_task_config.utils]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.planner]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.replyer]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.7                    # 回复任务可以调高温度，更有创意
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.voice]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"
```

> 💡 **进阶用法**：等你有多个模型后，可以把不同的任务分配给不同模型。比如 `utils` 用便宜模型，`planner` 和 `replyer` 用质量好的模型（planner 负责决策逻辑，不建议用太差的）。只需修改对应任务的 `model_list` 即可，配置结构完全相同。

---

## 下一步

- 配置 Bot：看 [Bot 配置](./bot-config.md)
- 模型高级参数：看 [模型高级参数](./model-extra-params.md)
- 连接 QQ：看 [NapCat 适配器](../adapters/napcat.md)
- 管理 WebUI：看 [WebUI 配置管理](../webui/config-management.md)