# 表情包系统（Emoji System）

---

## 功能概述

- 在聊天中自动收集表情包，理解，并在合适的时候发送
- 后台表情包管理器会定期扫描 `data/emoji` 文件夹、自动分析与注册表情包。
- 依赖视觉模型生成描述与情感标签，可选开启内容审核（`content_filtration`）。
- 适配 WebUI：在 WebUI → 表情包页面可检索、查看明细、手动注册/删除表情包。

---

## 配置入口

- 文件：`config/bot_config.toml`
- 区块：`[emoji]`

```toml
[emoji]
emoji_chance = 0.4        # Planner 触发表情动作的基础概率
max_reg_num = 100         # 允许注册的最大表情数量
do_replace = true         # 达到上限时是否替换旧表情
check_interval = 10       # 扫描/清理/注册的轮询周期（分钟）
steal_emoji = true        # 允许自动“偷取”新表情（从 data/emoji 目录注册）
content_filtration = false
filtration_prompt = "符合公序良俗"
```

---

## 关键选项说明

- **emoji_chance**：基础触发概率，决定发送Emoji的频率。
- **max_reg_num + do_replace**：
  - 达到上限时，若 `do_replace=true`，管理器会根据使用次数、时间等策略替换最旧/最少用的表情；
  - 若为 `false`，超出后将停止自动注册，除非你手动删除旧表情。
- **check_interval**：扫描周期（分钟）。每个周期会执行：
  1. 校验数据库与磁盘中文件是否完整，剔除损坏项；
  2. 清理 `data/emoji`、`data/image` 临时目录；
  3. 若 `steal_emoji=true`，尝试从 `data/emoji` 目录取出新的图片并注册。
- **steal_emoji**：打开后，麦麦会把聊天中收到/由插件保存到 `data/emoji` 的图片“据为己有”，自动生成描述、情绪标签并入库；关闭则仅保留手动或 API 注册方式。
- **content_filtration / filtration_prompt**：
  - 先由 VLM 生成描述，再根据 `filtration_prompt` 进行一次审核；
  - 返回“否”会直接丢弃该表情并删除源文件——适合企业或公域场景。

---

## 使用建议

- **批量导入**：将图片放到 `data/emoji` 后等待一个轮询周期即可自动注册；日志中会显示注册结果。
- **容量管理**：结合 `max_reg_num` 与 `do_replace` 控制收藏策略；想保留手动精选的收藏，可以调低 `emoji_chance` 并关闭 `steal_emoji`。
- **质量控制**：如需强审核，开启 `content_filtration` 并根据需求修改 `filtration_prompt`，例如 “符合公司信息安全规范，不包含真人照片”。
- **监控**：可通过 WebUI 查看表情包用量、注册时间、是否被封禁；也可以调用 `/emoji/stats` API 获取统计报表。
