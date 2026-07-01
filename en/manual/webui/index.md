---
title: 🖥️ WebUI Management Panel
---# 🖥️ WebUI Admin Panel


Manage your bot directly through your browser!

## First-Time Use

### Obtaining the Login Password

When you start MaiBot for the first time, a password (Token) will be displayed in the console:

```
WebUI Access Token: a1b2c3d4...
请使用此 Token 登录 WebUI
```

**Important**: This password is only displayed once; make sure to save it!

### Login Steps

1. Open your browser and visit `http://localhost:8001` (default address)
2. Enter the password displayed in the console
3. Once logged in, you will see the admin panel

## What can it do?

WebUI allows you to manage MaiBot with ease:

- ⚙️ **Modify Config** - Change settings with a few clicks instead of editing files
- 🧠 **Manage Memory** - View, edit, and delete the bot's memories
- 🔌 **Install Plugins** - Install and manage various functional plugins
- 📊 **View Stats** - Check chat history and usage data

## Basic Settings

You can change the WebUI settings in `bot_config.toml`:

```toml
[webui]
enabled = true                # 是否启用 WebUI
host = "127.0.0.1"            # 绑定地址
port = 8001                   # 端口号
mode = "production"           # 运行模式：development(开发) 或 production(生产)
anti_crawler_mode = "basic"   # 防爬虫模式：false / strict / loose / basic
allowed_ips = "127.0.0.1"     # IP 白名单（逗号分隔）
```

- Changing `host` to `0.0.0.0` allows other devices on the local network to access it
- `port` can be changed to another number to avoid conflicts

## What to do if you forget the password?

If you forget your password:

1. Close MaiBot
2. Delete the `data/webui.json` file
3. Restart MaiBot, and a new password will be generated

## Security Reminders

- Do not share your password with others
- It is recommended to change the default port when deploying on a public network
- Changing your password regularly is more secure

## More Features

- [Config Management](./config-management.md) - Modify configurations in the browser
- [Memory Management](./memory-management.md) - View and manage memories
- [Plugin Management](./plugin-management.md) - Install and manage plugins
- [Chat History](./chat-stats.md) - View chat statistics