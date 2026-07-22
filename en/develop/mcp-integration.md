---
title: MCP Integration and External Tools
---

# MCP Integration and External Tools

MaiBot acts as an MCP client and exposes connected server tools to the planning and reply pipeline. The main switch, client identity, roots, callbacks, and server list are configured under `[mcp]`.

## Transports

- **`stdio`** — Starts a local child process. Best for local tools, but the MaiBot environment must contain the executable and dependencies.
- **`streamable_http`** — Connects to a remote HTTP MCP endpoint and is the preferred remote transport.
- **`sse`** — Connects to an SSE endpoint for servers that still use that transport.

Each server needs a unique name. Tool names must not collide with built-in reserved names or tools from another server.

## Host callbacks

Sampling lets a server request an LLM generation through the host. Logging forwards server logs into MaiBot. Elicitation lets a server request user input when the active surface supports it. Enable only the callbacks that the server needs.

## Operations and security

- Verify the SDK and server command before diagnosing missing tools.
- For `stdio`, inspect filtered startup output and child-process exit codes.
- In containers, mount every declared filesystem root and install the server runtime inside the container.
- Do not expose broad filesystem roots or secrets to an untrusted MCP server.

See [MCP Configuration](../manual/configuration/mcp-config.md) and [MCP Tools](../manual/features/mcp.md).
