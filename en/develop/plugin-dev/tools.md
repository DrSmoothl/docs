---
title: Tool Component
---

# Tool Component

`@Tool` is the most core component type in MaiBot's plugin system. It allows plugins to expose callable tool functions to LLM, enabling LLM to actively invoke external capabilities during reasoning — such as searching knowledge bases, querying databases, calling external APIs, etc.

::: tip Tool vs Action
`@Action` is the legacy decorator. The SDK internally auto-converts it to a `@Tool` declaration. New plugins should use `@Tool` directly instead of `@Action`. See [Action Component (Legacy)](./actions.md).
:::

## Decorator Signature

```python
from maibot_sdk import Tool
from maibot_sdk.types import ToolParameterInfo, ToolParamType

@Tool(
    name: str,                                              # Tool name (required)
    description: str = "",                                  # Compatibility param, equivalent to brief_description
    brief_description: str = "",                            # Brief description for LLM quick judgment
    detailed_description: str = "",                         # Detailed description, including parameter docs
    parameters: list[ToolParameterInfo] | dict | None = None,  # Parameter definition
    **metadata,                                             # Additional metadata
)
```

### Parameter Description

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `str` | Tool name, must be unique within the plugin. LLM calls the tool by this name |
| `description` | `str` | Legacy parameter, recommend using `brief_description` directly |
| `brief_description` | `str` | Brief description. Passed to LLM as tool description summary, helping LLM decide whether to call it |
| `detailed_description` | `str` | Detailed description. Can include parameter usage notes, caveats, etc. The SDK automatically merges parameter Schema to generate complete description |
| `parameters` | `list \| dict \| None` | Tool parameter definition, supports two formats (see below) |

## Parameter Definition

### Method 1: Structured Parameters (Recommended)

Declare parameters using a `ToolParameterInfo` list. The SDK automatically generates JSON Schema:

```python
from maibot_sdk import Tool, MaiBotPlugin
from maibot_sdk.types import ToolParameterInfo, ToolParamType

class MyPlugin(MaiBotPlugin):
    @Tool(
        "search",
        brief_description="Search the internet for information",
        detailed_description="Use a search engine to find related information. Parameter details:\n- query: string, required. Search keywords.\n- limit: integer, optional. Maximum number of results to return.",
        parameters=[
            ToolParameterInfo(
                name="query",
                param_type=ToolParamType.STRING,
                description="Search keywords",
                required=True,
            ),
            ToolParameterInfo(
                name="limit",
                param_type=ToolParamType.INTEGER,
                description="Maximum number of results to return",
                required=False,
                default=5,
            ),
        ],
    )
    async def handle_search(self, query: str, limit: int = 5, **kwargs):
        results = await self._do_search(query, limit)
        return {"results": results}
```

### Method 2: Dict Parameters (Legacy Format)

Directly pass a JSON Schema-style dictionary:

```python
class MyPlugin(MaiBotPlugin):
    @Tool(
        "search",
        brief_description="Search the internet for information",
        parameters={
            "query": {"type": "string", "description": "Search keywords"},
            "limit": {"type": "integer", "description": "Maximum number of results to return", "default": 5},
        },
    )
    async def handle_search(self, query: str, limit: int = 5, **kwargs):
        results = await self._do_search(query, limit)
        return {"results": results}
```

## ToolParameterInfo Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | `str` | Parameter name |
| `param_type` | `ToolParamType` | Parameter type enum |
| `description` | `str` | Parameter description |
| `required` | `bool` | Whether required, default `True` |
| `enum_values` | `list \| None` | Optional enum value list |
| `default` | `Any` | Default value |
| `items_schema` | `dict \| None` | Array element Schema (used when `param_type=ARRAY`) |
| `properties` | `dict \| None` | Object property definitions (used when `param_type=OBJECT`) |
| `required_properties` | `list[str]` | Required fields within the object |
| `additional_properties` | `bool \| dict \| None` | Whether additional fields are allowed |

## ToolParamType Enum

| Enum Value | JSON Schema Type | Description |
|------------|-----------------|-------------|
| `STRING` | `string` | String |
| `INTEGER` | `integer` | Integer |
| `NUMBER` | `number` | Number (integer or float) |
| `FLOAT` | `number` | Float (equivalent to NUMBER) |
| `BOOLEAN` | `boolean` | Boolean |
| `ARRAY` | `array` | Array |
| `OBJECT` | `object` | Object |

## Handler Function

Tool handler functions are async methods on the plugin class that receive named parameters matching the parameter names and `**kwargs`:

```python
@Tool("greet", brief_description="Greet the user",
      detailed_description="Parameter details:\n- stream_id: string, required. Current chat stream ID.",
      parameters=[
          ToolParameterInfo(name="stream_id", param_type=ToolParamType.STRING,
                          description="Current chat stream ID", required=True),
      ])
async def handle_greet(self, stream_id: str, **kwargs):
    await self.ctx.send.text("Hello!", stream_id)
    return {"success": True, "message": "Replied"}
```

### Return Value

The return value of a Tool handler is returned to LLM as the tool execution result. The return value can be:

- `dict`: Recommended, LLM can understand structured data
- `str`: Simple text result
- Other serializable values

LLM will decide the next action based on the return value (e.g., reply to user, call other tools, etc.).

### Returning Images and Other Media

