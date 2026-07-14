---
title: 快速上手
---

# 🚀 MaiBot 快速上手

**欢迎使用 MaiBot！** 本文档会带你从零开始，让麦麦成功跑起来。

## 📋 准备工作

你需要准备以下 3 样东西：

### 1️⃣ 一个 QQ 小号 🆔

- **必须是 QQ 小号**（机器人账号有被限制登录的风险，不要用主号）
- **能正常登录**（建议先在手机上确认账号正常）

### 2️⃣ 一个 AI 模型的 API 密钥 🔑

MaiBot 需要调用大语言模型来思考和回复。**首次启动会自动生成以 DeepSeek 为默认服务商的配置**。最小可运行配置只需要一个可用的 DeepSeek API Key；视觉模型和嵌入模型可以稍后按需配置。

| 服务商 | 价格 | 特点 | 获取方式 |
|--------|------|------|----------|
| **阿里云百炼 (Qwen)** | 便宜 | 提供通义千问系列及多种模型能力 | [百炼控制台](https://bailian.console.aliyun.com/) → API-KEY |
| **硅基流动** | 便宜 | 聚合 200+ 模型（DeepSeek、Qwen、GLM 等），**一个 API Key 覆盖文本/视觉/向量**，支持支付宝/微信支付 | [官网注册](https://cloud.siliconflow.cn/) |
| **DeepSeek** 🏆 默认 | 极低 | 默认文本模型服务商，首次配置最省步骤 | [官网注册](https://platform.deepseek.com/) |
| **智谱 GLM** | 免费起 | 清华大学团队出品，**文本/视觉/向量全支持**；Flash 系列**永久免费**，新用户送 2000 万 tokens | [智谱开放平台](https://open.bigmodel.cn/) |
| **Kimi (Moonshot)** | 中等 | **超长上下文（262K）**，原生多模态（文本+图片+视频理解），中英双语能力出色 | [官网注册](https://platform.moonshot.cn/) |

::: tip 💡 新手推荐
- **先跑起来？用 DeepSeek** — 默认配置已经对齐，只需填写 API Key 并按 WebUI 向导检查文本模型
- **需要看图或相关记忆能力？稍后再配** — 视觉与嵌入不是首次运行的必填项
- **想要免费？用智谱 GLM** — Flash 模型永久免费，注册即送 2000 万 tokens
- 大部分服务商提供**免费试用额度**，可以先体验再决定
:::

MaiBot 通过 Git 下载和管理代码。从 [git-scm.com](https://git-scm.com/) 下载安装。


## 🏃‍♂️ 安装步骤

### 第 1 步：下载 MaiBot 📥

**方法一：下载压缩包（Windows 新手推荐）**

1. 访问 [MaiBot Releases 页面](https://github.com/Mai-with-u/MaiBot/releases)
2. 找到最新版本，展开 **Assets**，下载 **Source code (zip)**
3. 解压到你想要的位置（比如桌面）

**方法二：Git 克隆**（如果你装了 Git）

```bash
git clone https://github.com/Mai-with-u/MaiBot.git
```

如需使用开发分支：

```bash
git checkout dev
```

### 第 2 步：安装 Python 🐍

> MaiBot 需要 **Python 3.12 及以上版本**（推荐 3.12 / 3.13）。

1. 访问 [python.org](https://www.python.org/downloads/) 下载 Windows 安装包
2. **安装时务必勾选 "Add Python to PATH"**
3. 打开命令提示符（`Win + R` → 输入 `cmd` → 回车），验证安装：

```bash
python --version
```

### 第 3 步：安装 uv（包管理器）📦

MaiBot 使用 [uv](https://docs.astral.sh/uv/) 管理依赖，速度比 pip 快很多。

在命令提示符中运行：

```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

安装完成后**关闭并重新打开**命令提示符。

### 第 4 步：安装项目依赖

进入你解压好的 MaiBot 文件夹，在地址栏输入 `cmd` 回车打开命令提示符，运行：

```bash
uv sync
```

这会创建虚拟环境（`.venv`）并安装所有依赖，大概需要几分钟。

::: tip 💡 国内用户
MaiBot 已配置清华镜像源，`uv sync` 会自动使用，无需手动设置。
:::

### 第 5 步：首次启动（生成配置 + 同意协议）

```bash
uv run python bot.py
```

**首次启动时，终端会显示用户协议（EULA）和隐私协议，输入 `同意` 并回车以继续。** 系统会自动生成默认配置到 `config/` 目录，并继续初始化 MaiBot 和 WebUI；不需要为了生成配置而启动第二次。

::: tip 💡 服务器/无头环境
如果在没有交互终端的服务器上部署，无法输入"同意"，可以使用环境变量跳过协议确认：

```bash
# 先运行一次，终端会显示需要的 hash 值
uv run python bot.py
# 复制终端显示的 EULA_AGREE=xxx 和 PRIVACY_AGREE=xxx
# 然后设置环境变量重新启动
export EULA_AGREE=<显示的hash>
export PRIVACY_AGREE=<显示的hash>
uv run python bot.py
```
:::

### 第 6 步：进入 WebUI

同一次启动继续运行后，你会看到类似这样的日志：

```
🌐 WebUI 服务器启动中...
🌐 访问地址: http://127.0.0.1:8001
🔑 WebUI 访问令牌: e7b2a4f1...（一长串字符）
💡 请在浏览器中打开访问地址，输入上面的访问令牌进行登录
```

### 第 7 步：浏览器打开 WebUI，完成设置 🌐

1. 打开浏览器，访问 **http://127.0.0.1:8001**
2. 你会看到一个登录页面，**输入终端里那串访问令牌（Access Token）**
3. 登录成功后，如果是首次使用，会自动进入**配置向导**
4. 在向导中填写 **DeepSeek API 密钥**，确认文本回复、规划和工具等任务使用的模型可用
5. 完成后系统标记初始化完成，进入正常管理界面

视觉模型和嵌入模型可以跳过，等需要看图或启用相关记忆能力时再配置。

::: tip 💡 所有配置都在 WebUI 上操作
修改昵称、人格、聊天频率、模型等，都可以在 WebUI 的“配置管理”中在线修改，无需手动编辑文件。大部分运行时配置保存后热重载；监听端口、MCP 连接等启动项仍需重启，详见[配置概览](../configuration/)。
:::

## 📱 连接 QQ

MaiBot 核心启动后，还需要连接 QQ 才能收发消息。MaiBot 通过 **NapCat** 实现 QQ 接入。

### 安装 NapCat

参照 [NapCat 官方安装指南](https://napneko.github.io/guide/install) 安装并登录你的 QQ 小号。

### 安装 NapCat 适配器

在 MaiBot WebUI 中（浏览器访问 `http://127.0.0.1:8001`）：

1. 点击左侧菜单 **"插件管理"**
2. 搜索 **"NapCat 适配器"**
3. 点击安装

安装完成后，根据适配器的配置说明填写 NapCat 的连接地址即可。

::: warning ⚠️ 重要：插件默认不启用
**无论是通过 WebUI 安装还是手动克隆到 `plugins/` 目录，插件安装后默认都是禁用状态。** 安装完成不等于就能用了！

需要在 WebUI 的 **"插件管理"** 页面中，找到 NapCat 适配器，**手动点击启用开关**。

也可以找到实际插件目录中的 `config.toml`，将 `[plugin] enabled` 改为 `true`。文件监听器会加载插件，正常情况下不需要重启 MaiBot；不同安装方式生成的插件目录名可能不同。

> 如何确认是否启用？启动后看日志：出现「激活」说明已启用，出现「跳过激活」说明还是禁用状态。
:::

::: tip 💡 更多适配器信息
详细的 NapCat 适配器安装和配置请参考 [NapCat 适配器文档](../adapters/napcat.md)。
:::


## 🎉 开始聊天

### 测试机器人

在 QQ 群里 @机器人，或者在私聊中发送消息：

```
@麦麦 你好！
```

如果机器人回复你了，恭喜，部署成功！🎉


## 🆘 常见问题

### 启动后自动退出？

查看日志确认原因，在命令提示符中运行：

```bash
uv run python bot.py
```

程序生成默认配置后会继续运行。如果意外退出，请以日志中的最后一条错误为准，重点检查协议确认、TOML 格式、端口占用和依赖初始化。

### 端口被占用？

启动时如果报错类似以下内容：

```
WebUI 服务器 启动失败: 端口 8001 已被占用 (host=127.0.0.1)
```

说明默认端口被其他程序占用了。

**解决方法一：改端口**

编辑 `config/bot_config.toml`，在 `[webui]` 段落中修改端口：

```toml
[webui]
port = 8002   # 改成其他未被占用的端口，如 8002、8003
```

保存后重新启动，WebUI 访问地址也会变成 `http://127.0.0.1:8002`。

> 💡 如果 `maim_message` 的 WebSocket 端口（默认 8000）也被占用，同样在 `[maim_message]` 段落中修改 `ws_server_port`。

**解决方法二：关闭占用端口的进程**

```bash
# Windows（CMD）
netstat -ano | findstr :8001
# 记下最后一列的 PID，然后用任务管理器或命令关闭
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8001
# 记下 PID，然后
kill -9 <PID>
```

关闭后重启 MaiBot 即可使用原来的端口。

### 机器人不回复？

按顺序排查：

1. ✅ NapCat 是否在线？（NapCat 界面显示已登录）
2. ✅ API 密钥是否正确？（WebUI 配置中检查）
3. ✅ 插件是否已安装？（WebUI 插件管理中确认）
4. ✅ 日志是否有报错？（WebUI 日志页面查看）

### API Key 无效？

- 确认没有多余的空格
- 检查 API 服务商选择是否正确
- 确认账户是否有余额或免费额度

### 浏览器打不开？

- 确认 MaiBot 正在运行（终端窗口是打开的）
- 检查地址是否正确：`http://127.0.0.1:8001`
- 防火墙是否允许

### 如何修改配置？

- **通过 WebUI**：浏览器访问 `http://127.0.0.1:8001`，在配置管理页面修改
- **直接编辑文件**：修改 `config/bot_config.toml` 或 `config/model_config.toml`
- 修改后大部分配置无需重启，MaiBot 支持**配置热重载**（部分配置仍需重启生效）


## 🎯 下一步

恭喜你成功部署了 MaiBot！接下来可以：

- 📚 **[配置详解](../configuration/)** — 调整人格、聊天频率、记忆等参数
- 🔌 **[插件开发](../../plugin/)** — 为麦麦开发新功能
- 🧠 **[了解麦麦的大脑](../../manual/features/maisaka-reasoning.md)** — 深入理解 MaiBot 的推理机制
- 💬 **邀请麦麦进群** — 和朋友们一起玩


**遇到问题？** 加入技术交流群提问：[麦麦脑电图](https://qm.qq.com/q/RzmCiRtHEW)

**祝你玩得开心！**
