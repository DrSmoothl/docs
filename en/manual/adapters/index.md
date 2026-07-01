---
title: Adapter Overview
---# Adapter Overview

Adapters are responsible for integrating messaging platforms such as QQ, Telegram, WeChat, and Discord into MaiBot. Different adapters support different platforms, have different operation methods of operation, and vary in maintenance status. For your first deployment, it is recommended to prioritize adapters that are actively maintained and have complete documentation.

## Choosing an Adapter

| Adapter | Supported Platform | Status | Description |
| --- | --- | --- | --- |
| [NapCat](./napcat.md) | QQ | Recommended | Official QQ adapter maintained by MaiMai. Supports both plugin and standalone versions; the plugin version is the currently recommended solution. |
| [GoCQ](./gocq.md) | QQ | Available, Legacy | QQ adaptation solution based on go-cqhttp / AstralGocq, suitable for those with existing GoCQ environments or specific needs. |
| [SnowLuma](./snowluma.md) | QQ | Available (Testing) | Next-generation QQ adaptation solution. |
| [Telegram](./telegram.md) | Telegram | Community | Adaptation solution for the Telegram platform. |
| [Discord](./discord.md) | Discord | Community | Adaptation solution for the Discord platform. |
| [Desktop Pet Adapter](https://github.com/MaiM-with-u/MaiM-desktop-pet) | Desktop Pet | Community | Integrates MaiBot into desktop pet interaction scenarios. |
| [WeChat - wxauto Adapter](https://github.com/Angela459/WeMai) | WeChat | Community | WeChat platform adaptation solution based on wxauto. |
| More Adapters | - | Community | Follow the [MaiBot GitHub Organization](https://github.com/Mai-with-u) or community chat groups for more third-party adapter information. |

When deploying the QQ platform for the first time, it is recommended to use the **NapCat Plugin Version**. It runs directly as a MaiBot plugin, requires less configuration, and eliminates the need to maintain a network connection between the adapter and MaiBot.

## Legacy / Community Adapter List (May not be updated timely)

The following adapters are mostly legacy or community projects, and some may not be compatible with the current version of MaiBot. It is recommended to check the update time, README, and Issues of the corresponding repository before use.

- [Nonebot Adapters](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters)
- [Milky Protocol Adapter](https://github.com/ShinKanji/MaiBot-Milky-Adapter)

::: warning 注意兼容性
Some community adapters may be legacy projects and might not be compatible with the current MaiBot. It is recommended to check the repository update time, README, and Issues before installation.
:::

### Plugin Version Adapters

If an adapter provides a plugin version, the installation process is usually as follows:

1. Download or clone the adapter project.
2. Ensure you have switched to the plugin branch required by the adapter.
3. Place the adapter directory into MaiBot's `plugins/` directory.
4. Start MaiBot to let the plugin system automatically load the adapter.

Plugin version adapters run inside MaiBot and typically only require configuration for the "Messaging Platform to Adapter" connection.

### Standalone Version Adapters

If the adapter is a standalone version, the installation process is usually as follows:

1. Download or clone the adapter project.
2. Install dependencies according to the adapter documentation.
3. Fill in the adapter's own configuration file.
4. Start the adapter process separately.

Standalone adapters need to connect to both the messaging platform and MaiBot. When troubleshooting, you must check both of these connections separately.

## Configuring Connections

Adapters typically require the configuration of two types of connections:

| Connection Direction | Description |
| --- | --- |
| Messaging Platform $\rightarrow$ Adapter | For example, NapCat connects to QQ and pushes QQ messages to the adapter. |
| Adapter $\rightarrow$ MaiBot | Standalone adapters need to connect to MaiBot; plugin adapters usually do not require additional configuration for this layer. |

When using a plugin version adapter, primarily confirm that the adapter can correctly connect to the messaging platform.

When using a standalone version adapter, you also need to confirm that the adapter can connect to MaiBot's message service address.

If you are unsure what address to fill in, first try to get it working with the default localhost configuration from the corresponding adapter documentation, then consider cross-machine or Docker network deployment.

## Confirming Successful Connection

After configuration is complete, send a test message to the corresponding platform.

If the corresponding message logs are visible in the MaiBot backend and MaiBot can reply normally, the adapter has been connected successfully.

If no message is received, check in this order:

1. Whether the messaging platform client has logged in successfully.
2. Whether the adapter has started normally.
3. Whether the adapter has successfully connected to the messaging platform.
4. Whether the standalone adapter has successfully connected to MaiBot.
5. Whether MaiBot has completed initialization and is running normally.