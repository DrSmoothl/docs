---
title: Modify configurations in the browser
---# Modify Configuration in Browser

Change MaiBot settings with a few clicks—no need to edit files manually!

## Two Modification Methods

### 1. Form Mode (Recommended)

Modify configurations like filling out a questionnaire; simple and intuitive:

- Each setting includes descriptive text
- Dropdown menus, switches, and input boxes for easy operation
- Automatic format validation

### 2. Advanced Mode

Directly edit the configuration file, suitable for technical users:

- View the complete configuration file
- Freely modify any content
- Requires knowledge of TOML format

## What Settings Can Be Changed?

### 🤖 Bot Settings
- **Basic Profile** - Name, avatar, signature
- **Chat Behavior** - Response speed, message length
- **Personality Traits** - Personality, speaking style

### 💬 Message Settings
- **Response Rules** - When to respond, who to respond to
- **Emoji Usage** - Preference for using emojis/stickers
- **Typos** - Whether to intentionally make typos

### 🧠 Intelligence Settings
- **Memory System** - How much to remember, for how long
- **Model Selection** - Which AI model to use
- **API Configuration** - Model provider settings

## Modification Steps

### Form Mode

1. Open the WebUI and click "Configuration Management" on the left
2. Select the category you want to modify (e.g., "Bot Settings")
3. Find the item to change and enter the new value
4. Click "Save"; the configuration will be saved to the file (Configuration hot-reload is pending implementation; changes take effect after restart)

### Advanced Mode

1. Click the "Raw Configuration" tab
2. Edit the text content directly
3. Click "Save"; the system will check the format
4. Errors will be prompted; if there are no errors, the changes are applied

## Modification Suggestions

### For Beginners
- Start by changing the **Bot Name** and **Signature** to give the bot personality
- Adjust the **Response Speed**; too fast or too slow is not ideal
- Try the **Personality Settings** to make the bot more interesting

### Advanced Play
- Configure **multiple AI models** to use different models for different tasks
- Set up **keyword responses** to make the bot smarter
- Adjust **memory parameters** to remember more chat content

## Precautions

⚠️ **Important Reminder**:
- Incorrect settings may cause the bot to behave abnormally
- Check the documentation for options you are unsure about
- It is recommended to back up important configurations first

📝 **Tips**:
- Hover your mouse over a setting to see the description
- Remember to click save after making changes
- You can reset to default settings if you encounter problems

## FAQ

**Q: What should I do if I break something?**
A: You can reset to default settings or manually change the values back to the original ones

**Q: Why did the save fail?**
A: The format might be incorrect; please check the error prompt

**Q: How long does it take for changes to take effect?**
A: After saving the current configuration, the bot needs to be restarted to take effect (Configuration hot-reload is pending implementation)