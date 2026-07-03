---
title: Changelog
---# Changelog

This page records the major version updates of MaiBot. For the complete changelog, please refer to [GitHub Releases](https://github.com/Mai-with-u/MaiBot/releases).

## v1.0.0

1.0.0 is a systematic upgrade. For a more complete illustrated explanation, you can read the [MaiBot 1.0.0 Update Feature](./v1-0-0.md).

### Major Updates

- **Maisaka Inference Engine Refactoring**: Comprehensively upgraded the collaboration mechanism between planning and reply generation, Planner and Replyer now achieve deep integration
- **Thinking Effort Mechanism**: Dynamically controls reply time and length, making the reply rhythm more natural
- **A-Memorix Memory Engine v1.0**: Brand new long-term memory system, supporting knowledge graphs, character profiles, and chat summaries
- **Feedback Correction System**: Automatically corrects outdated memories based on user feedback, maintaining memory timeliness
- **MCP Built-in Plugin**: Model Context Protocol added as a built-in plugin, disabled by default
- **Global Memory**: Added global memory configuration, allowing memory retrieval across sessions

### WebUI Major Updates

- **Model Preset Marketplace**: Model configurations can be fully shared, the share button is located in the upper right corner of the model configuration interface
- **Comprehensive Security Hardening**: Authentication protection added to all WebUI API and WebSocket endpoints, Cookie Secure and SameSite attributes added
- **Frontend Authentication Refactoring**: Migrated from localStorage to HttpOnly Cookie, added a WebSocket temporary token authentication mechanism
- **Enhanced Plugin Configuration Management**: Supports loading and saving raw TOML configurations, frontend supports viewing and editing plugin configuration source files

### Feature Detail Updates

- Removed frequency auto-adjustment
- Removed emotion feature
- Optimized memory retrieval timeout settings
- Active selection of the cloned branch during plugin installation
- Homepage feedback questionnaire feature, allowing submission of feedback and suggestions
- Slang and expressions no longer extract content containing names
- Model interface supports editing extra params fields
- Model task assignment supports editing slow request detection thresholds
- Model interface supports specifying temperature and max_tokens parameters for individual models

## v0.12.2

- Optimized private chat wait logic
- Force quote reply on timeout
- Fixed disconnection issues with some adapters
- Fixed expression reflection configuration not taking effect
- Optimized memory retrieval logic

## v0.12.1

### 🌟 Major Updates

- Added year-end summary feature, viewable in WebUI
- Optional LLM judgment for quote replies
- Expression optimization: supports automatic and manual evaluation, making it more precise
- Reply and planning records: WebUI can view the details of each reply and plan

### Feature Detail Changes

- Optimized display of messages with long intervals
- Enabled jargon detection (enable_jargon_detection)
- Global memory blacklist (global_memory_blacklist), specifying certain group chats to not participate in global memory
- Removed utils_small model, removed deprecated LPMM model

## v0.12.0

### 🌟 Major Updates

- Added thinking effort mechanism, dynamically controlling reply time and length
- Planner and Replyer integration, better reply logic
- New private chat system
- Added MaiMai dreaming feature
- MCP plugin added as a built-in plugin
- Added global memory configuration

## Earlier Versions

For the changelog of earlier versions, please refer to [GitHub Releases](https://github.com/Mai-with-u/MaiBot/releases) or the `changelogs/` directory in the project repository.