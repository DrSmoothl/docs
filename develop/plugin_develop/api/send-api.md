# 消息发送API

消息发送API模块专门负责发送各种类型的消息，支持文本、表情包、图片等多种消息类型。

## 导入方式

```python
from src.plugin_system.apis import send_api
# 或者
from src.plugin_system import send_api
```

## 主要功能

### 1. 发送文本消息
```python
async def text_to_stream(
    text: str,
    stream_id: str,
    typing: bool = False,
    set_reply: bool = False,
    reply_message: Optional["DatabaseMessages"] = None,
    storage_message: bool = True,
    selected_expressions: Optional[List[int]] = None,
) -> bool:
```
发送文本消息到指定的流

**Args:**
- `text` (str): 要发送的文本内容
- `stream_id` (str): 聊天流ID
- `typing` (bool): 是否显示正在输入
- `set_reply` (bool): 是否设置为引用回复
- `reply_message` (Optional["DatabaseMessages"]): 要回复的消息对象（当 `set_reply=True` 时必需）
- `storage_message` (bool): 是否存储消息到数据库
- `selected_expressions` (Optional[List[int]]): 选中的表情包ID列表

**Returns:**
- `bool` - 是否发送成功

### 2. 发送表情包
```python
async def emoji_to_stream(
    emoji_base64: str,
    stream_id: str,
    storage_message: bool = True,
    set_reply: bool = False,
    reply_message: Optional["DatabaseMessages"] = None,
) -> bool:
```
向指定流发送表情包。

**Args:**
- `emoji_base64` (str): 表情包的base64编码
- `stream_id` (str): 聊天流ID
- `storage_message` (bool): 是否存储消息到数据库
- `set_reply` (bool): 是否设置为引用回复
- `reply_message` (Optional["DatabaseMessages"]): 要回复的消息对象（当 `set_reply=True` 时必需）

**Returns:**
- `bool` - 是否发送成功

### 3. 发送图片
```python
async def image_to_stream(
    image_base64: str,
    stream_id: str,
    storage_message: bool = True,
    set_reply: bool = False,
    reply_message: Optional["DatabaseMessages"] = None,
) -> bool:
```
向指定流发送图片。

**Args:**
- `image_base64` (str): 图片的base64编码
- `stream_id` (str): 聊天流ID
- `storage_message` (bool): 是否存储消息到数据库
- `set_reply` (bool): 是否设置为引用回复
- `reply_message` (Optional["DatabaseMessages"]): 要回复的消息对象（当 `set_reply=True` 时必需）

**Returns:**
- `bool` - 是否发送成功

### 4. 发送命令
```python
async def command_to_stream(command: Union[str, dict], stream_id: str, storage_message: bool = True, display_message: str = "") -> bool:
```
向指定流发送命令。

**Args:**
- `command` (Union[str, dict]): 命令内容
- `stream_id` (str): 聊天流ID
- `storage_message` (bool): 是否存储消息到数据库
- `display_message` (str): 显示消息

**Returns:**
- `bool` - 是否发送成功

### 5. 发送自定义类型消息
```python
async def custom_to_stream(
    message_type: str,
    content: str | Dict,
    stream_id: str,
    display_message: str = "",
    typing: bool = False,
    reply_message: Optional["DatabaseMessages"] = None,
    set_reply: bool = False,
    storage_message: bool = True,
    show_log: bool = True,
) -> bool:
```
向指定流发送自定义类型消息。

**Args:**
- `message_type` (str): 消息类型，如"text"、"image"、"emoji"、"video"、"file"等
- `content` (str | Dict): 消息内容（通常是base64编码或文本，也可以是字典）
- `stream_id` (str): 聊天流ID
- `display_message` (str): 显示消息
- `typing` (bool): 是否显示正在输入
- `reply_message` (Optional["DatabaseMessages"]): 要回复的消息对象
- `set_reply` (bool): 是否设置为引用回复
- `storage_message` (bool): 是否存储消息到数据库
- `show_log` (bool): 是否显示日志

**Returns:**
- `bool` - 是否发送成功

## 使用示例

### 1. 基础文本发送，并回复消息

```python
from src.plugin_system.apis import send_api

async def send_hello(chat_stream, reply_to_message):
    """发送问候消息并回复"""
    
    success = await send_api.text_to_stream(
        text="Hello, world!",
        stream_id=chat_stream.stream_id,
        typing=True,
        set_reply=True,
        reply_message=reply_to_message,
        storage_message=True
    )
    
    return success
```

### 2. 发送表情包

```python
from src.plugin_system.apis import emoji_api
async def send_emoji_reaction(chat_stream, emotion):
    """根据情感发送表情包"""
    # 获取表情包
    emoji_result = await emoji_api.get_by_emotion(emotion)
    if not emoji_result:
        return False
    
    emoji_base64, description, matched_emotion = emoji_result
    
    # 发送表情包
    success = await send_api.emoji_to_stream(
        emoji_base64=emoji_base64,
        stream_id=chat_stream.stream_id,
        storage_message=False # 不存储到数据库
    )
    
    return success
```

## 消息类型说明

### 支持的消息类型
- `"text"`：纯文本消息
- `"emoji"`：表情包消息
- `"image"`：图片消息
- `"command"`：命令消息
- `"video"`：视频消息（如果支持）
- `"audio"`：音频消息（如果支持）

### 回复消息说明
回复消息需要使用 `reply_message` 参数传入 `DatabaseMessages` 对象，并设置 `set_reply=True`。

`DatabaseMessages` 对象可以通过 `message_api` 获取，例如：
```python
from src.plugin_system.apis import message_api, send_api

# 获取最近的消息
messages = message_api.get_recent_messages(chat_stream.stream_id, hours=1, limit=1)
if messages:
    latest_message = messages[0]
    # 回复这条消息
    await send_api.text_to_stream(
        text="这是回复",
        stream_id=chat_stream.stream_id,
        set_reply=True,
        reply_message=latest_message
    )
```

## 注意事项

1. **异步操作**：所有发送函数都是异步的，必须使用`await`
2. **错误处理**：发送失败时返回False，成功时返回True
3. **发送频率**：注意控制发送频率，避免被平台限制
4. **内容限制**：注意平台对消息内容和长度的限制
5. **权限检查**：确保机器人有发送消息的权限
6. **编码格式**：图片和表情包需要使用base64编码
7. **存储选项**：可以选择是否将发送的消息存储到数据库 