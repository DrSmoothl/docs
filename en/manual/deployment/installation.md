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
`dev` branch has new features but may be unstable. For first-time users, it is recommended to choose the `main` branch.
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


## Startup

```bash
uv run python bot.py
```

## User Agreement Confirmation

Upon the first startup, you will be asked to agree to the user agreement. It's very simple:

**Just type "同意" (Agree) in the terminal!** 

## FAQ

### Prompt "Model list cannot be empty" after startup?

`model_config.toml` must contain at least one model configuration. If the automatic upgrade fails, you need to manually create a model configuration file, including:
- At least one API provider (`[[api_providers]]`)
- At least one text model (`[[models]]`)
- Corresponding task assignments (`[model_task_config.xxx]`)

Vision models and embedding models are optional—vision models are only configured when image recognition is needed, and embedding models are only configured when the memory feature is enabled.

Refer to the [Model Configuration Documentation](../configuration/model-config.md) for configuration.

### uv command not found?

After installing uv, you need to add it to your PATH environment variable:

```bash
# Linux/macOS
source $HOME/.local/bin/env

# 或者重新打开终端

# 验证安装
uv --version
```

### How to agree to the user agreement in a non-interactive environment?

In server or headless environments where you cannot type "同意" in the terminal, you can use an environment variable to skip this step:

```bash
# 方法一：使用程序提示的 hash 值（每次可能不同，以实际提示为准）
export EULA_AGREE=<终端显示的hash值>
export PRIVACY_AGREE=<终端显示的hash值>

# 方法二：先运行一次看提示的 hash 值，记录后用环境变量启动
uv run python bot.py  # 会显示需要的环境变量
```