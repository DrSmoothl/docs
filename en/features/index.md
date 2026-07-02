---
title: Feature Introduction
---# Features

MaiBot (MaiMai) is more than just a chatbot—she is a digital lifeform dedicated to interacting in an authentic human style. Here are her core capabilities.

<div class="feature-cards">

<div class="feature-card">

### 💬 Intelligent Message Pipeline

A complete processing pipeline from message reception to final reply, supporting Hook interception, command dispatch, filter checks, and flexible routing.

[Learn about the message pipeline →](../manual/features/message-pipeline.md)

</div>

<div class="feature-card">

### 🧠 Maisaka Reasoning Engine

A multi-turn internal reasoning system based on tool calls. Planner decision-making, Timing Gate rhythm control, automatic interruption and retry make the conversation flow naturally.

[Learn about Maisaka →](../manual/features/maisaka-reasoning.md)

</div>

<div class="feature-card">

### ❤️ Long-Term Memory System

The A-Memorix memory engine provides knowledge graphs, conversation summaries, and persona profiles. The automatic write-back mechanism allows MaiMai to continuously accumulate her understanding of you.

[Learn about the memory system →](../manual/features/memory-system.md)

</div>

<div class="feature-card">

### 📖 Expression and Slang Learning

Automatically extracts expression styles and group slang from conversations, infers meanings through LLM and gradually refines them, making MaiMai increasingly feel like someone right beside you.

[Learn about the learning system →](../manual/features/learning.md)

</div>

<div class="feature-card">

### 😊 Emoji System

VLM-based automatic emoji recognition, emotion tag generation, and intelligent selection make conversations more vivid.

[Learn about the emoji system →](../manual/features/emoji-system.md)

</div>

<div class="feature-card">

### 🔌 MCP Integration

Supports Model Context Protocol to connect to external tool servers, infinitely expanding MaiMai's capability boundaries.

[Learn about MCP →](../manual/features/mcp.md)

</div>

</div>

<style>
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
}
.feature-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.feature-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 12px var(--vp-c-brand-soft);
}
.feature-card h3 {
  margin-top: 0;
  font-size: 1.1em;
}
.feature-card a {
  font-size: 0.9em;
}
</style>
