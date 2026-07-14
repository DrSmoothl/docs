---
title: Docker Deployment
---

# 🐳 Docker Deployment Guide

Docker is like a big box that packages MaiBot and everything it needs together, allowing it to run with just one click!

## 📋 Prerequisites

You need to install:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 5-Minute Quick Deployment

### 1. Download MaiBot

```bash
git clone https://github.com/Mai-with-u/MaiBot.git
cd MaiBot
```

### 2. One-click Start!

```bash
docker compose up -d
```

The first startup will automatically generate configuration files, and then it will stop and wait for you to configure.

## 📦 What's inside Docker?

Docker will start several services at the same time, just like a team:

- **`core`** — MaiBot core, the brain of the robot 🧠
- **`napcat`** — QQ connector, enables the robot to go on QQ 📱
- **`sqlite-web`** — Database tool, view what the robot remembers 📊

## ⚙️ Environment Variables (Advanced Usage)

### Core Service Settings

- **`TZ`** — Timezone, e.g., `Asia/Shanghai`
- **`EULA_AGREE`** — Skip protocol confirmation (advanced usage, usually no need to worry about it)

### QQ Service Settings

- **`NAPCAT_UID`** — User ID (usually use the default)
- **`NAPCAT_GID`** — User group ID (usually use the default)

## 💾 Where is the data saved?

Docker saves important data in these locations on your computer:

### Robot Data
- **Configuration files**: `./docker-config/mmc/` (robot settings)
- **Runtime data**: `./data/MaiMBot/` (chat logs, memories, etc.)
- **Plugins**: `./data/MaiMBot/plugins/` (extra features)
- **Logs**: `./data/MaiMBot/logs/` (runtime records)

### QQ Data
- **QQ configuration**: `./docker-config/napcat/`
- **Login information**: `./data/qq/` (no need to log in again next time you start)

## 🔌 Port Description

- **Web Interface** — Port 18001, open http://localhost:18001 in your browser
- **NapCat Management Panel** — Port 6099, NapCat web configuration panel
- **Database Tool** — Port 8120, used to view robot data

## 🔗 Connecting to NapCat

`docker compose up -d` will only start the MaiBot and NapCat containers. You still need to complete the NapCat login, WebSocket, and adapter configuration before MaiBot can actually receive QQ messages.

First set the bot platform and QQ account in MaiBot WebUI, or edit `./docker-config/mmc/bot_config.toml`:

```toml
[bot]
platform = "qq"
qq_account = "123456789"  # Must match the QQ account actually logged in through NapCat
```

NapCat handles QQ login and message transport. `bot.qq_account` is used by MaiBot core to identify messages sent by the bot itself. It is not a NapCat login setting, but it must not be omitted or set to a different account.

1. Open the NapCat management panel: `http://localhost:6099`
2. Log in to the NapCat management panel. If a token is required, check the `token` field in `./docker-config/napcat/webui.json`.
3. Log in to your QQ alternate account in the NapCat management panel.
4. Enable **Forward WebSocket** or **WebSocket Server** in NapCat's network configuration. The listening port is usually `3001`.
5. Enable the **NapCat Adapter** in the MaiBot WebUI's plugin management, or edit `./data/MaiMBot/plugins/MaiBot-Napcat-Adapter/config.toml` on the host machine:

```toml
[plugin]
enabled = true

[napcat_server]
host = "napcat"
port = 3001
token = ""
```

::: warning Docker 网络地址
In Docker Compose, the MaiBot container should use the service name `napcat` when accessing the NapCat container. Therefore, `napcat_server.host` in the adapter configuration is usually filled with `napcat`, not `127.0.0.1`.
`127.0.0.1` inside the container only refers to the container itself.
:::

### Cannot receive group messages

The NapCat adapter enables chat list filtering by default, and group chats are in whitelist mode by default. If the group number is not added to the whitelist, group messages will be directly discarded by the adapter, making it look like NapCat is connected but MaiBot is not responding.

