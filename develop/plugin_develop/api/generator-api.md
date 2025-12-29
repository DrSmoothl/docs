# 回复生成器API

回复生成器API模块提供智能回复生成功能，让插件能够使用系统的回复生成器来产生自然的聊天回复。

## 导入方式

```python
from src.plugin_system.apis import generator_api
# 或者
from src.plugin_system import generator_api
```

## 主要功能

### 1. 回复器获取
```python
def get_replyer(
    chat_stream: Optional[ChatStream] = None,
    chat_id: Optional[str] = None,
    model_set_with_weight: Optional[List[Tuple[TaskConfig, float]]] = None,
    request_type: str = "replyer",
) -> Optional[DefaultReplyer]:
```
获取回复器对象

优先使用chat_stream，如果没有则使用chat_id直接查找。

使用 ReplyerManager 来管理实例，避免重复创建。

**Args:**
- `chat_stream`: 聊天流对象
- `chat_id`: 聊天ID（实际上就是`stream_id`）
- `model_set_with_weight`: 模型配置列表，每个元素为 `(TaskConfig, weight)` 元组
- `request_type`: 请求类型，用于记录LLM使用情况，可以不写

**Returns:**
- `DefaultReplyer`: 回复器对象，如果获取失败则返回None

#### 示例
```python
# 使用聊天流获取回复器
replyer = generator_api.get_replyer(chat_stream=chat_stream)

# 使用平台和ID获取回复器
replyer = generator_api.get_replyer(chat_id="123456789")
```

### 2. 回复生成
```python
async def generate_reply(
    chat_stream: Optional[ChatStream] = None,
    chat_id: Optional[str] = None,
    action_data: Optional[Dict[str, Any]] = None,
    reply_message: Optional["DatabaseMessages"] = None,
    think_level: int = 1,
    extra_info: str = "",
    reply_reason: str = "",
    available_actions: Optional[Dict[str, ActionInfo]] = None,
    chosen_actions: Optional[List["ActionPlannerInfo"]] = None,
    unknown_words: Optional[List[str]] = None,
    enable_tool: bool = False,
    enable_splitter: bool = True,
    enable_chinese_typo: bool = True,
    request_type: str = "generator_api",
    from_plugin: bool = True,
    reply_time_point: Optional[float] = None,
) -> Tuple[bool, Optional["LLMGenerationDataModel"]]:
```
生成回复

优先使用chat_stream，如果没有则使用chat_id直接查找。

**Args:**
- `chat_stream`: 聊天流对象（优先）
- `chat_id`: 聊天ID（备用）
- `action_data`: 动作数据（向下兼容，包含`reply_to`和`extra_info`）
- `reply_message`: 回复的消息对象
- `think_level`: 思考级别，0为轻量回复，1为中等回复
- `extra_info`: 额外信息，用于补充上下文
- `reply_reason`: 回复原因
- `available_actions`: 可用动作字典，格式为 `{"action_name": ActionInfo}`
- `chosen_actions`: 已选动作列表
- `unknown_words`: Planner 在 reply 动作中给出的未知词语列表，用于黑话检索
- `enable_tool`: 是否启用工具调用
- `enable_splitter`: 是否启用消息分割器
- `enable_chinese_typo`: 是否启用错字生成器
- `request_type`: 请求类型（可选，记录LLM使用）
- `from_plugin`: 是否来自插件
- `reply_time_point`: 回复时间点

**Returns:**
- `Tuple[bool, Optional["LLMGenerationDataModel"]]`: (是否成功, LLM生成数据模型)
  - 成功时返回 `LLMGenerationDataModel` 对象，包含 `reply_set`、`content`、`prompt`、`model` 等属性
  - 失败时返回 `None`

#### 示例
```python
success, llm_response = await generator_api.generate_reply(
    chat_stream=chat_stream,
    reply_message=message,
    extra_info="这是额外的上下文信息",
    reply_reason="用户询问了问题",
    available_actions=action_info,
    enable_tool=True,
    think_level=1
)
if success and llm_response:
    # 访问回复集合
    if llm_response.reply_set:
        for reply_content in llm_response.reply_set.reply_data:
            print(f"回复类型: {reply_content.content_type}, 内容: {reply_content.content}")
    # 访问原始内容
    print(f"原始回复: {llm_response.content}")
    # 访问提示词
    print(f"使用的提示词: {llm_response.prompt}")
    # 访问模型信息
    print(f"使用的模型: {llm_response.model}")
```

