---
title: 文档编写特性
---

# 文档编写特性

编写者注：本页收录本站用到的**非 VitePress 原生**的插件特性，这些特性需要编写者在 Markdown 中写特定语法才能触发。VitePress 原生的 custom container（`::: tip` / `::: warning` 等）、代码块行号高亮、代码片段导入等特性请参见 [VitePress 官方文档](https://vitepress.dev/guide/markdown)。

本页遵守[文档写作约定](/develop/contributing)：**内容页禁止使用 Markdown 表格**，请用列表或定义式描述。

## Mermaid 图表

用 ` ```mermaid ` 围栏代码块插入流程图、时序图、类图等。本站通过 `vitepress-plugin-mermaid` 插件支持。也支持 ` ```mmd `（不渲染，仅展示源码，用于教学示例）。

支持的图表类型：flowchart、sequenceDiagram、classDiagram、stateDiagram、erDiagram、gantt、pie、gitGraph 等。

**用法示例：**

````markdown
```mermaid
flowchart TD
    A[消息到达] --> B[消息管线处理]
    B --> C{命中命令?}
    C -->|是| D[执行命令]
    C -->|否| E[进入对话]
    D --> F[返回响应]
    E --> F
```
````

**效果预览：**

```mermaid
flowchart TD
    A[消息到达] --> B[消息管线处理]
    B --> C{命中命令?}
    C -->|是| D[执行命令]
    C -->|否| E[进入对话]
    D --> F[返回响应]
    E --> F
```

> 该插件在 `zh/develop/architecture/message-pipeline.md` 等 20+ 文件中实际使用。

## 更新时间线

用 `::: timeline <日期>` ... `:::` 容器创建时间线排版。本站通过 `vitepress-markdown-timeline` 插件支持。日期格式 `YYYY-MM-DD`，内部用 Markdown 项目符号列表。

**用法示例：**

```
::: timeline 2026-07-09
- [1.0.12] 优化 Planner 到 Replyer 的信息传递
- WebUI：增强麦麦观察离线记录，支持自定义 API 模型列表
- 首次配置会引导用户把启动时临时 Token 更换为固定 Token
:::
```

**效果预览：** [查看时间线渲染效果 →](/changelog/)

> 该插件在 `zh/changelog/index.md` 中实际使用。

## 代码组图标

本站通过 `vitepress-plugin-group-icons` 插件在 `::: code-group` 的标签页上自动显示图标。编写者有**三种**方式触发图标。

### 1. 内置关键词自动匹配

标签文本中包含特定关键词时自动出现对应图标。常用关键词包括：

- **包管理器** — pnpm、npm、yarn、bun、deno
- **框架** — vue、react、svelte、angular、next、nuxt、astro、solid
- **工具** — vite、rollup、webpack、esbuild、eslint、tailwind
- **其他** — tsconfig、gitignore、.env、prisma、gradle
- **文件扩展名** — 标签文本中包含文件名（如 `vite.config.ts`、`package.json`、`main.py`）时自动匹配：.ts、.js、.py、.json、.yml、.toml、.rs、.go、.html、.css、.scss、.lua、.swift 等数十种

> 完整内置标签列表见 [vitepress-plugin-group-icons 官方文档](https://vp.yuy1n.io/features.html)。

### 2. 本仓库自定义关键词

下列关键词也已配置自动匹配（在 `.vitepress/config.mts` 的 `customIcon` 中定义），只要标签文本中含有这些关键词就会自动出现对应图标：

- **`git`** — vscode-icons:file-type-git 图标
- **`uv`** — vscode-icons:file-type-python 图标
- **`pip`** — vscode-icons:file-type-python 图标

### 3. 标签内联命名图标

在 code-group 的标签中嵌入 `~iconify-id~` 语法，显式指定图标。格式为 `[标签文字 ~iconify图标名~]`，图标名从 [Iconify](https://icon-sets.iconify.design/) 获取（如 `vscode-icons:file-type-git`、`logos:docker-icon`）。

**综合用法示例：**

````markdown
::: code-group

```bash [稳定版（推荐）~vscode-icons:file-type-git~]
git clone https://github.com/MaiM-with-u/MaiBot.git
cd MaiBot
```

```bash [开发版（尝鲜）~vscode-icons:file-type-git~]
git clone -b dev https://github.com/MaiM-with-u/MaiBot.git
cd MaiBot
```

```bash [pip 安装依赖]
# 标签含 "pip" 自动出现 Python 图标（本仓库自定义关键词）
pip install -r requirements.txt
```

```bash [uv 安装依赖]
# 标签含 "uv" 自动出现 Python 图标（本仓库自定义关键词）
uv sync
```

:::
````

**效果预览：**

::: code-group

```bash [稳定版 ~vscode-icons:file-type-git~]
git clone https://github.com/MaiM-with-u/MaiBot.git
```

```bash [uv 安装]
uv sync
```

```bash [pip 安装]
pip install -r requirements.txt
```

:::

> 本仓库中，`zh/manual/deployment/installation.md` 使用了 `~vscode-icons:file-type-git~` 内联图标；其他文件中通过 `pnpm`/`npm`/`yarn`/`pip`/`uv` 等关键词自动匹配图标。

## 可选 Vue 组件

以下两个 Vue 组件已在主题中注册，可以在 Markdown 中直接以 HTML 标签形式使用。组件源码位于 `.vitepress/theme/components/` 目录，在 `.vitepress/theme/index.ts` 中通过 `app.component()` 注册。

> 当前暂无 MD 文件使用这些组件，按需启用。

### xgplayer 视频播放器

- **`url`** (必填) — 视频地址
- **`poster`** (可选, 默认 `''`) — 封面图地址
- **`width`** (可选, 默认 `'100%'`) — 播放器宽度
- **`height`** (可选, 默认 `'auto'`) — 播放器高度

```html
<xgplayer url="https://litev4.github.io/rickroll/rickroll.mp4" width="100%" height="auto" />
```

**效果预览：**

<xgplayer url="https://litev4.github.io/rickroll/rickroll.mp4" width="100%" height="auto" />

### Bilibili iframe 嵌入

除了 xgplayer 组件，也可以直接用 `<iframe>` 嵌入哔哩哔哩等第三方平台的视频：

```html
<iframe 
style="width:100%; aspect-ratio:16/9; margin-top: 2em;" 
src="//player.bilibili.com/player.html?bvid=BV1amAneGE3P" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
allowfullscreen>
</iframe>
```

**效果预览：**

<iframe 
style="width:100%; aspect-ratio:16/9; margin-top: 2em;" 
src="//player.bilibili.com/player.html?bvid=BV1amAneGE3P" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
allowfullscreen>
</iframe>

### Linkcard 链接卡片

- **`url`** (必填) — 链接地址
- **`title`** (必填) — 卡片标题
- **`description`** (必填) — 卡片描述
- **`logo`** (可选, 默认 `''`) — 左侧 logo 图片地址

```html
<Linkcard url="https://github.com/MaiM-with-u/MaiBot" title="MaiBot" description="一个智能 QQ 群聊天机器人" logo="/title_img/mai.png" />
```

**效果预览：**

<Linkcard url="https://github.com/MaiM-with-u/MaiBot" title="MaiBot" description="一个智能 QQ 群聊天机器人" logo="/title_img/mai.png" />

## 代码组强制写法

本站在全站范围内对独立 fenced block 统一采用单标签 `::: code-group` 配内联图标的写法。本节是 AGENTS.md 引用的权威规范。

**写法（强制）**

````markdown
::: code-group

```<lang> [<语言名> ~vscode-icons:<图标ID>~]
<代码逐字节不变>
```

:::
````

**纪律**

- `<语言名>` 用英文大写：`TOML`、`Python`、`Bash`、`YAML`、`JSON`、`PowerShell`、`HTML`、`CSS`、`SCSS`、`Rust`、`Go`、`TypeScript`、`JavaScript`、`INI`、`Config`、`Env`、`Docker`
- `::: code-group` 与内层 fence 之间、内层 fence 闭合 ```` ``` ```` 与 `:::` 之间**各留一个空行**
- 图标用**内联** `~vscode-icons:<id>~` 显式指定，**不依赖关键词匹配**

**图标映射预览**

下列 code-group 演示所有有效语言名与对应图标。点击标签页可在渲染区看到实际图标效果。

::: code-group

```toml [TOML ~vscode-icons:file-type-toml~]
key = "value"
```

```python [Python ~vscode-icons:file-type-python~]
print("hello")
```

```rust [Rust ~vscode-icons:file-type-rust~]
fn main() {}
```

```go [Go ~vscode-icons:file-type-go~]
package main
```

```typescript [TypeScript ~vscode-icons:file-type-typescript~]
const x: number = 1
```

```javascript [JavaScript ~vscode-icons:file-type-js~]
const x = 1
```

```json [JSON ~vscode-icons:file-type-json~]
{"key": "value"}
```

```html [HTML ~vscode-icons:file-type-html~]
<div></div>
```

```css [CSS ~vscode-icons:file-type-css~]
.a {}
```

```scss [SCSS ~vscode-icons:file-type-scss~]
$a: 1;
```

```yaml [YAML ~vscode-icons:file-type-yaml-official~]
key: value
```

```ini [INI ~vscode-icons:file-type-ini~]
[section]
key = value
```

```conf [Config ~vscode-icons:file-type-config~]
key = value
```

```env [Env ~vscode-icons:file-type-dotenv~]
KEY=value
```

```bash [Bash ~vscode-icons:file-type-shell~]
echo hello
```

```powershell [PowerShell ~vscode-icons:file-type-powershell~]
Write-Host hello
```

```dockerfile [Docker ~vscode-icons:file-type-docker~]
FROM node:20
```

:::

**语言名 → 图标 ID 对照**

- `toml`→`file-type-toml`
- `python`/`py`→`file-type-python`
- `rust`/`rs`→`file-type-rust`
- `go`→`file-type-go`
- `typescript`/`ts`→`file-type-typescript`
- `javascript`/`js`→`file-type-js`
- `json`→`file-type-json`
- `html`→`file-type-html`
- `css`→`file-type-css`
- `scss`→`file-type-scss`
- `yaml`/`yml`→`file-type-yaml-official`
- `ini`→`file-type-ini`
- `conf`→`file-type-config`
- `env`→`file-type-dotenv`
- `bash`/`sh`/`shell`→`file-type-shell`
- `powershell`/`ps1`→`file-type-powershell`
- `dockerfile`→`file-type-docker`

**禁止包裹（S1–S5）**

- **S1** `mermaid` / `mmd` 渲染图
- **S2** `::: tip` / `::: details` / `::: code-group` / `::: timeline` 等容器内的块
- **S3** `html` 块内含 `<xgplayer`、`<iframe`、`<Linkcard`
- **S4** 4+ 反引号教学外层及其内部所有 ``` 块
- **S5** 无语言标签 / `text` / `none` 的日志输出块

**en/ 镜像约定**

`en/` 的代码组结构必须与 `zh/` 对称（标签用英文大写语言名）。`en/` 与 `zh/` 的散文差异不在此约定同步范围内。

