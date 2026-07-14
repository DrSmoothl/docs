---
title: "# Connecting to MaiMai using NapCat and Adapter\n\nUse NapCat and an adapter
  to connect to MaiMai."
---

# Connecting MaiBot using NapCat and Adapter

You can use **NapCat** to obtain QQ messages and information,

and then use an **Adapter** to translate these messages and send them to MaiBot.

## Adapter Repository

Source code for the NapCat adapter: [Mai-with-u/MaiBot-Napcat-Adapter](https://github.com/Mai-with-u/MaiBot-Napcat-Adapter)

## Installing the Adapter

You can find the NapCat Adapter directly in the WebUI plugin store and install it from there.

⚠️ After installation, you need to manually **enable** it. You can see which plugins are enabled in the WebUI plugin management section.


<details>
<summary>（如果出现问题，也可以尝试手动安装）</summary>

```bash
# 克隆插件
git clone -b main https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

```

**Place the adapter directory into MaiBot's `plugins/` folder**

</details>


## Configuring NapCat

1. Open the NapCat web interface.
2. Find the "Forward WebSocket" or "WebSocket Server" settings.
3. Enable the Forward WebSocket server. The listening port must match the `端口` in the NapCat Adapter plugin (`napcat_server.port` in `plugins/MaiBot-Napcat-Adapter/config.toml`).
4. If your WebSocket connection has an access token, copy this token and enter it into the **Access Token** configuration item in the **Adapter plugin settings**. (Note: This is NOT the napcat webui token nor the maibot webui token!!!)

For detailed configuration methods, please refer to the [NapCat Official Documentation](https://napneko.github.io/guide/boot/Shell).

The default port for the Forward WebSocket server is usually `3001`. The adapter will connect to NapCat as a client, for example `ws://127.0.0.1:3001`; the specific address and port depend on the adapter configuration.

## Startup

Simply start MaiBot, and the adapter will load and connect automatically.


#### Group Chat Whitelist

The NapCat adapter enables chat list filtering by default, and group chats are in whitelist mode by default. Group messages not listed in `群聊名单` will be discarded. If you find that NapCat has connected successfully but the bot does not respond when @mentioned in a group, check the plugin's `聊天过滤` configuration first.

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

During the testing phase, you can temporarily disable list filtering:

```toml
[chat]
enable_chat_list_filter = false
```
</details>

## Standalone Mode Usage Guide 🔧

::: warning 旧版方法
The standalone adapter is an early integration method and is generally only recommended for existing standalone deployments, compatibility with old environments, or special network requirements. For new deployments, it is recommended to prioritize the plugin version of the adapter mentioned above, as it requires less configuration and is easier to maintain.
:::

<details>
<summary>展开查看独立版适配器配置方法</summary>

If you need to run the adapter independently, follow these steps.

Use the `main` branch:

```bash
# 克隆 main 分支（默认）
git clone https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

# 或者如果已克隆，确保在 main 分支
cd MaiBot-Napcat-Adapter
git checkout main
```

### Configuring MaiBot

Add the following to `config/bot_config.toml`:

```toml
[bot]
platform = "qq"           # 用 QQ 平台
qq_account = "123456789"  # Bot QQ account (string)
nickname = "麦麦"          # 机器人昵称
```

Still in `config/bot_config.toml`, set the connection parameters:

```toml
[maim_message]
ws_server_host = "127.0.0.1"   # 服务器地址（本地就用这个）
ws_server_port = 8000           # 端口号（默认 8000）
auth_token = []                 # 认证令牌，空着就行
```

- **`ws_server_host`** — Server address; use `127.0.0.1` for local, or the actual IP for servers.
- **`ws_server_port`** — Port number; default is `8000`. If changed, remember this number.
- **`auth_token`** — Password verification; leave it blank, ignore it.

> 💡 **Note**: `maim_message` configures the legacy WebSocket service (port 8000). The adapter connects to MaiBot via the MMC protocol, connecting by default to the `ws_server_port` (default 8000) set in `[maim_message]` within MaiBot's `config/bot_config.toml`. Ensure that `maibot_server.port` in the adapter's [[INLINE_211]] matches MaiBot's `ws_server_port` setting.

### Installing NapCat

Please refer to the [NapCat Official Documentation](https://napneko.github.io/guide/boot/Shell) to install NapCat.

**Docker Users**: If you are using the project's provided `docker-compose.yml`, NapCat is already included as a `napcat` service. Simply start it together with MaiBot:

```bash
docker compose up -d
```

### Setting up NapCat Connection

1. Open the NapCat web interface.
2. Find the "Reverse WebSocket" settings.
3. Enter the MaiBot address: `ws://127.0.0.1:8000/ws`

For detailed configuration methods, please refer to the [NapCat Official Documentation](https://napneko.github.io/guide/boot/Shell).

💡 **Tip**: If both NapCat and MaiBot are running in Docker Compose, please confirm that MaiBot's `maim_message.ws_server_host` listening address allows container network access.

### Logging into QQ

After starting NapCat, you need to log into QQ. For specific login methods, please refer to the [NapCat Official Documentation](https://napneko.github.io/guide/boot/Shell).


### Connection Steps

Recommended startup sequence:

1. **Start NapCat** → Wait for QQ login to succeed.
2. **Start MaiBot** → Wait for the WebSocket service to start.
3. **Start Adapter** → The adapter connects to NapCat and MaiBot.
4. **Automatic Connection** → NapCat will automatically connect to the adapter.

```bash
# Docker 一键启动（推荐）
docker compose up -d

# 手动启动
# 终端 1：启动 NapCat
# 终端 2：启动适配器 (进入适配器目录运行)
# 终端 3：uv run python bot.py
```

</details>

## Troubleshooting ✅

How do I know if it's connected? Check these areas:

**Plugin Mode**:

1. **WebUI Plugin List**: You can see that the NapCat adapter plugin is loaded.
2. **MaiBot Logs**: You see a prompt that the adapter plugin has been loaded.
3. **Message Test**: @ the bot in a QQ group and see if it replies.

**Standalone Mode**:

1. **MaiBot Logs**: You see "WebSocket service started successfully".
2. **NapCat Logs**: You see "Reverse WebSocket connection successful".
3. **Adapter Logs**: You see a successful connection.
4. **Message Test**: @ the bot in a QQ group and see if it replies.

### What if it won't connect?

**Check these points**:

- Is the plugin enabled? Plugins are disabled by default.
- Are the address and port correct? Is the WS connection token entered correctly?
- Are NapCat and MaiBot on the same machine?
- Are there any error messages in the logs?

### Not receiving messages?

**Possible reasons**:

- Is the group chat whitelist correctly set in the adapter? Which group chats are allowed?
- Is the QQ number wrong? It must match the one used to log into NapCat.
- Did NapCat itself receive the message? Check the NapCat logs.
- Is the network connection normal?
