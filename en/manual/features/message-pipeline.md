---
title: How are messages processed?
---# How Messages are Processed 📨

Have you ever wondered how MaiBot processes your message when you @ it or chat with it? Let's explain this process in simple terms.

## The One-Sentence Version

**You send a message → The bot thinks → It replies to you**

It's that simple! But there are actually quite a few interesting little steps in between.

## Detailed Process (In Plain English)

### 1️⃣ Receiving the Message

When you send a message in a group:
- If you @ the bot, it will definitely see it
- If you don't @ it, it will still take a peek and consider whether to chime in
- Whether it's text, images, or stickers, it can receive them all

### 2️⃣ Deciding Whether to Pay Attention

The bot will first make a quick judgment:
- Is this spam? (Filtered out if it contains blocked words)
- Is this a command? (Like "!help")
- If it's a command, process the command first

### 3️⃣ Entering Thinking Mode

If it's not a command, the bot starts thinking seriously:
- Look at what you were just talking about
- Recall your personal characteristics
- Consider if it's the right time to chime in

### 4️⃣ Deciding Whether to Reply

This step is crucial! The bot will consider:
- How is the current chat atmosphere?
- Will my speaking interrupt you guys?
- What would be appropriate for me to say?

Sometimes it will choose to:
- **Reply immediately** - Feels it's time to speak
- **Wait a bit** - Feels the timing isn't right
- **Stay silent** - Decides not to interrupt after all

### 5️⃣ Organizing the Language

If it decides to reply, the bot will:
- Think about what tone to use
- Recall the speaking style of your group
- Choose appropriate stickers (if needed)
- Compose a natural reply

### 6️⃣ Sending the Reply

Finally, it sends out the message it has prepared!

## A Practical Example 🌰

**Scenario**: The group is discussing where to go for the weekend

```
Xiao Ming: I want to go hiking this weekend, anyone want to join?
Xiao Hong: I want to go! But the weather forecast says it might rain
Xiao Gang: How about going to the mall instead?
(At this point you @ MaiBot)
You: @MaiBot What do you think?

[The bot receives the message and starts thinking...]

MaiBot: I think hiking is great! But we need to check the weather,
       if it rains, the mall is indeed a safer choice~
       You guys can prepare a Plan B, that's more flexible 😊
```

**The Bot's Thinking Process**:
1. Received @ message → "Someone is asking for my opinion"
2. Checked the context → "They are discussing weekend activities"
3. Checked the chat atmosphere → "Pretty relaxed, okay to join in"
4. Decided to reply → "Give some practical advice"
5. Organized the language → "Use a relaxed tone, add an emoji"
6. Sent the reply → "Done!"

## When Will It Reply to You?

### Situations where it will definitely reply:
- You @'d the bot
- You spoke directly to it
- It feels your message is directed at it

### Situations where it might reply:
- The group chat is booming and the atmosphere is great
- A topic it's interested in comes up
- It feels it has useful information to share

### Situations where it usually won't reply:
- The group is discussing very private matters
- The atmosphere is relatively serious or tense
- It feels it's not appropriate to interrupt

## How Fast Does It Reply?

This depends on the situation:
- **Instant reply**: Sometimes it thinks fast and replies immediately
- **Wait a bit**: Sometimes it needs to think for a while
- **Takes a long time to reply**: It might be busy with something else, or is genuinely thinking hard

Just like a real person, it has its own "thinking time."

## Why Doesn't It Reply Sometimes?

The bot usually doesn't reply because:
1. **Feels it shouldn't speak** - Polite, like a real person
2. **Still thinking** - Hasn't figured out what to say yet
3. **Network issues** - Technical reasons (rare)
4. **Set to quiet mode** - The admin told it to talk less

## Want to Learn More?

If you're interested in the technical details:
- [See how MaiBot thinks →](./maisaka-reasoning.md)
- [Learn about its memory system →](./memory-system.md)
- [See how it learns speaking styles →](./learning.md)

Remember, MaiBot's goal is not to reply the fastest, but to participate in conversations most naturally. It wants to be a real chat partner, not a cold auto-reply machine.