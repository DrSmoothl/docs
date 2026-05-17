---
title: Adapter Overview
---

# Adapter Overview

Adapters connect MaiBot to QQ, Telegram, WeChat, Discord, desktop pets, and other message platforms or clients. Different adapters support different platforms and operating modes, so first-time users should prefer adapters that are actively maintained and well documented.

## Choose an Adapter

| Adapter | Platform | Status | Description |
| --- | --- | --- | --- |
| [NapCat](./napcat.md) | QQ | Recommended | The officially maintained QQ adapter for MaiBot. It supports plugin mode and standalone mode; plugin mode is currently recommended. |
| [GoCQ](./gocq.md) | QQ | Available, older | QQ adapter based on go-cqhttp / AstralGocq, suitable for existing GoCQ setups or specific requirements. |
| [SnowLuma](https://github.com/Mai-with-u/MaiBot-SnowLuma-Adapter) | QQ | Available, in development | A newer QQ adapter. It is already usable, but some features and documentation may still need improvement. |
| [Telegram](https://github.com/xiaoxi68/MaiBot-Telegram-Adapter) | Telegram | Community adapter | Telegram platform adapter. |
| [Discord](https://github.com/2829798842/MaiBot-Discord-Adapter) | Discord | Community adapter | Discord platform adapter. |
| [Desktop Pet Adapter](https://github.com/MaiM-with-u/MaiM-desktop-pet) | Desktop pet | Community adapter | Connects MaiBot to desktop pet interaction scenarios. |
| [WeChat - wxauto Adapter](https://github.com/Angela459/WeMai) | WeChat | Community adapter | WeChat adapter based on wxauto. |
| More adapters | - | Community adapter | Follow the [MaiBot GitHub organization](https://github.com/Mai-with-u) or community groups for more third-party adapters. |

For a first QQ deployment, **NapCat plugin mode** is recommended. It runs directly as a MaiBot plugin, requires less configuration, and avoids maintaining a separate adapter-to-MaiBot network connection.

## Legacy / Community Adapters That May Not Be Maintained Promptly

These adapters are mostly older or community projects. Some may not be compatible with the current MaiBot version. Before using them, check the repository update time, README, and issues.

- [Nonebot Adapter](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters)
- [Milky Protocol Adapter](https://github.com/ShinKanji/MaiBot-Milky-Adapter)

::: warning Compatibility
Some community adapters may be older projects and may not work with the current MaiBot version. Check the repository update time, README, and issues before installing.
:::

### Plugin Mode Adapters

If an adapter provides plugin mode, the usual installation flow is:

1. Download or clone the adapter project.
2. Switch to the plugin branch required by the adapter, if needed.
3. Put the adapter directory into MaiBot's `plugins/` directory.
4. Start MaiBot and let the plugin system load the adapter automatically.

Plugin mode adapters run inside MaiBot. Usually you only need to configure the connection from the message platform to the adapter.

### Standalone Adapters

If an adapter is standalone, the usual installation flow is:

1. Download or clone the adapter project.
2. Install dependencies according to the adapter documentation.
3. Fill in the adapter's own configuration file.
4. Start the adapter as a separate process.

Standalone adapters need to connect both to the message platform and to MaiBot. When troubleshooting, check both sides of the connection.

## Configure Connections

Adapters usually involve two connection directions:

| Direction | Description |
| --- | --- |
| Message platform -> adapter | For example, NapCat connects to QQ and pushes QQ messages to the adapter. |
| Adapter -> MaiBot | Standalone adapters need to connect to MaiBot; plugin adapters usually do not need extra configuration for this layer. |

When using a plugin adapter, mainly confirm that the adapter can connect to the message platform.

When using a standalone adapter, also confirm that the adapter can connect to MaiBot's message service address.

If you are not sure what address to use, first run the default local configuration from the adapter documentation, then adjust it for cross-machine or Docker network deployments.

## Confirm the Connection

After configuration, send a test message on the target platform.

If MaiBot logs show the message and MaiBot replies normally, the adapter is connected successfully.

If no message is received, check in this order:

1. Whether the message platform client has logged in successfully.
2. Whether the adapter started normally.
3. Whether the adapter connected to the message platform successfully.
4. Whether the standalone adapter connected to MaiBot successfully.
5. Whether MaiBot has finished initialization and is running normally.
