---
title: Configuration Overview
---# Configuration Overview
## 📋 Configuration File List

MaiBot has two main configuration files, both located in the `config/` folder:


| 📁 File | 📝 Purpose | 🔗 Details |
|---------|---------|------------|
| `bot_config.toml` | All main configurations including basic bot information, personality, chat, memory (including A_Memorix), learning, logs, etc. | [View Details](./bot-config.md) |
| `model_config.toml` | AI model settings, configuring the LLM used by MaiBot | [View Details](./model-config.md) |

::: tip 💡 小贴士
These configuration files are generated after starting MaiBot for the first time. If you cannot find them, please start the bot once first.
:::

::: tip 💡 麦麦现在支持配置热重载
MaiBot now supports hot-reloading of configurations. After modifying the configuration files, there is no need to restart; simply save the file to automatically reload the new settings.
(Some configurations (such as changing the AI model) may require re-initializing related services to take full effect.)
:::


## 🌐 WebUI Configuration

If you prefer not to edit files manually, MaiBot also provides a web-based configuration interface (WebUI configuration interface is built-in since 1.0.0):

- 🌐 Default Address: `http://127.0.0.1:8001`
- 🖱️ Change configurations with a few clicks
- 📱 Compatible with both mobile and PC