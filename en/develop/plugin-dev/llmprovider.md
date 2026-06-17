---
title: LLMProvider Component
---

# LLMProvider Component

`@LLMProvider` is used to declare that a plugin provides a new LLM Provider `client_type`. The host registers this `client_type` into the LLM client registry, so existing `LLMService` and model task configurations do not need to change their invocation approach — as long as the `api_providers[].client_type` in the model configuration points to the value declared by the plugin, requests will be sent through the plugin Provider.

::: warning Dual Declarations Must Match
An LLM Provider must satisfy both declarations simultaneously; neither can be omitted:

1. Statically declare `client_type` in the top-level `llm_providers` field of `_manifest.json`
2. Use `@LLMProvider("the same client_type")` to decorate the handler method in the plugin code

The Runner verifies that the manifest and the collected decorator results match exactly. If either side is missing, has a spelling mismatch, or declares duplicates within the same plugin, the plugin will be rejected. When different plugins declare the same `client_type`, both conflicting sides will be prevented from loading.
:::

## Decorator Signature

```python
from maibot_sdk import LLMProvider

@LLMProvider(
    client_type: str,          # Client type identifier (required)
    *,
    name: str = "",            # Provider display name
    description: str = "",     # Provider description
    version: str = "1.0.0",    # Provider implementation version
    **metadata,                # Additional metadata
)
```

### Parameter Description

- **`client_type`** `str` · Required — Client type identifier, corresponds to `api_providers[].client_type` in model configuration. Must not be empty
- **`name`** `str` · Default `""` — Provider display name. Falls back to `client_type` when empty
- **`description`** `str` · Default `""` — Provider description
- **`version`** `str` · Default `"1.0.0"` — Provider implementation version
- **`**metadata`** `Any` — Additional metadata key-value pairs

## Manifest Declaration

The top-level `_manifest.json` must include an `llm_providers` array, with a one-to-one correspondence to the `@LLMProvider` decorators in the code:

```json
{
  "llm_providers": [
    {
      "client_type": "example.provider",
      "name": "Example Provider",
      "description": "Example LLM Provider",
      "version": "1.0.0"
    }
  ]
}
```

### llm\_providers Field Description

- **`client_type`** `str` · Required — Provider client type, must match `api_providers[].client_type` in model configuration
- **`name`** `str` · Default `""` — Provider display name
- **`description`** `str` · Default `""` — Provider description
- **`version`** `str` · Default `"1.0.0"` — Provider implementation version

::: danger
Do not include `handler_name` or `metadata` in the manifest's `llm_providers` — handler functions are automatically collected by the `@LLMProvider` decorator and do not need to be specified manually.
:::

## Operation Types

The handler method distinguishes request types via the `operation` parameter. The three operations correspond to different LLM capabilities:

- **`response`** — LLM text/tool response. Main request fields: `message_list`, `tool_options`, `max_tokens`, `temperature`, `response_format`, `extra_params`, `model_info`, `api_provider`. Return fields: `content` / `response`, `reasoning_content`, `tool_calls`, `usage`
- **`embedding`** — Text vectorization. Main request fields: `embedding_input`, `extra_params`, `model_info`, `api_provider`. Return fields: `embedding`
- **`audio_transcription`** — Speech recognition. Main request fields: `audio_base64`, `max_tokens`, `extra_params`, `model_info`, `api_provider`. Return fields: `content`

All three operations include the following common fields in their requests:

- **`model_info`** `dict` — Model information for the current request
- **`api_provider`** `dict` — API Provider configuration for the current request
- **`extra_params`** `dict` — Extra parameters

## Request and Return Fields

### Handler Method Parameters

- **`operation`** `str` — Request type: `response`, `embedding`, `audio_transcription`
- **`request`** `dict[str, Any]` — Serialized request content from the Host

### Return Value Fields

The return value must be a serializable dictionary. The Host recognizes the following fields and restores them into a unified response:

- **`content` / `response`** `str` — Text response or audio transcription text
- **`reasoning_content` / `reasoning`** `str` — Reasoning content
- **`embedding`** `list[float]` — Embedding vector
- **`tool_calls`** `list` — Tool call snapshots
- **`usage`** `dict` — Token usage dictionary
- **`raw_data`** `dict` — Raw response data

## Basic Usage

### Method 1: Manual Dispatching (Simple Scenarios)

Use `if/elif` to handle different `operation` types within the handler method:

```python
from typing import Any

from maibot_sdk import LLMProvider, MaiBotPlugin


class MyLLMPlugin(MaiBotPlugin):
    async def on_load(self) -> None:
        return None

    async def on_unload(self) -> None:
        return None

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @LLMProvider("my.provider", name="My Provider", description="Custom LLM Provider")
    async def handle_llm(self, operation: str, request: dict[str, Any]) -> dict[str, Any]:
        if operation == "response":
            return {"content": "Hello, I am from the plugin Provider"}
        if operation == "embedding":
            return {"embedding": [0.0, 0.1, 0.2]}
        if operation == "audio_transcription":
            return {"content": "Audio transcription result"}
        raise ValueError(f"Unsupported LLM Provider operation type: {operation}")


def create_plugin():
    return MyLLMPlugin()
```

### Method 2: LLMProviderBase (Recommended for Complex Logic)

Inherit from `LLMProviderBase` and let the base class's `dispatch()` method handle routing. Subclasses only need to implement the operations they care about; unimplemented methods raise `NotImplementedError`:

```python
from typing import Any

from maibot_sdk import LLMProvider, LLMProviderBase, MaiBotPlugin


class MyProvider(LLMProviderBase):
    """Custom Provider, only implementing the response capability."""

    async def get_response(self, request: dict[str, Any]) -> dict[str, Any]:
        # request contains message_list, tool_options, model_info, etc.
        return {"content": "Response from the Provider class"}


class MyLLMPlugin(MaiBotPlugin):
    def __init__(self) -> None:
        super().__init__()
        self.provider = MyProvider()

    async def on_load(self) -> None:
        return None

    async def on_unload(self) -> None:
        return None

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @LLMProvider("my.provider")
    async def handle_llm(self, operation: str, request: dict[str, Any]) -> dict[str, Any]:
        return await self.provider.dispatch(operation, request)


def create_plugin():
    return MyLLMPlugin()
```

`LLMProviderBase` provides the following methods for subclasses to override:

- **`get_response()`** · operation `response` — Generate text or multimodal response (abstract method, must be implemented)
- **`get_embedding()`** · operation `embedding` — Generate text embeddings (default raises `NotImplementedError`)
- **`get_audio_transcriptions()`** · operation `audio_transcription` — Generate audio transcription (default raises `NotImplementedError`)

::: tip
`LLMProviderBase` is only a recommended base class and does not participate in registration. The actual registration entry point is always the `@LLMProvider` decorator.
:::

## Complete Example

Below is a complete minimal plug-in, including manifest declaration and Python code.

**\_manifest.json**:

```json
{
  "id": "com.example.llm-provider",
  "name": "Example LLM Provider",
  "version": "1.0.0",
  "description": "Example LLM Provider plugin",
  "author": "example",
  "llm_providers": [
    {
      "client_type": "example.provider",
      "name": "Example Provider",
      "description": "Example LLM Provider",
      "version": "1.0.0"
    }
  ]
}
```

**main.py**:

```python
from typing import Any

from maibot_sdk import LLMProvider, LLMProviderBase, MaiBotPlugin


class ExampleProvider(LLMProviderBase):
    """Example Provider, implementing response and embedding capabilities."""

    async def get_response(self, request: dict[str, Any]) -> dict[str, Any]:
        model_info = request.get("model_info", {})
        message_list = request.get("message_list", [])
        # Connect to the actual LLM API here
        return {
            "content": "Response from example.provider",
            "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30},
        }

    async def get_embedding(self, request: dict[str, Any]) -> dict[str, Any]:
        embedding_input = request.get("embedding_input", "")
        # Connect to the actual Embedding API here
        return {"embedding": [0.1, 0.2, 0.3]}


class ExampleLLMPlugin(MaiBotPlugin):
    def __init__(self) -> None:
        super().__init__()
        self.provider = ExampleProvider()

    async def on_load(self) -> None:
        self.ctx.logger.info("Example LLM Provider plugin loaded")

    async def on_unload(self) -> None:
        self.ctx.logger.info("Example LLM Provider plugin unloaded")

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @LLMProvider("example.provider", name="Example Provider", description="Example LLM Provider")
    async def handle_llm(self, operation: str, request: dict[str, Any]) -> dict[str, Any]:
        return await self.provider.dispatch(operation, request)


def create_plugin():
    return ExampleLLMPlugin()
```

## Unloading and Fallback

When a Provider plugin is unloaded, disabled, or fails a hot-reload, the Host unregisters the `client_type` owned by that plugin. Subsequent new requests will follow the host's model fallback strategy to attempt the next available model.

::: info
Plugin Providers do not currently support custom streaming handlers or response parsers on the Host side.
:::
