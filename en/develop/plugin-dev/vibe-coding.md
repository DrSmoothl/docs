---
title: Vibe Coding Plugin Guide
---

# Vibe Coding Plugin Guide

This page is for developers who use AI assistants to write MaiBot plugins. Its goal is to turn a plugin idea into a clear, bounded task that an AI can implement and verify without accidentally changing the host application.

## AI Task Brief

Use this as the first context block for an AI assistant, then add your concrete requirements:

```text
You are writing a third-party MaiBot plugin. The plugin must live under plugins/<plugin-name>/, and you must not modify MaiBot host code unless I explicitly approve it. Use maibot-plugin-sdk. The entry file is plugin.py and metadata lives in _manifest.json. Implement on_load, on_unload, on_config_update, and create_plugin. Prefer @Tool, @Command, @HookHandler, @EventHandler, @API, and @MessageGateway; do not use @Action for new plugins. User-facing text should default to Simplified Chinese. Keep the change boundary clear and describe how to test it.
```

## Boundaries

- Put the plugin in `plugins/<plugin-name>/`. If the plugin needs ignore rules, add a `.gitignore` inside that plugin directory; do not edit the repository root `.gitignore`.
- The entry file is `plugin.py`; the factory function is `create_plugin()`.
- Plugin metadata goes in `_manifest.json`; runtime settings go in `config.toml`.
- New plugins should not modify `src/`, `dashboard/`, `config/`, or other host directories. If host changes are truly required, explain the reason, impact, and alternatives before asking for approval.
- Do not commit local experiments, logs, temporary scripts, personal secrets, tokens, cookies, or database files.
- Dependencies belong in `_manifest.json` `dependencies`. Only maintain MaiBot host dependencies when you are intentionally changing the host application.

## Minimal Structure

```text
plugins/my-plugin/
├── _manifest.json
├── plugin.py
├── config.toml
├── README.md
└── .gitignore
```

Recommended additions:

```text
plugins/my-plugin/
├── tests/
├── docs/
└── assets/
```

## Manifest Essentials

`_manifest.json` lets the Host validate a plugin before loading it. When AI generates it, check these points:

- `manifest_version` is currently `2`.
- `id` should be lowercase and namespaced, for example `com.example.my-plugin`.
- `version` must be strict three-part semantic versioning, for example `1.0.0`.
- `author.url`, `urls.repository`, and similar URLs must start with `http://` or `https://`.
- `host_application` and `sdk` must both declare `min_version` and `max_version`.
- Python package dependencies use `dependencies` entries with type `python_package`.
- Plugin dependencies use `dependencies` entries with type `plugin`.
- `capabilities` should only list capabilities the plugin actually needs.
- `i18n.default_locale` should usually be `zh-CN`.

```json
{
  "manifest_version": 2,
  "id": "com.example.my-plugin",
  "version": "1.0.0",
  "name": "我的插件",
  "description": "一个 MaiBot 插件",
  "author": {
    "name": "Developer",
    "url": "https://github.com/developer"
  },
  "license": "MIT",
  "urls": {
    "repository": "https://github.com/developer/my-plugin"
  },
  "host_application": {
    "min_version": "1.0.0",
    "max_version": "1.99.99"
  },
  "sdk": {
    "min_version": "2.5.1",
    "max_version": "2.99.99"
  },
  "dependencies": [],
  "capabilities": ["send_message"],
  "i18n": {
    "default_locale": "zh-CN"
  }
}
```

## Code Skeleton

```python
from typing import Any

from maibot_sdk import Command, Field, MaiBotPlugin, PluginConfigBase, Tool
from maibot_sdk.types import ToolParameterInfo, ToolParamType


class PluginSectionConfig(PluginConfigBase):
    """Basic plugin settings."""

    __ui_label__ = "插件"
    __ui_icon__ = "package"
    __ui_order__ = 0

    enabled: bool = Field(default=False, description="是否启用插件")
    config_version: str = Field(default="1.0.0", description="配置版本")


class MyPluginConfig(PluginConfigBase):
    """Plugin configuration."""

    plugin: PluginSectionConfig = Field(default_factory=PluginSectionConfig)


class MyPlugin(MaiBotPlugin):
    """My plugin."""

    config_model = MyPluginConfig

    async def on_load(self) -> None:
        """Run when the plugin is loaded."""
        self.ctx.logger.info("插件已加载")

    async def on_unload(self) -> None:
        """Run when the plugin is unloaded."""
        self.ctx.logger.info("插件已卸载")

    async def on_config_update(self, scope: str, config_data: dict[str, Any], version: str) -> None:
        """Run when configuration is hot-reloaded."""
        del scope
        del config_data
        del version

    @Tool(
        "echo_text",
        description="Repeat the provided text. Useful for testing whether the LLM can call this plugin.",
        parameters=[
            ToolParameterInfo(
                name="text",
                param_type=ToolParamType.STRING,
                description="要复述的文本",
                required=True,
            ),
        ],
    )
    async def echo_text(self, text: str, **kwargs: Any) -> dict[str, str]:
        del kwargs
        return {"content": text}

    @Command("ping", description="测试插件是否在线", pattern=r"^/ping$")
    async def ping(self, stream_id: str = "", **kwargs: Any) -> tuple[bool, str, bool]:
        del kwargs
        await self.ctx.send.text("pong", stream_id)
        return True, "pong", True


def create_plugin() -> MyPlugin:
    """Create the plugin instance."""
    return MyPlugin()
```

