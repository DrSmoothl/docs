---
title: Connect MaiMai with NapCat and the Adapter
---

# Connect MaiMai with NapCat and the Adapter

You can use **NapCat** to receive QQ messages and information.

Then use the **adapter** to translate those messages and send them to MaiBot.

## Adapter Repository

NapCat adapter source code: [Mai-with-u/MaiBot-Napcat-Adapter](https://github.com/Mai-with-u/MaiBot-Napcat-Adapter)

## Install the Adapter

You can find the NapCat Adapter directly in the WebUI plugin store and install it there.

After installation, you still need to **enable** it manually. You can see which plugins are enabled in WebUI plugin management.

<details>
<summary>If something goes wrong, you can also try manual installation</summary>

```bash
# Clone the plugin
git clone -b main https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git
```

**Put the adapter directory into MaiBot's `plugins/` folder.**

</details>

## Configure NapCat

1. Open NapCat's web interface.
2. Find the "Forward WebSocket" or "WebSocket Server" settings.
3. Enable the Forward WebSocket server. Its listening port must match the `Port` setting in the NapCat Adapter plugin (`napcat_server.port` in `plugins/MaiBot-Napcat-Adapter/config.toml`).
4. If your WebSocket connection has an access token, copy that token into the **Access Token** setting in the **adapter plugin configuration**. This is not the NapCat WebUI token and not the MaiBot WebUI token.

For detailed configuration, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

The Forward WebSocket server usually uses `3001` by default. The adapter connects to NapCat as a client, for example `ws://127.0.0.1:3001`. Use the actual address and port from the adapter config.

## Start

Start MaiBot directly. The adapter will be loaded and connected automatically.

#### Group Chat Whitelist

The NapCat adapter enables chat list filtering by default, and group chats use whitelist mode by default. Messages from groups not listed in the `Group List` will be dropped directly. If NapCat is connected successfully but the bot does not respond when mentioned in a group, check the plugin's `Chat Filter` configuration first.

<details>
<summary>Detailed configuration file items</summary>

`plugins/MaiBot-Napcat-Adapter/config.toml`

```toml
[chat]
enable_chat_list_filter = true
show_dropped_chat_list_messages = true
group_list_type = "whitelist"
group_list = ["your QQ group number"]
```

During testing, you can also temporarily disable chat list filtering:

```toml
[chat]
enable_chat_list_filter = false
```

</details>

## Standalone Mode Guide

::: warning Legacy method
The standalone adapter is an earlier integration method. It is usually only recommended when you already have a standalone deployment, need compatibility with an old environment, or have special network requirements. For new deployments, prefer the plugin adapter described above. It needs less configuration and is easier to maintain.
:::

<details>
<summary>Expand to view standalone adapter configuration</summary>

If you need to run the adapter independently, follow these steps.

Use the `main` branch:

```bash
# Clone the main branch (default)
git clone https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

# Or, if you have already cloned it, make sure you are on the main branch
cd MaiBot-Napcat-Adapter
git checkout main
```

### Configure MaiBot

Add this to `config/bot_config.toml`:

```toml
[bot]
platform = "qq"           # Use the QQ platform
qq_account = 123456789    # Your bot QQ account
nickname = "MaiMai"       # Bot nickname
```

Still in `config/bot_config.toml`, set the connection parameters:

```toml
[maim_message]
ws_server_host = "127.0.0.1"   # Server address, use this for local deployment
ws_server_port = 8080           # Port number, default 8080
auth_token = []                 # Auth token, leave empty
```

| Setting | Meaning | How to fill |
| ------- | ------- | ----------- |
| `ws_server_host` | Server address | Use `127.0.0.1` locally, or the actual IP on a server |
| `ws_server_port` | Port number | Default `8080`; remember the number if you change it |
| `auth_token` | Password verification | Leave it empty |

> **Note**: `maim_message` configures the legacy WebSocket service, usually on port 8080. The adapter connects to MaiBot through the MMC protocol and uses the `ws_server_port` configured under `[maim_message]` in MaiBot's `config/bot_config.toml`. Make sure `maibot_server.port` in the adapter's `config.toml` matches MaiBot's `ws_server_port`.

### Install NapCat

See the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell) to install NapCat.

**Docker users**: if you use the project's built-in `docker-compose.yml`, NapCat is already included as the `napcat` service. Start it together with MaiBot:

```bash
docker compose up -d
```

### Set Up the NapCat Connection

1. Open NapCat's web interface.
2. Find the "Reverse WebSocket" settings.
3. Fill in the MaiBot address: `ws://127.0.0.1:8080/ws`.

For detailed configuration, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

**Tip**: if NapCat and MaiBot both run in Docker Compose, make sure MaiBot's `maim_message.ws_server_host` listening address allows access from the container network.

### Log in to QQ

After starting NapCat, you need to log in to QQ. For login methods, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

### Connection Steps

Recommended startup order:

1. **Start NapCat** -> wait for QQ login to succeed.
2. **Start MaiBot** -> wait for the WebSocket service to start.
3. **Start the adapter** -> the adapter connects to NapCat and MaiBot.
4. **Automatic connection** -> NapCat will automatically connect to the adapter.

```bash
# One-command Docker startup (recommended)
docker compose up -d

# Manual startup
# Terminal 1: start NapCat
# Terminal 2: start the adapter (run it from the adapter directory)
# Terminal 3: uv run python bot.py
```

</details>

## Common Issues

How do you know it is connected? Check these places:

**Plugin mode**:

1. **WebUI plugin list**: the NapCat adapter plugin is loaded.
2. **MaiBot logs**: there is a message indicating that the adapter plugin has loaded.
3. **Message test**: mention the bot in a QQ group and see whether it replies.

**Standalone mode**:

1. **MaiBot logs**: shows "WebSocket service started successfully".
2. **NapCat logs**: shows "Reverse WebSocket connection successful".
3. **Adapter logs**: shows a successful connection.
4. **Message test**: mention the bot in a QQ group and see whether it replies.

### Cannot Connect?

Check these points:

- Is the plugin enabled? Plugins are disabled by default.
- Are the address, port, and WebSocket token correct?
- Are NapCat and MaiBot on the same machine?
- Are there any errors in the logs?

### Not Receiving Messages?

Possible causes:

- Is the group chat whitelist configured correctly? Which groups are allowed to chat?
- Is the QQ account correct? It must match the account logged in through NapCat.
- Did NapCat itself receive the message? Check the NapCat logs.
- Is the network connection normal?
