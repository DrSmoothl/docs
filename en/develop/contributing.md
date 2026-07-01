---
title: Contribution Guide
---# Contribution Guide

Welcome to the development of MaiBot! Please read the following specifications carefully before submitting code.

## Import Specifications

1. Standard libraries and third-party libraries should use the `from ... import ...` form first, followed by the `import ...` form; items within the same group should be sorted alphabetically
2. Local modules: Use relative imports for the same directory and `from src.xxx` absolute imports for cross-directory imports
3. Standard library/third-party library imports should be placed before local module imports, with empty lines separating the blocks
4. Adjust import orders that do not comply with the specifications during refactoring

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

## Commenting Specifications

1. Maintain good comments; preserve original comments during refactoring (content may be modified)
2. When refactoring code that previously had no comments, comments should be added for long or complex functional blocks
3. The preferred language is Simplified Chinese (for comments, logs, and WebUI copy)

## Type Annotation Specifications

1. Preserve original type annotations during refactoring; add annotations for complex functions or functions with multiple parameters that lack them
2. Use Python 3.10+ built-in syntax for parameterized generics (e.g., `dict[K, V]`, `list[T]`, `T | None`), avoiding old-style `typing` module syntax
3. Once a variable type is determined, there is no need to use `or` fallback

```python
# 推荐
def process_message(message: SessionMessage, timeout: float = 5.0) -> bool:
    ...

# 不推荐
def process_message(message, timeout=5.0):
    ...
```

## Anti-Pattern List

The following behaviors are **strictly prohibited** in the project:

- **Modifying any content under `dashboard/`** — The frontend is built from a separate repository
- **Directly editing `bot_config.toml` / `model_config.toml`** — Templates and version numbers should be modified instead
- **Empty catch blocks `catch(e) {}`** — At least log the error
- **Deleting failing tests to "pass"** — The issue itself must be fixed
- **Hardcoding API keys / passwords / tokens** — Use the configuration system for management
- **`eval()` / `exec()` / `__import__`** — These pose security risks

## Variable and Property Specifications

- Once the type is determined, `or` fallback is not necessary
- Reduce the use of `getattr`/`setattr`; prioritize direct property access

## Development Commands

### Install Dependencies

```bash
uv sync
```

### Run Project

```bash
uv run python bot.py
```

### Run Tests

```bash
uv run pytest
```

### Code Linting

```bash
# Lint
uv run ruff check .

# 自动格式化
uv run ruff format .
```

## PR Process

1. Fork the repository and create a feature branch from the `dev` branch
2. Ensure the code passes `uv run ruff check .` and `uv run pytest`
3. Submit a PR to the `dev` branch, accompanied by clear modification notes
4. Wait for code review and merging

### Notes

- WebUI binds to `127.0.0.1:8001` by default; a reverse proxy is required for production environments
- Tokens are stored in `data/webui.json` (plain text JSON), relying on file system permission protection
- The rate limiter is memory-based and cannot share state across multiple instance deployments
- Plugin installation is executed via `git clone`; ensure Git security configurations are in place
- `model_config.toml` contains sensitive fields such as `api_key` (`repr=False`)