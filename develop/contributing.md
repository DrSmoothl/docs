---
title: 贡献指南
---

# 贡献指南

欢迎参与 MaiBot 开发！在提交代码之前，请仔细阅读以下规范。

## 导入规范

1. 标准库和第三方库使用 `from ... import ...` 形式在前，`import ...` 形式在后；同组按字母序排列
2. 本地模块：同目录使用相对导入，跨目录使用 `from src.xxx` 绝对导入
3. 标准库/第三方库导入放在本地模块导入之前，块间用空行分隔
4. 重构时调整不符合规范的导入顺序

```python
# 标准库
import asyncio
import os
from pathlib import Path

# 第三方库
from fastapi import FastAPI
from pydantic import BaseModel

# 本地模块
from src.common.logger import get_logger
from src.config.config import config_manager
```

## 注释规范

1. 保持良好注释；重构时保留原注释（可修改内容）
2. 原无注释的重构时，较长或复杂功能块应添加注释
3. 首选语言为简体中文（注释、日志、WebUI 文案）

## 类型注解规范

1. 重构时保留原类型注解；无注解的复杂函数/多参数函数应添加
2. 参数化泛型使用 `typing` 模块（如 `Dict`、`List`、`Optional`）
3. 变量类型确定后不必使用 `or` 回退

```python
# 推荐
def process_message(message: SessionMessage, timeout: float = 5.0) -> bool:
    ...

# 不推荐
def process_message(message, timeout=5.0):
    ...
```

## 反模式列表

以下行为在项目中**严格禁止**：

| 反模式 | 说明 |
|--------|------|
| 修改 `dashboard/` 下任何内容 | 前端由独立仓库构建 |
| 直接编辑 `bot_config.toml` / `model_config.toml` | 应修改模版 + 版本号 |
| 空 catch 块 `catch(e) {}` | 至少记录日志 |
| 删除失败测试来"通过" | 必须修复问题本身 |
| 硬编码 API key / 密码 / token | 使用配置系统管理 |
| `eval()` / `exec()` / `__import__` | 存在安全风险 |

## 变量与属性规范

- 确定类型后不必 `or` fallback
- 减少 `getattr`/`setattr`，优先直接属性访问

## 开发命令

### 安装依赖

```bash
uv sync
```

### 运行项目

```bash
uv run python bot.py
```

### 运行测试

```bash
uv run pytest
```

### 代码检查

```bash
# Lint
uv run ruff check .

# 自动格式化
uv run ruff format .
```

## PR 流程

1. Fork 仓库并从 `dev` 分支创建功能分支
2. 确保代码通过 `uv run ruff check .` 和 `uv run pytest`
3. 提交 PR 到 `dev` 分支，附上清晰的修改说明
4. 等待代码审查与合并

### 注意事项

- WebUI 默认绑定 `127.0.0.1:8001`，生产环境需反向代理
- Token 存储在 `data/webui.json`（明文 JSON），依赖文件系统权限保护
- 限流器为内存型，多实例部署时无法共享状态
- 插件安装通过 `git clone` 执行，需确保 Git 安全配置
- `model_config.toml` 中包含 `api_key` 等敏感字段（`repr=False`）
