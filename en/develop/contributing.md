---
title: Contributing Guide
---# Contribution Guidelines

Welcome to MaiBot development! Please read the following guidelines carefully before submitting code.

## Import Guidelines

1. Standard library and third-party libraries use the `from ... import ...` format first, followed by the `import ...` format; within the same group, sort alphabetically
2. Local modules: use relative imports within the same directory, and `from src.xxx` absolute imports across directories
3. Standard library / third-party library imports are placed before local module imports, separated by blank lines between blocks
4. Adjust non-compliant import order when refactoring

```python
# Standard library
import asyncio
import os
from pathlib import Path

# Third-party libraries
from fastapi import FastAPI
from pydantic import BaseModel

# Local modules
from src.common.logger import get_logger
from src.config.config import config_manager
```

## Comment Guidelines

1. Maintain good comments; preserve original comments when refactoring (content may be modified)
2. When refactoring code without comments, add comments to longer or complex functional blocks
3. The preferred language is Simplified Chinese (comments, logs, WebUI copy)

## Type Annotation Guidelines

1. Preserve original type annotations when refactoring; add annotations to complex functions / multi-parameter functions that lack them
2. Parameterized generics use Python 3.10+ built-in syntax (e.g., `dict[K, V]`, `list[T]`, `T | None`), avoid using legacy typing module syntax
3. Once the variable type is determined, no need to use `or` fallback

```python
# Recommended
def process_message(message: SessionMessage, timeout: float = 5.0) -> bool:
    ...

# Not recommended
def process_message(message, timeout=5.0):
    ...
```

## Anti-Pattern List

The following behaviors are **strictly prohibited** in the project:

- **Modifying anything under `dashboard/`** — the frontend is built from a separate repository
- **Directly editing `bot_config.toml` / `model_config.toml`** — should modify templates + version numbers
- **Empty catch blocks `catch(e) {}`** — at least log the exception
- **Deleting failing tests to "pass"** — the underlying issue must be fixed
- **Hardcoding API keys / passwords / tokens** — use the configuration system to manage them
- **`eval()` / `exec()` / `__import__`** — pose security risks

## Variable and Attribute Guidelines

- Once the type is determined, no need for `or` fallback
- Minimize `getattr`/`setattr`, prefer direct attribute access

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

# Auto format
uv run ruff format .
```

## PR Process

1. Fork the repository and create a feature branch from `dev`
2. Ensure the code passes `uv run ruff check .` and `uv run pytest`
3. Submit a PR to the `dev` branch, with a clear description of the changes
4. Wait for code review and merge

### Notes

- WebUI binds to `127.0.0.1:8001` by default, a reverse proxy is required for production
- Tokens are stored in `data/webui.json` (plain text JSON), relying on file system permissions for protection
- The rate limiter is in-memory and cannot share state in multi-instance deployments
- Plugin installation is executed via `git clone`, ensure Git security configuration
- `model_config.toml` contains sensitive fields like `api_key` (`repr=False`)