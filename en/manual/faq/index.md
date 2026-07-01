---
title: ❓ FAQ
---# ❓ FAQ

All the most common problems beginners encounter are right here!

## 💰 Cost Related

### Does MaiBot cost money?
**Ans**: MaiBot itself is free, but the AI models cost money.

**Details**:
- 💡 **MaiBot Software** - Completely free and open source
- 💳 **AI Models** - Paid, such as DeepSeek, OpenAI, etc.
- 📊 **Approximate Cost** - A few dollars a month is enough if you don't chat much

**Money-saving tips**:
- Use cheaper models (DeepSeek is very affordable)
- Set response frequency limits
- Disable unnecessary features

### Which AI model is the best to use?
**Recommendation**: Beginners should use DeepSeek—it's cheap and effective!

**Comparison**:
| Model | Price | Effect | Recommendation |
|------|------|------|--------|
| DeepSeek | ⭐ Very Cheap | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐⭐ Highly Recommended |
| Qwen | ⭐⭐ Cheap | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐ Recommended |
| GPT-4o-mini | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Great | ⭐⭐⭐ Worth a try |

### Will my QQ account be banned?
**Ans**: There is a risk, but you can use an alt account to avoid this.

**Suggestions**:
- 🔒 **Use an alt account** - Do not use your main account to reduce risk
- ⚠️ **Mind your words** - Do not post content that violates regulations
- 🛡️ **Diversify risk** - Rotate between multiple alt accounts

## 🚀 Usage Issues

### What to do if it won't start?
**Common causes and solutions**:

1️⃣ **Incorrect Python version**
```
# 检查版本
python --version
# 需要 3.12 以上
```

2️⃣ **Missing configuration file**
```
# 第一次启动会自动创建
# 如果没有，手动创建 config 文件夹
```

3️⃣ **Port occupied**

Startup error example:
```
WebUI 服务器 启动失败: 端口 8001 已被占用 (host=127.0.0.1)
```

**Method 1: Change Port** — Edit `config/bot_config.toml`:
- WebUI Port: `[webui]` → `port = 8002`
- WebSocket Port: `[maim_message]` → `ws_server_port = 8001` (Default is 8000; change to another port if there is a conflict)

**Method 2: Kill Process**:
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8001
kill -9 <PID>
```

### Bot is not replying to messages?
**Checklist**:

1. **Check Logs** - Are there any error messages?
2. **Check Configuration** - Is the API Key entered correctly?
3. **Test Connection** - Can the network access the model service?
4. **Check Permissions** - Does it have permission to speak in the QQ group?

**Common Errors**:
- ❌ Wrong API Key → 401 Error
- ❌ Network failure → Connection timeout
- ❌ Muted → Cannot send messages

### Configuration file format error?
**Tips for beginners**:
- 🖥️ **Use WebUI to change config** - No mistakes will be made
- ✏️ **Be careful with manual editing** - Every symbol must be correct
- 💾 **Backup before changing** - So you can restore if something goes wrong

**Formatting Key Points**:
```toml
# 字符串要加引号
name = "我的机器人"

# 数字不要引号
port = 8001

