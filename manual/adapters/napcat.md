---
title: 使用NapCat和适配器连接麦麦
---
# 使用NapCat和适配器连接麦麦

你可以通过 **NapCat** 来获取QQ的消息和信息

然后通过 **适配器**将这些消息翻译并发送给MaiBot

## 适配器仓库

NapCat 适配器的源码：[Mai-with-u/MaiBot-Napcat-Adapter](https://github.com/Mai-with-u/MaiBot-Napcat-Adapter)

## 安装适配器

你可以在WebUI的插件商店直接找到NapCat Adapter适配器，直接安装即可

⚠️安装后需要手动进行**启用**，你可以在webui的插件管理看到哪些插件被启用了



<details>
<summary>（如果出现问题，也可以尝试手动安装）</summary>

```bash
# 克隆插件
git clone -b main https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

```

**将适配器目录放入 MaiBot 的 `plugins/` 文件夹中**

</details>


## 配置 NapCat

1. 打开 NapCat 的网页界面
2. 找到 "正向 WebSocket" 或 "WebSocket 服务器" 设置
3. 启用正向 WebSocket 服务器，监听端口需要和 NapCat Adapter插件中的 `端口` 一致 （`plugins/MaiBot-Napcat-Adapter/config.toml` 中 `napcat_server.port` ）
4. 如果你设置的WebSocket连接有访问Token，将这个Token复制并填写到**Adapter插件配置**的**访问令牌**配置项中。（注意不是napcat webui的token也不是maibot webui的token！！！）

具体配置方法请参考 [NapCat 官方文档](https://napneko.github.io/guide/boot/Shell)。

正向 WebSocket 服务器默认端口通常为 `3001`。适配器会作为客户端连接到 NapCat，例如 `ws://127.0.0.1:3001`，具体地址和端口以适配器配置为准。

## 启动

直接启动 MaiBot 就行，适配器会自动加载并连接。


#### 群聊白名单

NapCat 适配器默认启用聊天名单过滤，群聊默认是白名单模式。没有写进 `群聊名单` 的群消息会被直接丢弃；如果你发现 NapCat 已经连接成功，但群里 @ 机器人没有反应，优先插件的 `聊天过滤` 配置。

<details>
<summary>具体的配置文件项目</summary>

`plugins/MaiBot-Napcat-Adapter/config.toml`

```toml
[chat]
enable_chat_list_filter = true
show_dropped_chat_list_messages = true
group_list_type = "whitelist"
group_list = ["你的QQ群号"]
```

测试阶段也可以临时关闭名单过滤：

```toml
[chat]
enable_chat_list_filter = false
```
</details>

## 独立模式使用指南 🔧

::: warning 旧版方法
独立版适配器是早期的接入方式，通常只建议在已有独立部署、兼容旧环境或有特殊网络需求时继续使用。新部署建议优先使用上方的插件版适配器，配置更少，也更便于维护。
:::

<details>
<summary>展开查看独立版适配器配置方法</summary>

如果你需要独立运行适配器，按以下步骤操作。

使用 `main` 分支：

```bash
# 克隆 main 分支（默认）
git clone https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

# 或者如果已克隆，确保在 main 分支
cd MaiBot-Napcat-Adapter
git checkout main
```

### 配置 MaiBot

在 `config/bot_config.toml` 里添加：

```toml
[bot]
platform = "qq"           # 用 QQ 平台
qq_account = 123456789    # 你的机器人 QQ 号
nickname = "麦麦"          # 机器人昵称
```

还是在 `config/bot_config.toml` 里，设置连接参数：

```toml
[maim_message]
ws_server_host = "127.0.0.1"   # 服务器地址（本地就用这个）
ws_server_port = 8000           # 端口号（默认 8000）
auth_token = []                 # 认证令牌，空着就行
```

- **`ws_server_host`** — 服务器地址，本地用 `127.0.0.1`，服务器用实际 IP
- **`ws_server_port`** — 端口号，默认 `8000`，改了就记住这个数字
- **`auth_token`** — 密码验证，空着就行，不用管

> 💡 **注意**：`maim_message` 配置的是 legacy WebSocket 服务（端口 8000）。适配器通过 MMC 协议连接 MaiBot，默认连接 MaiBot 的 `config/bot_config.toml` 中 `[maim_message]` 设置的 `ws_server_port`（默认 8000）。确保适配器的 `config.toml` 中 `maibot_server.port` 与 MaiBot 的 `ws_server_port` 设置一致。

### 安装 NapCat

请参考 [NapCat 官方文档](https://napneko.github.io/guide/boot/Shell) 安装 NapCat。

**Docker 用户**：如果你使用项目自带的 `docker-compose.yml`，NapCat 已经作为 `napcat` 服务包含在内，直接和 MaiBot 一起启动即可：

```bash
docker compose up -d
```

### 设置 NapCat 连接

1. 打开 NapCat 的网页界面
2. 找到 "反向 WebSocket" 设置
3. 填上 MaiBot 地址：`ws://127.0.0.1:8000/ws`

具体配置方法请参考 [NapCat 官方文档](https://napneko.github.io/guide/boot/Shell)。

💡 **提示**：如果 NapCat 和 MaiBot 都在 Docker Compose 里运行，请确认 MaiBot 的 `maim_message.ws_server_host` 监听地址允许容器网络访问。

### 登录 QQ

启动 NapCat 后需要登录 QQ。具体登录方法请参考 [NapCat 官方文档](https://napneko.github.io/guide/boot/Shell)。


### 连接步骤

推荐启动顺序：

1. **启动 NapCat** → 等 QQ 登录成功
2. **启动 MaiBot** → 等 WebSocket 服务启动
3. **启动适配器** → 适配器连接到 NapCat 和 MaiBot
4. **自动连接** → NapCat 会自动连上适配器

```bash
# Docker 一键启动（推荐）
docker compose up -d

# 手动启动
# 终端 1：启动 NapCat
# 终端 2：启动适配器 (进入适配器目录运行)
# 终端 3：uv run python bot.py
```

</details>

## 一些问题 ✅

怎么知道连上了？看这几个地方：

**插件模式**：

1. **WebUI 插件列表**：能看到 NapCat 适配器插件已加载
2. **MaiBot 日志**：看到适配器插件已加载的提示
3. **发消息测试**：在 QQ 群里 @机器人，看有没有回复

**独立模式**：

1. **MaiBot 日志**：看到 "WebSocket 服务启动成功"
2. **NapCat 日志**：看到 "反向 WebSocket 连接成功"
3. **适配器日志**：看到连接成功
4. **发消息测试**：在 QQ 群里 @机器人，看有没有回复

### 连不上怎么办？

**检查这几点**：

- 是否启用了插件，插件是默认关闭的哦
- 地址和端口填对了吗？是否正确填写WS连接的token
- NapCat 和 MaiBot 在同一台机器吗？
- 日志里有什么报错信息？

### 收不到消息？

**可能原因**：

- 适配器是否正确设置了群聊白名单？哪些群聊允许聊天？
- QQ 号填错了？要和 NapCat 登录的一致
- NapCat 本身收到消息了吗？看 NapCat 日志
- 网络连接正常吗？