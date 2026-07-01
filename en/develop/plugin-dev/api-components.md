---
title: API Components
---# API Component

The `@API` decorator is used to declare API interfaces for inter-plugin communication. Other plugins can call these APIs via `ctx.api.call()` to achieve functional interoperability between plugins.

## Decorator Signature

```python
from maibot_sdk import API

@API(
    name: str,                  # API 名称（必填）
    description: str = "",      # API 描述
    version: str = "1",         # API 版本
    public: bool = False,       # 是否允许其他插件调用
    **metadata,                 # 额外元数据
)
```

## Parameter Description

### name

The unique identifier name of the API. Duplicate API names are not allowed within the same plugin. Other plugins use `插件 ID + API 名称` to locate and call it.

### public

- **`False`** (Default) — Visible only within the plugin; cannot be called by other plugins.
- **`True`** — Public API; can be called by other plugins via `ctx.api.call()`.

### version

The API version number, defaulting to `"1"`. Used for API version management; the version number can be incremented when incompatible updates are required.

## Static API Example

Declare APIs directly on the plugin class using the `@API` decorator:

```python
from maibot_sdk import MaiBotPlugin, API


class RenderPlugin(MaiBotPlugin):
    async def on_load(self) -> None:
        self.ctx.logger.info("渲染插件已加载")

    async def on_unload(self) -> None:
        self.ctx.logger.info("渲染插件已卸载")

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @API(
        "render_html",
        description="将 HTML 渲染为图片",
        version="1",
        public=True,
    )
    async def handle_render_html(self, html: str, **kwargs):
        # 调用渲染能力
        result = await self.ctx.render.html2png(html)
        return {"success": True, "image_path": result}

    @API(
        "get_stats",
        description="获取渲染统计信息",
        version="1",
        public=True,
    )
    async def handle_get_stats(self, **kwargs):
        return {
            "total_renders": 42,
            "avg_time_ms": 150,
        }
```

## Dynamic API Registration

In addition to static declaration using the `@API` decorator, APIs can be dynamically registered and unregistered at runtime. Dynamic APIs are suitable for scenarios where the decision to expose an API depends on configurations or runtime conditions.

### Dynamic API Methods

- `self.register_dynamic_api(name, handler, *, description, version, public, handler_name, **metadata)` — Register a dynamic API
- `self.unregister_dynamic_api(name, *, version="1")` — Unregister a dynamic API
- `self.clear_dynamic_apis()` — Clear all dynamic APIs
- `await self.sync_dynamic_apis(*, offline_reason="动态 API 已下线")` — Synchronize dynamic APIs to the main program

### Dynamic Registration Example

```python
from maibot_sdk import MaiBotPlugin, PluginConfigBase, Field
from typing import Any


class DynamicApiPlugin(MaiBotPlugin):
    class MyConfig(PluginConfigBase):
        enable_translate: bool = Field(default=False, description="是否启用翻译 API")

    config_model = MyConfig

    async def on_load(self) -> None:
        # 根据配置动态注册 API
        if self.config.enable_translate:
            self.register_dynamic_api(
                "translate",
                self._handle_translate,
                description="文本翻译",
                version="1",
                public=True,
                handler_name="handle_translate",
            )

            self.register_dynamic_api(
                "detect_language",
                self._handle_detect_language,
                description="语言检测",
                version="1",
                public=True,
            )

        # 同步动态 API 到主程序
        await self.sync_dynamic_apis()
        self.ctx.logger.info("动态 API 已同步")

    async def on_unload(self) -> None:
        # 清空并同步下线
        self.clear_dynamic_apis()
        await self.sync_dynamic_apis(offline_reason="插件已卸载")

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    async def _handle_translate(self, text: str, target_lang: str = "en", **kwargs) -> dict[str, Any]:
        # 翻译逻辑
        return {"translated": f"[translated {text} to {target_lang}]"}

    async def _handle_detect_language(self, text: str, **kwargs) -> dict[str, Any]:
        # 语言检测逻辑
        return {"language": "zh", "confidence": 0.95}
```

