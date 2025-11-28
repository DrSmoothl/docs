# 插件配置 Schema 开发文档

本文档介绍如何使用 MaiBot 的插件配置系统，让你的插件支持 WebUI 可视化配置。

## 概述

MaiBot 的插件配置系统允许插件开发者通过声明式的方式定义配置项，WebUI 会自动根据配置 Schema 生成配置表单。

### 核心组件

| 组件 | 说明 |
|------|------|
| `ConfigField` | 配置字段定义，描述单个配置项的类型、默认值、UI 控件等 |
| `ConfigSection` | 配置节元数据，描述一组相关配置的标题、图标等 |
| `ConfigTab` | 标签页定义，用于将多个 section 组织到一个标签页 |
| `ConfigLayout` | 页面布局定义，支持自动布局、标签页布局等 |

## 快速开始

### 基础用法

```python
from src.plugin_system.base.base_plugin import BasePlugin
from src.plugin_system.base.config_types import ConfigField

class MyPlugin(BasePlugin):
    plugin_name = "my_plugin"
    enable_plugin = True
    dependencies = []
    python_dependencies = []
    config_file_name = "config.toml"
    
    # 定义配置 Schema
    config_schema = {
        "plugin": {
            "name": ConfigField(
                type=str,
                default="my_plugin",
                description="插件名称",
                required=True
            ),
            "enabled": ConfigField(
                type=bool,
                default=True,
                description="是否启用插件"
            ),
        },
        "api": {
            "key": ConfigField(
                type=str,
                default="",
                description="API 密钥",
                input_type="password",
                placeholder="请输入您的 API 密钥"
            ),
            "timeout": ConfigField(
                type=int,
                default=30,
                description="请求超时时间（秒）",
                min=1,
                max=120
            ),
        }
    }
    
    # 可选：Section 元数据
    config_section_descriptions = {
        "plugin": "插件基本信息",
        "api": "API 配置",
    }
```

## ConfigField 详解

### 构造参数

#### 基础字段（必需）

| 参数 | 类型 | 说明 |
|------|------|------|
| `type` | `type` | 字段类型：`str`, `int`, `float`, `bool`, `list`, `dict` |
| `default` | `Any` | 默认值 |
| `description` | `str` | 字段描述，也用作默认标签 |

#### 验证相关

| 参数 | 类型 | 说明 |
|------|------|------|
| `required` | `bool` | 是否必需，默认 `False` |
| `choices` | `List[Any]` | 可选值列表，用于下拉选择 |
| `min` | `float` | 最小值（数字类型） |
| `max` | `float` | 最大值（数字类型） |
| `step` | `float` | 步进值（数字类型） |
| `pattern` | `str` | 正则验证（字符串类型） |
| `max_length` | `int` | 最大长度（字符串类型） |
| `example` | `str` | 示例值，用于生成配置文件注释 |

#### UI 显示控制

| 参数 | 类型 | 说明 |
|------|------|------|
| `label` | `str` | 显示标签，默认使用 `description` |
| `placeholder` | `str` | 输入框占位符 |
| `hint` | `str` | 字段下方的提示文字 |
| `icon` | `str` | 字段图标名称 |
| `hidden` | `bool` | 是否在 UI 中隐藏，默认 `False` |
| `disabled` | `bool` | 是否禁用编辑，默认 `False` |
| `order` | `int` | 排序权重，数字越小越靠前，默认 `0` |

#### 输入控件类型

| 参数 | 类型 | 说明 |
|------|------|------|
| `input_type` | `str` | 强制指定控件类型，不指定则自动推断 |
| `rows` | `int` | textarea 行数，默认 `3` |

支持的 `input_type` 值：

| 值 | 说明 |
|------|------|
| `text` | 单行文本输入框 |
| `password` | 密码输入框（带显示/隐藏切换） |
| `textarea` | 多行文本域 |
| `number` | 数字输入框 |
| `color` | 颜色选择器 |
| `code` | 代码编辑器 |
| `file` | 文件上传（计划中） |
| `json` | JSON 编辑器（计划中） |

#### 分组与条件显示

