## 表达学习（Expression Learning）

### 这有什么用？

- 通过自动学习群体/私聊中的常见说法与语气，沉淀为可复用的表达
- 学到的表达会按活跃度进行权重累积与自然衰减，长期保持“常用更常用，冷门会被淘汰”的效果。

### 配置位置

- 文件：`config/bot_config.toml`
- 区块：`[expression]`

该区块包含两个核心选项：`learning_list` 与 `expression_groups`。

---

### 选项一：learning_list（开关与学习强度）

- 作用：为全局或某个特定聊天流配置“是否使用表达”“是否进行学习”“学习强度”。
- 格式：

```toml
[expression]
learning_list = [
  ["", "enable", "enable", 1.0],                   # 全局：使用表达=开，学习=开，强度=1.0
  ["qq:1919810:group", "enable", "enable", 1.5],   # 指定群聊：使用表达=开，学习=开，强度=1.5
  ["qq:114514:private", "enable", "disable", 0.5], # 指定私聊：使用表达=开，学习=关，强度=0.5
]
```

- 字段说明（按顺序）：

  - chat_stream_id：`platform:id:type`，例如群聊 `qq:123456:group`、私聊 `qq:123456:private`，空串 `""` 表示“全局默认配置”。
  - use_expression：是否在该聊天“使用已学表达”，`enable` / `disable`。
  - enable_learning：是否在该聊天“继续学习表达”，`enable` / `disable`。
  - learning_intensity：学习强度（浮点数，>0）。内部会等比调整两个阈值：
    - 最少消息数 = `15 / learning_intensity`
    - 最短学习间隔（秒）= `120 / learning_intensity`
- 行为要点：

  - 未配置时的默认值：使用表达=开，学习=开，强度=1.0（即 15 条消息、120 秒触发）。
  - 先匹配具体聊天流，再回退到全局配置；若都没有则用默认值。
  - 提高 learning_intensity 会在热闹场景中更快收集表达；降低则可减少学习频率。
  - use_expression 只影响“使用阶段”，enable_learning 只影响“学习阶段”，可单独开关。

---

### 选项二：expression_groups（表达互通组）

- 作用：把多个聊天流编组为“互通组”。同一组内会在“使用阶段”共享表达库（抽样范围合并），从而让相近场景下的表达可以互相迁移复用。
- 格式：

```toml
[expression]
expression_groups = [
  ["qq:1919810:private", "qq:114514:private", "qq:1111111:group"]
]
```

- 书写规则与注意：
  - 组是“列表的列表”，每个内层列表代表一个互通组。
  - 元素必须带上类型：群聊用 `:group`，私聊用 `:private`。
  - 同一聊天可以只出现在一个互通组中；如同时出现在多个组，实际使用时将以“第一个匹配到的组”为准。
  - 互通只影响“使用阶段”的抽样与权重回写：
    - 学习阶段：数据按实际 `chat_id` 写入。
    - 使用阶段：会合并同组内各 `chat_id` 的表达进行抽样与筛选；激活后权重回写到对应来源 `chat_id`。

---

### 快速对照（来自模板与示例，保持与模板一致）

```toml
[expression]
# 表达学习配置
learning_list = [
    ["", "enable", "enable", 1.0],
    ["qq:1919810:group", "enable", "enable", 1.5],
    ["qq:114514:private", "enable", "disable", 0.5],
]

expression_groups = [
  ["qq:1919810:private", "qq:114514:private", "qq:1111111:group"],
]
```

如需仅启用全局并关闭学习：

```toml
[expression]
learning_list = [["", "enable", "disable", 1.0]]
```

如需完全关闭表达（全局）：

```toml
[expression]
learning_list = [["", "disable", "disable", 1.0]]
```
