---
title: Changelog
---# Changelog

This page records the major version updates of MaiBot. For the complete changelog, please refer to [GitHub Releases](https://github.com/Mai-with-u/MaiBot/releases).

## v1.0.0

1.0.0 is a systemic upgrade. For more detailed illustrated instructions, please read the [MaiBot 1.0.0 Update Special](./v1-0-0.md).

### Major Updates

- **Maisaka Reasoning Engine Refactor**: Comprehensively upgraded the collaboration mechanism between planning and response generation; Planner and Replyer are now deeply linked.
- **Thinking Intensity Mechanism**: Dynamically controls response time and length to make the response rhythm more natural.
- **A-Memorix Memory Engine v1.0**: A brand new long-term memory system supporting knowledge graphs, character personas, and chat summaries.
- **Feedback Correction System**: Automatically corrects outdated memories based on user feedback to maintain memory timeliness.
- **Built-in MCP Plugins**: Model Context Protocol has been added as a built-in plugin (disabled by default).
- **Global Memory**: Added global memory configuration, allowing memory retrieval across different sessions.

### WebUI Major Updates

- **Model Preset Market**: Full model configurations can now be shared; the share button is located in the top right corner of the model configuration interface.
- **Comprehensive Security Hardening**: Identity authentication protection added to all WebUI APIs and WebSocket endpoints; Secure and SameSite attributes added to Cookies.
- **Frontend Authentication Refactor**: Migrated from localStorage to HttpOnly Cookies; added a temporary token authentication mechanism for WebSockets.
- **Enhanced Plugin Configuration Management**: Supports loading and saving of raw TOML configurations; the frontend now supports viewing and editing plugin configuration source files.

### Detailed Feature Updates

- Removed automatic frequency adjustment.
- Removed emotion functionality.
- Optimized memory retrieval timeout settings.
- Ability to actively select the branch to clone during plugin installation.
- Feedback questionnaire on the homepage for submitting feedback and suggestions.
- Jargon and expression extraction no longer includes content containing names.
- Model interface now supports editing `extra params` additional fields.
- Model task allocation now supports editing the slow request detection threshold.
- Model interface now supports specifying individual temperature and `max_tokens` parameters for single models.

## v0.12.2

- Optimized private chat wait logic.
- Forced quoted replies upon timeout.
- Fixed disconnection issues for some adapters.
- Fixed issue where expression reflection configuration was not taking effect.
- Optimized memory retrieval logic.

## v0.12.1

### 🌟 Main Updates

- Added Annual Summary feature, viewable in the WebUI.
- Optional LLM determination for quoted replies.
- Expression optimization: Supports automatic and manual evaluation for higher precision.
- Response and Planning logs: WebUI can now view details for every response and plan.

### Detailed Feature Changes

- Optimized display of messages with long intervals.
- Enabled jargon detection (`enable_jargon_detection`).
- Global memory blacklist (`global_memory_blacklist`): Specify certain group chats to be excluded from global memory.
- Removed `utils_small` model and deprecated LPMM models.

## v0.12.0

### 🌟 Major Updates

- Added Thinking Intensity mechanism to dynamically control response time and length.
- Linked Planner and Replyer for better response logic.
- New private chat system.
- Added "Mai's Dreaming" feature.
- MCP plugins added as built-in plugins.
- Added global memory configuration.

## Earlier Versions

For changelogs of earlier versions, please refer to [GitHub Releases](https://github.com/Mai-with-u/MaiBot/releases) or the `changelogs/` directory in the project repository.