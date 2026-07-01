---
title: Configuration Management
---# Configuration Management

MaiBot plugins support a declarative configuration management mechanism. By defining strongly-typed configuration models via `PluginConfigBase` and `Field`, the Runner will automatically generate default configurations, fill in missing fields, and expose a renderable configuration Schema to the WebUI.

## Configuration File Location

The configuration file for each plugin is located at `config.toml` under the plugin directory:

```
my_plugin/
├── plugin.py          # 插件入口
├── config.toml        # 插件配置（可选）
└── _manifest.json     # 插件元信息
```

::: tip config.toml vs _manifest.json
- `config.toml`: The plugin's **runtime configuration** (feature toggles, parameters, etc.), read by the plugin itself.
- `_manifest.json`: The plugin's **meta-information** (ID, version, dependencies, etc.), validated and managed by the Host.

The two serve completely different purposes; do not confuse them.
:::

## PluginConfigBase Configuration Model

### Basic Usage

```python
from maibot_sdk import MaiBotPlugin, PluginConfigBase, Field


class MyPluginConfig(PluginConfigBase):
    """插件完整配置"""
    __ui_label__ = "插件配置"

    enabled: bool = Field(default=True, description="是否启用插件")
    greeting: str = Field(default="你好！", description="默认问候语")
    max_retries: int = Field(default=3, description="最大重试次数")


class MyPlugin(MaiBotPlugin):
    config_model = MyPluginConfig

    async def on_load(self) -> None:
        # 通过 self.config 访问强类型配置
        self.ctx.logger.info("当前问候语: %s", self.config.greeting)
        self.ctx.logger.info("最大重试: %d", self.config.max_retries)
```

### Nested Configuration

Grouped configurations can be implemented by nesting `PluginConfigBase` classes:

```python
from maibot_sdk import MaiBotPlugin, PluginConfigBase, Field


class PluginSection(PluginConfigBase):
    """插件基础配置"""
    __ui_label__ = "基础设置"

    enabled: bool = Field(default=True, description="是否启用插件")
    greeting: str = Field(default="你好！", description="默认问候语")


class AdvancedSection(PluginConfigBase):
    """高级配置"""
    __ui_label__ = "高级设置"

    max_retries: int = Field(default=3, description="最大重试次数")
    timeout: float = Field(default=30.0, description="超时时间（秒）")


class MyPluginConfig(PluginConfigBase):
    """插件完整配置"""
    plugin: PluginSection = Field(default_factory=PluginSection)
    advanced: AdvancedSection = Field(default_factory=AdvancedSection)


class MyPlugin(MaiBotPlugin):
    config_model = MyPluginConfig

    async def on_load(self) -> None:
        # 访问嵌套配置
        self.ctx.logger.info("问候语: %s", self.config.plugin.greeting)
        self.ctx.logger.info("超时: %s", self.config.advanced.timeout)
```

## Field

`Field` is used to declare metadata for configuration fields:

```python
from maibot_sdk import Field

Field(
    default=...,          # 默认值
    default_factory=...,   # 默认值工厂函数（用于可变默认值）
    description="...",     # 字段描述（显示在 WebUI 中）
)
```

- **`default`** `Any` — Default value of the field
- **`default_factory`** `Callable` — Default value factory function, used for mutable types such as `list`, `dict`, and nested `PluginConfigBase`
- **`description`** `str` — Field description, displayed as a form label in the WebUI
- **`json_schema_extra`** `dict` — Additional metadata passed to the WebUI Schema generator. Common keys: `placeholder` (input box placeholder text), `group` (UI group hint)

### __ui_label__

`PluginConfigBase` subclasses can set the group title displayed in the WebUI via the `__ui_label__` class attribute:

```python
class PluginSection(PluginConfigBase):
    __ui_label__ = "基础设置"  # WebUI 中显示的标题
    enabled: bool = Field(default=True, description="是否启用插件")
```

### __ui_icon__

