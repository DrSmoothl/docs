# Changelog

For dev and detailed changelogs, see [GitHub Releases](https://github.com/MaiM-with-u/MaiBot/releases).

::: timeline 2026-07-28
- [1.1.3] WebUI: optimized sidebar hover behavior, page colors and layout, new storage management page
- Maisaka: fixed Planner native reasoning incorrectly passed as body to Replyer; added typo correction message references
- [1.1.2] WebUI: optimized homepage cards
- [1.1.1] Main program: statistics charts split into customizable cards, fixed memory growth from full model call detail loading
- WebUI: LLM request error classification in reasoning view, global AI search upgraded to draggable multi-turn Agent overlay
- Chat: fixed session teardown on page switch, default nickname "Human", user avatar and emoji support
- Plugin list now layered by load status; homepage version and card layout streamlined
- Maisaka: added `reply.before_post_process` Hook for per-reply text post-processing control
- MCP: process-level shared server connections with hot reload, improved WebUI MCP configuration
:::

::: timeline 2026-07-22
- [1.1.0] Main program: optional interactive terminal input with `/clear`, `/pm`, `/offline`, `/online` commands for chat and adapter management
- A_Memorix: long-term memory lifecycle (decay/freeze/restore/protect/recycle bin), improved retrieval quality and character profiles
- Legacy memory migration fixes: orphaned associations, timeline selection, entity renaming issues
- Maisaka: separated behavior style from persona, fixed cross-day time reminder interrupting tool chains
- WebUI: fixed frequency display precision, QQ number config, model rename, and homepage animation issues
- Plugins: automatic compatibility check after host update, tightened Host version range
:::

::: timeline 2026-07-09
- [1.0.12] Improved Planner-to-Replyer information transfer and reduced duplicate replies
- WebUI: more reliable offline observation records, custom API model lists, multiple model configurations, data import/export, and upgrade announcements
- Initial setup now guides users to replace the temporary startup Token with a persistent Token
- Messaging: the host can control adapter admission; fixed handling of oversized emoji images
:::

::: timeline 2026-06-12
- [1.0.0] **Systematic upgrade!** Maisaka inference engine refactored with Planner-Replyer deep integration
- Thinking effort mechanism: dynamically controls reply time and length
- A-Memorix Memory Engine v1.0: knowledge graphs, character profiles, chat summaries
- Feedback correction system: automatically corrects outdated memories
- MCP built-in plugin; global memory configuration added
- WebUI: Model preset marketplace, comprehensive security hardening, frontend auth refactoring
- For a more complete illustrated explanation, see the [MaiBot 1.0.0 Update Feature](./v1-0-0.md)
:::

::: timeline 2026-01-11
- [0.12.2] Optimized private chat wait logic, force quote reply on timeout
- Fixed disconnection issues with some adapters, optimized memory retrieval logic
:::

::: timeline 2025-12-31
- [0.12.1] Year-end summary feature (WebUI), optional LLM judgment for quote replies
- Expression optimization: automatic and manual evaluation support
- Reply and planning records viewable in WebUI
- Global memory blacklist: exclude specific group chats from global memory
:::

::: timeline 2025-12-21
- [0.12.0] Thinking effort mechanism: dynamic reply time and length control
- Planner and Replyer integration, new private chat system
- MaiMai dreaming feature, MCP plugin as built-in
- Global memory configuration added
:::

## Earlier Versions

For changelog of earlier versions, see [GitHub Releases](https://github.com/Mai-with-u/MaiBot/releases).