# 布尔值小写
enabled = true
```

## 🤖 Feature Issues

### Can it serve multiple groups simultaneously?
**Ans**: Of course! One MaiBot instance can serve many groups.

**Setup Method**:
- Add multiple group numbers in the configuration
- Each group can have a different personality
- Unified management is very convenient

### Where is data stored? Is it secure?
**Ans**: All data is stored on your own computer.

**Storage Locations**:
- 💾 **Chat History** - Local database
- 🧠 **Memory Content** - Local files
- ⚙️ **Configuration Files** - Local disk

**Security Reminders**:
- 🔒 **No network uploads** - Data stays local
- 🏠 **Good privacy protection** - Others cannot see it
- 💿 **Regular backups** - Prevent data loss

### Does MaiBot support mobile deployment?
**Ans**: Theoretically yes, but not recommended.

**Reasons**:
- 📱 **Limited mobile performance** - May run sluggishly
- 🔋 **High power consumption** - Phone may overheat severely
- 📶 **Unstable network** - Prone to disconnecting

**Suggestions**:
- 🖥️ **Use a computer** - Desktops or laptops both work
- ☁️ **Use a cloud server** - Online 24/7
- 🏠 **Raspberry Pi** - Small devices also work

### Must I use QQ? Can I use other platforms?
**Ans**: Currently, it primarily supports QQ; other platforms are under development.

**Current Status**:
- ✅ **QQ** - Best support, most complete features
- 🚧 **WeChat** - No available adapter yet; community development is welcome
- 📋 **Others** - More platforms can be integrated via adapter plugins

## 🔧 Technical Issues

### What to do if replies are too slow?
**Optimization Methods**:
1. **Switch to a faster model** - DeepSeek responds very quickly
2. **Reduce context** - Do not provide too much history
3. **Check network** - Slow network affects speed
4. **Disable unnecessary features** - Too many plugins can slow it down

### NapCat is connected, but group chats aren't receiving messages?
**First, check the group chat list filtering of the NapCat adapter.**

NapCat adapter enables chat list filtering by default, and group chats are in whitelist mode by default. If the group number is not in `group_list`, group messages will be discarded by the adapter.

**Solution**:
1. Open `plugins/MaiBot-Napcat-Adapter/config.toml`
2. If using Docker deployment, open `./data/MaiMBot/plugins/MaiBot-Napcat-Adapter/config.toml`
3. Add the target group number to `group_list` in `[chat]`
4. It is recommended to temporarily enable `show_dropped_chat_list_messages = true` to see filtered messages in the logs
5. Save and restart MaiBot

```toml
[chat]
enable_chat_list_filter = true
show_dropped_chat_list_messages = true
group_list_type = "whitelist"
group_list = ["你的QQ群号"]
```

### Memory usage is too high?
**Save Memory**:
- 📉 **Reduce memory capacity** - Remember fewer things
- 🗑️ **Clean useless data** - Regularly delete junk
- 🔌 **Use fewer plugins** - Plugins consume memory
- 💻 **Upgrade hardware** - Adding RAM is the most direct way

### How to change the AI model?
**Simple Steps**:
1. Open WebUI → Configuration Management
2. Find Model Settings
3. Select a new model
4. Save, and it takes effect immediately

## 💡 Beginner Tips

### What should I pay attention to the first time?
1. **Test with an alt account first** - Avoid risks to your main account
2. **Start with simple configurations** - Don't enable too many features at once
3. **Check logs often** - Logs will tell you what's wrong
4. **Join the community group** - Ask others if you have questions

### How to make the bot smarter?
1. **Teach it knowledge** - Use the memory management feature
2. **Adjust personality settings** - Make the character more distinct
3. **Install useful plugins** - Add various capabilities
4. **Chat with it more** - It will learn and get smarter

### Where can I learn more?
- 📖 **Read the docs** - This documentation site
- 💬 **Join groups** - Communicate with other users
- 🔍 **Search tutorials** - Many experiences are shared online
- 🐱 **Check GitHub** - Latest updates and discussions

## 🆘 Encountered an unsolvable problem?

### Ways to get help:
1. **Check FAQ first** - The answer might already be there
2. **Check logs** - Error messages are very important
3. **Search online** - Others may have encountered it
4. **Ask around** - Join the group and ask other users
5. **Submit an Issue** - Submit the problem on GitHub

### Information to provide when asking:
- 🖥️ **System Info** - Windows/Linux/Mac?
- 📋 **Error Logs** - Specific error messages
- ⚙️ **Config Info** - Relevant configuration content
- 🔢 **Version Info** - MaiBot version number
- 🎯 **Reproduction Steps** - How to trigger the error