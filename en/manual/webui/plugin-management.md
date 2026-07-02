---
title: Install and manage plugins
---# Installing and Managing Plugins

Plugins are like installing "Apps" for MaiBot, giving it more features!

## What are Plugins?

Plugins are extension features for MaiBot, such as:

- 🎮 **Game Plugins** - Can play games with users
- 🎨 **Drawing Plugins** - Can generate images
- 🎵 **Music Plugins** - Can play music
- 🌤️ **Weather Plugins** - Can check weather forecasts
- 📚 **Learning Plugins** - Can teach knowledge

## Installing Plugins

### Method 1: Online Installation (Recommended)

1. Open the WebUI and click "Plugin Management"
2. Click the "Install Plugin" button
3. Enter the plugin address (GitHub link)
4. Click "Install" and wait for completion

**Example Address**:
```
https://github.com/author/plugin-name
```

### Method 2: Git URL Installation

1. Get the plugin's Git repository address (GitHub, etc.)
2. Click "Install Plugin" on the plugin management page
3. Enter the Git repository URL
4. Click "Install" and wait for completion

> Note: Currently, installing plugins via Git repository URL is the only supported method; local file uploads are not supported

## Managing Installed Plugins

### Viewing Plugins

The plugin page will display:
- 📋 **Plugin Name** and brief description
- 🔧 **Version Number** and author
- ✅ **Enable Status** (Green = Enabled, Gray = Disabled)
- 📖 **Usage Instructions** (click to view)

### Enabling/Disabling Plugins

- Switch on → Plugin is active
- Switch off → Plugin is disabled
- Takes effect immediately after change, no restart required

### Configuring Plugins

Some plugins can be customized:
1. Click the plugin's "Settings" button
2. Modify configuration options
3. Takes effect immediately after saving

**Common Configurations**:
- API Keys (for plugins requiring external services)
- Trigger keywords
- Feature toggles

### Updating Plugins

An update prompt will be displayed when a new version of a plugin is available:
1. Click the "Update" button
2. Wait for download and installation
3. Completes automatically, data will not be lost

### Uninstalling Plugins

Unneeded plugins can be uninstalled:
1. Click the "Uninstall" button
2. Confirm uninstallation
3. Plugin files will be deleted

⚠️ **Note**: Plugin data may be lost after uninstallation

## Plugin Recommendations

### Essential for Beginners
- **Welcome Plugin** - Automatically welcomes new users to the group
- **Help Plugin** - Provides command help
- **Check-in Plugin** - Daily check-in feature

### Entertainment
- **Gacha Plugin** - Simulates various gacha pulls
- **Dice Plugin** - Dice games
- **Riddle Plugin** - Guess riddles and brain teasers

### Practical
- **Translation Plugin** - Multi-language translation
- **Calculator Plugin** - Mathematical calculations
- **Time Plugin** - Time and date queries

## Usage Tips

### Plugin Conflicts
If plugin features overlap or conflict:
- Only enable the plugins you need
- Contact the plugin author to update

### Performance Optimization
Too many plugins may affect performance:
- Uninstall unused plugins promptly
- Regularly clean up useless plugins
- Monitor plugin resource usage

### Security Reminders
- Only install plugins from trusted sources
- Check plugin permission requirements
- Regularly update plugin versions

## Frequently Asked Questions

**Q: What should I do if plugin installation fails?**
A: Check your network connection, confirm the plugin address is correct, and review the error message

**Q: Plugin not working?**
A: Confirm the plugin is enabled, check if the configuration is correct, and review the MaiBot logs

**Q: Where can I find plugins?**
A: Search for "MaiBot plugins" on GitHub, or join the community for recommendations

**Q: Can I develop my own plugins?**
A: Of course! There are development docs and sample code, even beginners can learn

## Getting Help

- Plugin pages have usage instructions
- Check the plugin's README document
- Join the MaiBot community group to ask questions
- Submit issues on GitHub