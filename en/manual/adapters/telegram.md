---
title: Telegram Adapter
---

# Telegram Adapter

MaiBot's Telegram platform adapter bridges a Telegram Bot with MaiBot seamlessly via Telegram Bot API long polling.

## Adapter Repository

Telegram adapter source code: [exynos967/MaiBot-Telegram-Adapter](https://github.com/exynos967/MaiBot-Telegram-Adapter)

## Create a Telegram Bot

Before using the adapter, you need to create a Bot on Telegram and obtain its token.

### Step 1: Create a Bot via @BotFather

1. Search for [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/newbot` and follow the prompts to enter the bot name and username
3. When finished, BotFather will return a Bot Token in the format `123456:ABC-DEF...`
4. Fill this token into the `telegram_bot.token` field in the adapter configuration

### Step 2: Disable Privacy Mode

By default, Telegram Bots in group chats can only receive commands starting with `/` and messages that directly mention the bot via @. If you need the bot to receive all messages in a group chat, Privacy Mode must be disabled:

1. Send `/setprivacy` to @BotFather
2. Select the bot you created
3. Choose **Disable**

After disabling Privacy Mode, the bot will be able to receive all messages in group chats. Even if you only want to trigger the bot via @mentions or replies, it is still recommended to disable this setting to ensure messages are received properly.

## Installation

Clone the adapter repository into MaiBot's `plugins/` directory:

```bash
cd /path/to/MaiBot/plugins
git clone https://github.com/exynos967/MaiBot-Telegram-Adapter.git
```

### Dependencies

- `maibot_sdk` >= 2.0.0 (provided by MaiBot main program)
- `aiohttp` >= 3.9.0 (included with MaiBot main program)

For SOCKS5 proxy support, install additionally:

```bash
pip install aiohttp-socks
```

## Configuration

### Adapter Configuration

On first load, the adapter generates `config.toml` in the plugin directory. Edit this file:

```toml
[plugin]
enabled = true                # Enable the plugin
config_version = "0.1.0"

[telegram_bot]
token = "Your Bot Token"      # Required, obtained from @BotFather
api_base = "https://api.telegram.org"
poll_timeout = 20
proxy_enabled = false
proxy_url = ""                # e.g. socks5://127.0.0.1:1080 or http://127.0.0.1:7890
proxy_from_env = false

[chat]
group_list_type = "whitelist" # whitelist / blacklist
group_list = []               # chat_id list
private_list_type = "whitelist"
private_list = []             # User ID list
ban_user_id = []              # Globally banned users
```

::: tip Tip
Configuration can also be hot-reloaded via the MaiBot WebUI plugin configuration page without restarting MaiBot.
:::

### MaiBot Main Configuration

MaiBot Core needs to identify "the bot itself" through the `platforms` field in the main configuration. After enabling Telegram, add the Telegram Bot's numeric ID to the `[bot]` section of the MaiBot main configuration:

```toml
[bot]
platforms = ["telegram:123456789"]
```

Here `123456789` is your Telegram Bot's numeric ID; the shorthand `tg:123456789` can also be used. The bot numeric ID will be logged after the adapter starts successfully via `Telegram Bot: id=...`.

::: warning Note
Without the Telegram configuration in `platforms`, MaiBot may not be able to identify the bot itself as the configured nickname in historical messages and prompts.
:::

## Configuration Reference

### `[plugin]` — Plugin Settings

- **`enabled`** — Whether to enable the Telegram adapter. When disabled, the plugin stays idle and does not start polling. Default: disabled
- **`config_version`** — Current configuration structure version (auto-maintained, no manual modification needed). Default: "0.1.0"

### `[telegram_bot]` — Telegram Bot Connection Settings

- **`token`** — Bot Token, obtained from @BotFather. Required when enabling the adapter. Default: empty
- **`api_base`** — Telegram Bot API base URL. Modify this when using a custom API server. Default: "https://api.telegram.org"
- **`poll_timeout`** — Long polling timeout (seconds). Increasing this value reduces request frequency but increases perceived message latency. Default: 20
- **`proxy_enabled`** — Whether to enable a proxy. Default: disabled
- **`proxy_url`** — Proxy URL, supports `http://`, `https://` and `socks5://` protocols. e.g. `http://127.0.0.1:7890` or `socks5://127.0.0.1:1080`. Default: empty
- **`proxy_from_env`** — Whether to read proxy settings from environment variables (e.g. `HTTP_PROXY`, `HTTPS_PROXY`). Default: disabled

### `[chat]` — Chat Filtering

- **`group_list_type`** — Group chat list mode, either `whitelist` or `blacklist`. Default: "whitelist"
- **`group_list`** — List of chat_ids in the group chat list. Default: empty
- **`private_list_type`** — Private chat list mode, either `whitelist` or `blacklist`. Default: "whitelist"
- **`private_list`** — List of user IDs in the private chat list. Default: empty
- **`ban_user_id`** — List of globally banned user IDs; messages from banned users are discarded directly. Default: empty

::: tip Chat Filtering Notes
- **Whitelist mode**: only processes group/private chat messages in the list; everything else is discarded
- **Blacklist mode**: processes all messages, but discards group/private chat messages in the list
- The default group chat mode is whitelist. If the bot is connected but unresponsive in a group, first check whether the corresponding chat_id is filled in `group_list`
:::

## Message Type Support

- **Text** — Inbound: Supported | Outbound: Supported
- **Image** — Inbound: Supported (auto-download to base64) | Outbound: Supported (base64 / URL)
- **Voice** — Inbound: Supported (auto-download to base64) | Outbound: Supported (base64)
- **Sticker** — Inbound: Supported (converted to emoji type) | Outbound: Supported (sent as animation)
- **GIF Animation** — Inbound: Supported (converted to emoji type) | Outbound: Supported (sent as animation)
- **Video** — Inbound: Not supported | Outbound: Supported (URL)
- **File** — Inbound: Supported (converted to text marker) | Outbound: Supported (URL)
- **Reply Message** — Inbound: Supported (with associated message ID) | Outbound: Supported (via reply_parameters)
- **@Bot** — Inbound: Supported (multiple recognition methods)

## Proxy Configuration

If the server cannot directly access the Telegram API, you can connect through a proxy. The adapter supports the following proxy methods:

### HTTP/HTTPS Proxy

```toml
[telegram_bot]
proxy_enabled = true
proxy_url = "http://127.0.0.1:7890"
```

### SOCKS5 Proxy

Using a SOCKS5 proxy requires installing the `aiohttp-socks` dependency:

```bash
pip install aiohttp-socks
```

Then configure:

```toml
[telegram_bot]
proxy_enabled = true
proxy_url = "socks5://127.0.0.1:1080"
```

### Read Proxy from Environment Variables

If your system already has `HTTP_PROXY` or `HTTPS_PROXY` environment variables configured, enable this option:

```toml
[telegram_bot]
proxy_enabled = true
proxy_from_env = true
```

### Custom API URL

If you are using a self-hosted Telegram API proxy server (such as Telegram Bot API Server), modify `api_base`:

```toml
[telegram_bot]
api_base = "https://your-api-server.com"
```

## Topic Routing

Telegram supergroups support Topics. The adapter automatically routes messages from different Topics in the same group into separate sessions, allowing MaiBot to maintain independent contexts per Topic.

How it works:

- On inbound, the adapter combines `chat_id` and `message_thread_id` into a virtual `group_id` (format: `chat_id::tg-topic::mt=thread_id`)
- On outbound, the adapter parses the virtual `group_id` and sends the message to the correct Topic
- This means different Topics in the same Telegram group are treated as separate groups in MaiBot, each with its own conversation context

## @Bot Recognition

The adapter supports multiple methods for recognizing when a user @mentions the bot, ensuring the bot is triggered correctly in group chats:

1. **Mention entity**: The message `entities` contain a `mention` or `text_mention` type pointing to the bot
2. **Reply to bot**: The user replied to a message sent by the bot (`reply_to_message` sender is the bot)
3. **Fallback text matching**: When none of the above methods match, fall back to regex matching `@bot_username` in the message text

When an @Bot mention is detected, the adapter will:
- Insert an `at` type component in the message segment, marking `target_user_id` as the Bot ID
- Set `is_mentioned` and `is_at` to `true`
- Strip the leading `@bot_username` text from the message to avoid duplicate @mentions in the prompt

## Verify Connection

After starting MaiBot, check the following to confirm the adapter is working correctly:

1. **MaiBot logs**: See `Telegram Bot: id=xxx, username=xxx` — bot identity was obtained successfully
2. **MaiBot logs**: See `Telegram adapter starting polling...` — message receiving has started
3. **Message test**: Send a private message to the bot in Telegram or @mention it in a group and see whether it replies

### Common Issues

**Bot does not start polling after launch**

- Check whether `plugin.enabled` is set to `true`
- Check whether `telegram_bot.token` is filled in correctly
- Look for a `telegram_bot.token is empty` warning in the logs

**Cannot receive messages in group chats**

- Confirm that the bot's Privacy Mode is disabled (see [Disabling Privacy Mode](#step-2-disable-privacy-mode))
- Check whether `chat.group_list` contains the target group's chat_id
- Verify the `chat.group_list_type` mode is correct

**Cannot connect to Telegram API**

- Check whether the network can reach `api.telegram.org`
- If in Mainland China, a proxy needs to be configured (see [Proxy Configuration](#proxy-configuration))
- Verify the proxy address format is correct
