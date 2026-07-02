---
title: View and Manage Memory
---# Viewing and Managing Memories

MaiBot remembers chat content, just like human memory. You can view and manage these memories in the WebUI.

## What is Memory?

Imagine MaiBot has a "brain" that records:

- 💬 **What was chatted about** - Conversation content, important information
- 👥 **Who it knows** - Users' personalities, preferences
- 🔗 **Knowledge Graph** - Relationships between things
- 📚 **Learning Materials** - Knowledge you taught it

## Viewing Memories

### Memory Overview
Open the "Memory Management" page to see:
- Total number of memories stored
- Recently remembered items
- Memory category statistics

### Searching Memories
Looking for specific content? Use the search function:
- Enter keywords, such as "games", "food"
- Filter by time to view memories from a specific period
- Filter by user to view chat memories with someone

### Knowledge Graph
Like a mind map, it shows the relationships between concepts:
- Each circle is a concept (e.g., "Genshin Impact")
- Lines represent relationships (e.g., "Genshin Impact - Game")
- Click a circle to see details

## Managing Memories

### Adding Memories
You can manually teach MaiBot new knowledge:
1. Click "Import Memory"
2. Paste text or upload a file
3. Choose the processing method
4. Start importing

### Correcting Memories
When you find profiles or relationships inaccurate, you can correct them through the corresponding management entries:
1. Set or delete manual overrides in character profiles
2. Adjust nodes, relationships, or weights in the knowledge graph
3. Use feedback correction, delete and restore, or re-import to handle outdated content

For regular paragraph text, there is currently no arbitrary text editing entry available; when correction is needed, it is recommended to delete the erroneous source and re-import, or handle it through the feedback correction mechanism.

### Deleting Memories
Don't want to remember certain things?
- Single deletion: Find the memory, click "Delete"
- Batch deletion: Select multiple items, delete them together
- Delete by source: Delete all memories from a certain group chat

⚠️ **Note**: Deleted items go to the recycle bin and can still be restored

## Character Profiles

MaiBot creates a "profile" for each user:
- Personality traits (cheerful, introverted, etc.)
- Hobbies and interests (games, anime, etc.)
- Chat habits (loves using emojis, speaking style, etc.)

You can:
- View your own profile
- Modify inaccurate descriptions
- Add notes for friends

## Advanced Features

### Memory Reinforcement
Make certain memories more important:
- Select important memories
- Click "Reinforce Memory"
- These memories will not be easily forgotten

### Permanent Memory
Particularly important content can be set as permanent:
- Select "Permanent Memory"
- This content will never be automatically cleaned up

### Memory Tuning
If MaiBot's memory is poor, you can:
- Adjust memory parameters
- Reprocess memories
- Optimize retrieval effectiveness

### Runtime Maintenance
The WebUI also provides operational entries such as runtime self-check, auto-save switch, vector rebuilding, paragraph vector backfill, import tasks, and deletion operation logs.

## Usage Tips

### Daily Maintenance
- Regularly review memories and delete useless content
- Correct errors as soon as they are found
- Manually reinforce important information

### Improving Effectiveness
- Teach the bot professional knowledge to make it smarter
- Improve character profiles to make conversations more thoughtful
- Reasonably set memory capacity to balance performance and effectiveness

## Frequently Asked Questions

**Q: How long are memories saved?**
A: By default, they are saved long-term. Memory evolution will gradually decay the weight of old relationships, and low-weight content may be marked for pruning; specific behavior is controlled by A_Memorix's memory evolution configuration.

**Q: Do memories take up space?**
A: Text memories take up very little space, feel free to use them

**Q: Can memories be exported?**
A: Currently, only exporting memory tuning configurations is supported; full memory export is not yet supported

**Q: Will memories leak privacy?**
A: Memory data is stored in a local directory by default. Generating summaries, profiles, corrections, or vectors may call the model service you configured; please confirm data boundaries based on your deployment method and model provider.