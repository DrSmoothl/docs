---
title: Chat History and Statistics
---# Chat History and Statistics

See how active MaiBot is and what it has been chatting about!

## Chat Statistics

### 📊 Data Overview
Open the "Chat Statistics" page to see:
- **Total Messages** - How many messages the bot received
- **Replies** - How many messages the bot replied to
- **Uptime** - How long the bot has been running
- **Average Response** - How fast the response speed is

### 💰 Cost Statistics
Track your spending:
- **Total Cost** - Total amount spent
- **Hourly Cost** - Average cost per hour
- **Token Usage** - How much text the AI processed
- **Cost per Model** - Spending breakdown for different AI models

### 📈 Trend Charts
Intuitive charts showing:
- **24 Hours** - Activity over the last day
- **7 Days** - Trends over the last week
- **Peak Hours** - When the bot is most active

## Chat History

### View Records
View detailed chat history:
- Who said what
- How the bot replied
- When the conversation happened
- Which group chat it occurred in

### Search Records
Looking for specific content?
- Filter by user
- Search by time range
- Filter by group chat

### Record Management
- **Clear Records** - Delete old records
- **Backup Important Chats** - Save interesting conversations

## User Management

### User List
Displays all users who have chatted:
- User nicknames and avatars
- Duration of acquaintance
- Chat frequency
- Which platform they were met on

### User Personas
Click a user to see:
- Personality traits
- Interests and hobbies
- Chatting habits
- Interaction history

### User Statistics
- **Total Users** - How many users are known
- **Active Users** - How many chat frequently
- **Platform Distribution** - Breakdown by QQ, WeChat, etc.

## Expression Styles

### Speaking Style
MaiBot learns different ways of expressing itself:
- Formal/Casual
- Lively/Steady
- Humorous/Serious
- Various internet slang

### Slang Management
Internet slang learned by the bot:
- New and trending words
- Memes and jokes
- Niche community terminology
- Can be manually confirmed or rejected

### Stickers/Emojis
Collected stickers:
- Usage frequency statistics
- Popular stickers
- Ability to upload new ones
- Ban inappropriate ones

Stickers are displayed in the WebUI in four states:
- **Known**: Has a description, but is not registered or banned
- **Unknown**: No description, and not registered or banned
- **Claimed**: Registered and can be used by MaiBot
- **Discarded**: Banned and no longer used

Stickers manually uploaded from the WebUI are directly marked as "Claimed". The tag list filled during upload will be merged into the sticker description; if the image already exists in the database, the original record will be reused, the description updated, the ban lifted, and it will be marked as registered. Deleting an unregistered sticker will synchronously delete the database record and local file; deleting a registered sticker will first uninstall it from the available sticker library, then delete the database record and file.

## Usage Suggestions

### Daily Review
- Check statistics daily to understand activity levels
- Monitor cost changes to avoid overspending
- Review user feedback to improve the bot

### Data Analysis
- Analyze peak hours to schedule maintenance reasonably
- Observe user preferences to adjust the bot's personality
- Track popular topics to add relevant content

### Optimization Tips
- Response too slow? Check the configuration
- Cost too high? Switch to a cheaper model
- Too few users? Increase promotion

## FAQ

**Q: How often are statistics updated?**
A: Updated in real-time; you can see the latest data at any time.

**Q: How long are records saved?**
A: Saved long-term by default; automatic cleaning can be configured.

**Q: Can data be exported?**
A: Export functionality is not yet supported but will be added in future versions.

**Q: How can I reduce usage costs?**
A: Choose cheaper models, reduce unnecessary calls, and optimize prompts.

## Useful Tips

### Monitoring Bot Health
- Response time suddenly increased? There might be an issue.
- Costs increasing abnormally? Check if it's under attack.
- Active users dropping? Check if the bot said something wrong.

### Improving User Experience
- Analyze user personas for personalized replies.
- Track popular topics to prepare relevant content.
- Record user feedback for continuous improvement.

### Saving Expenses
- Choose models with high cost-performance ratios.
- Set reasonable call frequencies.
- Avoid redundant calls to save Tokens.