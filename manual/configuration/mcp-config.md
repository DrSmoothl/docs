---
title: MCP 配置
---

# MCP 配置 🛠️

MCP（Model Context Protocol）让 MaiBot 能够连接外部工具，从"只会聊天"变成"又能说又能做"——查天气、搜新闻、读文件、调 API，全都可以。

本文详细介绍如何在 `bot_config.toml` 中配置 MCP。

::: tip 💡 先了解概念
如果你还不熟悉 MCP 是什么，建议先阅读 [MCP 功能概述](../features/mcp.md)，了解它能做什么。
:::

## 配置结构总览

MCP 配置位于 `bot_config.toml` 的 `[mcp]` 段落下，分为三个层级：

```toml
[mcp]
enable = true                         # 总开关

[mcp.client]                          # 客户端宿主能力
client_name = "MaiBot"
client_version = "1.0.0"

[mcp.client.roots]                    # Roots 能力（向服务端暴露本地路径）
enable = false

[mcp.client.sampling]                 # Sampling 能力（允许服务端调用你的模型）
enable = false
task_name = "planner"

[mcp.client.elicitation]              # Elicitation 能力（允许服务端请求用户填表）
enable = false
allow_form = true
allow_url = false

[[mcp.servers]]                       # MCP 服务器列表（可多个）
name = "my-server"
enabled = true
transport = "stdio"
command = "uvx"
args = ["some-mcp-server"]
env = { }
url = ""
headers = { }
http_timeout_seconds = 30.0
read_timeout_seconds = 300.0

[mcp.servers.authorization]
mode = "none"
bearer_token = ""
```

---

## 总开关 [mcp]

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | `bool` | `true` | 是否启用 MCP。设为 `false` 时所有 MCP 服务器都不会连接 |

---

## 客户端能力 [mcp.client]

这部分配置 MaiBot 作为 MCP **客户端**时，向服务端声明自己的能力。

### 基础信息

```toml
[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"
```

一般不需要改，除非你希望 MCP 服务端看到不同的客户端标识。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `client_name` | `str` | `"MaiBot"` | 客户端实现名称 |
| `client_version` | `str` | `"1.0.0"` | 客户端实现版本 |

### Roots 能力 [mcp.client.roots]

Roots 允许你向 MCP 服务器暴露本地文件系统路径，让服务器能读写这些路径下的文件。

```toml
[mcp.client.roots]
enable = true

[[mcp.client.roots.items]]
enabled = true
uri = "file:///home/mai/data"
name = "麦麦的数据目录"
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | `bool` | `false` | 是否向 MCP 服务器暴露 Roots 能力 |
| `items` | `list` | `[]` | Roots 列表 |

每个 Root 项：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | `bool` | `true` | 是否启用 |
| `uri` | `str` | `""` | Root URI，通常为 `file://` 路径。启用时必填 |
| `name` | `str` | `""` | 显示名称 |

::: tip 💡 Roots 有什么用？
如果连接了一个文件系统 MCP 服务器（如 `@modelcontextprotocol/server-filesystem`），开启 Roots 后，服务器就能知道你的数据目录在哪，从而读写该目录下的文件。
:::

### Sampling 能力 [mcp.client.sampling]

Sampling 允许 MCP 服务端**反过来请求 MaiBot 调用大模型**来完成某些任务。这是一个高级的双向能力。

```toml
[mcp.client.sampling]
enable = true
task_name = "planner"
include_context_support = false
tool_support = true
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | `bool` | `false` | 是否启用 Sampling 能力声明 |
| `task_name` | `str` | `"planner"` | 执行 Sampling 请求时使用的主程序模型任务名 |
| `include_context_support` | `bool` | `false` | 是否声明支持 `includeContext` 非 `none` 语义 |
| `tool_support` | `bool` | `false` | 是否声明支持在 Sampling 中继续使用工具 |

::: warning ⚠️ Sampling 会消耗 Tokens
启用 Sampling 意味着 MCP 服务端可以触发 MaiBot 的模型调用，会产生额外的 API 费用。确保 `task_name` 指向一个已配置好的模型任务。
:::

### Elicitation 能力 [mcp.client.elicitation]

Elicitation 允许 MCP 服务端请求用户填写表单或在浏览器中打开 URL。

```toml
[mcp.client.elicitation]
enable = true
allow_form = true
allow_url = false
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | `bool` | `false` | 是否启用 Elicitation 能力声明 |
| `allow_form` | `bool` | `true` | 是否允许表单模式 Elicitation |
| `allow_url` | `bool` | `false` | 是否允许 URL 模式 Elicitation |

启用时至少需要允许一种模式（`allow_form` 或 `allow_url`）。

---

## 服务器配置 [[mcp.servers]]

这是最常用的部分——配置你想连接的 MCP 服务器。**可以配置多个**，每段 `[[mcp.servers]]` 对应一个服务器。

### 通用字段