| 参数 | 类型 | 说明 |
|------|------|------|
| `group` | `str` | 字段分组，在 section 内再细分 |
| `depends_on` | `str` | 依赖的字段路径，如 `"section.field"` |
| `depends_value` | `Any` | 依赖字段需要的值 |

### 控件自动推断规则

如果不指定 `input_type`，系统会根据以下规则自动选择控件：

| 条件 | 控件类型 |
|------|----------|
| `type=bool` | Switch 开关 |
| `type=int/float` + 有 `min` 和 `max` | Slider 滑块 |
| `type=int/float` | NumberInput 数字输入框 |
| `type=str` + 有 `choices` | Select 下拉选择 |
| `type=str` + `input_type="password"` | Password 密码框 |
| `type=str` + `input_type="textarea"` | Textarea 文本域 |
| `type=list` | DynamicList 动态列表 |
| `type=dict` | JSON 编辑器 |
| `type=str`（默认） | Input 文本框 |

### 示例

```python
config_schema = {
    "api": {
        # 密码输入框
        "api_key": ConfigField(
            type=str,
            default="",
            description="API 密钥",
            input_type="password",
            placeholder="sk-xxxxxxxx",
            required=True,
            hint="从服务商控制台获取"
        ),
        
        # 带范围限制的滑块
        "temperature": ConfigField(
            type=float,
            default=0.7,
            description="生成温度",
            min=0.0,
            max=2.0,
            step=0.1,
            hint="较高的值会使输出更随机"
        ),
        
        # 下拉选择
        "model": ConfigField(
            type=str,
            default="gpt-4",
            description="使用的模型",
            choices=["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
            icon="cpu"
        ),
        
        # 多行文本
        "system_prompt": ConfigField(
            type=str,
            default="",
            description="系统提示词",
            input_type="textarea",
            rows=5,
            placeholder="输入系统提示词..."
        ),
        
        # 条件显示：只在 debug 为 True 时显示
        "debug_log_path": ConfigField(
            type=str,
            default="./debug.log",
            description="调试日志路径",
            depends_on="debug.enabled",
            depends_value=True
        ),
    }
}
```

## ConfigSection 详解

用于为配置节添加元数据，如标题、图标、是否默认折叠等。

### 方式一：简单字符串

```python
config_section_descriptions = {
    "plugin": "插件基本信息",
    "api": "API 配置",
}
```

### 方式二：使用 ConfigSection

```python
from src.plugin_system.base.config_types import ConfigSection

config_section_descriptions = {
    "plugin": ConfigSection(
        title="插件基本信息",
        description="配置插件的基本属性",
        icon="settings",
        order=1
    ),
    "api": ConfigSection(
        title="API 配置",
        description="外部 API 的连接参数",
        icon="cloud",
        order=2
    ),
    "advanced": ConfigSection(
        title="高级设置",
        icon="code",
        collapsed=True,  # 默认折叠
        order=99
    ),
}
```

### 方式三：使用便捷函数

```python
from src.plugin_system.base.config_types import section_meta

config_section_descriptions = {
    "plugin": section_meta("插件基本信息", icon="settings", order=1),
    "api": section_meta("API 配置", icon="cloud", order=2),
    "advanced": section_meta("高级设置", collapsed=True, order=99),
}
```

### ConfigSection 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `str` | 必需 | 显示标题 |
| `description` | `str` | `None` | 详细描述 |
| `icon` | `str` | `None` | 图标名称 |
| `collapsed` | `bool` | `False` | 默认是否折叠 |
| `order` | `int` | `0` | 排序权重 |

## 自定义布局

默认情况下，所有 section 会以可折叠面板的形式展示。如果需要更复杂的布局，可以使用 `config_layout`。

### 标签页布局

```python
from src.plugin_system.base.config_types import ConfigLayout, ConfigTab

class MyPlugin(BasePlugin):
    # ... 其他属性 ...
    
    config_schema = {
        "plugin": { ... },
        "api": { ... },
        "model": { ... },
        "debug": { ... },
        "logging": { ... },
    }
    
    config_layout = ConfigLayout(
        type="tabs",
        tabs=[
            ConfigTab(
                id="basic",
                title="基础设置",
                sections=["plugin", "api"],
                icon="settings"
            ),
            ConfigTab(
                id="model",
                title="模型配置",
                sections=["model"],
                icon="cpu"
            ),
            ConfigTab(
                id="dev",
                title="开发者",
                sections=["debug", "logging"],
                icon="terminal",
                badge="Dev"  # 显示角标
            ),
        ]
    )
```

