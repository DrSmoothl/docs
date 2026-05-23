---
title: Model Configuration
---

# Set Up the AI Brain

`model_config.toml` is the file used to configure MaiMai's "AI brain". It decides which LLM each MaiMai component uses.

We recommend assigning different models based on the characteristics of different tasks.

MaiMai's configuration must include one LLM model (or VLM), one VLM model, and one embedding model.

## Configuration File Structure

```toml
# Configuration file version
[inner]
version = "1.14.0"

# API provider list (AI service providers)
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
auth_type = "bearer"                    # Auth type: bearer/header/query/none

# Model list (which specific AI to use)
[[models]]
name = "deepseek-chat"
model_identifier = "deepseek-chat"
api_provider = "deepseek"
visual = false                          # Whether supports vision
price_in = 0.1                          # Input price (yuan/million tokens)
price_out = 0.2                         # Output price (yuan/million tokens)

# Task assignment (different work uses different AI)
[model_task_config.replyer]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0                   # Slow request threshold (seconds)
selection_strategy = "balance"          # Model selection strategy: balance/random/sequential
```

## API Providers [[api_providers]]

API providers represent the services that provide LLM capabilities.

### Basic Configuration (Required)

- **`name`** — Provider name, choose a name yourself, such as "deepseek" or "openai"
- **`base_url`** — API address, the URL provided by the service provider
- **`api_key`** — Key, the key you get after registration
- **`auth_type`** — Authentication type, `bearer` (default), `header`, `query`, `none`

### Common Provider Configuration Examples

::: code-group

```toml [DeepSeek]
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "sk-your-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [OpenAI]
[[api_providers]]
name = "openai"
base_url = "https://api.openai.com/v1"
api_key = "sk-your-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [Alibaba Bailian]
[[api_providers]]
name = "aliyun"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
api_key = "sk-your-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [ByteDance Volcengine]
[[api_providers]]
name = "volcengine"
base_url = "https://ark.cn-beijing.volces.com/api/v3"
api_key = "sk-your-key"
client_type = "openai"
auth_type = "bearer"
```

```toml [Custom Header Auth]
[[api_providers]]
name = "custom"
base_url = "https://api.example.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "header"
auth_header_name = "X-API-Key"
auth_header_prefix = ""
```

```toml [Query Parameter Auth]
[[api_providers]]
name = "query_auth"
base_url = "https://api.example.com/v1"
api_key = "your-api-key"
client_type = "openai"
auth_type = "query"
auth_query_name = "key"
```

:::

