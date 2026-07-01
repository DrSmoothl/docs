---
title: How are messages processed?
---# How Messages Are Processed 📨

Have you ever wondered how MaiBot actually processes your messages when you @ it or chat with it? Let's explain the process in simple terms.

## The One-Sentence Version

**You send a message $\rightarrow$ The bot thinks $\rightarrow$ It gives you a reply**

It's that simple! But there are actually many interesting little steps in between.

## Detailed Process (In Plain English)

### 1️⃣ Receiving the Message

When you send a message in a group:
- If you @ the bot, it will definitely see it
- If you don't @ it, it still takes a peek to decide whether it should chime in
- Whether it's text, images, or emojis, it can receive them all

### 2️⃣ Deciding Whether to Respond

The bot first makes a quick judgment:
- Is this spam? (Filtered out if there are blocked words)
- Is this a command? (Such as "!help")
- If it's a command, it processes the command first

### 3️⃣ Entering Thinking Mode

If it's not a command, the bot starts thinking seriously:
- Looks at what you were chatting about previously
- Recalls your personal characteristics
- Considers if now is the right time to interrupt

### 4️⃣ Deciding Whether to Reply

This step is crucial! The bot considers:
- What is the current chat atmosphere?
- Will my speaking disturb you?
- What would be appropriate to say?

Sometimes it will choose to:
- **Reply immediately** - Feels it's time to speak
- **Wait a bit** - Feels the timing isn't right
- **Stay silent** - Decides not to interrupt after all

### 5️⃣ Organizing Language

If it decides to reply, the bot will:
- Think about what tone to use
- Recall the speaking style of your group
- Choose appropriate emojis (if needed)
- Organize a natural response

### 6️⃣ Sending the Reply

Finally, it sends out the thought-out message!

## A Practical Example 🌰

**Scenario**: The group is discussing where to go for the weekend

```
小明：周末想去爬山，有人一起吗？
小红：我想去！不过天气预报说可能下雨
小刚：那要不改去商场？
（这时候你@了MaiBot）
你：@MaiBot 你觉得呢？

[机器人收到消息，开始思考...]

MaiBot：我觉得爬山挺好的啊！不过要看天气，
       如果下雨的话商场确实更稳妥～
       你们可以准备个Plan B，这样更灵活 😊
```

**Bot's Thinking Process**:
1. Received @ message $\rightarrow$ "Someone is asking for my opinion"
2. Check context $\rightarrow$ "They are discussing weekend activities"
3. Check chat atmosphere $\rightarrow$ "Quite relaxed, I can participate"
4. Decide to reply $\rightarrow$ "Give some practical suggestions"
5. Organize language $\rightarrow$ "Use a relaxed tone, add an emoji"
6. Send reply $\rightarrow$ "Done!"

## When Will It Reply to You?

### Situations where it definitely will reply:
- You @ the bot
- You speak to it directly
- It feels your message is directed at it

### Situations where it might reply:
- The group chat is lively and the atmosphere is great
- A topic it's interested in is mentioned
- It feels it has useful information to share

### Situations where it usually won't reply:
- The group is discussing very private matters
- The atmosphere is serious or tense
- It feels it would be inappropriate to interrupt

## How Fast is the Reply Speed?

It depends on the situation:
- **Instant reply**: Sometimes it thinks fast and replies immediately
- **Wait a bit**: Sometimes it needs to think for a while
- **Takes a long time**: Might be busy with other things, or truly thinking deeply

Just like a real person, it has its own "thinking time."

## Why Does It Sometimes Not Reply?

The bot usually doesn't reply because:
1. **Feels it shouldn't speak** - Polite, just like a real person
2. **Still thinking** - Hasn't figured out how to say it yet
3. **Network issues** - Technical reasons (rare)
4. **Set to quiet mode** - Administrators asked it to speak less

## Want to Dive Deeper?

If you are interested in the technical details:
- [See how MaiBot thinks $\rightarrow$](./maisaka-reasoning.md)
- [Learn about its memory system $\rightarrow$](./memory-system.md)
- [See how it learns speaking styles $\rightarrow$](./learning.md)

Remember, MaiBot's goal is not to reply the fastest, but to participate in the conversation most naturally. It wants to be a true chat companion, not a cold auto-reply machine.