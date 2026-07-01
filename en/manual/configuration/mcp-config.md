---
title: MCP Configuration
---# MCP Configuration 🛠️

MCP (Model Context Protocol) allows MaiBot to connect to external tools, transforming it from "just chatting" to "talking and doing"—checking weather, searching news, reading files, calling APIs, and more.

This document provides a detailed guide on how to configure MCP in `bot_config.toml`.

::: tip 💡 先了解概念
If you are not familiar with what MCP is, it is recommended to read the [MCP Feature Overview](../features/mcp.md) first to understand its capabilities.
:::

## Configuration Structure Overview

MCP configuration is located under the `[mcp]` section of `bot_config.toml`, divided into three levels:

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

## Global Switch [mcp]

- **`enable`** — Whether to enable MCP. When set to `false`, no MCP servers will be connected. Enabled by default.

---

## Client Capabilities [mcp.client]

This section configures the capabilities MaiBot declares to the server when acting as an MCP **client**.

### Basic Information

```toml
[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"
```

Generally, no changes are needed unless you want the MCP server to see a different client identifier.

- **`client_name`** — The name of the client implementation. Default: `"MaiBot"`
- **`client_version`** — The version of the client implementation. Default: `"1.0.0"`

### Roots Capability [mcp.client.roots]

Roots allow you to expose local file system paths to the MCP server, enabling the server to read and write files within those paths.

```toml
[mcp.client.roots]
enable = true

[[mcp.client.roots.items]]
enabled = true
uri = "file:///home/mai/data"
name = "麦麦的数据目录"
```

- **`enable`** — Whether to expose Roots capability to the MCP server. Disabled by default.
- **`items`** — List of Roots. Empty by default.

Each Root item:

- **`enabled`** — Whether it is enabled. Enabled by default.
- **`uri`** — Root URI, usually a `file://` path; required when enabled. Empty by default.
- **`name`** — Display name. Empty by default.

::: tip 💡 Roots 有什么用？
If you connect to a file system MCP server (such as `@modelcontextprotocol/server-filesystem`), enabling Roots allows the server to know where your data directory is, enabling it to read and write files in that directory.
:::

### Sampling Capability [mcp.client.sampling]

Sampling allows the MCP server to **request MaiBot to call the LLM** to complete certain tasks. This is an advanced bidirectional capability.

```toml
[mcp.client.sampling]
enable = true
task_name = "planner"
include_context_support = false
tool_support = true
```

- **`enable`** — Whether to enable the Sampling capability declaration. Disabled by default.
- **`task_name`** — The main program model task name used when executing Sampling requests. Default: `"planner"`
- **`include_context_support`** — Whether to declare support for `includeContext` non- `none` semantics. Disabled by default.
- **`tool_support`** — Whether to declare support for continuing to use tools within Sampling. Disabled by default.

::: warning ⚠️ Sampling 会消耗 Tokens
Enabling Sampling means the MCP server can trigger MaiBot's model calls, which will incur additional API costs. Ensure `task_name` points to a properly configured model task.
:::

### Elicitation Capability [mcp.client.elicitation]

Elicitation allows the MCP server to request the user to fill out a form or open a URL in a browser.

```toml
[mcp.client.elicitation]
enable = true
allow_form = true
allow_url = false
```

- **`enable`** — Whether to enable the Elicitation capability declaration. Disabled by default.
- **`allow_form`** — Whether to allow form-mode Elicitation. Enabled by default.
- **`allow_url`** — Whether to allow URL-mode Elicitation. Disabled by default.

When enabled, at least one mode must be allowed (`allow_form` or `allow_url`).

---

## Server Configuration [[mcp.servers]]

This is the most commonly used part—configuring the MCP servers you want to connect to. **Multiple servers can be configured**, with each `[[mcp.servers]]` block corresponding to one server.

### General Fields

```toml
[[mcp.servers]]
name = "playwright"
enabled = true
transport = "stdio"           # 或 "streamable_http"、"sse"
http_timeout_seconds = 30.0
read_timeout_seconds = 300.0
```

- **`name`** — **Required**. Server name; must be unique within the same configuration. Empty by default.
- **`enabled`** — Whether to enable the current server. Enabled by default.
- **`transport`** — Transport method: `"stdio"` (default), `"streamable_http"`, `"sse"`
- **`http_timeout_seconds`** — HTTP request timeout (seconds). Default: 30.0
- **`read_timeout_seconds`** — Session read timeout (seconds). Default: 300.0

### stdio Mode

Runs the MCP server by starting a local subprocess, suitable for locally installed tools. Key fields:

- **`command`** — Startup command, e.g., `uvx`, `npx`, `python`
- **`args`** — List of command arguments
- **`env`** — Additional environment variables

#### Running via uvx (Recommended)

uvx is the execution tool bundled with [uv](https://docs.astral.sh/uv/), which manages dependencies automatically:

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

#### Running via npx

Requires Node.js to be installed first:

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

#### Running via Python

```toml
[[mcp.servers]]
name = "my-python-mcp"
transport = "stdio"
command = "python"
args = ["-m", "my_mcp_server"]
env = { PYTHONUNBUFFERED = "1" }
```

### streamable_http Mode

Connects to a remote MCP service (HTTP endpoint), suitable for cloud services or tools deployed by others. Key fields:

- **`url`** — MCP endpoint address; required.
- **`headers`** — Additional HTTP request headers
- **`authorization`** — HTTP authentication configuration

#### Remote Service without Authentication

```toml
[[mcp.servers]]
name = "public-weather-mcp"
transport = "streamable_http"
url = "https://mcp.example.com/weather"

[mcp.servers.authorization]
mode = "none"
```

#### Remote Service with Bearer Token

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

#### Remote Service with Custom Request Headers

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

## Complete Examples

### Basic Configuration: Connecting to a Single Service

```toml
[mcp]
enable = true

[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]
```

This is the simplest configuration—only one `enable = true` line adding a service, with all other settings using defaults.

### Daily Use Configuration: Two Services + Basic Capabilities

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

### Advanced Configuration: Enabling Sampling + Roots

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

## FAQ

### Q: Configuration not taking effect?

**You must restart MaiBot** after saving the configuration for it to take effect. The connection results will be printed in the startup logs:

```
✓ MCP 服务器 'playwright' 已连接 (工具 12 / Prompt 0 / 资源 0 / 模板 0)
```

If the connection fails, a warning log will appear:

```
⚠️ MCP 服务器 'playwright' 连接失败: ...
```

### Q: How many services can be configured?

There is no hard limit, but each service consumes resources. It is recommended to only configure those you actually need.

### Q: Where can I find MCP services online?

- Search for projects under the `modelcontextprotocol` organization on GitHub
- Search for `@modelcontextprotocol` packages on npm
- The Python community has server implementations in the `mcp` ecosystem

### Q: How to choose between stdio, streamable_http, and sse?

- **stdio**: Locally installed tools, low latency, no network required. Suitable for file operations, local computation, etc.
- **streamable_http**: Remote HTTP services, requires network. Suitable for cloud APIs or services deployed by others.
- **sse**: Remote SSE (Server-Sent Events) services, suitable for scenarios requiring server-side event pushing.

### Q: Where do I get the API Token?

It depends on the service you are connecting to. For GitHub MCP, generate one in GitHub Settings $\rightarrow$ Developer settings $\rightarrow$ Personal access tokens; for other third-party services, obtain it from the respective service's management console.

---

## Next Steps

- Want to learn about MCP concepts and capabilities $\rightarrow$ [MCP Feature Overview](../features/mcp.md)
- View all configuration items $\rightarrow$ [Bot Configuration Overview](./bot-config.md)