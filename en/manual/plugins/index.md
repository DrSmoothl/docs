---
title: Plugins
---

# Plugins

Plugins are like "Apps" you install for MaiBot, giving it more capabilities—games, drawing, music, weather queries, and **adapters that connect platforms like QQ, email, and voice calls**—almost everything is a plugin.

You can install from the built-in **Plugin Market** with one click, or build your own. This page only covers "how to install and manage plugins as a user"; for development see [Plugin Development](/en/plugin/).

## What is a Plugin

- 🎮 **Feature plugins** — games, drawing, music, weather, etc.
- 🔌 **Platform adapters** — connect messaging platforms to MaiBot; they are plugins too
- 🛠️ **Developer components** — Tool, Command, Hook, event handlers, etc.

## Plugin Market (Recommended)

MaiBot has a built-in **Plugin Market** where you can browse, install, and update plugins from the WebUI—no command line needed.

![Plugin Market](/images/plugin-market/store-overview.jpeg)

The market supports filtering by category and keyword to quickly find the plugin or adapter you need:

![Plugin Market filtering and categories](/images/plugin-market/store-filter.png)

### Install from the Plugin Market

1. Open the WebUI and go to "Plugin Management".
2. Switch to the "Plugin Market / Browse" tab.
3. Search or filter for the plugin you want (e.g. `NapCat`).
4. Click "Install" and wait for it to finish.
5. Newly installed plugins are **disabled by default**—remember to enable them (see [Manage Plugins](./management)).

::: tip Can't find it in the market?
The Plugin Market is indexed from GitHub repositories. If it's not there, use the Git URL method below to install any public repository.
:::

## Install from a Repository (git clone)

Beyond the Plugin Market, there is a "repository" path: first find a plugin on the Plugin Site or the official organization, then install it via a Git URL.

### Where to Find Plugins

Besides the built-in Plugin Market in the WebUI, you can also visit the **MaiBot Plugin Site** to browse and search community-maintained plugins and adapters:

<Linkcard url="https://plugins.maibot.chat/" title="MaiBot Plugin Site" description="Browse and search community-maintained plugins and adapters" logo="/title_img/mai.png" />

<Linkcard url="https://github.com/Mai-with-u" title="MaiBot Official Organization" description="Official adapters and example plugins live here" logo="/title_img/mai.png" />

### Install from a Git Repository URL

Use this when the plugin isn't in the market, or when you want a specific branch / fork.

Paste the repository URL into "Install from Git" in plugin management, or clone manually in a terminal:

::: code-group

```bash [Bash ~vscode-icons:file-type-shell~]
# Paste the URL into "Install from Git" in the WebUI, or run in a terminal:
git clone https://github.com/author/plugin-name.git plugins/plugin-name
```

:::

**Example URL**:

```
https://github.com/author/plugin-name
```

> ⚠️ Currently only installation via Git repository URL is supported; local file upload is not supported.

## After Install: Disabled by Default

Regardless of method, once a plugin is written to `plugins/`:

- A file watcher detects the new plugin and generates `config.toml` from the plugin's `config_model`;
- Plugins whose `enabled` defaults to `false` **must be enabled manually** to run.

So "install succeeded" ≠ "already running". Next, go to [Manage Plugins](./management) to enable and configure it.

::: warning Security reminder
Only install plugins from trusted sources. Before installing, check the repository's README, update time, and Issues, and review the permissions the plugin requests. Third-party plugins are maintained by their respective authors; the MaiBot team does not guarantee their compatibility or safety.
:::
