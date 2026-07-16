---
title: Installation Guide
---
# 📦 MaiBot Installation Guide

## Environment Requirements

- **Python 3.12 or higher** (Recommended: 3.12 / 3.13)
- **Git**

## Download MaiBot

Download the latest version from [GitHub Release](https://github.com/Mai-with-u/MaiBot/releases/), or clone the repository directly:

::: code-group

```bash [Stable Version (includes pre-release) (Recommended) ~vscode-icons:file-type-git~]
git clone https://github.com/Mai-with-u/MaiBot.git
cd MaiBot
```

```bash [Development Version (for early adopters) ~vscode-icons:file-type-git~]
git clone -b dev https://github.com/Mai-with-u/MaiBot.git
cd MaiBot
```

:::

::: warning ⚠️ Note
The `dev` branch has new features but may be unstable. It is recommended to choose the `main` branch for your first use.
:::

## Install Dependencies

We recommend using [uv](https://github.com/astral-sh/uv) to manage dependencies.

### Install uv

::: code-group

```bash [Windows ~vscode-icons:file-type-shell~]
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```bash [macOS / Linux ~vscode-icons:file-type-shell~]
curl -LsSf https://astral.sh/uv/install.sh | sh
```

:::

### Install Project Dependencies

::: code-group

```bash [Recommended: uv ~vscode-icons:file-type-shell~]
uv sync
```

```bash [Fallback: pip (not recommended, may lack some dependencies) ~vscode-icons:file-type-shell~]
pip install -r requirements.txt
```

:::

## Launch

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
uv run python bot.py
```

:::

## User Agreement Confirmation

The first launch will require you to accept the user agreement. It's simple:

**Just type "agree" in the terminal!**

## Frequently Asked Questions

### Why does it say "Model list cannot be empty" after launching?

The `model_config.toml` file must contain at least one model configuration. If automatic upgrade fails, you need to manually create a model configuration file, including:
- At least one API provider (`[[api_providers]]`)
- At least one text model (`[[models]]`)
- Corresponding task assignments (`[model_task_config.xxx]`)

Vision models and embedding models are optional — configure vision models only when image viewing is needed, and configure embedding models only when memory functionality is enabled.

Refer to the [Model Configuration Documentation](../configuration/model-config.md) for configuration.

### uv command not found?

After installing uv, you need to add it to the PATH environment variable:

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# Linux/macOS
source $HOME/.local/bin/env

# Or simply reopen the terminal

# Verify installation
uv --version
```

:::

### How to accept the user agreement in a non-interactive environment?

On a server or in a headless environment where you cannot type "agree" in the terminal, you can use environment variables to skip the prompt:

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# Method 1: Use the hash value shown in the program prompt (may differ each time, refer to the actual prompt)
export EULA_AGREE=<hash_value_shown_in_terminal>
export PRIVACY_AGREE=<hash_value_shown_in_terminal>

# Method 2: Run once to see the required hash value, then start with environment variables
uv run python bot.py  # This will display the required environment variables
```

:::