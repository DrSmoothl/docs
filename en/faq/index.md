---
title: ❓ Frequently Asked Questions
---
# ❓ Frequently Asked Questions

Here are the most common problems encountered by beginners!

## 💰 Cost-Related Questions

### Does MaiBot cost money?
**Answer**: MaiBot itself is free, but AI models require payment.

**Details**:
- 💡 **MaiBot Software** - Completely free and open-source
- 💳 **AI Models** - Paid services, such as DeepSeek, OpenAI, etc.
- 📊 **Estimated Cost** - A few yuan per month is sufficient for light chat usage

**Money-Saving Tips**:
- Use cheaper models (DeepSeek is very affordable)
- Set reply frequency limits
- Disable unnecessary features

### Which AI model is the best?
**Recommendation**: Beginners should use DeepSeek; it is affordable and effective!

**Comparison**:
| Model | Price | Performance | Recommendation |
|------|------|------|--------|
| DeepSeek | ⭐ Very Cheap | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Highly Recommended |
| Qwen | ⭐⭐ Cheap | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Recommended |
| GPT-4o-mini | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Worth Trying |

### Will my QQ number be banned?
**Answer**: There is a risk, but you can avoid it by using a secondary account.

**Suggestions**:
- 🔒 **Use a Secondary Account** - Do not use your main account to reduce risk
- ⚠️ **Watch Your Words** - Do not post violating content
- 🛡️ **Diversify Risk** - Rotate multiple secondary accounts

## 🚀 Usage Issues

### What should I do if it won't start?
**Common Causes and Solutions**:

1️⃣ **Incorrect Python Version**
```bash
# Check version
python --version
# Requires version 3.12 or higher
```

2️⃣ **Missing Configuration File**
```bash
# First startup creates config/, bot_config.toml, and model_config.toml
# If generation fails, check directory write permissions and the log
```

3️⃣ **Port Already in Use**

Startup error example:
```
WebUI server startup failed: Port 8001 is already in use (host=127.0.0.1)
```

**Method 1: Change the Port** — Edit `config/bot_config.toml`:
- If the log says WebUI port `8001` is occupied: set `[webui].port = 8002`, or choose another port confirmed to be free
- Change `[maim_message].ws_server_port` only when the log says its legacy WebSocket port `8000` is occupied; the NapCat plugin adapter does not use this setting

Ports `8001` and `8002` do not conflict. The important point is not to move a service to a port the log has already shown to be occupied, and to change only the service that actually failed.

**Method 2: Terminate the Process**:
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8001
kill -9 <PID>
```

### The bot is not replying to messages?
**Checklist**:

1. **Check Logs** - Are there any error messages?
2. **Verify Configuration** - Is the API Key entered correctly?
3. **Test Connection** - Can the network access the model service?
4. **Check Permissions** - Do you have permission to speak in the QQ group?

**Common Errors**:
- ❌ Incorrect API Key → 401 Error
- ❌ Network Unreachable → Connection Timeout
- ❌ Muted → Unable to send messages

### Configuration file format error?
**Beginner Suggestions**:
- 🖥️ **Use WebUI to Edit Config** - Prevents errors
- ✏️ **Manual Editing Requires Caution** - Ensure all symbols are correct
- 💾 **Backup Before Editing** - Allows recovery if mistakes occur

**Format Key Points**:
```toml
# Strings must be enclosed in quotes
name = "My Robot"

# Numbers should not have quotes
port = 8001

