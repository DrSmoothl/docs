---
title: Installation Guide
---# 📦 MaiBot Installation Guide

## Environment Requirements

- **Python 3.12 or higher** (3.12 / 3.13 recommended)
- **Git**

## Download MaiBot

Download the latest version from [GitHub Release](https://github.com/Mai-with-u/MaiBot/releases/), or clone the repository directly:

::: code-group

```bash [稳定版（包含预发布版） (推荐)]
git clone https://github.com/Mai-with-u/MaiBot.git
cd MaiBot
```

```bash [开发版 (尝鲜)]
git clone -b dev https://github.com/Mai-with-u/MaiBot.git
cd MaiBot
```

:::

::: warning ⚠️ 注意
The `dev` branch has new features but may be unstable. For first-time users, the `main` branch is recommended.
:::

## Install Dependencies

We recommend using [uv](https://github.com/astral-sh/uv) to manage dependencies.

### Install uv

::: code-group

```bash [Windows]
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```bash [macOS / Linux]
curl -LsSf https://astral.sh/uv/install.sh | sh
```

:::

### Install Project Dependencies

::: code-group

```bash [推荐：uv]
uv sync
```

```bash [备用：pip（不推荐，可能缺少部分依赖）]
pip install -r requirements.txt
```

:::


## Launch

```bash
uv run python bot.py
```

## User Agreement Confirmation

The first launch will require you to agree to the user agreement, which is simple:

**Just type "agree" in the terminal!** 

## FAQ

### Prompted "Model list cannot be empty" after launch?

`model_config.toml` must contain at least one model configuration. If the automatic upgrade fails, you need to manually create the model configuration file, including:
- At least one API provider (`[[api_providers]]`)
- At least one text model (`[[models]]`)
- Corresponding task assignments (`[model_task_config.xxx]`)

Vision models and embedding models are optional — vision models are only configured when image processing is needed, and embedding models are only configured when the memory feature is enabled.

Refer to the [Model Configuration Documentation](../configuration/model-config.md) for setup.

### uv command not found?

After installing uv, you need to add it to the PATH environment variable:

```bash
# Linux/macOS
source $HOME/.local/bin/env

# Or reopen the terminal

# Verify installation
uv --version
```

### How to agree to the user agreement in a non-interactive environment?

In server or headless environments where you cannot type "agree" in the terminal, you can use environment variables to skip:

```bash
# Method 1: Use the hash value prompted by the program (may vary each time, subject to the actual prompt)
export EULA_AGREE=<hash value displayed in terminal>
export PRIVACY_AGREE=<hash value displayed in terminal>

# Method 2: Run once to see the prompted hash value, note it down, and then launch with environment variables
uv run python bot.py  # Will display the required environment variables
```