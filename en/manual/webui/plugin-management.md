---
title: Installing and Managing Plugins
---# Installing and Managing Plugins

Plugins are like installing "Apps" for MaiBot, giving it more capabilities!

## What are Plugins?

Plugins are extended functionalities for MaiBot, such as:

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
https://github.com/作者/插件名
```

### Method 2: Git URL Installation

1. Get the Git repository address of the plugin (GitHub, etc.)
2. Click "Install Plugin" on the plugin management page
3. Enter the Git repository URL
4. Click "Install" and wait for completion

> Note: Currently, only installation via Git repository URL is supported; local file uploads are not supported.

## Managing Installed Plugins

### Viewing Plugins

The plugin page will display:
- 📋 **Plugin Name** and description
- 🔧 **Version Number** and author
- ✅ **Enable Status** (Green = Enabled, Grey = Disabled)
- 📖 **Usage Instructions** (Click to view)

### Enabling/Disabling Plugins

- Switch ON $\rightarrow$ Plugin takes effect
- Switch OFF $\rightarrow$ Plugin is deactivated
- Changes take effect immediately without requiring a restart

### Configuring Plugins

Some plugins allow custom settings:
1. Click the "Settings" button of the plugin
2. Modify the configuration options
3. Save changes to take effect immediately

**Common Configurations**:
- API Keys (for plugins requiring external services)
- Trigger keywords
- Feature toggles

### Updating Plugins

An update prompt will appear when a new version of a plugin is available:
1. Click the "Update" button
2. Wait for download and installation
3. Completed automatically; data will not be lost

### Uninstalling Plugins

Unnecessary plugins can be uninstalled:
1. Click the "Uninstall" button
2. Confirm uninstallation
3. Plugin files will be deleted

⚠️ **Note**: Plugin data may be lost after uninstallation

## Plugin Recommendations

### Essentials for Beginners
- **Welcome Plugin** - Automatically welcomes new users to the group
- **Help Plugin** - Provides command assistance
- **Check-in Plugin** - Daily check-in functionality

### Entertainment
- **Gacha Plugin** - Simulates various card draws
- **Dice Plugin** - Dice rolling games
- **Riddle Plugin** - Riddles and brain teasers

### Utility
- **Translation Plugin** - Multi-language translation
- **Calculator Plugin** - Mathematical calculations
- **Time Plugin** - Time and date queries

## Usage Tips

### Plugin Conflicts
If plugin functions overlap or conflict:
- Enable only the plugins you need
- Contact the plugin author for updates

### Performance Optimization
Too many plugins may affect performance:
- Uninstall unused plugins promptly
- Regularly clean up useless plugins
- Monitor plugin resource usage

### Security Reminders
- Only install plugins from trusted sources
- Review plugin permission requirements
- Update plugin versions regularly

## FAQ

**Q: What should I do if the plugin installation fails?**
A: Check your network connection, ensure the plugin address is correct, and check the error prompts.

**Q: The plugin is not working?**
A: Confirm the plugin is enabled, check if the configuration is correct, and view the MaiBot logs.

**Q: Where can I find plugins?**
A: Search for "MaiBot plugins" on GitHub or join the community for recommendations.

**Q: Can I develop my own plugins?**
A: Of course! There are development documents and example code available, making it accessible even for beginners.

## Getting Help

- Usage instructions are available on the plugin page
- View the plugin's README documentation
- Join the MaiBot exchange group to ask questions
- Submit issues on GitHub