---
title: 插件
---

# 插件

插件就像给 MaiBot 安装的「App」，让它拥有更多能力——游戏、画图、音乐、天气查询，以及**把 QQ、邮件、语音通话等平台接入麦麦的适配器**，几乎都以插件形式存在。

你既可以从内置的**插件市场**一键安装，也可以自己开发。本文只讲「作为用户如何安装与管理插件」；开发相关内容见[插件开发文档](/plugin/)。

## 什么是插件

- 🎮 **功能型插件** — 游戏、画图、音乐、天气等
- 🔌 **平台适配器** — 把消息平台接进 MaiBot，它们本身也是插件
- 🛠️ **开发向组件** — Tool、Command、Hook、事件处理器等

## 插件市场（推荐）

MaiBot 内置**插件市场（Plugin Market）**，在 WebUI 里就能浏览、安装、更新插件，无需命令行。

![插件市场](/images/plugin-market/store-overview.jpeg)

市场支持按分类、关键词筛选，快速定位你需要的插件或适配器：

![插件市场筛选与分类](/images/plugin-market/store-filter.png)

### 从插件市场安装

1. 打开 WebUI，进入「插件管理」。
2. 切换到「插件市场 / 浏览」页签。
3. 搜索或筛选你要的插件（例如 `NapCat`）。
4. 点击「安装」，等待拉取完成。
5. 安装后插件默认**禁用**，记得手动启用（见[管理插件](./management)）。

::: tip 市场里找不到？
插件市场基于 GitHub 仓库索引。如果搜不到，也可以用下面的 Git 地址方式安装任意公开仓库。
:::

## 从仓库安装（git clone）

插件市场之外，还有一条「仓库」路径：先在插件站或官方组织里找到插件，再用 Git 地址安装。

### 去哪里找插件

除了 WebUI 内置的插件市场，你还可以访问 **MaiBot 插件站** 浏览、搜索社区维护的插件与适配器：

<Linkcard url="https://plugins.maibot.chat/" title="MaiBot 插件站" description="浏览、搜索社区维护的插件与适配器" logo="/title_img/mai.png" />

<Linkcard url="https://github.com/Mai-with-u" title="MaiBot 官方组织" description="官方维护的适配器与示例插件都在这里" logo="/title_img/mai.png" />

### 从 Git 仓库地址安装

适用于市场搜不到的插件，或你想固定某个分支 / fork。

在插件管理的「从 Git 安装」里粘贴仓库地址，或在终端手动克隆：

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# 通过 WebUI 的「从 Git 安装」粘贴地址，或终端执行：
git clone https://github.com/作者/插件名.git plugins/插件名
```

:::

**示例地址**：

```
https://github.com/作者/插件名
```

> ⚠️ 当前仅支持通过 Git 仓库地址安装，不支持本地文件上传。

## 安装后：默认是禁用状态

无论哪种方式，插件写入 `plugins/` 后：

- 文件监听器会发现新插件，并按插件 `config_model` 生成 `config.toml`；
- `enabled` 默认为 `false` 的插件**需要手动启用**才会运行。

所以「安装成功」≠「已经在运行」。下一步请到[管理插件](./management)完成启用与配置。

::: warning 安全提醒
只安装可信来源的插件。安装前查看仓库的 README、更新时间与 Issue，留意插件申请的权限。第三方插件由各自作者维护，MaiBot 官方不保证其兼容性与安全性。
:::