If a Tool needs to pass an image back to Maisaka for further observation or reasoning, do not put the image base64 directly in `content`. Return a `dict` instead: put the text for LLM in `content`, and put the image payload in `content_items`:

```python
from base64 import b64encode


async def handle_draw(self, prompt: str, **kwargs):
    image_bytes = await self._draw_image(prompt)

    return {
        "success": True,
        "content": "The image has been generated. Please inspect the image content by its index.",
        "content_items": [
            {
                "type": "image",
                "data": b64encode(image_bytes).decode("ascii"),
                "mime_type": "image/png",
                "name": "result.png",
                "description": "Image generated from the prompt",
            }
        ],
    }
```

Data URLs are also supported:

```python
return {
    "success": True,
    "content": "The image has been generated.",
    "content_items": [
        {
            "type": "image",
            "uri": f"data:image/png;base64,{b64encode(image_bytes).decode('ascii')}",
            "mime_type": "image/png",
            "name": "result.png",
        }
    ],
}
```

Common fields in `content_items`:

| Field | Type | Description |
|-------|------|-------------|
| `type` / `content_type` | `str` | Content type. Use `image` for images; `audio`, `resource_link`, `resource`, and `binary` are also supported |
| `data` / `base64` | `str` | Base64 string of the media bytes. Recommended for image payloads |
| `uri` | `str` | Media URI. Images may use `data:image/...;base64,...` |
| `mime_type` | `str` | MIME type, such as `image/png`, `image/jpeg`, or `image/webp` |
| `name` | `str` | File name or display name |
| `description` | `str` | Short description of the media content |
| `metadata` | `dict` | Additional metadata |

Maisaka splits this return value into two context messages. The first message is still a plain-text Tool Result containing a media index like `tool_result:<tool_call_id>:1`. The second message is a normal user message containing the same index and the actual image component. This keeps compatibility with model APIs that do not support images inside tool results, while allowing vision-capable models to observe the image as a normal image message.

::: tip View logic
The split-out image uses the normal `ImageComponent` rendering path in LLM input and Prompt preview, so it is displayed much like a real received image message. The difference is identity metadata: its source is marked as `tool_result_media`, and its message ID is the tool media index, so it is not treated as a real platform message sent by a user.
:::

### Common Extra Parameters in kwargs

| Parameter | Type | Description |
|-----------|------|-------------|
| `stream_id` | `str` | Current chat stream ID, can be used with `ctx.send.text()` etc. to send messages |
| `message` | `dict` | Original message that triggered this tool call |

::: tip stream_id
`stream_id` is one of the most important parameters in Tool components. It identifies the current conversation stream. Use `ctx.send.text("message", stream_id)` to send messages to the corresponding chat stream.
:::

## Description Generation Rules

The SDK automatically generates complete description information for tools:

1. If `detailed_description` is provided, the SDK appends parameter Schema documentation to the end of `detailed_description`
2. If only `brief_description` (or `description`) is provided, the SDK automatically generates parameter documentation based on the parameter Schema
3. Auto-generated parameter documentation format:
   ```
   Parameter details:
   - query: string, required. Search keywords
   - limit: integer, optional. Maximum number of results to return. Default: 5
   ```

## Complete Example

```python
from typing import Any

from maibot_sdk import MaiBotPlugin, Tool
from maibot_sdk.types import ToolParameterInfo, ToolParamType


class SearchPlugin(MaiBotPlugin):
    async def on_load(self) -> None:
        self.ctx.logger.info("Search plugin loaded")

    async def on_unload(self) -> None:
        pass

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @Tool(
        "search_web",
        brief_description="Search the internet for information",
        detailed_description="Use a search engine to find related information. Returns a list of results that best match the keywords.",
        parameters=[
            ToolParameterInfo(
                name="query",
                param_type=ToolParamType.STRING,
                description="Search keywords",
                required=True,
            ),
            ToolParameterInfo(
                name="limit",
                param_type=ToolParamType.INTEGER,
                description="Maximum number of results to return",
                required=False,
                default=5,
            ),
        ],
    )
    async def search(self, query: str, limit: int = 5, **kwargs):
        """Search the internet"""
        results = await self._do_search(query, limit)
        return {"results": results, "count": len(results)}

    @Tool(
        "get_weather",
        brief_description="Get weather information for a specified city",
        parameters=[
            ToolParameterInfo(
                name="city",
                param_type=ToolParamType.STRING,
                description="City name",
                required=True,
            ),
        ],
    )
    async def get_weather(self, city: str, **kwargs):
        """Query weather"""
        weather = await self._fetch_weather(city)
        return {"city": city, "weather": weather}

    async def _do_search(self, query: str, limit: int) -> list:
        # Actual search logic
        return []

    async def _fetch_weather(self, city: str) -> dict:
        # Actual weather query logic
        return {}


def create_plugin():
    return SearchPlugin()
```

## Relationship with Legacy Action

The `@Action` decorator is deprecated in SDK 2.0 and internally auto-converts to `@Tool` declaration:

- `action_parameters` → converted to Tool's `parameters` Schema (all parameter types become `string`)
- `activation_type` / `activation_keywords` → preserved as Tool `metadata`
- Using `@Action` triggers a `DeprecationWarning`

New plugins should use `@Tool` directly to enjoy richer parameter type support and more standardized Schema generation.