### 3. 回复重写
```python
async def rewrite_reply(
    chat_stream: Optional[ChatStream] = None,
    reply_data: Optional[Dict[str, Any]] = None,
    chat_id: Optional[str] = None,
    enable_splitter: bool = True,
    enable_chinese_typo: bool = True,
    raw_reply: str = "",
    reason: str = "",
    reply_to: str = "",
    request_type: str = "generator_api",
) -> Tuple[bool, Optional["LLMGenerationDataModel"]]:
```
重写回复，使用新的内容替换旧的回复内容。

优先使用chat_stream，如果没有则使用chat_id直接查找。

**Args:**
- `chat_stream`: 聊天流对象（优先）
- `reply_data`: 回复数据字典（向下兼容备用，当其他参数缺失时从此获取）
- `chat_id`: 聊天ID（备用）
- `enable_splitter`: 是否启用消息分割器
- `enable_chinese_typo`: 是否启用错字生成器
- `raw_reply`: 原始回复内容
- `reason`: 重写原因
- `reply_to`: 回复对象
- `request_type`: 请求类型（可选，记录LLM使用）

**Returns:**
- `Tuple[bool, Optional["LLMGenerationDataModel"]]`: (是否成功, LLM生成数据模型)
  - 成功时返回 `LLMGenerationDataModel` 对象，包含 `reply_set`、`content`、`prompt` 等属性
  - 失败时返回 `None`

#### 示例
```python
success, llm_response = await generator_api.rewrite_reply(
    chat_stream=chat_stream,
    raw_reply="原始回复内容",
    reason="重写原因",
    reply_to="麦麦:你好"
)
if success and llm_response:
    # 访问回复集合
    if llm_response.reply_set:
        for reply_content in llm_response.reply_set.reply_data:
            print(f"回复类型: {reply_content.content_type}, 内容: {reply_content.content}")
    # 访问原始内容
    print(f"重写后的回复: {llm_response.content}")
    # 访问提示词
    print(f"使用的提示词: {llm_response.prompt}")
```

## LLMGenerationDataModel 对象说明

`generate_reply` 和 `rewrite_reply` 函数返回的 `LLMGenerationDataModel` 对象包含以下主要属性：

- `reply_set`: `ReplySetModel` 对象，包含处理后的回复内容列表
- `content`: 原始LLM生成的文本内容
- `processed_output`: 处理后的输出列表（分割后的文本）
- `prompt`: 使用的提示词
- `model`: 使用的模型名称
- `timing`: 生成耗时信息
- `reasoning`: 推理过程（如果有）

### ReplySetModel 结构
`reply_set` 是一个 `ReplySetModel` 对象，包含 `reply_data` 属性，这是一个 `ReplyContent` 对象列表。

每个 `ReplyContent` 对象包含：
- `content_type`: 内容类型（`ReplyContentType.TEXT`、`ReplyContentType.EMOJI`、`ReplyContentType.IMAGE` 等）
- `content`: 内容数据（文本字符串、base64编码的图片等）

### 使用示例
```python
success, llm_response = await generator_api.generate_reply(...)
if success and llm_response and llm_response.reply_set:
    for reply_content in llm_response.reply_set.reply_data:
        if reply_content.content_type == ReplyContentType.TEXT:
            print(f"文本: {reply_content.content}")
        elif reply_content.content_type == ReplyContentType.EMOJI:
            print(f"表情包: {reply_content.content[:50]}...")  # base64数据很长
```

### 4. 自定义提示词回复
```python
async def generate_response_custom(
    chat_stream: Optional[ChatStream] = None,
    chat_id: Optional[str] = None,
    request_type: str = "generator_api",
    prompt: str = "",
) -> Optional[str]:
```
生成自定义提示词回复

优先使用chat_stream，如果没有则使用chat_id直接查找。

**Args:**
- `chat_stream`: 聊天流对象
- `chat_id`: 聊天ID（备用）
- `request_type`: 请求类型（可选，记录LLM使用）
- `prompt`: 自定义提示词

**Returns:**
- `Optional[str]`: 生成的自定义回复内容，如果生成失败则返回None

## 注意事项

1. **异步操作**：部分函数是异步的，须使用`await`
2. **聊天流依赖**：需要有效的聊天流对象才能正常工作
3. **性能考虑**：回复生成可能需要一些时间，特别是使用LLM时
4. **回复格式**：返回的回复集合是元组列表，包含类型和内容
5. **上下文感知**：生成器会考虑聊天上下文和历史消息，除非你用的是自定义提示词。