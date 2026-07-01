---
title: Feature Introduction
---# Feature Introduction

MaiBot (MaiMai) is more than just a chatbot—she is a digital life dedicated to interacting in a true human style. Below are her core capabilities.

<div class="feature-cards">

<div class="feature-card">

### 💬 Intelligent Dialogue Pipeline

A complete processing pipeline from message reception to final response, supporting Hook interception, command dispatching, filter checks, and flexible routing.

[Learn about Message Pipeline $\rightarrow$](../manual/features/message-pipeline.md)

</div>

<div class="feature-card">

### 🧠 Maisaka Reasoning Engine

A multi-turn internal reasoning system based on tool calling. With Planner decision-making, Timing Gate rhythm control, and automatic interruption and retry, the conversation flow remains natural and smooth.

[Learn about Maisaka $\rightarrow$](../manual/features/maisaka-reasoning.md)

</div>

<div class="feature-card">

### ❤️ Long-term Memory System

The A-Memorix memory engine provides knowledge graphs, conversation summaries, and persona profiles. An automatic write-back mechanism allows MaiMai to continuously accumulate knowledge about you.

[Learn about Memory System $\rightarrow$](../manual/features/memory-system.md)

</div>

<div class="feature-card">

### 📖 Expression & Slang Learning

Automatically extract expression styles and community slang from conversations. The system uses LLMs to infer meanings and refine them over time, making MaiMai feel more like someone close to you.

[Learn about Learning System $\rightarrow$](../manual/features/learning.md)

</div>

<div class="feature-card">

### 😊 Sticker System

Based on VLM for automatic sticker recognition, emotion tag generation, and intelligent selection, making conversations more vivid.

[Learn about Sticker System $\rightarrow$](../manual/features/emoji-system.md)

</div>

<div class="feature-card">

### 🔌 MCP Integration

Supports Model Context Protocol to connect to external tool servers, infinitely expanding the boundaries of MaiMai's capabilities.

[Learn about MCP $\rightarrow$](../manual/features/mcp.md)

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