### ConfigTab 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `id` | `str` | 必需 | 标签页 ID |
| `title` | `str` | 必需 | 显示标题 |
| `sections` | `List[str]` | `[]` | 包含的 section 名称列表 |
| `icon` | `str` | `None` | 图标名称 |
| `order` | `int` | `0` | 排序权重 |
| `badge` | `str` | `None` | 角标文字 |

### ConfigLayout 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `str` | `"auto"` | 布局类型：`auto`、`tabs`、`pages` |
| `tabs` | `List[ConfigTab]` | `[]` | 标签页列表 |

布局类型说明：

| 类型 | 说明 |
|------|------|
| `auto` | 自动布局，section 以可折叠面板显示 |
| `tabs` | 标签页布局，顶部标签切换 |
| `pages` | 分页布局，左侧导航 + 右侧内容（计划中） |

## 完整示例

```python
from src.plugin_system.base.base_plugin import BasePlugin
from src.plugin_system.base.config_types import (
    ConfigField,
    ConfigSection,
    ConfigLayout,
    ConfigTab,
)
from src.plugin_system.apis.plugin_register_api import register_plugin


@register_plugin
class TTSPlugin(BasePlugin):
    """TTS 语音合成插件"""
    
    plugin_name = "tts_plugin"
    enable_plugin = True
    dependencies = []
    python_dependencies = []
    config_file_name = "config.toml"
    
    # 配置 Schema
    config_schema = {
        "plugin": {
            "name": ConfigField(
                type=str,
                default="tts_plugin",
                description="插件名称",
                required=True
            ),
            "version": ConfigField(
                type=str,
                default="1.0.0",
                description="插件版本"
            ),
            "enabled": ConfigField(
                type=bool,
                default=True,
                description="是否启用插件"
            ),
        },
        "tts": {
            "provider": ConfigField(
                type=str,
                default="azure",
                description="TTS 服务提供商",
                choices=["azure", "google", "local"],
                order=1
            ),
            "api_key": ConfigField(
                type=str,
                default="",
                description="API 密钥",
                input_type="password",
                required=True,
                order=2
            ),
            "voice": ConfigField(
                type=str,
                default="zh-CN-XiaoxiaoNeural",
                description="语音角色",
                placeholder="例如: zh-CN-XiaoxiaoNeural",
                order=3
            ),
            "speed": ConfigField(
                type=float,
                default=1.0,
                description="语速",
                min=0.5,
                max=2.0,
                step=0.1,
                order=4
            ),
        },
        "cache": {
            "enabled": ConfigField(
                type=bool,
                default=True,
                description="启用缓存"
            ),
            "max_size": ConfigField(
                type=int,
                default=100,
                description="最大缓存数量",
                min=10,
                max=1000,
                depends_on="cache.enabled",
                depends_value=True
            ),
            "ttl": ConfigField(
                type=int,
                default=3600,
                description="缓存过期时间（秒）",
                min=60,
                depends_on="cache.enabled",
                depends_value=True
            ),
        },
        "debug": {
            "enabled": ConfigField(
                type=bool,
                default=False,
                description="调试模式"
            ),
            "log_level": ConfigField(
                type=str,
                default="INFO",
                description="日志级别",
                choices=["DEBUG", "INFO", "WARNING", "ERROR"]
            ),
        },
    }
    
    # Section 元数据
    config_section_descriptions = {
        "plugin": ConfigSection(
            title="插件信息",
            icon="info",
            order=1
        ),
        "tts": ConfigSection(
            title="TTS 配置",
            description="语音合成相关设置",
            icon="volume-2",
            order=2
        ),
        "cache": ConfigSection(
            title="缓存设置",
            icon="database",
            order=3
        ),
        "debug": ConfigSection(
            title="调试选项",
            icon="bug",
            collapsed=True,
            order=99
        ),
    }
    
    # 自定义布局（可选）
    config_layout = ConfigLayout(
        type="tabs",
        tabs=[
            ConfigTab(id="main", title="主要设置", sections=["plugin", "tts"]),
            ConfigTab(id="advanced", title="高级", sections=["cache", "debug"]),
        ]
    )
    
    # ... 插件其他实现 ...
```

