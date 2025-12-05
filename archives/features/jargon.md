# 黑话系统（Jargon System）

---

## 功能概述

- 自动从实时聊天中挖掘“黑话/俚语/自创缩写”，并推断其含义
- 黑话可被记忆检索，还可以通过WebUi 查询复用。
- 支持“全局模式”与“按聊天隔离”两种策略，适应跨群共享或单群私有的用词。

---

## 配置入口

- 文件：`config/bot_config.toml`
- 区块：`[jargon]`

```toml
[jargon]
all_global = true  # 是否开启全局黑话模式
```

- `all_global=true`：所有新词默认共享，`chat_id` 只记录首次出现的位置；后续查询不会按群区分，适合多群共通用语。
- `all_global=false`：仅在当前 `chat_id` 内保存/检索，便于区分圈层私语。
- 调试相关：`[debug].show_jargon_prompt=true` 可在日志中观察提取/推断提示词与结果，便于排查。