# Boolean values must be lowercase
enabled = true
```

## 🤖 Feature Issues

### Can it serve multiple groups simultaneously?
**Answer**: Of course! One MaiBot instance can serve many groups.

**Setup Method**:
- Add multiple group IDs in the configuration
- Each group can have a different personality
- Unified management is convenient

### Where is data stored? Is it safe?
**Answer**: Databases, memory, and logs are primarily stored on the deployment device, but it is inaccurate to say that no data ever leaves it.

- Input and output content is sent to the configured third-party model API to generate responses and is also governed by that provider's privacy policy.
- When telemetry is enabled, MaiBot sends limited statistics such as client UUID, version, environment, and aggregated message/model usage. It should not include message bodies, group or user IDs, API keys, or per-message details.
- Client UUID, platform, and model aliases can be associated with a deployment, so telemetry is not fully anonymous.
- Third-party plugins may process or transmit data independently; review their source and privacy terms before installation.

Telemetry can be disabled without affecting core chat:

```toml
[telemetry]
enable = false
```

See the [Privacy Policy](/en/about/PRIVACY) and [EULA](/en/about/EULA) for the complete boundary.

### Does MaiBot support mobile deployment?
**Answer**: Theoretically possible, but not recommended.

**Reasons**:
- 📱 **Limited Mobile Performance** - May cause lag
- 🔋 **High Power Consumption** - Significant device heating
- 📶 **Unstable Network** - Prone to disconnection

**Suggestions**:
- 🖥️ **Use a Computer** - Desktop or laptop works fine
- ☁️ **Use a Cloud Server** - Ensures 24/7 uptime
- 🏠 **Raspberry Pi** - Small devices are also viable

### Must I use QQ? Can I use other platforms?
**Answer**: No. MaiBot uses adapter plugins. NapCat Adapter is a common QQ option, while the documentation also lists Telegram, Discord, SnowLuma, and GoCQ adapters.

Adapters are maintained by the core team or community projects and may differ in compatibility and features. Check the adapter repository and documentation for your MaiBot version before deployment.

## 🔧 Technical Issues

### What if the reply is too slow?
**Optimization Methods**:
1. **Switch to a Faster Model** - DeepSeek responds quickly
2. **Reduce Context** - Do not provide too much history
3. **Check Network** - Slow network affects speed
4. **Disable Unnecessary Features** - Too many plugins slow down performance

### NapCat is connected, but group messages are not received?
**Priority Check: NapCat Adapter Group List Filtering.**

The NapCat adapter enables chat list filtering by default. Group chats operate in whitelist mode by default. If a group ID is not in `group_list`, group messages will be directly discarded by the adapter.

**Resolution Steps**:
1. Open `plugins/MaiBot-Napcat-Adapter/config.toml`
2. If using Docker, open `./data/MaiMBot/plugins/MaiBot-Napcat-Adapter/config.toml`
3. Add the target group ID to `group_list` under `[chat]`
4. It is recommended to temporarily enable `show_dropped_chat_list_messages = true` to view filtered messages in the logs
5. Save; the plugin configuration-update lifecycle reloads the list, normally without restarting MaiBot

```toml
[chat]
enable_chat_list_filter = true
show_dropped_chat_list_messages = true
group_list_type = "whitelist"
group_list = ["Your QQ Group ID"]
```

### Memory usage is too high?
**Memory Saving Tips**:
- 📉 **Reduce Memory Capacity** - Remember less information
- 🗑️ **Clean Up Useless Data** - Regularly delete junk
- 🔌 **Use Fewer Plugins** - Plugins consume memory
- 💻 **Upgrade Hardware** - Adding RAM is the most direct solution

### How do I switch AI models?
**Simple Steps**:
1. Open WebUI → Configuration Management
2. Locate Model Settings
3. Select the new model
4. Changes take effect immediately after saving

## 💡 Beginner Suggestions

### What should I pay attention to on the first use?
1. **Test with a Secondary Account First** - Avoid risks to your main account
2. **Start with Simple Configuration** - Do not enable too many features at once
3. **Monitor Logs Frequently** - Logs will inform you of issues
4. **Join the Discussion Group** - Ask others if you encounter problems

### How to make the bot smarter?
1. **Teach It Knowledge** - Use the memory management feature
2. **Adjust Personality Settings** - Make the character more distinct
3. **Install Useful Plugins** - Add various capabilities
4. **Chat with It Frequently** - It will learn and become smarter over time

### Where can I learn more?
- 📖 **Read Documentation** - This documentation website
- 💬 **Join Groups** - Communicate with other users
- 🔍 **Search Tutorials** - Many experience-sharing posts online
- 🐱 **Check GitHub** - Latest updates and discussions

## 🆘 Encountered an Unsolvable Problem?

### Ways to Get Help:
1. **Check the FAQ First** - The answer might already be there
2. **Review Logs** - Error messages are crucial
3. **Search Online** - Others may have encountered the same issue
4. **Ask in the Group** - Ask other users in the community
5. **Submit an Issue** - Report the problem on GitHub

### Information to Provide When Asking:
- 🖥️ **System Info** - Windows/Linux/Mac?
- 📋 **Error Logs** - Specific error messages
- ⚙️ **Configuration Info** - Relevant configuration content
- 🔢 **Version Info** - MaiBot version number
- 🎯 **Reproduction Steps** - How to trigger the error
