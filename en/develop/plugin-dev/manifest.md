---
title: Manifest
---# Manifest System

Every MaiBot plugin must include a `_manifest.json` file in its root directory to declare the plugin's metadata, version compatibility, dependencies, and capability requirements. The `ManifestValidator` on the Host side will strictly validate this file before loading.

::: tip _manifest.json 与 config.toml 的区别
- `_manifest.json`: Plugin **metadata** (ID, version, dependencies, etc.), validated and managed by the Host.
- `config.toml`: Plugin **runtime configuration** (feature toggles, parameters, etc.), read by the plugin itself.

The purposes of the two are completely different; do not confuse them.
:::

## _manifest.json Structure

Below is a complete Manifest example:

```json
{
  "manifest_version": 2,
  "id": "com.example.my-plugin",
  "version": "1.0.0",
  "name": "我的插件",
  "description": "一个示例插件",
  "author": {
    "name": "开发者",
    "url": "https://github.com/developer"
  },
  "license": "MIT",
  "urls": {
    "repository": "https://github.com/developer/my-plugin",
    "homepage": "https://example.com",
    "documentation": "https://docs.example.com",
    "issues": "https://github.com/developer/my-plugin/issues"
  },
  "host_application": {
    "min_version": "1.0.0",
    "max_version": "1.99.99"
  },
  "sdk": {
    "min_version": "1.0.0",
    "max_version": "2.99.99"
  },
  "dependencies": [],
  "plugin_type": "tool",
  "display": {
    "icon": {
      "type": "lucide",
      "value": "wrench"
    }
  },
  "capabilities": ["send_message"],
  "i18n": {
    "default_locale": "zh-CN",
    "locales_path": "i18n",
    "supported_locales": ["zh-CN", "en-US"]
  }
}
```

## Required Fields

- **`manifest_version`** `2` — Manifest protocol version, currently fixed at `2`
- **`id`** `string` — Unique plugin identifier, formatted as lowercase letters/numbers separated by dots or hyphens (e.g., `com.author.plugin`)
- **`version`** `string` — Plugin version number, must be a strict three-part semantic version (e.g., `1.0.0`)
- **`name`** `string` — Plugin display name
- **`description`** `string` — Plugin description
- **`author`** `object` — Plugin author information, containing `name` (author name) and `url` (author homepage, must be an HTTP/HTTPS URL)
- **`license`** `string` — Plugin license
- **`urls`** `object` — Collection of plugin-related links (see below)
- **`host_application`** `object` — Host compatibility range (see below)
- **`sdk`** `object` — SDK compatibility range (see below)
- **`capabilities`** `string[]` — List of capability requests declared by the plugin; null values are not allowed
- **`i18n`** `object` — Internationalization configuration (see below)

## Optional Fields

### plugin_type Plugin Type

`plugin_type` is used to declare the primary role of the plugin, used by the WebUI for display, filtering, and default icon selection. This is an optional field and does not require upgrading `manifest_version`; it defaults to `extension` if omitted.

Optional values:

- `adapter` — Message platform or protocol adapter
- `tool` — Tool, command, or model-callable capability
- `provider` — LLM, TTS, API, or other service provider
- `management` — Management, permissions, group management, or backend-type plugin
- `data` — Statistics, memory, knowledge base, import/export, or other data-type plugins
- `media` — Image, voice, video, emoji, or other media processing
- `game` — Game or entertainment interaction
- `integration` — External platform, search, Webhook, or other integrations
- `extension` — General extension
- `other` — Other

### display Display Metadata

`display.icon` is used to declare the plugin icon. This field only affects WebUI display and does not participate in plugin runtime behavior.

```json
{
  "display": {
    "icon": {
      "type": "local",
      "value": "assets/icon.png",
      "fallback": "package",
      "background": "#1f2937"
    }
  }
}
```

- `type`: `lucide`, `emoji`, or `local`
- `value`: Icon value. `lucide` uses an icon name, `emoji` uses a single emoji or short text, `local` uses a relative path within the plugin directory
- `fallback`: Optional, the lucide icon name used when icon loading fails
- `background`: Optional, icon background color, formatted as `#RRGGBB`

