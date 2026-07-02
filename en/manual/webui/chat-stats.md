---
title: Chat History and Statistics
---# Chat Logs and Statistics

See how active MaiBot is and what it chatted about!

## Chat Statistics

### 📊 Data Overview
Open the "Chat Statistics" page to see:
- **Total Messages** - How many messages the bot received
- **Replies** - How many messages the bot replied to
- **Online Duration** - How long the bot has been running
- **Average Response** - How fast the bot replies

### 💰 Cost Statistics
You can also see the spending details:
- **Total Cost** - Total amount spent
- **Hourly Cost** - Average cost per hour
- **Token Usage** - How much text the AI processed
- **Cost by Model** - How much was spent on different AI models

### 📈 Trend Charts
Intuitive chart displays:
- **24 Hours** - Activity in the last day
- **7 Days** - Trends over the last week
- **Peak Hours** - When it is most active

## Chat Logs

### View Logs
You can view detailed chat history:
- Who said what
- How the bot replied
- When the chat happened
- Which group chat it was in

### Search Logs
Looking for something specific?
- Filter by user
- Search by time range
- Filter by group chat

### Log Management
- **Clean up logs** - Delete old records
- **Backup important chats** - Save interesting conversations

## User Management

### User List
Displays all users who have chatted:
- User nickname and avatar
- How long you've known them
- Chat frequency
- Which platform you met them on

### User Persona
Click on a user to see:
- Personality traits
- Interests and hobbies
- Chat habits
- Interaction history

### User Statistics
- **Total Users** - How many users the bot knows
- **Active Users** - How many users chat frequently
- **Platform Distribution** - How many on QQ, WeChat, etc.

## Expression Methods

### Speaking Style
MaiBot will learn different ways of expression:
- Formal/Casual
- Lively/Calm
- Humorous/Serious
- Various internet slang

### Slang Management
Internet slang learned by the bot:
- New and trending words
- Memes and jokes
- Niche community jargon
- Can be manually confirmed or rejected

### Stickers
Collected stickers:
- Usage frequency statistics
- Popular stickers
- Can upload new ones
- Disable inappropriate ones

Stickers are uniformly displayed in four states in the WebUI:
- **Recognized**: Has a description, but not registered or banned
- **Unrecognized**: No description yet, and not registered or banned
- **Adopted**: Registered and can be used by MaiBot
- **Discarded**: Banned and no longer used

Stickers manually uploaded from the WebUI will be directly marked as "Adopted". The tag list filled in during upload will be merged into the sticker description; if the image already exists in the database, it will reuse the original record, update the description, unban it, and mark it as registered. Deleting an unregistered sticker will simultaneously delete the database record and the local file; deleting a registered sticker will first uninstall it from the available sticker library, then delete the database record and the file.

## Usage Tips

### Daily Check
- Check statistics daily to understand activity levels
- Monitor cost changes to avoid overspending
- Review user feedback to improve the bot

### Data Analysis
- Analyze peak hours to schedule maintenance reasonably
- Observe user preferences to adjust the bot's personality
- Track popular topics to add related content

### Optimization Suggestions
- Responses too slow? Check the configuration
- Costs too high? Switch to a cheaper model
- Too few users? Increase promotion

## Frequently Asked Questions

**Q: How often are statistics updated?**
A: Updated in real-time, latest data is always visible

**Q: How long are logs kept?**
A: Saved long-term by default, automatic cleanup can be configured

**Q: Can I export the data?**
A: Export is not currently supported, but will be added in future versions

**Q: How to reduce usage costs?**
A: Choose cheaper models, reduce unnecessary calls, optimize prompts

## Practical Tips

### Monitor Bot Health
- Response time suddenly increased? There might be an issue
- Abnormal cost increase? Check if it's under attack
- Active users declining? See if it said something wrong

### Improve User Experience
- Analyze user personas for personalized replies
- Track popular topics to prepare relevant content
- Record user feedback for continuous improvement

### Save Expenses
- Choose cost-effective models
- Set reasonable call frequencies
- Avoid repeated calls to waste Tokens