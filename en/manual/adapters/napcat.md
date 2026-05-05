---
title: Connect MaiMai with NapCat and the Adapter
---

# Connect MaiMai with NapCat and the Adapter

You can use **NapCat** to receive QQ messages and information.

Then use the **adapter** to translate those messages and send them to MaiBot.

## Adapter Repository

NapCat adapter source code: [Mai-with-u/MaiBot-Napcat-Adapter](https://github.com/Mai-with-u/MaiBot-Napcat-Adapter)

## Usage Guide

### Step 1: Install the Adapter

Plugin mode uses the `plugin` branch:

1. Clone or switch to the plugin branch:

```bash
# Clone the plugin branch
git clone -b plugin https://github.com/Mai-with-u/MaiBot-Napcat-Adapter.git

# Or, if you have already cloned it, switch to the plugin branch
cd MaiBot-Napcat-Adapter
git checkout plugin
```

2. **Put the adapter directory into MaiBot's `plugins/` folder**

Alternatively, you can install the plugin from MaiBot's WebUI.

### Step 2: Configure the NapCat Connection

In plugin mode, the adapter already runs inside MaiBot, so you no longer need to configure the connection between the adapter and MaiBot. You only need to configure the connection between the adapter and NapCat. Fill in NapCat's address and port in the adapter configuration file.

> 💡 **Plugin config file location**: the adapter config file is at `plugins/MaiBot-Napcat-Adapter/config.toml`, and contains NapCat connection address, port, token, and related settings.

### Step 3: Configure NapCat

1. Open NapCat's web interface
2. Find the "Forward WebSocket" or "WebSocket Server" settings
3. Enable the Forward WebSocket server. Its listening port must match `napcat_server.port` in `plugins/MaiBot-Napcat-Adapter/config.toml`

For detailed configuration, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

The Forward WebSocket server usually uses `3001` by default. The adapter connects to NapCat as a client, for example `ws://127.0.0.1:3001`. Use the actual address and port from the adapter config.

### Step 4: Start

Start MaiBot directly. The adapter will be loaded and connected automatically.

### ⚠️ Important: The Plugin Is Disabled by Default

After installation, the NapCat adapter plugin is **disabled by default**. You need to enable it manually before it can connect to QQ.

#### Method 1: Edit the Config File (Recommended)

Edit `plugins/MaiBot-Napcat-Adapter/config.toml` and set `enabled` to `true`:

```toml
[plugin]
enabled = true   # Change to true
config_version = "0.1.0"

[napcat_server]
host = "127.0.0.1"    # NapCat WebSocket address
port = 3001           # NapCat WebSocket port
token = ""            # NapCat access token, if configured
```

Then restart MaiBot.

#### Method 2: Enable It from WebUI

1. Open `http://127.0.0.1:8001` in your browser and log in with the Access Token
2. Click **"Plugin Management"** in the left menu
3. Find **"NapCat Adapter"** and turn on the enable switch
4. Save the config and restart MaiBot, or wait for plugin hot reload

> 💡 **Verify whether it is enabled**: after starting MaiBot, check whether the logs contain `plugin maibot-team.napcat-adapter ... activated`. If you see `disabled in config, skipping activation`, the plugin is not enabled yet.

#### Group Chat Whitelist

The NapCat adapter enables chat list filtering by default, and group chats use whitelist mode by default. Messages from groups not listed in `group_list` will be dropped directly. If NapCat is connected successfully but the bot does not respond when mentioned in a group, check this first.

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

## Standalone Mode Guide 🔧

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

> 💡 **Note**: `maim_message` configures the legacy WebSocket service, usually on port 8080. The adapter connects to MaiBot through the MMC protocol and uses the `ws_server_port` configured under `[maim_message]` in MaiBot's `config/bot_config.toml`. Make sure `maibot_server.port` in the adapter's `config.toml` matches MaiBot's `ws_server_port`.

### Install NapCat

See the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell) to install NapCat.

**Docker users**: if you use the project's built-in `docker-compose.yml`, NapCat is already included as the `napcat` service. Start it together with MaiBot:

```bash
docker compose up -d
```

### Set Up the NapCat Connection

1. Open NapCat's web interface
2. Find the "Reverse WebSocket" settings
3. Fill in the MaiBot address: `ws://127.0.0.1:8080/ws`

For detailed configuration, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

💡 **Tip**: if NapCat and MaiBot both run in Docker Compose, make sure MaiBot's `maim_message.ws_server_host` listening address allows access from the container network.

### Log in to QQ

After starting NapCat, you need to log in to QQ. For login methods, see the [NapCat official documentation](https://napneko.github.io/guide/boot/Shell).

⚠️ **Important reminders**:

- Use a secondary account to reduce ban risk
- Login information is saved, so you do not need to log in again after restart
- Follow QQ rules and do not send spam

### Connection Steps

Recommended startup order:

1. **Start NapCat** -> wait for QQ login to succeed
2. **Start MaiBot** -> wait for the WebSocket service to start
3. **Start the adapter** -> the adapter connects to NapCat and MaiBot
4. **Automatic connection** -> NapCat will automatically connect to the adapter

```bash
# One-command Docker startup (recommended)
docker compose up -d

# Manual startup
# Terminal 1: start NapCat
# Terminal 2: start the adapter (run it from the adapter directory)
# Terminal 3: uv run python bot.py
```

</details>

## Verify the Connection ✅

How do you know it is connected? Check these places:

**Plugin mode**:

1. **WebUI plugin list**: the NapCat adapter plugin is loaded
2. **MaiBot logs**: there is a message indicating that the adapter plugin has loaded
3. **Message test**: mention the bot in a QQ group and see whether it replies

**Standalone mode**:

1. **MaiBot logs**: shows "WebSocket service started successfully"
2. **NapCat logs**: shows "Reverse WebSocket connection successful"
3. **Adapter logs**: shows a successful connection
4. **Message test**: mention the bot in a QQ group and see whether it replies

### Cannot Connect?

**Check these points**:

- Are the address and port correct?
- Is the firewall blocking the connection?
- Are NapCat and MaiBot on the same machine?
- Are there any errors in the logs?

### Not Receiving Messages?

**Possible causes**:

- Is the QQ account incorrect? It must match the account logged in with NapCat
- Is NapCat itself receiving messages? Check NapCat logs
- Is the network connection normal?

### Cannot Send Messages?

**Troubleshooting**:

- Does the bot have permission to speak? Group chats may require permissions
- Check MaiBot logs for errors
- Are multiple programs using the same QQ account?

### What About Other Platforms?

If you need to connect other platforms, such as GoCQ, WeChat, Discord, or Telegram, see:

- [GoCQ Adapter](./gocq) - QQ adapter based on go-cqhttp
- [Community Adapter List](./#community-third-party-adapters) - WeChat, Discord, Telegram, and more

## Security Reminders

- Do not expose the WebSocket port to the public internet
- Using `127.0.0.1` is safer
- Update NapCat regularly
- Pay attention to QQ usage rules

## Getting Help

If you run into problems:

- Check NapCat and MaiBot logs
- Join the MaiBot community group and ask
- Submit an issue on GitHub
- Search for related tutorials