## 在插件中读取配置

```python
class MyPlugin(BasePlugin):
    def some_method(self):
        # 读取单个配置项
        api_key = self.get_config("api.key")
        timeout = self.get_config("api.timeout", default=30)
        
        # 读取整个 section
        api_config = self.config.get("api", {})
        
        # 检查是否启用
        if self.get_config("plugin.enabled", True):
            # 执行逻辑
            pass
```

## WebUI API

WebUI 提供以下 API 用于配置管理：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/webui/plugins/config/{plugin_id}/schema` | GET | 获取插件配置 Schema |
| `/api/webui/plugins/config/{plugin_id}` | GET | 获取当前配置值 |
| `/api/webui/plugins/config/{plugin_id}` | PUT | 更新配置 |
| `/api/webui/plugins/config/{plugin_id}/reset` | POST | 重置为默认配置 |
| `/api/webui/plugins/config/{plugin_id}/toggle` | POST | 切换启用/禁用状态 |

## 最佳实践

### 1. 合理组织 Section

将相关的配置项放在同一个 section 中，使用有意义的 section 名称。

```python
# 好的做法
config_schema = {
    "api": { ... },      # API 相关
    "model": { ... },    # 模型相关
    "cache": { ... },    # 缓存相关
}

# 避免
config_schema = {
    "settings": { ... },  # 太笼统
    "misc": { ... },      # 不清晰
}
```

### 2. 提供有意义的描述和提示

```python
ConfigField(
    type=str,
    default="",
    description="OpenAI API 密钥",  # 清晰的描述
    hint="从 platform.openai.com 获取",  # 有帮助的提示
    placeholder="sk-..."  # 格式示例
)
```

### 3. 使用合适的控件类型

```python
# 敏感信息用密码框
"api_key": ConfigField(type=str, input_type="password", ...)

# 有限选项用下拉
"model": ConfigField(type=str, choices=["gpt-3.5", "gpt-4"], ...)

# 范围值用滑块
"temperature": ConfigField(type=float, min=0, max=2, ...)

# 长文本用 textarea
"prompt": ConfigField(type=str, input_type="textarea", rows=5, ...)
```

### 4. 设置合理的默认值

```python
ConfigField(
    type=int,
    default=30,  # 合理的默认值
    min=1,
    max=120,
    description="超时时间（秒）"
)
```

### 5. 使用条件显示减少界面复杂度

```python
"debug_enabled": ConfigField(type=bool, default=False, ...),
"debug_log_path": ConfigField(
    type=str,
    depends_on="debug.debug_enabled",
    depends_value=True,
    ...
)
```

### 6. 使用 order 控制显示顺序

```python
"important_field": ConfigField(..., order=1),
"less_important": ConfigField(..., order=10),
"rarely_used": ConfigField(..., order=99),
```

## 迁移指南

如果你的插件使用旧版 `config_schema`，升级非常简单：

### 旧版

```python
config_schema = {
    "api": {
        "key": ConfigField(type=str, default="", description="API密钥"),
    }
}
```

### 新版（完全兼容）

旧版代码无需修改即可继续工作。如需使用新功能，只需添加新参数：

```python
config_schema = {
    "api": {
        "key": ConfigField(
            type=str,
            default="",
            description="API密钥",
            # 新增的参数
            input_type="password",
            placeholder="请输入 API 密钥",
            hint="从控制台获取",
            required=True,
            order=1
        ),
    }
}
```

## 常见问题

### Q: 配置修改后何时生效？

A: 配置保存到 TOML 文件后，需要重新加载插件才能生效。WebUI 会显示提示信息。

### Q: 如何验证配置值？

A: 目前支持基本验证（必填、范围、正则），复杂验证逻辑需要在插件代码中实现。

### Q: 支持哪些图标？

A: 图标使用 Lucide Icons，参考 https://lucide.dev/icons

### Q: 如何处理敏感配置？

A: 使用 `input_type="password"` 会在 UI 中隐藏输入内容，但配置文件中仍是明文存储。如需加密存储，需要自行实现。
