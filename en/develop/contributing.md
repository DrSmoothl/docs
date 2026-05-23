---
title: Contributing Guide
---

# Contributing Guide

Welcome to participate in MaiBot development! Please read the following specifications carefully before submitting code.

## Import Specifications

1. Standard library and third-party libraries use `from ... import ...` form first, `import ...` form second; same group arranged alphabetically
2. Local modules: same directory uses relative import, cross-directory uses `from src.xxx` absolute import
3. Standard library/third-party library imports placed before local module imports, separated by blank lines between blocks
4. Adjust import order that doesn't meet specifications during refactoring

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

## Comment Specifications

1. Maintain good comments; retain original comments during refactoring (content can be modified)
2. When refactoring code without comments, add comments for longer or complex functional blocks
3. Preferred language is Simplified Chinese (comments, logs, WebUI copy)

## Type Annotation Specifications

1. Retain original type annotations during refactoring; add annotations for functions without annotations or complex functions/multiple parameters
2. Parameterized generics use `typing` module (such as `Dict`, `List`, `Optional`)
3. No need to use `or` fallback after variable type is determined

```python
# Recommended
def process_message(message: SessionMessage, timeout: float = 5.0) -> bool:
    ...

# Not recommended
def process_message(message, timeout=5.0):
    ...
```

## Anti-pattern List

The following behaviors are **strictly prohibited** in the project:

- **Modify any content under `dashboard/`** — Frontend built by independent repository
- **Directly edit `bot_config.toml` / `model_config.toml`** — Should modify template + version number
- **Type suppression like `as any`, `@ts-ignore`** — Must properly handle types
- **Empty catch block `catch(e) {}`** — At least log the error
- **Delete failing tests to "pass"** — Must fix the problem itself
- **Hard-coded API key / password / token** — Use configuration system management
- **`eval()` / `exec()` / `__import__`** — Security risks exist

## Variable and Attribute Specifications

- No need for `or` fallback after type is determined
- Reduce `getattr`/`setattr`, prefer direct attribute access

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

### Code Checking

```bash
# Lint
uv run ruff check .

# Auto format
uv run ruff format .
```

## PR Process

1. Fork the repository and create a feature branch from the `dev` branch
2. Ensure code passes `uv run ruff check .` and `uv run pytest`
3. Submit PR to the `dev` branch with clear modification description
4. Wait for code review and merge

### Notes

- WebUI defaults to binding `0.0.0.0:8001`, production environment needs reverse proxy
- Tokens stored in `data/webui.json` (plain text JSON), rely on file system permissions protection
- Rate limiter is memory-based, cannot share state in multi-instance deployment
- Plugin installation executed through `git clone`, need to ensure Git security configuration
- `model_config.toml` contains sensitive fields like `api_key` (`repr=False`)
