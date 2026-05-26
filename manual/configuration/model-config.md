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

MaiBot 将模型用于 9 种不同的任务类型：

- **`replyer`** — 回复器：生成实际回复。推荐质量好的模型
- **`planner`** — 规划器：决定行动逻辑，搜集信息，何时回复等。需要支持 tool 调用
- **`memory`** — 记忆任务：长期记忆总结、抽取、写回等。留空时由调用方按需回退
- **`utils`** — 工具类：表情包、学习分析、取名、关系模块、情绪变化等，是麦麦必须的模型。推荐便宜实用的模型
- **`learner`** — 学习模型：表达方式学习和黑话学习。留空时自动继用 utils 模型
- **`emoji`** — 表情包发送模型。留空时保持原有 planner/vlm 选择逻辑
- **`vlm`** — 看图说话：理解图片。推荐视觉模型
- **`voice`** — 语音识别：语音转文字。推荐语音模型
- **`embedding`** — 生成向量：用于记忆搜索。推荐嵌入模型

### 任务配置参数

每个任务类型都有相同的配置参数：

```toml
[model_task_config.replyer]
# 使用的模型名称列表，每个元素对应 models 中的 name，支持自动切换
model_list = []
# 任务最大输出 token 数
max_tokens = 1024
# 模型温度，范围 0-2：0.3 保守，0.7 有创意
temperature = 0.3
# 慢请求阈值（秒），超过此值会输出警告日志
slow_threshold = 15.0
# 模型选择策略：balance(负载均衡) / random(随机) / sequential(按顺序)
selection_strategy = "balance"
# 任务硬超时（秒），到点未返回则取消请求并切换下一个模型
hard_timeout = 240.0
```

> `replyer`、`planner`、`memory`、`utils`、`learner`、`emoji`、`vlm`、`voice`、`embedding` 全部使用相同的参数结构，只需替换 `model_list` 中的模型名即可。

### 任务配置示例

```toml
# 工具类，用便宜实用的模型
[model_task_config.utils]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

# 回复器，用好一点的模型，温度高一点更有创意
[model_task_config.replyer]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.7
slow_threshold = 15.0
selection_strategy = "balance"

# 视觉模型，需要 visual=true 的模型
[model_task_config.vlm]
model_list = ["qwen3.5-flash"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

# 嵌入模型，用于记忆搜索
[model_task_config.embedding]
model_list = ["qwen3-embedding"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"
```


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


## 下一步

- 配置 Bot：看 [Bot 配置](./bot-config.md)
- 模型高级参数：看 [模型高级参数](./model-extra-params.md)
- 连接 QQ：看 [NapCat 适配器](../adapters/napcat.md)
- 管理 WebUI：看 [WebUI 配置管理](../webui/config-management.md)
