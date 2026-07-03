---
title: Configuration Overview
---# Configuration Overview
## 📋 Configuration File List

MaiBot has two main configuration files, both located in the `config/` folder:


| 📁 File | 📝 Purpose | 🔗 Details |
|---------|---------|------------|
| `bot_config.toml` | Main configuration for bot basic info, personality, chat, memory (including A_Memorix), learning, logging, etc. | [View Details](./bot-config.md) |
| `model_config.toml` | AI model settings, configure the LLM used by Mai | [View Details](./model-config.md) |

::: tip 💡 小贴士
These configuration files will only be generated after starting MaiBot once. If you cannot find them, please start it once first.
:::

::: tip 💡 麦麦现在支持配置热重载
Mai now supports configuration hot-reload. After modifying the configuration file, there is no need to restart; saving will automatically reload the new configuration.
(Some configurations (such as changing the AI model) may require re-initializing the related services to take full effect.)
:::


## 🌐 WebUI Configuration

If you don't like manually editing files, MaiBot also provides a web-based configuration interface (WebUI configuration interface is built-in since 1.0.0):

- 🌐 Default address: `http://127.0.0.1:8001`
- 🖱️ Change configurations with a few mouse clicks
- 📱 Usable on both mobile and PC