### Dynamic Unregistration Example

```python
class ManagedApiPlugin(MaiBotPlugin):
    async def on_load(self) -> None:
        # 批量注册
        for name, handler in [("api_a", self._a), ("api_b", self._b)]:
            self.register_dynamic_api(name, handler, public=True)
        await self.sync_dynamic_apis()

    async def disable_api_b(self) -> None:
        # 注销单个 API
        self.unregister_dynamic_api("api_b")
        await self.sync_dynamic_apis(offline_reason="API B 已禁用")

    async def on_unload(self) -> None:
        self.clear_dynamic_apis()
        await self.sync_dynamic_apis(offline_reason="插件已卸载")

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    async def _a(self, **kwargs):
        return {"result": "a"}

    async def _b(self, **kwargs):
        return {"result": "b"}
```

## Calling APIs of Other Plugins

You can query and call public APIs of other plugins through the `self.ctx.api` proxy.

### ctx.api Methods

- `await self.ctx.api.call(api_name, *, version="", **kwargs)` — Call an API of another plugin
- `await self.ctx.api.get(api_name, *, version="")` — Get API information
- `await self.ctx.api.list()` — List all available APIs
- `await self.ctx.api.replace_dynamic_apis(components, offline_reason="...")` — Replace a dynamic API

### Call Example

```python
from maibot_sdk import MaiBotPlugin, Tool
from maibot_sdk.types import ToolParameterInfo, ToolParamType


class CallerPlugin(MaiBotPlugin):
    async def on_load(self) -> None:
        # 列出所有可用 API
        apis = await self.ctx.api.list()
        self.ctx.logger.info("可用 API: %s", apis)

    async def on_unload(self) -> None:
        pass

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        pass

    @Tool(
        "translate_text",
        brief_description="翻译文本",
        detailed_description="参数说明：\n- text：string，必填。待翻译文本。",
        parameters=[
            ToolParameterInfo(
                name="text",
                param_type=ToolParamType.STRING,
                description="待翻译文本",
                required=True,
            ),
        ],
    )
    async def handle_translate(self, text: str, **kwargs):
        # 调用其他插件的翻译 API
        result = await self.ctx.api.call(
            "com.example.translate.translate",
            text=text,
            target_lang="en",
        )
        return result
```

### Querying API Information

```python
# 获取特定 API 的详细信息
api_info = await self.ctx.api.get("com.example.translate.translate")
self.ctx.logger.info("API 信息: %s", api_info)
```

## API Design Recommendations

### Naming Conventions

- Use lowercase letters and underscores: `render_html`, `get_stats`
- Start with a verb: `get_`, `render_`, `detect_`, `translate_`
- Avoid overly generic names; they should reflect the functional meaning

### Version Management

- Use `"1"` for the initial version
- Increment the version number for incompatible updates
- Multiple versions of the same API name can exist simultaneously

### Parameter Design

- API handler methods receive `**kwargs`, from which parameters are extracted
- Required parameters should be explicitly declared as positional arguments
- Return values should be serializable dictionaries

## Comparison: Static API vs. Dynamic API

- **Declaration Timing**: `@API` At class definition $\rightarrow$ `register_dynamic_api()` At runtime (usually in `on_load`)
- **Conditional Exposure**: `@API` Not supported $\rightarrow$ `register_dynamic_api()` Can be decided dynamically based on configuration
- **Unregistration**: `@API` Not supported $\rightarrow$ `register_dynamic_api()` Can be dynamically unregistered via `unregister`
- **Synchronization**: `@API` Automatic $\rightarrow$ `register_dynamic_api()` Requires calling `sync_dynamic_apis()`
- **Use Case**: `@API` Fixed and unchanging APIs $\rightarrow$ `register_dynamic_api()` APIs enabled/disabled on demand