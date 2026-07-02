---
title: Deployment Overview
---# MaiBot Introduction

**MaiBot is a human-like intelligent agent** that can chat with you, continuously learn about you, gather information, or expand its capabilities using plugins or MCP.

MaiBot can be interacted with via the local command line, or connected to different IM platforms or any client through adapter plugins.

## Deployment Methods

MaiBot can be deployed in multiple ways

| Method | Suitable For |
| -------------------------------- | ------------- |
| [Source Code Installation](./installation.md) | Suitable for those who prefer deploying from source |
| [One-Click Package Deployment](./one_key.md) | Suitable for those who prefer one-click packages |
| [Docker Deployment](./docker.md) | Suitable for those who prefer Docker |

## How to Chat with Maimai

First, you need to install MaiBot correctly, and then start it.

### WebUI Chat

When you start MaiBot, you will see the WebUI start along with it. By default, you can access your deployed Maimai's WebUI via http://127.0.0.1:8001/

In the WebUI, you can follow the **Configuration Wizard** for basic setup. To chat with Maimai, you need to configure the corresponding models and settings.

For Maimai to be active, it requires at least one LLM model. If it needs to view images, it also requires a VLM; if you want to enable memory, it requires an embedding model.

Once configured, you can chat via **Maimai Chat** in the top navigation.

For more help on configuration, you can read the [Configuration Guide](../configuration/index.md)

### Chatting with Maimai on QQ

To connect MaiBot to QQ, you need an **Adapter** to establish the connection between MaiBot and these messaging platforms.

Here we introduce NapCat.

As is well known, QQ has official bots, but the official bots provide very few interfaces and cannot proactively fetch messages, which is highly limiting.

Therefore, we recommend using **NapCat**, which you can colloquially understand as an unofficial QQ bot application (in layman's terms).

To connect NapCat to MaiBot, you need an Adapter to bridge them, forwarding NapCat's messages to MaiBot for processing.

This leads to two questions: 1. How to deploy NapCat 2. How to install the adapter

#### How to Deploy NapCat

If you installed via Docker or the one-click package, a NapCat client is often included, so no additional installation is needed.

If you deployed from source, you need to install NapCat separately. You can refer to NapCat's documentation for installation, which will not be elaborated here.

[NapCat Official Documentation](https://napneko.github.io/)

#### How to Install the Adapter

To use the NapCat adapter, you can refer to this link. [NapCat Adapter Usage](../adapters/napcat.md)

### Chatting with Maimai on Other Platforms

Similar to QQ, you can also chat on other platforms by installing adapter plugins.

You can find other adapters here [Adapter Overview](../adapters/index.md).