## Component Choice

- **Let the LLM call a capability** → `@Tool` — Default tools enter the deferred pool and are discovered by search; use `core_tool=True` only for frequent, low-risk tools
- **Trigger from user commands** → `@Command` — Match text with regex `pattern`, such as `/ping`
- **Intercept or observe host flow** → `@HookHandler` — Good for message rewrite, send auditing, and flow interception
- **Listen to messages or lifecycle events** → `@EventHandler` — Good for statistics, logging, and async helper tasks
- **Expose capability to other plugins** → `@API` — Only make stable interfaces public
- **Connect an external chat platform** → `@MessageGateway` — Used by adapter plugins
- **Maintain legacy plugins** → `@Action` — Legacy only; do not use it for new plugins

## Tool Rules

- `description` should explain when to use the tool, what the parameters mean, constraints, and side effects.
- Prefer `ToolParameterInfo` for parameters, with types from `ToolParamType`.
- Prefer returning a `dict`; put LLM-readable text in `content`.
- For images or media, use the documented `content_items` pattern instead of embedding base64 in long text.
- Do not set `core_tool=True` by default; too many core tools increase model selection cost.
- Handle failures inside tools and return readable errors instead of leaking stack traces.

## Sending Messages

- When `stream_id` is available, send text with `await self.ctx.send.text(content, stream_id)`.
- For images, emojis, forwards, and hybrid messages, prefer `self.ctx.send` and `self.ctx.emoji` capability proxies.
- Do not calculate session IDs yourself. Use `stream_id` or SDK-provided message context.
- User-facing text should default to Simplified Chinese.

## Configuration

- Config models inherit `PluginConfigBase`; fields use `Field(default=..., description="...")`.
- Keep a `[plugin]` section with `enabled` and `config_version`.
- Add WebUI hints with `__ui_label__`, `__ui_icon__`, and `__ui_order__` when useful.
- Prefer `self.config.<section>.<field>` for config access; use `self.get_plugin_config_data()` only when raw dictionaries are needed.
- Put hot-reload handling in `on_config_update()`.

## AI Code Review Checklist

Ask the AI to self-check these points before finishing:

- `_manifest.json` is complete, with valid version and URL formats.
- `plugin.py` imports only standard library, third-party packages, and `maibot_sdk`; import order follows project rules.
- The plugin class inherits `MaiBotPlugin` and declares `config_model`.
- `on_load()`, `on_unload()`, and `on_config_update()` are implemented.
- `create_plugin()` returns a plugin instance.
- New functionality uses `@Tool` or `@Command` where appropriate; new code does not use `@Action`.
- No host application code or root `.gitignore` was changed.
- No hard-coded tokens, absolute private paths, personal QQ IDs, group IDs, or private URLs.
- All network requests have timeouts and exception handling.
- Background tasks, connections, and file handles are cleaned up on unload.
- User-facing text is Simplified Chinese.
- README documents installation, enabling, configuration, commands, and troubleshooting.

## Prompt Templates

### Generate a New Plugin

```text
Create a MaiBot third-party plugin under plugins/<plugin-name>/ that implements <feature description>.
Requirements:
1. Only modify the plugin directory; do not modify MaiBot host code.
2. Use maibot-plugin-sdk with plugin.py and _manifest.json.
3. Implement on_load, on_unload, on_config_update, and create_plugin.
4. Use PluginConfigBase + Field for configuration. User-facing text should be Simplified Chinese.
5. Include README, config.toml, and a plugin-local .gitignore when needed.
6. Explain how to enable and test it in MaiBot.
```

### Modify an Existing Plugin

```text
Only modify files inside plugins/<plugin-name>/ to add <feature description>.
First read _manifest.json, plugin.py, config.toml, and README, then follow the existing style.
Do not refactor unrelated code or format the whole repository.
If host changes are required, stop and explain why first.
```

### Debug a Plugin

```text
Debug loading or runtime issues in plugins/<plugin-name>/.
Prioritize _manifest.json validation, dependency declarations, lifecycle methods, create_plugin, config models, and log exceptions.
Provide the smallest fix and avoid unrelated refactors.
```

## Testing Suggestions

- Static check: verify `_manifest.json` is valid JSON and `plugin.py` can be imported by Python.
- Local load: put the plugin in `plugins/`, start MaiBot, and inspect plugin load logs.
- WebUI check: confirm the plugin appears, can be enabled, and has editable config.
- Command test: use a command such as `/ping` to confirm `@Command` works.
- Tool test: let the LLM discover and call the tool through normal chat, then inspect whether the result is readable.
- Unload test: disable or unload the plugin and confirm background tasks, connections, and caches are cleaned up.

## Before Publishing

- The plugin repository root contains `_manifest.json`, `plugin.py`, `README.md`, and a sample `config.toml`.
- README documents features, installation, configuration, commands, capabilities, and troubleshooting.
- The license matches the `license` field in `_manifest.json`.
- Dependencies are fully declared so users do not need manual installs.
- `.venv/`, `__pycache__/`, logs, databases, secrets, and local configs are not committed.
- If submitting to the plugin repository, read its contributing guide and align metadata with its requirements.
