---
title: Deployment Overview
---
# MaiBot Introduction

**MaiBot is a human-like agent** that can chat with you, continuously learn about you, gather information, or extend its capabilities using plugins or MCP.

MaiBot can be used via local command-line conversations or connected to different IM platforms or any client through adapter plugins.

## Deployment Methods

MaiBot can be deployed using multiple methods:

| Method                               | Suitable For          |
| -------------------------------- | ------------- |
| [Source Code Installation](./installation.md)        | Users who prefer deploying from source code |
| [One-Click Package Deployment](./one_key.md) | Users who prefer one-click packages  |
| [Docker Deployment](./docker.md) | Users who prefer Docker  |

## How to Chat with MaiMai

First, you must correctly install and start MaiBot.

### WebUI Chat

When you start MaiBot, the WebUI will launch alongside it. By default, you can access the WebUI of your deployed MaiMai at http://127.0.0.1:8001/.

In the WebUI, you can follow the **Configuration Wizard** for basic setup. To chat with MaiMai, you need to configure the appropriate models and settings.

At minimum, MaiMai requires an LLM model to function. If image viewing is needed, a VLM is also required. If memory features are to be enabled, an embedding model is additionally necessary.

Once configured, you can start chatting via **MaiMai Chat** in the top navigation bar.

For more help on configuration, please refer to the [Configuration Guide](../configuration/index.md).

### Chatting with MaiMai on QQ

To connect MaiBot to QQ, you need an **Adapter** to establish the link between MaiBot and these messaging platforms.

This section introduces NapCat.

As is well known, QQ has an official bot, but the official bot provides very limited APIs, cannot actively retrieve messages, and has significant limitations.

Therefore, we recommend using **NapCat**, which can be simply understood as an unofficial QQ bot application (for general understanding).

To connect NapCat to MaiBot, an Adapter is needed to bridge them, forwarding messages from NapCat to MaiBot for processing.

This raises two questions: 1. How to deploy NapCat  2. How to install the adapter

#### How to Deploy NapCat

If you installed via Docker or a one-click package, a NapCat client is often included, so no additional installation is needed.

If you deployed from source code, you need to install NapCat separately. You can refer to the NapCat documentation for installation details; further elaboration is omitted here.

[NapCat Official Documentation](https://napneko.github.io/)

#### How to Install the Adapter

To use the NapCat adapter, please refer to this link: [NapCat Adapter Usage](../adapters/napcat.md).

### Chatting with MaiMai on Other Platforms

Similar to QQ, chatting on other platforms can also be achieved by installing adapter plugins.

You can find other adapters here: [Adapter Overview](../adapters/index.md).