---
title: Model Extra Parameters
titleTemplate: :title · Model Extra Parameters
---

# Model Advanced Parameters

Each model in `model_config.toml` can set the `extra_params` field, allowing you to pass provider-specific additional parameters during API calls.

> 💡 **Tip**: Except for the three special keys (`headers`, `query`, `body`), all other keys are merged into the request body (i.e., OpenAI SDK's `extra_body` parameter).

## API Provider Advanced Config

### Advanced Auth Configuration

- **`auth_header_name`** — Header auth name. Default: `Authorization`
- **`auth_header_prefix`** — Header auth prefix. Default: `Bearer`
- **`auth_query_name`** — Query auth param name. Default: `api_key`

### Advanced Parameters

- **`default_headers`** — Default HTTP headers. Default: empty
- **`default_query`** — Default query params. Default: empty
- **`organization`** — OpenAI org (optional). Default: none
- **`project`** — OpenAI project (optional). Default: none
- **`model_list_endpoint`** — Model list endpoint. Default: `/models`
- **`reasoning_parse_mode`** — Reasoning parse mode. Default: `auto`
- **`tool_argument_parse_mode`** — Tool argument parse mode. Default: `auto`

### Runtime Configuration

- **`timeout`** — Timeout. Recommended: 10 seconds
- **`max_retry`** — Max retries. Recommended: 2 times
- **`retry_interval`** — Retry interval. Recommended: 10 seconds

#### Internal Translation Mechanism

`extra_params` is an internal MaiBot configuration field. **It is not sent as-is to the model provider**. Before the request is sent, the client converts it into the extra arguments supported by the corresponding SDK.

The OpenAI-compatible client (`client_type = "openai"`) splits `extra_params` using these rules:

- **`headers`** — Sent as request headers
- **`query`** — Sent as URL query parameters
- **`body`** — Merged into the request body
- **Other plain keys** — Sent as extra request body fields

For example:

```toml
extra_params = {
  headers = {"X-Trace-Id" = "test-001"},
  query = {version = "2024-01-01"},
  body = {metadata = {source = "maibot"}},
  enable_thinking = "false"
}
```

This is converted to request extras similar to:

```python
extra_headers = {"X-Trace-Id": "test-001"}
extra_query = {"version": "2024-01-01"}
extra_body = {
    "metadata": {"source": "maibot"},
    "enable_thinking": "false",
}
```

A common configuration like `extra_params = {enable_thinking = "false"}` sends `enable_thinking` as a request body field to the provider, not as a nested `{"extra_params": {"enable_thinking": "false"}}`.

## Model Advanced Parameters

### Parameter Overrides

- **`temperature`** — Model-level temperature, overrides task config temp. Optional
- **`max_tokens`** — Model-level max tokens, overrides task config max_tokens. Optional

### Other Advanced Parameters

- **`force_stream_mode`** — Force streaming, set `true` if non-streaming unsupported. Default: disabled
- **`extra_params`** — Extra parameters, custom API params, see scenarios below. Default: empty

#### Priority Rules

`temperature` and `max_tokens` can be written in `extra_params` as model-level defaults, but the dedicated model fields are recommended:

```toml
temperature = 0.7
max_tokens = 4096
```

This keeps the configuration clearer and avoids confusion with provider-specific request body fields that may use the same names.

When the same parameter exists in multiple places, the priority order is:

1. Values explicitly passed by the current request
2. Dedicated fields in the current model config, such as `temperature` and `max_tokens`
3. Same-name fields in the current model's `extra_params`
4. Defaults from the current task config

---

## Enabling Thinking Mode

Many large models support "thinking mode" — letting the model perform deep reasoning before answering, improving response quality for complex questions.

### DeepSeek

```toml
[[models]]
name = "deepseek-r1"
model_identifier = "deepseek-reasoner"
api_provider = "deepseek"
visual = false
extra_params = {enable_thinking = true}   # Enable thinking mode
```

- **`enable_thinking`** — `true` to enable thinking, `false` to disable

## Adjusting Reasoning Depth

OpenAI's reasoning models use the `reasoning_effort` parameter to control reasoning depth.

- **`none`** — Simple Q&A, information retrieval. Fastest, no reasoning
- **`minimal`** — Minimal reasoning. Almost no added latency
- **`low`** — Tool calls, search, multi-step decisions. Light reasoning
- **`medium`** — Planning, complex reasoning (default). Balance of quality and speed
- **`high`** — Complex debugging, deep planning. Quality prioritized
- **`xhigh`** — Deep research, async tasks. Highest quality, maximum latency

```toml
[[models]]
name = "gpt-5"
model_identifier = "gpt-5.5"
api_provider = "openai"
visual = false
extra_params = {reasoning_effort = "medium"}
```

> 💡 **Recommendation**: Use `medium` for daily use, `low` for speed-sensitive tasks, `high` for deep analysis.

## About client_type and Gemini

`client_type` determines which client MaiBot uses to communicate with the API:

- **`openai`** — OpenAI-compatible interface (default), works with DeepSeek, Alibaba Bailian, OpenAI, etc.
- **`google`** — Google Gemini native interface, supports thinking budget control

### Gemini Thinking Configuration

Gemini models use `thinking_config` in `extra_params` to control thinking:

```toml
[[models]]
name = "gemini-2.5-flash"
model_identifier = "gemini-2.5-flash"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_budget = 4096}}
```

> ⚠️ Google API is not directly accessible in China. You'll need a proxy.

### Gemini Extra Parameter Fields

When `client_type = "google"`, `extra_params` does not follow the OpenAI-compatible `headers/query/body` splitting rules. The Gemini client filters and maps fields according to what it supports:

- Content generation: mapped to supported `GenerateContentConfig` fields
- Embeddings: mapped to supported `EmbedContentConfig` fields

- **`thinking_budget`** — Thinking budget (token count)
- **`include_thoughts`** — Whether to include thinking process in responses
- **`enable_google_search`** — Enable Google search capability
- **`task_type`** — Embedding task type
- **`output_dimensionality`** — Embedding output dimensionality
- **`audio_mime_type`** — MIME type for audio requests

## Custom HTTP Requests

`extra_params` supports three special keys for precise API request control:

- **`headers`** — Add HTTP request headers, e.g. `{headers: {"X-Custom": "value"}}`
- **`query`** — Add URL query parameters, e.g. `{query: {"key": "value"}}`
- **`body`** — Override request body fields, e.g. `{body: {"field": "value"}}`

```toml
[[models]]
name = "custom-model"
model_identifier = "custom-model-v1"
api_provider = "custom"
visual = false
extra_params = {headers = {"X-API-Version" = "2024-06", "X-Priority" = "high"}}
```

## Combining Parameters

You can use multiple parameters together:

```toml
[[models]]
name = "gpt-5-advanced"
model_identifier = "gpt-5.5"
api_provider = "openai"
visual = true
extra_params = {
    reasoning_effort = "high",
    headers = {"X-Request-ID" = "custom-id", "X-Priority" = "high"}
}
```

## Quick Parameter Reference

- **`enable_thinking`** — Enable thinking mode. Providers: DeepSeek
- **`reasoning_effort`** — Reasoning depth level. Providers: OpenAI
- **`headers`** — Custom HTTP request headers. Providers: All
- **`query`** — Custom URL query parameters. Providers: All
- **`body`** — Custom request body fields. Providers: All
- **`thinking_config`** — Thinking budget config. Providers: Gemini

> ⚠️ **Note**: Parameters are passed directly to the LLM API. Ensure parameter names and value formats match your provider's documentation, otherwise API calls may fail.