```toml
[[mcp.servers]]
name = "playwright"
enabled = true
transport = "stdio"           # 或 "streamable_http"、"sse"
http_timeout_seconds = 30.0
read_timeout_seconds = 300.0
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `name` | `str` | `""` | **必填**。服务器名称，在同一配置中不能重复 |
| `enabled` | `bool` | `true` | 是否启用当前服务器 |
| `transport` | `"stdio"` / `"streamable_http"` / `"sse"` | `"stdio"` | 传输方式 |
| `http_timeout_seconds` | `float` | `30.0` | HTTP 请求超时（秒） |
| `read_timeout_seconds` | `float` | `300.0` | 会话读取超时（秒） |

### stdio 模式

通过启动一个本地子进程来运行 MCP 服务器，适合本地安装的工具。关键字段：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `command` | `str` | 启动命令，如 `uvx`、`npx`、`python` |
| `args` | `list[str]` | 命令参数列表 |
| `env` | `dict[str, str]` | 附加环境变量 |

#### 通过 uvx 运行（推荐）

uvx 是 [uv](https://docs.astral.sh/uv/) 自带的运行工具，自动管理依赖：

```toml
[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]
```

```toml
[[mcp.servers]]
name = "mcp-sse"
transport = "stdio"
command = "uvx"
args = ["mcp-sse-server", "--port", "8080"]
```

#### 通过 npx 运行

需要先安装 Node.js：

```toml
[[mcp.servers]]
name = "github"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_TOKEN = "ghp_your_token_here" }
```

```toml
[[mcp.servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
```

#### 通过 Python 运行

```toml
[[mcp.servers]]
name = "my-python-mcp"
transport = "stdio"
command = "python"
args = ["-m", "my_mcp_server"]
env = { PYTHONUNBUFFERED = "1" }
```

### streamable_http 模式

连接远程 MCP 服务（HTTP 端点），适合云服务或别人部署好的工具。关键字段：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `url` | `str` | MCP 端点地址，必填 |
| `headers` | `dict[str, str]` | 附加 HTTP 请求头 |
| `authorization` | `object` | HTTP 认证配置 |

#### 无认证的远程服务

```toml
[[mcp.servers]]
name = "public-weather-mcp"
transport = "streamable_http"
url = "https://mcp.example.com/weather"

[mcp.servers.authorization]
mode = "none"
```

#### 带 Bearer Token 的远程服务

```toml
[[mcp.servers]]
name = "private-api-mcp"
transport = "streamable_http"
url = "https://api.example.com/mcp"
headers = { "X-Custom-Header" = "custom-value" }

[mcp.servers.authorization]
mode = "bearer"
bearer_token = "sk-your-bearer-token"
```

#### 带自定义请求头的远程服务

```toml
[[mcp.servers]]
name = "enterprise-mcp"
transport = "streamable_http"
url = "https://internal.example.com/mcp/v1"
headers = {
    "X-API-Key" = "your-api-key",
    "X-Tenant-ID" = "tenant-001",
}
```

---

## 完整示例

### 基础配置：只连接一个服务

```toml
[mcp]
enable = true

[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]
```

这是最简单的配置——只写了一行 `enable = true` 加一个服务，其余全部走默认值。

### 日常使用配置：两个服务 + 基础能力

```toml
[mcp]
enable = true

[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"

# 连接 Playwright（浏览器自动化）
[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]

# 连接文件系统服务器
[[mcp.servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
```

### 高级配置：启用 Sampling + Roots

```toml
[mcp]
enable = true

[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"

[mcp.client.roots]
enable = true

[[mcp.client.roots.items]]
enabled = true
uri = "file:///home/mai/data"
name = "数据目录"

[mcp.client.sampling]
enable = true
task_name = "planner"
tool_support = true

# 本地服务
[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]

# 远程服务
[[mcp.servers]]
name = "weather-api"
transport = "streamable_http"
url = "https://mcp.example.com/weather"
```

---

## 常见问题

### Q: 配置后不生效？

保存配置后**必须重启 MaiBot** 才能生效。启动日志中会打印连接结果：

```
✓ MCP 服务器 'playwright' 已连接 (工具 12 / Prompt 0 / 资源 0 / 模板 0)
```

如果连接失败会有警告日志：

```
⚠️ MCP 服务器 'playwright' 连接失败: ...
```

### Q: 可以配置多少个服务？

没有硬性限制，但每个服务都会消耗资源。建议只配置你实际需要的。

### Q: 如何在网上找 MCP 服务？

- GitHub 上搜索 `modelcontextprotocol` 组织下的项目
- npm 上搜索 `@modelcontextprotocol` 包
- Python 社区有 `mcp` 生态的服务器实现

### Q: stdio、streamable_http 和 sse 怎么选？

- **stdio**：本地安装的工具，延迟低，无需网络。适合文件操作、本地计算等
- **streamable_http**：远程 HTTP 服务，需要网络。适合云 API、别人部署好的服务
- **sse**：远程 SSE（Server-Sent Events）服务，适合需要服务端推送事件的场景

### Q: 从哪里获取 API Token？

取决于你连接的服务。如果是 GitHub MCP，去 GitHub Settings → Developer settings → Personal access tokens 生成；如果是其他第三方服务，去对应服务的管理后台获取。

---

## 下一步

- 想了解 MCP 的概念和能做什么 → [MCP 功能概述](../features/mcp.md)
- 查看所有配置项 → [Bot 配置总览](./bot-config.md)
