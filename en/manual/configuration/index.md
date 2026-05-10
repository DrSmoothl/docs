---
title: Configuration Overview
---

# Configuration Overview

## 📋 Configuration File List

MaiBot has two main configuration files, both in the `config/` folder:

| 📁 File | 📝 Purpose | 🔗 Details |
|---------|------------|------------|
| `bot_config.toml` | Basic information, personality, chat, memory, learning, log, knowledge base... | [View Details](./bot-config.md) |
| `model_config.toml` | AI model settings, configures the LLM MaiMai uses | [View Details](./model-config.md) |

::: tip 💡 Quick Tip
These configuration files are generated after MaiBot starts once. If you cannot find them, start MaiBot once first.
:::

::: tip 💡 MaiMai now supports config hot reload
MaiMai now supports config hot reload. After modifying a configuration file, you do not need to restart; saving the file will automatically reload the new configuration.
(Some configuration changes, such as switching AI models, may require related services to be reinitialized before they fully take effect.)
:::

## 🌐 WebUI Configuration

If you do not like manually editing files, MaiBot also provides a web-based configuration interface:

- 🌐 Default address: `http://127.0.0.1:8001`
- 🖱️ Click to change configs with mouse
- 📱 Works on both phone and computer
