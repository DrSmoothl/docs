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
version = "1.17.2"

[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
auth_type = "bearer"                    # bearer/header/query/none

[[models]]
name = "deepseek-v4-flash"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"               # 对应 api_providers 的 name
visual = false
price_in = 1.0
price_out = 2.0
extra_params = {thinking = {type = "disabled"}}

[model_task_config.replyer]
model_list = ["deepseek-v4-flash"]
max_tokens = 4096
temperature = 1.0
slow_threshold = 120.0
selection_strategy = "random"           # balance/random/sequential
hard_timeout = 240.0
```


## API 提供商 [[api_providers]]

**说明**：API 提供商代表提供 LLM 服务的对象，配置 API 端点、鉴权方式等。

### 基础配置

```toml
[[api_providers]]
# API 服务商名称（可随意命名，在 models 的 api_provider 中需使用这个命名）
name = ""
# API 服务商的 BaseURL
base_url = ""
# API 密钥。对于不需要鉴权的端点，可将 auth_type 设为 none
api_key = ""
# 客户端类型：openai(默认) / google
client_type = "openai"
# 鉴权方式：bearer(默认) / header / query / none
auth_type = "bearer"
# 当 auth_type 为 header 时使用的请求头名称
auth_header_name = "Authorization"
# 当 auth_type 为 header 时使用的请求头前缀，留空表示直接发送原始密钥
auth_header_prefix = "Bearer"
# 当 auth_type 为 query 时使用的查询参数名称
auth_query_name = "api_key"
# 所有请求默认附带的 HTTP Header
default_headers = {}
# 所有请求默认附带的查询参数
default_query = {}
# OpenAI 官方接口可选的 organization
# organization = "org-xxxx"
# OpenAI 官方接口可选的 project
# project = "proj-xxxx"
# 模型列表端点路径
model_list_endpoint = "/models"
# 推理内容解析模式：auto(默认) / native / think_tag / none
reasoning_parse_mode = "auto"
# 工具参数解析模式：auto(默认) / strict / repair / double_decode
tool_argument_parse_mode = "auto"
# 最大重试次数
max_retry = 3
# API 调用超时，单位秒
timeout = 60
# 重试间隔，单位秒
retry_interval = 5
```

### 配置选项详解

**`name`** — API 服务商名称。可随意命名，在 `models` 的 `api_provider` 字段中需使用此名称。**类型**：`str`。**默认值**：`""`（必填）。

**`base_url`** — API 服务商的 BaseURL。**类型**：`str`。**默认值**：`""`（必填）。**示例**：`https://api.deepseek.com/v1`。

**`api_key`** — API 密钥。**类型**：`str`。**默认值**：`""`（必填，除非 `auth_type = "none"`）。**安全提示**：请勿将真实密钥提交到版本控制系统。

**`client_type`** — 客户端类型。**类型**：`str`。**默认值**：`"openai"`。**可选值**：
- `"openai"` — 默认，使用 OpenAI 兼容客户端
- `"google"` — 使用 Google/Gemini 客户端

**`auth_type`** — OpenAI 兼容接口的鉴权方式。**类型**：`str`（枚举）。**默认值**：`"bearer"`。**可选值**：
- `"bearer"` — Bearer Token 鉴权（最常用，适用于大部分 OpenAI 兼容接口）
- `"header"` — 自定义请求头鉴权（适用于需要特殊 Header 的接口）
- `"query"` — 查询参数鉴权（将 API Key 作为 URL 参数传递）
- `"none"` — 无鉴权（适用于公开端点或本地部署）

**`auth_header_name`** — 当 `auth_type = "header"` 时使用的请求头名称。**类型**：`str`。**默认值**：`"Authorization"`。**示例**：`"X-API-Key"`。

**`auth_header_prefix`** — 当 `auth_type = "header"` 时使用的请求头前缀。**类型**：`str`。**默认值**：`"Bearer"`。**说明**：留空表示直接发送原始密钥，不添加前缀。

**`auth_query_name`** — 当 `auth_type = "query"` 时使用的查询参数名称。**类型**：`str`。**默认值**：`"api_key"`。**示例**：`"key"`。

**`default_headers`** — 所有请求默认附带的 HTTP Header。**类型**：`dict[str, str]`。**默认值**：`{}`。**用法**：例如 `{"User-Agent" = "MaiBot/1.0"}`。

**`default_query`** — 所有请求默认附带的查询参数。**类型**：`dict[str, str]`。**默认值**：`{}`。**用法**：例如 `{"version" = "v1"}`。

**`organization`** — OpenAI 官方接口可选的 organization。**类型**：`str | None`。**默认值**：`None`（不设置）。**说明**：仅在使用 OpenAI 官方接口时需要。

**`project`** — OpenAI 官方接口可选的 project。**类型**：`str | None`。**默认值**：`None`（不设置）。**说明**：仅在使用 OpenAI 官方接口时需要。

**`model_list_endpoint`** — 模型列表端点路径。**类型**：`str`。**默认值**：`"/models"`。**说明**：适用于 OpenAI 兼容接口的探测与管理。

**`reasoning_parse_mode`** — 推理内容解析模式。**类型**：`str`（枚举）。**默认值**：`"auto"`。**可选值**：
- `"auto"` — 自动检测（推荐，根据模型响应自动判断）
- `"native"` — 原生解析（适用于支持原生 reasoning 的模型）
- `"think_tag"` — think 标签解析（适用于使用 `<think>` 标签的模型）
- `"none"` — 不解析推理内容（直接忽略 reasoning 字段）

**`tool_argument_parse_mode`** — 工具参数解析模式。**类型**：`str`（枚举）。**默认值**：`"auto"`。**可选值**：
- `"auto"` — 自动检测（推荐）
- `"strict"` — 严格模式（要求参数格式完全匹配）
- `"repair"` — 修复模式（尝试自动修复格式问题）
- `"double_decode"` — 双重解码（适用于需要两次解码的场景）

**`max_retry`** — 最大重试次数。**类型**：`int`。**默认值**：`3`。**取值范围**：`>= 0`。**说明**：单个模型 API 调用失败后，最多重试的次数。

**`timeout`** — API 调用超时时长。**类型**：`int`。**默认值**：`60`。**取值范围**：`>= 1`。**单位**：秒。**说明**：超过此时长，本次请求将被视为"请求超时"。

**`retry_interval`** — 重试间隔。**类型**：`int`。**默认值**：`5`。**取值范围**：`>= 1`。**单位**：秒。**说明**：如果 API 调用失败，重试的间隔时间。

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


## 模型列表 [[models]]

**说明**：模型是具体的 LLM，比如 GPT-4、DeepSeek V3 等。

### 基础配置

```toml
[[models]]
# 模型标识符（API 服务商提供的模型标识符）
model_identifier = ""
# 模型名称（可随意命名，在 model_task_config 中需使用这个命名）
name = ""
# API 服务商名称（对应 api_providers 中配置的服务商名称）
api_provider = ""
# 输入价格，单位：元/M token
price_in = 0.0
# 是否启用缓存计费
cache = false
# 缓存命中输入价格，单位：元/M token，仅 cache=true 时使用
cache_price_in = 0.0
# 输出价格，单位：元/M token
price_out = 0.0
# 模型级别温度（可选），会覆盖任务配置中的温度
# temperature = 0.7
# 模型级别最大 token 数（可选），会覆盖任务配置中的 max_tokens
# max_tokens = 4096
# 强制流式输出模式（模型不支持非流式输出时设为 true）
force_stream_mode = false
# 是否为多模态模型（支持视觉输入）
visual = false
# 额外参数，用于 API 调用时的额外配置
extra_params = {}
```

### 配置选项详解

**`model_identifier`** — 模型标识符。**类型**：`str`。**默认值**：`""`（必填）。**说明**：API 服务商提供的模型标识符，例如 `"deepseek-chat"`、`"gpt-4"`。**格式要求**：必须与 API 服务商文档中的标识符完全一致。

**`name`** — 模型名称。**类型**：`str`。**默认值**：`""`（必填）。**说明**：可随意命名，在 `model_task_config` 中需使用此名称引用该模型。**示例**：`"deepseek-chat"`、`"my-gpt4"`。

**`api_provider`** — API 服务商名称。**类型**：`str`。**默认值**：`""`（必填）。**说明**：对应 `api_providers` 中配置的 `name` 值，用于关联模型与 API 提供商。

**`price_in`** — 输入价格。**类型**：`float`。**默认值**：`0.0`。**取值范围**：`>= 0`。**单位**：元/M token（每百万输入 token 的价格，单位：元）。**示例**：`0.1` 表示每百万输入 token 花费 0.1 元。

**`cache`** — 是否启用模型输入缓存计费。**类型**：`bool`。**默认值**：`false`。**可选值**：
- `true` — 启用缓存计费，命中缓存的输入 token 使用 `cache_price_in` 计费
- `false` — 不启用缓存计费，所有输入 token 使用 `price_in` 计费

**`cache_price_in`** — 缓存命中输入价格。**类型**：`float`。**默认值**：`0.0`。**取值范围**：`>= 0`。**单位**：元/M token。**说明**：仅当 `cache = true` 时使用，表示命中缓存的输入 token 的价格。

**`price_out`** — 输出价格。**类型**：`float`。**默认值**：`0.0`。**取值范围**：`>= 0`。**单位**：元/M token（每百万输出 token 的价格，单位：元）。**示例**：`0.2` 表示每百万输出 token 花费 0.2 元。

**`temperature`** — 模型级别温度。**类型**：`float | None`。**默认值**：`None`（不设置，使用任务配置中的温度）。**取值范围**：`0-2`。**说明**：如果设置，会覆盖任务配置中的 `temperature` 值。**推荐值**：`0.3` 保守稳定，`0.7` 有创意。

**`max_tokens`** — 模型级别最大 token 数。**类型**：`int | None`。**默认值**：`None`（不设置，使用任务配置中的 `max_tokens`）。**取值范围**：`>= 1`。**说明**：如果设置，会覆盖任务配置中的 `max_tokens` 值。

**`force_stream_mode`** — 强制流式输出模式。**类型**：`bool`。**默认值**：`false`。**可选值**：
- `true` — 强制使用流式输出（适用于不支持非流式输出的模型）
- `false` — 默认行为（根据模型能力自动选择）

**`visual`** — 是否为多模态模型。**类型**：`bool`。**默认值**：`false`。**可选值**：
- `true` — 是多模态模型，支持视觉输入（看图说话）
- `false` — 不是多模态模型，仅支持文本输入

**`extra_params`** — 额外参数。**类型**：`dict[str, Any]`。**默认值**：`{}`。**说明**：用于 API 调用时的额外配置。OpenAI 兼容客户端会将该字典拆分为请求附加项：
- `headers` — 作为请求头传入
- `query` — 作为 URL 查询参数传入
- `body` — 合并到请求体
- 未放入 `headers`/`query`/`body` 的普通键，也会作为请求体额外字段传入（例如 `enable_thinking = "false"` 会传为请求体字段 `enable_thinking`）
- **注意**：该字段不会以 `extra_params` 这个键整体发送给模型服务商
- `temperature` 和 `max_tokens` 也可写在此处作为模型级默认值，但更推荐使用同名独立配置项

### extra_params 说明

OpenAI 兼容客户端会将该字典拆分为请求附加项：
- **`headers`** — 作为请求头传入
- **`query`** — 作为 URL 查询参数传入
- **`body`** — 合并到请求体

未放入 `headers`/`query`/`body` 的普通键，也会作为请求体额外字段传入（如 `enable_thinking`）。

### 模型配置示例

```toml
# 基础模型
[[models]]
name = "deepseek-chat"
model_identifier = "deepseek-chat"
api_provider = "deepseek"
visual = false
price_in = 0.1
price_out = 0.2

# 带缓存计费 + 模型级参数覆盖
[[models]]
name = "gpt-4-cache"
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


## 任务配置 [model_task_config]

**说明**：你需要根据模型的特点分配给各种任务，实现最好的表现和最优的效率。

### 任务类型说明

MaiBot 将模型用于 **11 种**不同的任务类型，分为「快模型」和「智能模型」两类：

#### 🔷 智能模型（追求回复质量，用高价/推理模型）

- **`replyer`** — 回复器：生成实际回复。**推荐质量最好的模型**，开启思考模式效果更佳。是唯一使用智能模型的任务

#### 🟢 快模型（追求响应速度，用低价模型）

- **`planner`** — 规划器：决定行动逻辑、搜集信息、何时回复、调用哪些工具。需要支持 tool 调用。**推荐便宜快速的模型**
- **`timing_gate`** — 节奏控制：独立判断是否该在此时说话。留空时自动继用 planner 模型
- **`utils`** — 组件模型：表情包分析、学习分析、取名、关系模块、情绪变化等。麦麦必须的模型。**推荐便宜实用的模型**
- **`mid_memory`** — 中期摘要：当上下文超出限制时，将被裁切的历史聊天记录压缩为摘要。留空时自动继用 planner 模型
- **`learner`** — 学习模型：表达方式学习和黑话学习。留空时自动继用 utils 模型
- **`emoji`** — 表情包选择：从候选表情包中选出合适的一张。留空时按 planner 视觉能力自动选择 planner 或 vlm
- **`vlm`** — 看图说话：理解图片内容。需要 visual=true 的多模态模型
- **`voice`** — 语音识别：语音转文字
- **`embedding`** — 生成向量：用于长期记忆的向量搜索。推荐嵌入模型

#### 回退链

当某个任务的 `model_list` 为空时，系统会自动复用其他任务的配置：

```
learner     →  utils
mid_memory  →  planner
timing_gate →  planner
```

其他任务（`memory`、`emoji`、`vlm`、`voice`、`embedding`）的 `model_list` 为空时不自动回退，调用方会跳过该功能或报错。

### 任务配置参数

每个任务类型都有相同的配置参数：

```toml
[model_task_config.replyer]
# 使用的模型名称列表，每个元素对应 models 中的 name，支持自动切换
model_list = []
# 任务最大输出 token 数
max_tokens = 1024
# 模型温度，范围 0-2：0.3 保守，1.0 有创意
temperature = 0.3
# 慢请求阈值（秒），超过此值会输出警告日志
slow_threshold = 15.0
# 模型选择策略：balance(负载均衡) / random(随机) / sequential(按顺序)
selection_strategy = "balance"
# 任务硬超时（秒），到点未返回则取消请求并切换下一个模型
hard_timeout = 240.0
```

> **⚠️ 注意**：上方是 `TaskConfig` 的类默认值，实际各任务的默认值差异很大。例如 replyer 默认 `temperature=1.0`、`slow_threshold=120s`；planner 默认 `temperature=0.7`、`max_tokens=8000`、`slow_threshold=12s`。具体见下方默认值速查表。

### 任务配置选项详解

**`model_list`** — 使用的模型名称列表。**类型**：`list[str]`。**默认值**：`[]`（必填）。**说明**：每个元素对应 `models` 中的 `name` 值，支持自动切换。当列表中有多个模型时，根据 `selection_strategy` 策略选择使用哪个模型。

**`max_tokens`** — 任务最大输出 token 数。**类型**：`int`。**默认值**：`1024`。**取值范围**：`>= 1`。**说明**：限制模型单次响应的最大输出长度。

**`temperature`** — 模型温度。**类型**：`float`。**默认值**：`0.3`。**取值范围**：`0-2`。**说明**：控制模型响应的随机性。**推荐值**：
- `0.3` — 保守稳定，适合工具类、规划类任务
- `0.7` — 有创意，适合回复类任务
- `1.0+` — 高度随机，一般不推荐

**`slow_threshold`** — 慢请求阈值。**类型**：`float`。**默认值**：`15.0`。**取值范围**：`>= 0`。**单位**：秒。**说明**：超过此值的请求会输出警告日志，用于监控 API 响应速度。

**`selection_strategy`** — 模型选择策略。**类型**：`str`（枚举）。**默认值**：`"balance"`。**可选值**：
- `"balance"` — 负载均衡（推荐，自动在多个模型间均衡分配请求）
- `"random"` — 随机选择（从列表中随机选择一个模型）
- `"sequential"` — 按顺序优先（优先使用列表中的第一个模型，失败后尝试下一个）

**`hard_timeout`** — 任务硬超时。**类型**：`float`。**默认值**：`240.0`。**取值范围**：`>= 1.0`。**单位**：秒。**说明**：到点未返回则取消请求并尝试切换下一个模型；防止上游代理静默排队导致主循环饥饿。

### 11 种任务类型详解

#### 各任务默认参数速查

| 任务 | 默认 model_list | max_tokens | temperature | slow_threshold | selection_strategy | hard_timeout |
|------|----------------|------------|-------------|----------------|-------------------|--------------|
| **replyer** | `deepseek-v4-pro-think`, `deepseek-v4-pro-nonthink` | 4096 | **1.0** | **120.0s** | random | **240.0s** |
| **planner** | `deepseek-v4-flash` | **8000** | 0.7 | **12.0s** | random | 180.0s |
| **timing_gate** | 空（→回退 planner）| 1024 | 0.3 | **12.0s** | random | 120.0s |
| **memory** | 空 | **8192** | 0.5 | 30.0s | random | 240.0s |
| **mid_memory** | 空（→回退 planner）| **8000** | 0.7 | 12.0s | random | 180.0s |
| **utils** | `deepseek-v4-flash` | 4096 | 0.5 | 15.0s | random | 120.0s |
| **learner** | 空（→回退 utils）| 1024 | 0.3 | 15.0s | balance | 120.0s |
| **emoji** | 空 | 1024 | 0.3 | 15.0s | balance | 120.0s |
| **vlm** | 空 | 1024 | 0.3 | 15.0s | balance | 240.0s |
| **voice** | 空 | 1024 | 0.3 | 15.0s | balance | 120.0s |
| **embedding** | 空 | 1024 | 0.3 | 15.0s | balance | 60.0s |

> 上方为系统默认值（从 `default_model_config.py` 生成）。当 `model_list` 为空时，标注了「→回退 xxx」的任务会自动复用对应任务的配置；未标注回退的任务不自动回退（调用方会跳过或报错）。

#### 设计理念：快模型 vs 智能模型

麦麦将模型调用分为两类：

- **快模型（追求速度）**：用于 `planner`、`timing_gate`、`utils`、`mid_memory`、`learner` 等决策和辅助任务。使用低价 flash 模型（如 deepseek-v4-flash，¥1/M token），`slow_threshold` 低至 12s，`hard_timeout` 短至 120s
- **智能模型（追求质量）**：仅 `replyer` 使用。使用高价 pro 模型（如 deepseek-v4-pro-think，¥12/M token），开启思考模式、高温度、高创造性，`slow_threshold` 高达 120s，「故意」允许模型慢慢思考

一次典型的「收到消息→发出回复」流程中，会触发 3~6 次 LLM 调用，**其中只有 replyer 使用智能模型**，其余全部用快模型。

#### 各任务详细说明

**`replyer`** — 回复器。**用途**：生成最终发送给用户的实际回复文本。**推荐**：质量最好的模型，开启思考模式（`thinking.type=enabled`）效果更佳。温度可调高（默认 1.0）增加创造性。**默认**：使用 deepseek-v4-pro-think（思考）和 deepseek-v4-pro-nonthink（非思考）做负载均衡。

**`planner`** — 规划器。**用途**：决定行动逻辑——是否回复、回复谁、搜集什么信息、调用哪些工具。需要支持 tool 调用。**推荐**：便宜快速的模型，支持 tool 调用即可。**默认**：使用 deepseek-v4-flash。

**`timing_gate`** — 节奏控制。**用途**：独立判断麦麦是否该在此刻说话（仅当 `chat.enable_independent_timing_gate=true` 时启用）。可选输出：`continue`（继续规划）、`no_action`（沉默）、`wait`（等待一会再判断）。**推荐**：可继用 planner 模型。**默认**：空（回退到 planner 配置）。

**`utils`** — 组件模型。**用途**：表情包分析、学习分析、取名、关系模块、情绪变化等组件调用。麦麦必须的模型。**推荐**：便宜实用的模型。**默认**：使用 deepseek-v4-flash。

**`mid_memory`** — 中期聊天摘要。**用途**：当上下文消息超出 `max_context_size` 限制时，将被裁切掉的历史聊天记录压缩为一句话摘要，作为可展开的复杂消息保留在历史中。**触发条件**：`chat.mid_term_memory=true` 且上下文溢出。**默认**：空（回退到 planner 配置）。

**`memory`** — 长期记忆。**用途**：长期记忆的总结、抽取、写回等高质量记忆任务（A_Memorix 子系统）。**推荐**：质量好的模型。**默认**：空（调用方按需处理，未配置时记忆系统使用自己的优先级规则选择其他可用任务）。

**`learner`** — 学习模型。**用途**：表达方式学习和黑话学习。**推荐**：可继用 utils 模型。**默认**：空（回退到 utils 配置）。

**`emoji`** — 表情包选择。**用途**：从候选表情包拼图中选出合适的一张发送。**默认**：空。系统会按以下优先级自动选择：如果 `emoji` 配置了模型→使用；否则如果 planner 的所有模型都是视觉模型→使用 planner；否则→使用 vlm。

**`vlm`** — 视觉模型。**用途**：理解图片内容（看图说话）。**推荐**：多模态模型（`visual=true`）。**默认**：空，未配置时图片相关功能不可用。

**`voice`** — 语音识别。**用途**：语音转文字（ASR）。**推荐**：支持语音的模型。**默认**：空，未配置时语音识别不可用。

**`embedding`** — 嵌入模型。**用途**：生成文本向量，用于长期记忆的语义搜索。**推荐**：专门的嵌入模型（如 text-embedding-3-small）。**默认**：空，未配置时记忆搜索不可用。

### 任务配置示例

```toml
# 工具类，用便宜实用的模型
[model_task_config.utils]
model_list = ["deepseek-v4-flash"]
max_tokens = 4096
temperature = 0.5
slow_threshold = 15.0
selection_strategy = "random"

# 规划器，用低价 flash 模型追求速度
[model_task_config.planner]
model_list = ["deepseek-v4-flash"]
max_tokens = 8000
temperature = 0.7
slow_threshold = 12.0
selection_strategy = "random"

# 回复器，用高质量思考模型，温度高更有创意
[model_task_config.replyer]
model_list = ["deepseek-v4-pro-think", "deepseek-v4-pro-nonthink"]
max_tokens = 4096
temperature = 1.0
slow_threshold = 120.0
selection_strategy = "random"

# 视觉模型，需要 visual=true 的多模态模型
[model_task_config.vlm]
model_list = ["qwen3-vl-flash"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

# 嵌入模型，用于记忆搜索
[model_task_config.embedding]
model_list = ["text-embedding-3-small"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"
```


## 🎯 推荐配置（新手专用）

### 方案一：单模型配置（最快上手）

所有任务共用一个模型，适合只有一个 API key 的场景：

```toml
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com"
api_key = "your-api-key"
auth_type = "bearer"

[[models]]
name = "deepseek-v4-flash"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
visual = false
price_in = 1.0
price_out = 2.0
extra_params = {thinking = {type = "disabled"}}

[model_task_config.planner]
model_list = ["deepseek-v4-flash"]
max_tokens = 8000
temperature = 0.7

[model_task_config.replyer]
model_list = ["deepseek-v4-flash"]
max_tokens = 4096
temperature = 0.7

[model_task_config.utils]
model_list = ["deepseek-v4-flash"]
max_tokens = 4096
temperature = 0.5
```

::: tip 💡 不需要填满所有 11 个任务
上述只配置了 `planner`、`replyer`、`utils` 三个核心任务。其余 8 个任务（`timing_gate`、`mid_memory`、`learner` 等）的 `model_list` 留空即可——系统会自动回退到已配置的任务。
:::

### 方案二：快慢分离（推荐生产使用）

规划器用 flash 快模型，回复器用 pro 思考模型：

```toml
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com"
api_key = "your-api-key"
auth_type = "bearer"

# 快模型：用于 planner、utils 等决策任务
[[models]]
name = "deepseek-v4-flash"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
visual = false
price_in = 1.0
price_out = 2.0
extra_params = {thinking = {type = "disabled"}}

# 智能模型（思考模式）：用于 replyer 回复
[[models]]
name = "deepseek-v4-pro-think"
model_identifier = "deepseek-v4-pro"
api_provider = "deepseek"
visual = false
price_in = 12.0
price_out = 24.0
extra_params = {thinking = {type = "enabled"}, reasoning_effort = "high"}

[model_task_config.planner]
model_list = ["deepseek-v4-flash"]
max_tokens = 8000
temperature = 0.7

[model_task_config.replyer]
model_list = ["deepseek-v4-pro-think"]
max_tokens = 4096
temperature = 1.0

[model_task_config.utils]
model_list = ["deepseek-v4-flash"]
max_tokens = 4096
temperature = 0.5
```

> 💡 **进阶用法**：有更多模型后，可以为 `vlm` 配置视觉模型（看图）、为 `embedding` 配置嵌入模型（记忆搜索），只需在对应任务下填写 `model_list` 即可。


## 下一步

- 配置 Bot：看 [Bot 配置](./bot-config.md)
- 模型高级参数：看 [模型高级参数](./model-extra-params.md)
- 连接 QQ：看 [NapCat 适配器](../adapters/napcat.md)
- 管理 WebUI：看 [WebUI 配置管理](../webui/config-management.md)