Edit the `[chat]` configuration in `./data/MaiMBot/plugins/MaiBot-Napcat-Adapter/config.toml`:

```toml
[chat]
enable_chat_list_filter = true
show_dropped_chat_list_messages = true
group_list_type = "whitelist"
group_list = ["Your QQ group number"]
```

If you are just testing locally, you can also temporarily disable list filtering:

```toml
[chat]
enable_chat_list_filter = false
```

After making changes, restart the core container:

```bash
docker compose restart core
```

::: tip WebUI 配置位置
The WebUI's enabled status, listening address, and in-container port are now all set in the `[webui]` configuration section of `./docker-config/mmc/bot_config.toml`, instead of being configured via a separate WebUI configuration file or environment variables.
:::

By default, `docker-compose.yml` will map the host's `18001` port to the container's `8001` port:

```yaml
ports:
  - "18001:8001"
```

When deploying with Docker, it is recommended to confirm that the WebUI configuration in `./docker-config/mmc/bot_config.toml` is as follows:

```toml
[webui]
enabled = true
host = "0.0.0.0"
port = 8001
```

::: warning ⚠️ host 必须改为 0.0.0.0
The default value of WebUI's `host` is `127.0.0.1` (only listens on the local loopback address), **which inside a Docker container means only the container itself can access the WebUI, and the host machine cannot access it via port mapping**. When deploying with Docker, you must change `host` to `0.0.0.0`, otherwise the WebUI will not open in your browser.
:::

- `host` is the address the WebUI binds to inside the container. For Docker deployments, it is recommended to use `0.0.0.0`, so that the host port mapping can access the WebUI.
- `port` is the port the WebUI listens on inside the container, which needs to match the right side of the `docker-compose.yml` port mapping. For example, `8001` in `18001:8001`.
- If you want to change the browser access port, you usually only need to change the left side of the port mapping. For example, after changing `18001:8001` to `28001:8001`, access it via `http://localhost:28001`.

## 📋 Complete Steps (Step by Step)

```bash
# 1. Download
git clone https://github.com/Mai-with-u/MaiBot.git
cd MaiBot

# 2. First startup (will generate configuration files)
docker compose up -d

# 3. Modify configuration (Important!)
# Open ./docker-config/mmc/bot_config.toml and fill in the QQ number
# WebUI configuration is also in the [webui] section of ./docker-config/mmc/bot_config.toml
# Open ./docker-config/mmc/model_config.toml and fill in the API key
# Open http://localhost:6099 to log in to NapCat, and enable Forward WebSocket
# Enable the NapCat adapter, and set the adapter's napcat_server.host to napcat
# For group chats, add the group number to the NapCat adapter's group_list, or disable chat list filtering

# 4. Restart to apply configuration
docker compose restart core

# 5. View logs
docker compose logs -f core
```

## 🔧 Frequently Asked Questions

### Container exits immediately after starting?

Check the logs to find the reason:
```bash
docker compose logs core
```

90% of the time it's because:
- Configuration file is not filled in correctly (especially the API key)

An incorrect QQ account does not normally make the `core` container exit directly, but it prevents MaiBot from reliably identifying its own messages, avatar, and related data. Ensure `[bot].qq_account` matches the account logged in through NapCat.

### Not enough memory?

Docker consumes quite a bit of memory. It is recommended to have at least 2GB of free memory.

### Want to stop the robot?

```bash
docker compose down
```

### Want to restart?

```bash
docker compose restart
```

### Getting an error `unknown shorthand flag: 'd' in -d` when entering commands?

This means your server has the **Standalone** version of Docker Compose installed. Please replace the space in the middle of the command with a **hyphen** to execute:
```bash
docker-compose up -d
```
Similarly, all subsequent operations in this document in the format of `docker compose <command>` need to be written as `docker-compose <command>` on your server (e.g., `docker-compose restart core`)
