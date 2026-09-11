---
title: Model Extra Parameters
titleTemplate: :title · Model Parameters
---

# Model Extra Parameters (extra_params)

Every model in `model_config.toml` accepts an `extra_params` field for passing provider-specific parameters in API calls. The most common use is controlling a model's thinking mode and reasoning intensity.

`extra_params` is not sent to the provider as-is. Before the request, the client splits and converts it by rule:

- **`headers`** — passed as HTTP request headers
- **`query`** — passed as URL query parameters
- **`body`** — merged into the request body
- **Other plain keys** — passed as extra request-body fields (the OpenAI SDK's `extra_body`)

When `client_type = "google"`, `extra_params` is not split by the rules above. Instead, the Gemini client filters the fields it supports and maps them to `GenerateContentConfig`.

---

## Thinking and Non-thinking Modes

Many large models support a "thinking mode" — deep reasoning before answering, improving response quality on complex questions. MaiBot supports two API families, each configured differently:

- **OpenAI-compatible API** (`client_type = "openai"`): DeepSeek, OpenAI, Alibaba Cloud Bailian, etc.
- **Gemini native API** (`client_type = "google"`): the Google Gemini family

### OpenAI-compatible APIs

The `thinking` object is a thinking-mode switch shared by several providers. **DeepSeek**, **Kimi (Moonshot)**, and **GLM (Zhipu)** all use this format in exactly the same way. `reasoning_effort` is optional; omit it to use the default intensity. Some third-party platforms (e.g. Alibaba Cloud Bailian / DashScope) use the `enable_thinking` parameter format instead:

::: code-group

```toml [Official (thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-think"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
visual = false
extra_params = {thinking = {type = "enabled"}, reasoning_effort = "high"}
```

```toml [Official (non-thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-nothink"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
visual = false
extra_params = {thinking = {type = "disabled"}}
```

```toml [Official (max) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-max"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
visual = false
extra_params = {thinking = {type = "enabled"}, reasoning_effort = "max"}
```

```toml [Third-party (thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-think"
model_identifier = "deepseek-v4-flash"
api_provider = "dashscope"
visual = false
extra_params = {enable_thinking = true}
```

```toml [Third-party (non-thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-nothink"
model_identifier = "deepseek-v4-flash"
api_provider = "dashscope"
visual = false
extra_params = {enable_thinking = false}
```

:::

**Key points:**

- DeepSeek V4's `reasoning_effort` only supports two valid levels: `high` (default) and `max` (maximum reasoning). `low`/`medium` map to `high`, and `xhigh` maps to `max`
- Compared with OpenAI: OpenAI's `reasoning_effort` supports 6 independent levels (`none`/`minimal`/`low`/`medium` (default)/`high`/`xhigh`), each effective on its own — unlike DeepSeek V4's 2 valid levels. Note that `o1-mini` does not support this parameter
- **Multi-turn rule**: if a thinking turn contains no tool calls, there is no need to send the thinking content back; if there are tool calls, it must be sent back
- **Limitations**: in thinking mode `temperature` and `top_p` are silently ignored, and `tool_choice` causes a 400 error
- Third-party platforms (e.g. Alibaba Cloud Bailian / DashScope) control thinking mode with the `enable_thinking` boolean, which differs from the native `thinking` object. Confirm which format your platform supports before configuring

### Responses API

Some providers (e.g. DeepSeek v4 flash web search) use OpenAI's **Responses protocol** and require `client_type = "openai_responses"` in the provider configuration. The Responses API parameter format differs slightly from Chat Completions:

- **Thinking mode**: use `reasoning = {effort = "..."}` instead of `thinking`/`reasoning_effort`; `effort` accepts `none` / `low` / `high` / `max`
- **Web search**: add the native `web_search` tool to the `tools` list to enable it

::: code-group

```toml [Responses (thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-responses-think"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
client_type = "openai_responses"
extra_params = {reasoning = {effort = "high"}}
```

```toml [Responses (non-thinking) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-responses-nothink"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
client_type = "openai_responses"
extra_params = {reasoning = {effort = "none"}}
```

```toml [Responses (web search) ~vscode-icons:file-type-toml~]
[[models]]
name = "deepseek-v4-flash-responses-web"
model_identifier = "deepseek-v4-flash"
api_provider = "deepseek"
client_type = "openai_responses"
extra_params = {reasoning = {effort = "high"}, tools = [{type = "web_search"}]}
```

:::

**Key points:**

- In the Responses client, do not write `thinking` or `reasoning_effort`; always use `reasoning.effort`, otherwise the request is rejected by validation
- `reasoning.effort` has one more level than Chat Completions: `none` (fully disables thinking)
- The `web_search` tool is passed via `extra_params.body.tools` (fields in the `body` group are merged into the request body together with other plain keys — see [Custom HTTP Requests](#custom-http-requests))
- DeepSeek's Chat Completions endpoint does not support native web search; using web search requires the `openai_responses` client
- The Maisaka monitoring page and logs show a web-search summary for the turn (queries, actions, status, and source count)

### Gemini Native API

When `client_type = "google"`, `extra_params` is not processed by the OpenAI `headers/query/body` rules. The Gemini client filters the fields it supports and maps them to `GenerateContentConfig`.

#### Gemini 2.5 (thinking_budget)

The Gemini 2.5 family controls the thinking budget with `thinking_budget` (an integer):

::: code-group

```toml [Enable thinking ~vscode-icons:file-type-toml~]
[[models]]
name = "gemini-2.5-flash-think"
model_identifier = "gemini-2.5-flash"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_budget = 4096, include_thoughts = true}}
```

```toml [Disable thinking ~vscode-icons:file-type-toml~]
[[models]]
name = "gemini-2.5-flash-nothink"
model_identifier = "gemini-2.5-flash"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_budget = 0}}
```

```toml [Auto budget ~vscode-icons:file-type-toml~]
[[models]]
name = "gemini-2.5-pro-think"
model_identifier = "gemini-2.5-pro"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_budget = -1, include_thoughts = true}}
```

:::

**Key points:**

- `thinking_budget`: `-1` = automatic allocation, `0` = thinking disabled, `N` = a token budget
- `include_thoughts`: whether the response includes the thinking process
- Known issue: on Flash Preview 04-17, setting `thinking_budget = 0` may fail

#### Gemini 3.0+ (thinking_level)

Gemini 3.0 and later control thinking intensity with `thinking_level` (an enum):

::: code-group

```toml [High-intensity thinking ~vscode-icons:file-type-toml~]
[[models]]
name = "gemini-3-flash-high"
model_identifier = "gemini-3-flash"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_level = "high", include_thoughts = true}}
```

```toml [Low-intensity thinking ~vscode-icons:file-type-toml~]
[[models]]
name = "gemini-3-flash-low"
model_identifier = "gemini-3-flash"
api_provider = "google-gemini"
visual = true
client_type = "google"
extra_params = {thinking_config = {thinking_level = "low", include_thoughts = true}}
```

:::

**Key points:**

- `thinking_level` accepts: `minimal`, `low`, `medium`, `high`
- Do not combine `thinking_budget` and `thinking_level` — it causes a 400 error
- Multi-turn conversations need thought signatures to preserve context

#### Gemini Overview

- **Gemini 2.5** — controls the thinking budget via `thinking_budget`, range: `-1` (auto) / `0` (off) / `N` (budget); disable with `budget = 0`. Budget and level cannot be combined
- **Gemini 3.0+** — controls the thinking level via `thinking_level`, range: `minimal` / `low` / `medium` / `high`; disabled by leaving it unset or using `minimal`. No token-level budget control

Gemini 2.5 controls intensity indirectly by token count (`-1` = automatic), while Gemini 3.0+ sets the level directly with an enum value.

> Google APIs are not directly accessible from mainland China; a proxy is required.

## Custom HTTP Requests

`extra_params` supports three special keys for precise control over API requests:

- **`headers`** — adds HTTP request headers, e.g. `{headers = {"X-Custom" = "value"}}`
- **`query`** — adds URL query parameters, e.g. `{query = {"key" = "value"}}`
- **`body`** — fields inside it go into the request body along with other plain keys; it exists only to group entries by purpose in the config

::: warning Note
`body` does not create a separate request channel. Fields inside `body` and **all plain keys** outside `headers`/`query` are merged and sent together in the request body.
:::

For example:

::: code-group

```toml [TOML ~vscode-icons:file-type-toml~]
[[models]]
name = "custom-model"
model_identifier = "custom-model-v1"
api_provider = "custom"
visual = false
extra_params = {
  headers = {"X-API-Version" = "2024-06", "X-Priority" = "high"},
  query = {version = "2024-01-01"},
  body = {metadata = {source = "maibot"}},
  enable_thinking = false
}
```

:::

The actual effect after the client splits it:

**`headers`** — HTTP request headers: `X-API-Version: 2024-06`, `X-Priority: high`

**`query`** — URL query parameters: `?version=2024-01-01`

**`body` fields + other plain keys** — request body JSON: `{"metadata": {"source": "maibot"}, "enable_thinking": false}`

So `extra_params = {enable_thinking = "false"}` is equivalent to `extra_params = {body = {enable_thinking = "false"}}` — both send `enable_thinking` as a request-body JSON field to the provider, rather than a nested `{"extra_params": {"enable_thinking": "false"}}`.

## Advanced Auth Configuration

- **`auth_header_name`** — Header auth name. Default `Authorization`
- **`auth_header_prefix`** — Header auth prefix. Default `Bearer`
- **`auth_query_name`** — Query auth parameter name. Default `api_key`

## Other Advanced Parameters

### Model-level Parameter Overrides

- **`temperature`** — model-level temperature, overrides the task config. Optional, e.g. `0.7`
- **`max_tokens`** — model-level max tokens, overrides the task config. Optional, e.g. `4096`
- **`force_stream_mode`** — forces streaming output; set `true` when a model does not support non-streaming. Off by default
- **`extra_params`** — extra-parameter dictionary. Empty by default

### Priority Rules

`temperature` and `max_tokens` can be written inside `extra_params` as model-level defaults, but prefer the standalone fields of the same name in the model config:

::: code-group

```toml [TOML ~vscode-icons:file-type-toml~]
temperature = 0.7
max_tokens = 4096
```

:::

The intent is clearer, and it avoids confusion with same-named fields in the provider's request body.

When the same parameter exists in multiple places, the effective priority is:

1. The value explicitly passed by the caller for this request
2. The standalone field in the current model config (e.g. `temperature`, `max_tokens`)
3. The same-named field in the current model's `extra_params`
4. The default value in the current task config

### API Provider Advanced Configuration

- **`default_headers`** — default HTTP headers. Empty by default
- **`default_query`** — default query parameters. Empty by default
- **`organization`** — OpenAI organization (optional). None by default
- **`project`** — OpenAI project (optional). None by default
- **`model_list_endpoint`** — model-list endpoint. Default `/models`
- **`reasoning_parse_mode`** — reasoning-content parse mode. Default `auto`
- **`tool_argument_parse_mode`** — tool-argument parse mode. Default `auto`

### Runtime Configuration

- **`timeout`** — request timeout. 60 seconds recommended
- **`max_retry`** — failed-request retries. 3 retries recommended
- **`retry_interval`** — retry interval. 5 seconds recommended

## Quick Parameter Reference

### OpenAI-compatible APIs

- **`thinking`** — thinking-mode control, contains `type` (enabled/disabled). Applies to DeepSeek
- **`reasoning_effort`** — reasoning-intensity level (DeepSeek V4 only high/max; OpenAI has 6 levels). Applies to DeepSeek, OpenAI
- **`enable_thinking`** — enables thinking mode. Applies to Alibaba Cloud Bailian
- **`reasoning`** — Responses API thinking control, contains `effort` (none/low/high/max). Applies to DeepSeek (Responses client)
- **`tools`** — native tool list, e.g. `{type = "web_search"}` enables web search. Applies to the DeepSeek Responses client
- **`headers`** — custom HTTP request headers. Applies to all
- **`query`** — custom URL query parameters. Applies to all
- **`body`** — custom request-body fields. Applies to all

### Gemini Native API

- **`thinking_config`** — thinking configuration, contains `thinking_budget` or `thinking_level`. Applies to the whole Gemini family
- **`thinking_budget`** — thinking budget (-1 auto / 0 off / N specified). Applies to Gemini 2.5
- **`thinking_level`** — thinking level (minimal/low/medium/high). Applies to Gemini 3.0+
- **`include_thoughts`** — whether the response includes the thinking process. Applies to the whole Gemini family

> Parameters are passed to the LLM API verbatim — make sure they match your provider's documentation, otherwise calls may fail.

---

For details, rely on each provider's official documentation: [DeepSeek thinking mode](https://api-docs.deepseek.com/guides/thinking_mode), [OpenAI reasoning guide](https://platform.openai.com/docs/guides/reasoning), [Google Gemini thinking config](https://cloud.google.com/vertex-ai/generative-ai/docs/thinking), [Alibaba Cloud Bailian](https://help.aliyun.com/zh/model-studio/developer-reference/), [Kimi thinking mode](https://platform.kimi.com/docs/guide/use-kimi-k2-thinking-model), [GLM thinking mode](https://docs.bigmodel.cn/cn/guide/capabilities/thinking-mode).
