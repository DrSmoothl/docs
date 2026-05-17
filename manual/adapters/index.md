---
title: 适配器概览
---

# 适配器概览

适配器负责把 QQ、Telegram、微信、Discord 等消息平台接入 MaiBot。不同适配器支持的平台、运行方式和维护状态不同，第一次部署建议优先选择维护活跃、文档完整的适配器。

## 选择适配器

| 适配器 | 支持平台 | 状态 | 简介 |
| --- | --- | --- | --- |
| [NapCat](./napcat.md) | QQ | 推荐使用 | 麦麦官方维护的 QQ 适配器，支持插件版和独立版，插件版是当前推荐方案。 |
| [GoCQ](./gocq.md) | QQ | 可用，偏旧 | 基于 go-cqhttp / AstralGocq 的 QQ 适配方案，适合已有 GoCQ 环境或特定需求。 |
| [SnowLuma](./snowluma.md) | QQ | 可用（测试中） | 新一代QQ适配方案 |
| [Telegram](./telegram.md) | Telegram | 社区适配 | Telegram平台适配方案 |
| [Discord](./discord.md) | Discord | 社区适配 | Discord平台适配方案 |
| [桌宠 适配器](https://github.com/MaiM-with-u/MaiM-desktop-pet) | 桌宠 | 社区适配 | 将 MaiBot 接入桌面宠物交互场景。 |
| [微信 - wxauto Adapter](https://github.com/Angela459/WeMai) | 微信 | 社区适配 | 基于 wxauto 的微信平台适配方案。 |
| 更多适配器 | - | 社区适配 | 关注 [MaiBot GitHub 组织](https://github.com/Mai-with-u) 或社区交流群获取更多第三方适配器信息。 |

第一次部署 QQ 平台时，建议使用 **NapCat 插件版**。它直接作为 MaiBot 插件运行，配置更少，也不需要额外维护适配器与 MaiBot 之间的网络连接。

## 旧版 / 社区适配器列表（可能未及时维护）

下面这些适配器多为旧版或社区项目，部分可能无法兼容当前 MaiBot 版本。使用前建议先查看对应仓库的更新时间、README 和 Issue。

- [Nonebot 适配器](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters)
- [Milky 协议适配器](https://github.com/ShinKanji/MaiBot-Milky-Adapter)

::: warning 注意兼容性
部分社区适配器可能是旧版项目，未必兼容当前 MaiBot。安装前建议先查看仓库更新时间、README 和 Issue。
:::

### 插件版适配器

如果适配器提供插件版，通常按这个流程安装：

1. 下载或克隆适配器项目。
2. 确认切换到适配器要求的插件分支。
3. 将适配器目录放入 MaiBot 的 `plugins/` 目录。
4. 启动 MaiBot，让插件系统自动加载适配器。

插件版适配器运行在 MaiBot 内部，通常只需要配置“消息平台到适配器”的连接。

### 独立版适配器

如果适配器是独立版，通常按这个流程安装：

1. 下载或克隆适配器项目。
2. 按适配器文档安装依赖。
3. 填写适配器自己的配置文件。
4. 单独启动适配器进程。

独立版适配器需要同时连接消息平台和 MaiBot，排查问题时也要分别检查这两段连接。

## 配置连接

适配器通常需要配置两类连接：

| 连接方向 | 说明 |
| --- | --- |
| 消息平台 → 适配器 | 例如 NapCat 连接到 QQ，并把 QQ 消息推送给适配器。 |
| 适配器 → MaiBot | 独立版适配器需要连接 MaiBot；插件版适配器通常不需要额外配置这一层。 |

使用插件版适配器时，主要确认适配器能正确连接消息平台。

使用独立版适配器时，还需要确认适配器能连接到 MaiBot 的消息服务地址。

如果你不确定该填什么地址，先按对应适配器文档的默认本机配置来跑通，再考虑跨机器或 Docker 网络部署。

## 确认连接成功

配置完成后，向对应平台发送一条测试消息。

如果 MaiBot 后台能看到对应消息日志，并且 MaiBot 能正常回复，说明适配器已经连接成功。

如果没有收到消息，按这个顺序检查：

1. 消息平台客户端是否已经登录成功。
2. 适配器是否正常启动。
3. 适配器是否成功连接消息平台。
4. 独立版适配器是否成功连接 MaiBot。
5. MaiBot 是否已经完成初始化并正常运行。