Online URLs are not allowed as plugin icons. Local icons only support `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, and the path must be within the plugin directory; absolute paths, `..`, or symbolic links cannot be used.

### urls Link Collection

- **`repository`** · Required — Plugin repository address, must be an HTTP/HTTPS URL
- **`homepage`** · Optional — Plugin homepage address
- **`documentation`** · Optional — Plugin documentation address
- **`issues`** · Optional — Plugin issue feedback address

### host_application / sdk Version Range

Both have the same structure and are declared as closed intervals:

```json
{
  "min_version": "1.0.0",
  "max_version": "1.99.99"
}
```

- `min_version`: Minimum allowed version (closed interval)
- `max_version`: Maximum allowed version (closed interval)
- Both must be strict three-part semantic version numbers (`X.Y.Z`)
- `min_version` cannot be greater than `max_version`

The Host will verify during the handshake phase whether the current version falls within the declared range. If incompatible, the plugin will be blocked from loading.

### i18n Internationalization Configuration

- **`default_locale`** · Required — Default language code (e.g., `zh-CN`)
- **`locales_path`** · Optional — Directory path for language resource files
- **`supported_locales`** · Optional — List of supported languages; cannot contain null values or duplicates. If not empty, `default_locale` must exist in this list

### llm_providers LLM Provider Declaration

Declares the LLM Provider capabilities provided by the plugin, allowing other plugins to call them via the `ctx.llm` proxy.

- **`client_type`** · Required — Unique Provider identifier, must exactly match the value declared in the `@LLMProvider` decorator
- **`name`** · Required — Provider display name
- **`description`** · Optional — Provider functional description
- **`version`** · Optional · Default `"1.0.0"` — Provider version number

::: warning 双重声明要求
The `llm_providers` field and the `@LLMProvider` decorator must both be declared, and the `client_type` must match exactly. If declared in only one place, or if they are inconsistent, the plugin will be blocked from loading.
:::

::: danger 冲突加载策略
If two plugins declare the same `client_type`, **both plugins will be prohibited from loading**. Please use a unique prefix (e.g., `com.example.my-provider`) when designing Providers to avoid conflicts.
:::

```json
{
  "llm_providers": [
    {
      "client_type": "my_custom_llm",
      "name": "My Custom LLM",
      "description": "A custom LLM provider",
      "version": "1.0.0"
    }
  ]
}
```

## Dependency Declaration

The `dependencies` array supports two types of dependencies, distinguished by the `type` field:

### Plugin-level Dependencies

```json
{
  "type": "plugin",
  "id": "com.example.other-plugin",
  "version_spec": ">=1.0.0,<2.0.0"
}
```

- `id`: The ID of the dependent plugin, following the same formatting rules as the plugin ID
- `version_spec`: Version constraint expression, using PEP 440 style (e.g., `>=1.0.0`, `~=1.0`)
- Circular dependencies or self-dependencies are not allowed
- Duplicate declarations of the same plugin dependency are not allowed

### Python Package Dependencies

```json
{
  "type": "python_package",
  "name": "httpx",
  "version_spec": ">=0.24.0"
}
```

- `name`: Python package name, allowing only letters, numbers, dots, underscores, and hyphens
- `version_spec`: Version constraint expression

### Dependency Resolution Process

`PluginDependencyPipeline` performs unified dependency analysis on the Host side:

1. **Scanning**: Collects `_manifest.json` from all plugins
2. **Host Conflict Detection**: If a plugin's Python package dependency has no intersection with the main program's dependency constraints, loading is blocked
3. **Inter-plugin Conflict Detection**: If multiple plugins have mutually exclusive version constraints for the same Python package, all are blocked from loading
4. **Automatic Installation**: For missing Python dependencies of loadable plugins, `uv pip install` is used preferentially, falling back to `pip install`
5. **Topological Sorting**: Determines the Runner startup order based on cross-Supervisor dependency relationships; circular dependencies will be rejected

## Validation Rules

The Manifest validator (`ManifestValidator`) uses Pydantic strict mode. The main validation rules include:

- **No Extra Fields**: Fields not declared in `_manifest.json` are not allowed
- **ID Format**: Must match `^[a-z0-9]+(?:[.-][a-z0-9]+)+$` (e.g., `com.example.my-plugin`)
- **Version Format**: Must be a `X.Y.Z` three-part version
- **URL Format**: Must start with `http://` or `https://`
- **No Self-dependency**: Cannot depend on itself in `dependencies`
- **No Duplicate Dependencies**: The same plugin/package name can only be declared once