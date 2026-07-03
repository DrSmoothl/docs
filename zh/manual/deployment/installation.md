---
title: 安装指南
---

# 📦 MaiBot 安装指南

## 环境要求

- **Python 3.12 及以上版本**（推荐 3.12 / 3.13）
- **Git**

## 下载 MaiBot

从 [GitHub Release](https://github.com/Mai-with-u/MaiBot/releases/) 下载最新版本，或者直接克隆仓库：

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
`dev` 分支有新功能但可能不稳定。第一次用建议选 `main` 分支。
:::

## 安装依赖

我们推荐你用 [uv](https://github.com/astral-sh/uv) 管理依赖。

### 安装 uv

::: code-group

```bash [Windows]
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```bash [macOS / Linux]
curl -LsSf https://astral.sh/uv/install.sh | sh
```

:::

### 安装项目依赖

::: code-group

```bash [推荐：uv]
uv sync
```

```bash [备用：pip（不推荐，可能缺少部分依赖）]
pip install -r requirements.txt
```

:::


## 启动

```bash
uv run python bot.py
```

## 用户协议确认

第一次启动会要求你同意用户协议，很简单：

**在终端输入"同意"就行！** 

## 常见问题

### 启动后提示"模型列表不能为空"？

`model_config.toml` 中必须至少包含一个模型配置。如果自动升级失败，需要手动创建模型配置文件，包括：
- 至少一个 API 提供商（`[[api_providers]]`）
- 至少一个文本模型（`[[models]]`）
- 对应的任务分配（`[model_task_config.xxx]`）

视觉模型和嵌入模型是可选的——视觉模型仅在需要看图时配置，嵌入模型仅在启用记忆功能时配置。

参考 [模型配置文档](../configuration/model-config.md) 进行配置。

### uv 命令找不到？

安装 uv 后需要将其加入 PATH 环境变量：

```bash
# Linux/macOS
source $HOME/.local/bin/env

# 或者重新打开终端

# 验证安装
uv --version
```

### 非交互环境下如何同意用户协议？

在服务器或无头环境下，无法在终端中输入"同意"，可以使用环境变量跳过：

```bash
# 方法一：使用程序提示的 hash 值（每次可能不同，以实际提示为准）
export EULA_AGREE=<终端显示的hash值>
export PRIVACY_AGREE=<终端显示的hash值>

# 方法二：先运行一次看提示的 hash 值，记录后用环境变量启动
uv run python bot.py  # 会显示需要的环境变量
```