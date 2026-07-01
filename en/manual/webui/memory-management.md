---
title: Viewing and Managing Memory
---# Viewing and Managing Memories

MaiBot remembers chat content, much like human memory. You can view and manage these memories within the WebUI.

## What are Memories?

Imagine MaiBot has a "brain" that records:

- 💬 **What was discussed** - Conversation content, important information
- 👥 **Who it knows** - User personalities, preferences
- 🔗 **Knowledge Graph** - Relationships between entities
- 📚 **Learning Materials** - Knowledge you have taught it

## Viewing Memories

### Memory Overview
Open the "Memory Management" page to see:
- Total amount of stored information
- Recently remembered items
- Memory category statistics

### Searching Memories
Looking for specific content? Use the search function:
- Enter keywords, such as "games" or "food"
- Filter by time to view memories from a specific period
- Filter by user to view chat memories with a specific person

### Knowledge Graph
Similar to a mind map, this displays relationships between concepts:
- Each circle represents a concept (e.g., "Genshin Impact")
- Lines represent relationships (e.g., "Genshin Impact - Game")
- Click a circle to view detailed information

## Managing Memories

### Adding Memories
You can manually teach MaiBot new knowledge:
1. Click "Import Memory"
2. Paste text or upload a file
3. Select the processing method
4. Start importing

### Correcting Memories
When you find that a persona or relationship is inaccurate, you can correct it through the corresponding management entry:
1. Set or delete manual overrides in the User Persona
2. Adjust nodes, relationships, or weights in the Knowledge Graph
3. Use feedback correction, delete/restore, or re-import to handle outdated content

Currently, there is no arbitrary text editing entry for general paragraph body text; if a correction is needed, it is recommended to delete the erroneous source and re-import, or handle it via the feedback correction mechanism.

### Deleting Memories
Don't want to remember certain things?
- Single deletion: Find the memory and click "Delete"
- Batch deletion: Select multiple items and delete them together
- Delete by source: Delete all memories from a specific group chat

⚠️ **Note**: Deleted items go to the Recycle Bin and can still be restored

## User Personas

MaiBot creates a "persona" for every user:
- Personality traits (cheerful, introverted, etc.)
- Interests and hobbies (games, anime, etc.)
- Chatting habits (fondness for emojis, speaking style, etc.)

You can:
- View your own persona
- Modify inaccurate descriptions
- Add notes for friends

## Advanced Features

### Memory Reinforcement
Make certain memories more important:
- Select important memories
- Click "Reinforce Memory"
- These memories will be less likely to be forgotten

### Permanent Memory
Particularly important content can be set as permanent:
- Select "Permanent Memory"
- This content will never be automatically cleaned up

### Memory Tuning
If MaiBot's memory is poor, you can:
- Adjust memory parameters
- Reprocess memories
- Optimize retrieval effects

### Runtime Maintenance
The WebUI also provides O&M entries such as runtime self-checks, auto-save switches, vector reconstruction, paragraph vector backfilling, import tasks, and deletion operation logs.

## Usage Suggestions

### Daily Maintenance
- Regularly review memories and delete useless content
- Correct errors promptly
- Manually reinforce important information

### Improving Performance
- Teach the bot professional knowledge to make it smarter
- Refine user personas to make conversations more thoughtful
- Set memory capacity reasonably to balance performance and effect

## FAQ

**Q: How long are memories saved?**
A: By default, they are saved long-term. Memory evolution causes the weights of old relationships to decay gradually, and low-weight content may be marked for pruning; specific behavior is controlled by the A_Memorix memory evolution configuration.

**Q: Do memories take up much space?**
A: Text memories occupy very little space; feel free to use them.

**Q: Can memories be exported?**
A: Currently, only the export of memory tuning configurations is supported; full memory export is not yet supported.

**Q: Will memories leak privacy?**
A: Memory data is stored in the local directory by default. When generating summaries, personas, corrections, or vectors, your configured model service may be called. Please confirm data boundaries based on your deployment method and model provider.