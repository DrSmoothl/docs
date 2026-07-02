---
title: 🖥️ WebUI Admin Panel
---# 🖥️ WebUI Management Panel

Manage your bot right through your browser!

## First Time Use

### Get the Login Password

When starting MaiBot for the first time, the console will display a password (Token):

```
WebUI Access Token: a1b2c3d4...
Please use this Token to log in to the WebUI
```

**Important**: This password is only displayed once, make sure to save it!

### Login Steps

1. Open your browser and visit `http://localhost:8001` (default address)
2. Enter the password shown in the console
3. After a successful login, you will see the management panel

## What Can You Do?

WebUI makes it easy to manage MaiBot:

- ⚙️ **Change Configuration** - Modify settings with a few clicks, no need to edit files
- 🧠 **Manage Memory** - View, edit, and delete the bot's memories
- 🔌 **Install Plugins** - Install and manage various functional plugins
- 📊 **View Statistics** - Check chat logs and usage data

## Basic Settings

You can change the WebUI settings in `bot_config.toml`:

```toml
[webui]
enabled = true                # Whether to enable WebUI
host = "127.0.0.1"            # Bind address
port = 8001                   # Port number
mode = "production"           # Running mode: development or production
anti_crawler_mode = "basic"   # Anti-crawler mode: false / strict / loose / basic
allowed_ips = "127.0.0.1"     # IP whitelist (comma-separated)
```

- Change `host` to `0.0.0.0` to allow access from other devices on the LAN
- `port` can be changed to another number to avoid conflicts

## Forgot Your Password?

If you forget your password:

1. Shut down MaiBot
2. Delete the `data/webui.json` file
3. Restart MaiBot, and a new password will be generated

## Security Reminders

- Do not share your password with others
- It is recommended to change the default port when deploying on the public network
- Changing your password regularly is more secure

## More Features

- [Configuration Management](./config-management.md) - Change configurations in the browser
- [Memory Management](./memory-management.md) - View and manage memories
- [Plugin Management](./plugin-management.md) - Install and manage plugins
- [Chat Logs](./chat-stats.md) - View chat statistics