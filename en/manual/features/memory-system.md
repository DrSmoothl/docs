---
title: How MaiBot Remembers You
---

# How MaiBot Remembers You 🧠

Have you noticed that the more you chat with MaiBot, the better it understands you? It's not an illusion! When long-term memory is enabled, MaiBot can save important conversations, person facts, and chat summaries according to your configuration, making future replies better match your shared context.

## Just Like Human Memory

### 📝 What does it remember?

**Basic information about you**
- Your name, nickname
- What you like and dislike
- Your speaking style
- Which groups you're active in

**Your chat history**
- Important things you've discussed
- Questions you've asked
- Feedback you've given
- Interesting things you've experienced together

**Your habits and preferences**
- Topics you like
- When you're usually active
- Words you like to use
- What you're sensitive about

### 🎯 How does it remember?

**Automatic memory**
When the corresponding switches are enabled, MaiBot can:
- Extract stable person facts after sending replies
- Summarize chats by message windows
- Update profiles for relevant people
- Store important content in long-term memory

**Smart organization**
It doesn't remember everything — it:
- Filters valuable information
- Merges similar content
- Regularly organizes and summarizes

**Continuous updates**
As your preferences change, it changes too:
- Old, inaccurate information gets updated
- New important information gets added
- It adjusts its understanding of you based on new situations

::: tip
The memory system does not unconditionally remember every message. Memory query, profile injection, person fact writeback, chat summary writeback, and feedback correction are controlled by `[a_memorix.integration]`.
:::

## Building a "Profile" for Everyone 👤

### What is a profile?

Just like real people "label" others, MaiBot builds a "profile" for each person:

```
User: Xiao Ming
├─ Basic Info
│  ├─ Nickname: Mingming, Gege
│  ├─ Active Time: 8-11 PM
│  └─ Active Groups: Gaming, Classmates
├─ Personality
│  ├─ Speaking Style: Humorous, likes jokes
│  ├─ Interests: Games, anime, tech
│  └─ Response Pattern: Optimistic
├─ Chat Preferences
│  ├─ Likes: Game guides, new tech
│  └─ Dislikes: Too serious topics
│  └─ Common Expressions: "haha", "nice", "okay"
└─ Important Memories
   ├─ Helped him with a gaming problem last time
   ├─ He doesn't like being called "bad"
   └─ He's learning programming recently
```

### What is the profile used for?

**Better replies that understand you**
- Knows your preferred style, uses that style to reply
- Understands your knowledge level, explains in ways you can understand
- Remembers your preferences, gives suggestions that suit you better

**More natural conversations**
- Won't repeatedly ask things you've already mentioned
- Can continue topics you discussed before
- Communication style becomes more like your friend

**More attentive service**
- Knows what help you need
- Proactively provides information when you need it
- Communicates in the way you're most comfortable with

## Types of Memory

### 🧠 Long-term Memory
Like human long-term memory, it remembers:
- Your basic characteristics (relatively stable)
- Important conversations you've had
- Your core preferences

These memories are stored for a long time and won't be lost even after restart.

### 💭 Short-term Memory
Like human working memory, it remembers:
- The context of current conversations
- What you just discussed
- Temporary important information

These memories help it keep up with the current conversation.

### 📊 Conversation Summary
Regularly organizes your chat records into summaries:
- What you discussed during this time
- Any important events that happened
- Any changes in your status

## How Does Memory Work?

### 1️⃣ Collecting Information
During each chat:
- Listens to what you say
- Observes your reactions
- Records important details

### 2️⃣ Extracting Key Points
After writeback conditions are met:
- Extracts key information
- Identifies important changes
- Updates related memories

### 3️⃣ Organizing and Storing
Regular organization:
- Merges similar information
- Removes outdated content
- Reinforces important memories

### 4️⃣ Retrieving and Using
When needed:
- Quickly finds relevant memories
- Combines with current situation
- Gives personalized responses

## Privacy and Security 🔒

### Your data is safe
- Memory data is stored in the local data directory by default
- WebUI can view and manage long-term memory
- Summaries, profiles, correction, and vectorization may call the model services you configured

### You have control
- Can view what it remembers
- Can delete content you don't want remembered
- Can adjust retention behavior with memory evolution, reinforcement, freezing, and protection

### Transparency
- You can view long-term memory, person profiles, and sources in WebUI
- You can disable memory query, profile injection, or automatic writeback
- You can view and manage anytime

## Effects of Memory

### 🌟 Understanding you better over time
At the start: "Hello, I'm MaiBot"
After chatting: "Hey, got time to come online today? How's the game going?"

### 🎯 Getting more attentive
At the start: Gives generic suggestions
After chatting: "Based on what you mentioned last time, I think this is better for you"

### 🤝 Becoming more natural
At the start: Like a customer service robot
After chatting: Like a real friend

## Want to View and Manage Memories?

Through WebUI you can:
- View what it remembers about you
- Correct inaccurate person profiles or graph relations
- Delete content you don't want to keep
- Import data, manage recycle bins, and tune retrieval quality

[Go to WebUI Memory Management page →](../webui/memory-management.md)

---

MaiBot's memory system lets it build a more stable understanding across long-term conversations. You can always control what it can read and write through configuration and WebUI.