> 📖 See: [Model Advanced Parameters](./model-extra-params#api-provider-advanced-config) for advanced auth, parameters, and runtime settings.

## Model List [[models]]

Models are specific LLMs, such as GPT-5.4, DeepSeek V4, and so on.

### Basic Configuration (Required)

- **`name`** — Model name, choose a name yourself, such as "gpt-5" or "deepseek-v4"
- **`model_identifier`** — Model ID, the specific model name provided by the service provider
- **`api_provider`** — Which provider to use, fill in the `name` from `api_providers` above
- **`visual`** — Whether to enable vision, only multimodal models can enable this option
- **`price_in`** — Input price, yuan per million tokens. Default: 0.0
- **`price_out`** — Output price, yuan per million tokens. Default: 0.0

### Billing Configuration (Optional)

- **`price_in`** — Input price, yuan per million tokens. Default: 0.0
- **`price_out`** — Output price, yuan per million tokens. Default: 0.0
- **`cache`** — Enable cache billing, use cache_price_in for cache hits when enabled. Default: disabled
- **`cache_price_in`** — Cache input price, yuan per million tokens. Default: 0.0

> 📖 See: [Model Advanced Parameters](./model-extra-params#model-advanced-parameters) for model-level overrides and advanced parameters.

> 📖 **See: [Model Extra Parameters (extra_params)](./model-extra-params)** — Complete guide covering thinking mode, reasoning depth, custom HTTP parameters, and more.
>

### Model Configuration Example

```toml
[[models]]
name = "deepseek-chat"                    # I call it "deepseek-chat"
model_identifier = "deepseek-chat"        # The provider also calls it this
api_provider = "deepseek"                 # Use the deepseek provider
visual = false                            # Cannot see images
price_in = 0.1                            # Input price: 0.1 yuan per million tokens
price_out = 0.2                           # Output price: 0.2 yuan per million tokens

[[models]]
name = "qwen3.5-vl"                       # Vision model, can see images
model_identifier = "qwen3.5-flash"
api_provider = "aliyun"
visual = true                             # ✅ Can see images
price_in = 0.05                           # Input price: 0.05 yuan per million tokens
price_out = 0.1                           # Output price: 0.1 yuan per million tokens

[[models]]
name = "gpt-4-cache"                      # Model with cache billing
temperature = 0.7                         # Model-level temperature setting
max_tokens = 2048                         # Model-level max tokens
model_identifier = "gpt-4"
api_provider = "openai"
visual = false
cache = true                              # Enable cache billing
cache_price_in = 0.025                    # Cache hit price
price_in = 0.1                            # Normal input price
price_out = 0.2                           # Output price
```


## Task Configuration [model_task_config]

You need to assign models to different tasks based on model characteristics to achieve the best performance and efficiency.

### Task Type Description

- **`utils`** — Tool tasks: emoji, learning analysis. Recommended: cheap and practical models, e.g. dsv4/qwen3.5-35A3B/gemini3.1-flash/gptmini
- **`planner`** — Planner: decides action logic, collects information, decides when to reply, etc. Recommended: practical models (needs tool calling support), e.g. dsv4/qwen3.5-35A3B/gemini3.1
- **`replyer`** — Replyer: generates the actual reply. Recommended: high-quality models, e.g. dsv4(thinking)/gemini3.1
- **`vlm`** — Image understanding: talks about pictures. Recommended: vision models, e.g. qwen3.5-35A3B/gemini3.1-flash
- **`voice`** — Speech recognition: voice to text. Recommended: speech models, e.g. whisper-1/qwen-audio
- **`embedding`** — Generate vectors: used for memory search. Recommended: embedding models, e.g. qwen3-embbeding

### Task Configuration Example

```toml
[model_task_config.utils]             # Tool tasks, use cheap and practical ones
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.replyer]           # Replyer, use a better model
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.7                     # Higher temperature for more creative replies
slow_threshold = 15.0
selection_strategy = "balance"
```

> 💡 `planner`, `vlm`, and `voice` share the exact same config structure. Just swap the model names in `model_list`. For example, use a vision model like `"qwen3.5-flash"` for `vlm`, or a speech model like `"whisper-1"` for `voice`.

### Parameter Description

- **`max_tokens`** — Maximum output length. Recommended: `1024`
- **`temperature`** — Creativity (0-2), `0.3` conservative, `0.7` creative
- **`model_list`** — Which models to use, multiple models can be written, automatically switched
- **`slow_threshold`** — Slow request threshold (seconds), outputs warning log when exceeded. Recommended: `15.0`
- **`selection_strategy`** — Model selection strategy, `balance` (default), `random`, `sequential`

## 🎯 Recommended Configuration (For Beginners)

Below is a **single-model configuration** where all tasks use the same model. Good for getting started quickly:

```toml
[[api_providers]]
name = "deepseek"
base_url = "https://api.deepseek.com/v1"
api_key = "sk-your-key"
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
temperature = 0.7                    # Higher temperature for more creative replies
slow_threshold = 15.0
selection_strategy = "balance"

[model_task_config.voice]
model_list = ["deepseek-chat"]
max_tokens = 1024
temperature = 0.3
slow_threshold = 15.0
selection_strategy = "balance"
```

> 💡 **Going further**: Once you have multiple models, you can assign different tasks to different ones. For example, use a cheap model for `utils`, and better models for `planner` and `replyer` (planner handles decision logic — don't go too cheap). Just change the `model_list` for each task. The config structure is the same.