`PluginConfigBase` subclasses can set the group icon displayed in the WebUI via the `__ui_icon__` class attribute, which accepts [Material Icons](https://fonts.google.com/icons) icon names:

```python
class PluginSection(PluginConfigBase):
    __ui_label__ = "基础设置"
    __ui_icon__ = "settings"  # WebUI 中显示的 Material Icons 图标名
    enabled: bool = Field(default=True, description="是否启用插件")
```

### __ui_order__

`PluginConfigBase` subclasses can set the display order of the group in the WebUI via the `__ui_order__` class attribute; smaller values appear earlier:

```python
class PluginSection(PluginConfigBase):
    __ui_label__ = "基础设置"
    __ui_icon__ = "settings"
    __ui_order__ = 0  # WebUI 中分组的排序权重，数字越小越靠前
    enabled: bool = Field(default=True, description="是否启用插件")
```

### json_schema_extra

`json_schema_extra` is used to pass additional metadata to the WebUI Schema generator. Common scenarios include:

- `placeholder`: Placeholder hint text for the input box
- `group`: Configuration group hint in the WebUI

```python
class MyPluginConfig(PluginConfigBase):
    """插件完整配置"""
    greeting: str = Field(
        default="你好！",
        description="默认问候语",
        json_schema_extra={"placeholder": "请输入问候语", "group": "basic"}
    )
    api_key: str = Field(
        default="",
        description="API 密钥",
        json_schema_extra={"placeholder": "请输入 API Key", "group": "advanced"}
    )
```

## Accessing Configuration

### Strongly-Typed Access (self.config)

```python
class MyPlugin(MaiBotPlugin):
    config_model = MyPluginConfig

    async def on_load(self) -> None:
        # 强类型访问，有代码补全和类型检查
        greeting = self.config.plugin.greeting
        timeout = self.config.advanced.timeout
```

::: warning 注意
- Calling `self.config` without declaring `config_model` will throw `RuntimeError`
- Calling `self.config` before the configuration has been injected will also throw `RuntimeError`
:::

### Raw Dictionary Access

```python
class MyPlugin(MaiBotPlugin):
    config_model = MyPluginConfig

    async def on_load(self) -> None:
        # 获取原始配置字典
        raw = self.get_plugin_config_data()
        greeting = raw.get("plugin", {}).get("greeting", "默认值")
```

`get_plugin_config_data()` is always available and returns `dict[str, Any]`, without requiring the declaration of `config_model`.

## Configuration Hot Reload

When the `config.toml` file changes, the Runner will automatically trigger the `on_config_update()` callback:

```python
from maibot_sdk import MaiBotPlugin, CONFIG_RELOAD_SCOPE_SELF

class MyPlugin(MaiBotPlugin):
    config_model = MyPluginConfig

    async def on_config_update(self, scope: str, config_data: dict, version: str) -> None:
        if scope == CONFIG_RELOAD_SCOPE_SELF:
            # self.config 会自动更新为最新值
            self.ctx.logger.info("配置已更新，新问候语: %s", self.config.plugin.greeting)
```

::: important
`self.config` is automatically updated when `on_config_update(scope="self")` is called; there is no need to read it manually.
:::

For more on configuration hot reloading, see [Lifecycle](./lifecycle.md#on-config-update).

## config.toml Format

The configuration file uses the TOML format, corresponding to the nested structure of `PluginConfigBase`:

```toml
[plugin]
config_version = "1.0.0"
enabled = true
greeting = "你好！"

[advanced]
max_retries = 3
timeout = 30.0
```

### config_version

`config_version` is a special field used to track the configuration version. The Runner preserves this field when merging default configurations.

## Default Configuration and Schema Generation

### Automatic Completion

When certain fields are missing in `config.toml`, the Runner will automatically fill them based on the default values in `config_model`:

```python
# 如果 config.toml 只有:
# [plugin]
# enabled = false

# Runner 会自动补齐 greeting 和 advanced 部分的默认值
```

### WebUI Schema

After declaring `config_model`, the Runner automatically generates a configuration Schema that can be rendered by the WebUI:

```python
# 插件类上的方法（通常不需要手动调用）
schema = MyPlugin.build_config_schema(
    plugin_id="com.example.my-plugin",
    plugin_name="我的插件",
    plugin_version="1.0.0",
)
```

The WebUI renders a configuration form based on the Schema, allowing users to edit configurations directly in the browser.

## Reading Configuration via API

In addition to `self.config` and `self.get_plugin_config_data()`, configurations can also be read via the capability proxy:

```python
# 读取插件自身配置
value = await self.ctx.config.get("plugin.greeting")

# 读取其他插件配置
value = await self.ctx.config.get_plugin("com.other.plugin")

# 读取全局 Bot 配置
all_config = await self.ctx.config.get_all()
```

## Not Using config_model

If the plugin configuration is very simple, you can skip declaring `config_model` and use `ctx.config` and `get_plugin_config_data()` directly:

```python
class SimplePlugin(MaiBotPlugin):
    # 不声明 config_model

    async def on_load(self) -> None:
        # 只能通过原始字典或 ctx.config 读取
        raw = self.get_plugin_config_data()
        name = raw.get("name", "默认名称")

        # self.config 会抛出 RuntimeError
        # 不要调用 self.config
```

However, it is recommended to always use `config_model` for better type safety and WebUI integration experience.