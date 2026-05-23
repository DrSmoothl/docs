---
title: MCP Configuration
---

# MCP Configuration 🛠️

MCP (Model Context Protocol) allows MaiBot to connect with external tools — from a "chat-only" bot to one that can check weather, search news, read files, call APIs, and more.

This guide explains how to configure MCP in your `bot_config.toml`.

::: tip 💡 Learn the concepts first
If you're not familiar with MCP yet, read the [MCP Feature Overview](../features/mcp.md) first to understand what it can do.
:::

## Configuration Structure Overview

MCP configuration lives under the `[mcp]` section of `bot_config.toml`, with three layers:

```toml
[mcp]
enable = true                         # Master switch

[mcp.client]                          # Client host capabilities
client_name = "MaiBot"
client_version = "1.0.0"

[mcp.client.roots]                    # Roots capability (expose local paths to server)
enable = false

[mcp.client.sampling]                 # Sampling capability (let server use your LLM)
enable = false
task_name = "planner"

[mcp.client.elicitation]              # Elicitation capability (let server request user input)
enable = false
allow_form = true
allow_url = false

[[mcp.servers]]                       # MCP server list (multiple allowed)
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

## Master Switch [mcp]

- **`enable`** — Whether to enable MCP. When `false`, no MCP servers will be connected. Default: enabled

---

## Client Capabilities [mcp.client]

This section configures what MaiBot declares to MCP servers as a **client**.

### Basic Info

```toml
[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"
```

Usually you don't need to change this, unless you want MCP servers to see a different client identity.

- **`client_name`** — Client implementation name. Default: `"MaiBot"`
- **`client_version`** — Client implementation version. Default: `"1.0.0"`

### Roots Capability [mcp.client.roots]

Roots allow you to expose local filesystem paths to MCP servers, enabling them to read and write files in those directories.

```toml
[mcp.client.roots]
enable = true

[[mcp.client.roots.items]]
enabled = true
uri = "file:///home/mai/data"
name = "Mai's data directory"
```

- **`enable`** — Whether to expose Roots capability to MCP servers. Default: disabled
- **`items`** — Roots list. Default: empty

Each Root item:

- **`enabled`** — Whether to enable this root. Default: enabled
- **`uri`** — Root URI, typically a `file://` path. Required when enabled. Default: empty
- **`name`** — Display name. Default: empty

::: tip 💡 What are Roots good for?
If you connect a filesystem MCP server (e.g., `@modelcontextprotocol/server-filesystem`), enabling Roots tells the server where your data directory is, so it can read and write files there.
:::

### Sampling Capability [mcp.client.sampling]

Sampling allows MCP servers to **ask MaiBot to call its LLM** for certain tasks. This is an advanced bidirectional capability.

```toml
[mcp.client.sampling]
enable = true
task_name = "planner"
include_context_support = false
tool_support = true
```

- **`enable`** — Whether to declare Sampling capability. Default: disabled
- **`task_name`** — Model task name used for Sampling requests. Default: `"planner"`
- **`include_context_support`** — Whether to declare support for non-`none` `includeContext` semantics. Default: disabled
- **`tool_support`** — Whether to declare support for continued tool use in Sampling. Default: disabled

::: warning ⚠️ Sampling Consumes Tokens
Enabling Sampling means MCP servers can trigger model calls, incurring additional API costs. Make sure `task_name` points to a properly configured model task.
:::

### Elicitation Capability [mcp.client.elicitation]

Elicitation allows MCP servers to request the user to fill out a form or open a URL.

```toml
[mcp.client.elicitation]
enable = true
allow_form = true
allow_url = false
```

- **`enable`** — Whether to declare Elicitation capability. Default: disabled
- **`allow_form`** — Whether to allow form-mode Elicitation. Default: enabled
- **`allow_url`** — Whether to allow URL-mode Elicitation. Default: disabled

At least one mode (`allow_form` or `allow_url`) must be enabled when Elicitation is turned on.

---

## Server Configuration [[mcp.servers]]

This is the most commonly used part — configuring the MCP servers you want to connect to. **You can add multiple servers**, each `[[mcp.servers]]` section defines one.

### Common Fields

```toml
[[mcp.servers]]
name = "playwright"
enabled = true
transport = "stdio"           # or "streamable_http"
http_timeout_seconds = 30.0
read_timeout_seconds = 300.0
```

- **`name`** — **Required**. Server name, must be unique across all servers. Default: empty
- **`enabled`** — Whether to enable this server. Default: enabled
- **`transport`** — Transport mode, `"stdio"` (default), `"streamable_http"`, `"sse"`
- **`http_timeout_seconds`** — HTTP request timeout (seconds). Default: 30.0
- **`read_timeout_seconds`** — Session read timeout (seconds). Default: 300.0

### stdio Mode

Launches a local subprocess to run the MCP server. Ideal for locally installed tools. Key fields:

- **`command`** — Launch command, e.g. `uvx`, `npx`, `python`
- **`args`** — Command arguments
- **`env`** — Extra environment variables

#### Via uvx (Recommended)

[uvx](https://docs.astral.sh/uv/) manages dependencies automatically:

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

#### Via npx

Requires Node.js:

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

#### Via Python

```toml
[[mcp.servers]]
name = "my-python-mcp"
transport = "stdio"
command = "python"
args = ["-m", "my_mcp_server"]
env = { PYTHONUNBUFFERED = "1" }
```

### streamable_http Mode

Connects to a remote MCP service via HTTP. Suitable for cloud services or tools hosted by others. Key fields:

- **`url`** — MCP endpoint URL, required
- **`headers`** — Extra HTTP headers
- **`authorization`** — HTTP auth configuration

#### Unauthenticated Remote Service

```toml
[[mcp.servers]]
name = "public-weather-mcp"
transport = "streamable_http"
url = "https://mcp.example.com/weather"

[mcp.servers.authorization]
mode = "none"
```

#### Bearer Token Auth

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

#### Custom Headers

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

### Minimal: One Server

```toml
[mcp]
enable = true

[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]
```

This is the simplest setup — just `enable = true` and one server. Everything else uses defaults.

### Everyday Setup: Two Servers

```toml
[mcp]
enable = true

[mcp.client]
client_name = "MaiBot"
client_version = "1.0.0"

# Playwright (browser automation)
[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]

# Filesystem server
[[mcp.servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
```

### Advanced: Sampling + Roots

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
name = "Data Directory"

[mcp.client.sampling]
enable = true
task_name = "planner"
tool_support = true

# Local server
[[mcp.servers]]
name = "playwright"
transport = "stdio"
command = "uvx"
args = ["@playwright/mcp"]

# Remote server
[[mcp.servers]]
name = "weather-api"
transport = "streamable_http"
url = "https://mcp.example.com/weather"
```

---

## FAQ

### Q: Configuration not working after saving?

MCP settings only take effect after **restarting MaiBot**. Check the startup logs for connection results:

```
✓ MCP server 'playwright' connected (Tools 12 / Prompts 0 / Resources 0 / Templates 0)
```

If connection fails, a warning will appear:

```
⚠️ MCP server 'playwright' connection failed: ...
```

### Q: How many servers can I configure?

No hard limit, but each server consumes resources. Only configure what you actually need.

### Q: Where can I find MCP servers to use?

- Search for the `modelcontextprotocol` organization on GitHub
- Look for `@modelcontextprotocol` packages on npm
- The Python community also has MCP server implementations

### Q: stdio vs streamable_http — which one should I choose?

- **stdio**: Local tools, low latency, no network needed. Good for file operations, local computation, etc.
- **streamable_http**: Remote services, requires network. Good for cloud APIs or services hosted by others.

### Q: Where do I get API tokens?

It depends on the service you're connecting to. For GitHub MCP, generate a token at GitHub Settings → Developer settings → Personal access tokens. For other third-party services, check their management console.

---

## Next Steps

- Want to learn about MCP concepts and capabilities? → [MCP Feature Overview](../features/mcp.md)
- View all configuration options → [Bot Configuration Reference](./bot-config.md)
