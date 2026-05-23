---
title: 模型配置
---

# 设置AI大脑

`model_config.toml` 是给麦麦配置"AI大脑"的文件，决定了麦麦的不同组件使用什么LLM

我们推荐根据不同任务的特性来分配不同的模型

最少启动只需要至少一个LLM模型和一个API提供商（`models` 和 `api_providers` 均非空即可）；要完整功能还需要配置 VLM 模型（看图说话）和嵌入模型（记忆搜索）

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

API 提供商代表提供LLM服务的对象

### 基础配置（必填）

- **`name`** — 服务商名字，自己取个名字，比如"deepseek"、"openai"
- **`base_url`** — API地址，服务商提供的url
- **`api_key`** — 密钥，注册后获得的密钥
- **`auth_type`** — 鉴权方式，`bearer`（默认）、`header`、`query`、`none`

### 常见服务商配置示例

::: code-group

```toml [DeepSeek（bearer鉴权）]
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [自定义Header鉴权]
[[api_providers]]
name = "custom"
base_url = "https://api.example.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "header"
auth_header_name = "X-API-Key"
auth_header_prefix = ""
```

```toml [Query参数鉴权]
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

> 📖 高级鉴权、参数、运行时配置请参阅：[模型高级参数](./model-extra-params#高级鉴权配置)

## 模型列表 [[models]]

模型就是具体的LLM，比如GPT-5.4、DeepSeek V4等。

### 基础配置（必填）

- **`name`** — 模型名字，自己取个名字，比如"gpt-5"、"deepseek-v4"
- **`model_identifier`** — 模型ID，服务商提供的具体模型名称
- **`api_provider`** — 用哪个服务商，填上面api_providers（提供商）里的name
- **`visual`** — 是否启用视觉，只有多模态模型可以打开此选项

### 计费配置（可选）

- **`price_in`** — 输入价格，元/百万token。默认 0.0
- **`price_out`** — 输出价格，元/百万token。默认 0.0
- **`cache`** — 启用缓存计费，开启后缓存命中用cache_price_in计费。默认关闭
- **`cache_price_in`** — 缓存输入价格，元/百万token。默认 0.0

> 📖 模型级覆盖和高级参数请参阅：[模型高级参数](./model-extra-params#其他高级参数)

> 📖 **详细说明请参阅：[模型额外参数 (extra_params)](./model-extra-params)** — 包含思考模式配置、推理深度调整、自定义 HTTP 参数等完整指南。
>

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



## 任务配置 [model_task_config]

你需要根据模型的特点分给各种任务，实现最好的表现和最优的效率

### 任务类型说明

- **`utils`** — 工具类：表情包、学习分析。推荐便宜实用的模型，如 dsv4/qwen3.5-35A3B/gemini3.1-flash/gptmini
- **`planner`** — 规划器：决定行动逻辑，搜集信息，何时回复等。推荐实用的模型（需要支持tool调用），如 dsv4/qwen3.5-35A3B/gemini3.1
- **`replyer`** — 回复器：生成实际回复。推荐质量好的模型，如 dsv4(思考)/gemini3.1
- **`vlm`** — 看图说话：理解图片。推荐视觉模型，如 qwen3.5-35A3B/gemini3.1-flash
- **`voice`** — 语音识别：语音转文字。推荐语音模型，如 whisper-1/qwen-audio
- **`embedding`** — 生成向量：用于记忆搜索。推荐嵌入模型，如 qwen3-embbeding

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

### 参数说明

- **`max_tokens`** — 最多输出多少token。推荐 `1024`
- **`temperature`** — 创造性（0-2），`0.3` 保守，`0.7` 有创意
- **`model_list`** — 用哪些模型，可以写多个，自动切换
- **`slow_threshold`** — 慢请求阈值（秒），超过会输出警告日志。推荐 `15.0`
- **`selection_strategy`** — 模型选择策略，`balance`（默认）、`random`、`sequential`

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

