---
title: Deployment Overview
---# Introduction to MaiBot

**MaiBot is a personified intelligent agent** that can chat with you, continuously learn to understand you, gather information gather, or extend its capabilities using plugins or MCP.

MaiBot can be used via a local command-line interface or connected to different IM platforms or any client through adapter plugins.

## Deployment Methods

MaiBot can be deployed using several methods:

| Method | Target Audience |
| -------------------------------- | ------------- |
| [Source Installation](./installation.md) | For those who prefer deploying from source |
| [One-Click Package Deployment](./one_key.md) | For those who prefer using one-click packages |
| [Docker Deployment](./docker.md) | For those who prefer using Docker |

## How to Chat with MaiMai

First, you need to install MaiBot correctly and then start it.

### WebUI Chat

When you start MaiBot, you will see the WebUI launch alongside it. By default, you can access the WebUI of your deployed MaiMai via http://127.0.0.1:8001/.

In the WebUI, you can follow the **Configuration Wizard** for basic setup. To chat with MaiMai, you need to configure the corresponding models and settings.

For MaiMai to function, at least one LLM model is required. If image recognition is needed, a VLM is also required; if memory needs to be enabled, an embedding model is required.

Once configured, you can chat via **MaiMai Chat** in the top navigation bar.

For more help regarding configuration, please read the [Configuration Guide](../configuration/index.md).

### Chatting with MaiMai on QQ

To connect MaiBot to QQ, you need an **Adapter** to establish the connection between MaiBot and these messaging platforms.

Here we introduce NapCat.

As is well known, QQ has official bots, but the interfaces provided by official bots are very limited and cannot proactively retrieve messages, which poses significant limitations.

Therefore, we recommend using **NapCat**, which you can simply understand as an unofficial QQ bot application.

To connect NapCat to MaiBot, a bridge is needed via an Adapter to send messages from NapCat to MaiBot for processing.

This leads to two questions: 1. How to deploy NapCat 2. How to install the adapter.

#### How to Deploy NapCat

If you installed via Docker or the one-click package, a NapCat client is usually bundled, so no additional installation is required.

If you deployed from source, you need to install NapCat separately. You can refer to the NapCat documentation for installation, which will not be detailed here.

[NapCat Official Documentation](https://napneko.github.io/)

#### How to Install the Adapter

To use the NapCat adapter, please refer to this link: [NapCat Adapter Usage](../adapters/napcat.md).

### Chatting with MaiMai on Other Platforms

Similar to QQ, chatting on other platforms can be achieved by installing adapter plugins.

You can find other adapters here: [Adapters Overview](../adapters/index.md).