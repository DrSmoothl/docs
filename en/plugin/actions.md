---
title: Action Component (Legacy)
---# Action Component (Legacy)

::: danger 已废弃
The `@Action` decorator is deprecated. The SDK internally converts it to an `@Tool` declaration automatically. **New plugins should use [`@Tool`](./tools.md) directly**. Using `@Action` will trigger `DeprecationWarning`.
:::

## Migrating from @Action to @Tool

Core differences between `@Action` and `@Tool`:

- **Parameter types**: `@Action` are all `string` → `@Tool` supports 7 types including `string`, `integer`, `boolean`, `array`, `object`, etc.
- **Parameter declaration**: `action_parameters={"key": "描述"}` → `parameters=[ToolParameterInfo(...)]`
- **Parameter Schema**: No JSON Schema generation → Automatically generates complete JSON Schema
- **Activation method**: `activation_type` + `activation_keywords` → Always available (LLM decides when to call it)
- **Description mechanism**: Single `description` → `brief_description` + `detailed_description`

### Migration Example

**Old style (@Action):**

```python
from maibot_sdk import MaiBotPlugin, Action

class MyPlugin(MaiBotPlugin):
    @Action(
        "search",
        description="Search the internet for information",
        activation_type="always",
        action_parameters={"query": "Search keyword"},
    )
    async def handle_search(self, query: str, **kwargs):
        results = await self._do_search(query)
        return results
```

**New style (@Tool):**

```python
from maibot_sdk import MaiBotPlugin, Tool
from maibot_sdk.types import ToolParameterInfo, ToolParamType

class MyPlugin(MaiBotPlugin):
    @Tool(
        "search",
        brief_description="Search the internet for information",
        parameters=[
            ToolParameterInfo(
                name="query",
                param_type=ToolParamType.STRING,
                description="Search keyword",
                required=True,
            ),
        ],
    )
    async def handle_search(self, query: str, **kwargs):
        results = await self._do_search(query)
        return {"results": results}
```

## @Action Decorator Signature (Reference)

The following is the complete parameter signature for `@Action`, provided for legacy plugin maintenance reference only:

```python
from maibot_sdk import Action

@Action(
    name: str,                                          # Action name
    description: str = "",                              # Action description
    activation_type: ActivationType = ActivationType.ALWAYS,  # Activation type
    activation_keywords: list[str] | None = None,       # Activation keywords
    activation_probability: float = 1.0,                # Random activation probability
    chat_mode: ChatMode = ChatMode.NORMAL,              # Chat mode
    action_parameters: dict[str, Any] | None = None,    # Parameter definition
    action_require: list[str] | None = None,            # Usage requirements
    associated_types: list[str] | None = None,          # Associated message types
    parallel_action: bool = False,                      # Whether it can be executed in parallel
    action_prompt: str = "",                            # LLM prompt
    **metadata,
)
```

### ActivationType Enum

- **`NEVER`** — Never activate
- **`ALWAYS`** — Always a candidate tool
- **`RANDOM`** — Randomly enabled with a certain probability
- **`KEYWORD`** — Enabled when the message contains keywords

### ChatMode Enum

- **`FOCUS`** — Focus mode
- **`NORMAL`** — Normal mode
- **`PRIORITY`** — Priority mode
- **`ALL`** — All modes

## Internal Conversion Mechanism

The SDK internally converts all parameters of `@Action` into `@Tool` equivalent metadata:

- `action_parameters` → Converted to Tool's parameter Schema (all field types are `string`)
- `activation_type` / `activation_keywords` / `activation_probability` / `chat_mode` → Saved as `legacy_action` marker fields in Tool `metadata`
- `action_require` / `associated_types` / `action_prompt` → Merged into Tool's `detailed_description`
- `invoke_method` is fixed to `"plugin.invoke_action"` (compatible with legacy call paths)

After conversion, the Host side maintains only a single Tool abstraction, no longer distinguishing between Action and Tool invocation flows.