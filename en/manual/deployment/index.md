---
title: Deployment Overview
---

# MaiBot Introduction

**MaiBot is a personified intelligent agent** that can chat with you, continuously learn about you, collect information, and extend its abilities through plugins or MCP.

MaiBot can talk through the local command line, or connect to different IM platforms or arbitrary clients through adapter plugins.

## Deployment Methods

MaiBot can be deployed in several ways:

| Method | Suitable For |
| --- | --- |
| [Source Installation](./installation.md) | Users who prefer deploying from source |
| [One-Click Package Deployment](./one_key.md) | Users who prefer the one-click package |
| [Docker Deployment](./docker.md) | Users who prefer Docker |

## How to Chat with MaiMai

First, install MaiBot correctly and start it.

### Chat Through WebUI

After starting MaiBot, the WebUI starts with it. By default, you can open the WebUI at http://127.0.0.1:8001/.

In the WebUI, follow the **configuration wizard** for basic setup. To chat with MaiMai, you need to configure the required models and settings.

MaiMai needs at least one LLM model to work. If you want image understanding, you also need a VLM. If you want memory features, you also need an embedding model.

After configuration, use **MaiMai Chat** in the top navigation to start chatting.

For more help with configuration, read the [Configuration Guide](../configuration/index.md).

### Chat with MaiMai on QQ

To connect MaiBot to QQ, you need an **adapter** to bridge MaiBot and the message platform.

This section uses NapCat as the example.

QQ has official bot APIs, but they expose only limited capabilities and cannot actively receive messages in the way MaiBot needs.

So we recommend **NapCat**. You can roughly understand it as an unofficial QQ bot client.

To connect NapCat to MaiBot, an adapter bridges them and forwards NapCat messages to MaiBot for processing.

This leads to two tasks: deploy NapCat, and install the adapter.

#### How to Deploy NapCat

If you use Docker or the one-click package, a NapCat client is usually included, so you often do not need to install it separately.

If you deploy from source, install NapCat separately by following the NapCat documentation.

[NapCat official documentation](https://napneko.github.io/)

#### How to Install the Adapter

To use the NapCat adapter, see [NapCat Adapter Usage](../adapters/napcat.md).

### Chat with MaiMai on Other Platforms

Similar to QQ, other platforms can also connect through adapter plugins.

You can find other adapters in the [Adapter Overview](../adapters/index.md).
