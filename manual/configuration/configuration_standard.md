# 🔧 配置指南

## 简介

这个配置文件主要涉及麦麦的所有行为表现

（如果你要配置哪些群可以聊天，需要到适配器设置中配置）

如果你要了解模型配置的内容，包括该选用哪些模型，请参考[bot_config模型配置教程](./configuration_model_standard)

## 配置文件结构

 MaiBot 现在使用独立的 `bot_config.toml` 文件来配置机器人行为。配置文件包含以下主要部分：

- `[inner]` - 版本信息
- `[bot]` - 机器人基本信息
- `[personality]` - 人设、兴趣、表达风格
- `[expression]` - 表达学习配置
- `[chat]` - 聊天节奏与上下文
- `[memory]` - 记忆模块配置
- `[jargon]` - 全局黑话模式
- `[message_receive]` - 消息过滤规则
- `[tool]` - 工具开关
- `[mood]` - 情绪系统
- `[emoji]` - 表情包功能
- `[voice]` - 语音识别
- `[lpmm_knowledge]` - LPMM知识库
- `[keyword_reaction]` - 关键词/正则触发回复
- `[response_post_process]` - 回复后处理
- `[log]` - 日志配置
- `[debug]` - 调试开关
- `[maim_message]` - maim_message 服务
- `[telemetry]` - 统计信息
- `[experimental]` - 实验性功能
- `[relationship]` - 关系系统（暂保留占位）

## 配置文件详解

```toml
[inner]
version = "6.21.8"

#----以下是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----
#如果你想要修改配置文件，请递增version的值
#如果新增项目，请阅读src/config/official_configs.py中的说明
#
# 版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
#     主版本号：MMC版本更新
#     次版本号：配置文件内容大更新
#     修订号：配置文件内容小更新
#----以上是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----
```

<hr class="custom_hr"/>

```toml
[bot]
platform = "qq"
qq_account = "1145141919810" # 麦麦的QQ账号

platforms = ["wx:114514","xx:1919810"] # 麦麦的其他平台账号

nickname = "麦麦" # 麦麦的昵称
alias_names = ["麦叠", "牢麦"] # 麦麦的别名
```
这里配置Maibot对应的主平台账号信息及跨平台账号列表。

通过昵称或别名呼叫麦麦均能引起麦麦注意；缺省将无法正常识别昵称/at。

<hr class="custom_hr"/>

```toml
[personality]
# 建议120字以内，描述人格特质 和 身份特征
personality = "是一个女大学生，现在在读大二，会刷贴吧。"
#アイデンティティがない 生まれないらららら
# 描述麦麦说话的表达风格，表达习惯，如要修改，可以酌情新增内容
reply_style = "请回复的平淡一些，简短一些，说中文，不要刻意突出自身学科背景。可以参考贴吧，知乎和微博的回复风格。"
# 麦麦的兴趣，会影响麦麦对什么话题进行回复
interest = "对技术相关话题，游戏和动漫相关话题感兴趣，也对日常话题感兴趣，不喜欢太过沉重严肃的话题"

# 麦麦的说话规则，行为风格:
plan_style = """
1.思考**所有**的可用的action中的**每个动作**是否符合当下条件，如果动作使用条件符合聊天内容就使用
2.如果相同的内容已经被执行，请不要重复执行
3.请控制你的发言频率，不要太过频繁的发言
4.如果有人对你感到厌烦，请减少回复
5.如果有人对你进行攻击，或者情绪激动，请你以合适的方法应对"""

# 麦麦识图规则，不建议修改
visual_style = "请用中文描述这张图片的内容。如果有文字，请把文字描述概括出来，请留意其主题，直观感受，输出为一段平文本，最多30字，请注意不要分点，就输出一段文本"

# 麦麦私聊的说话规则，行为风格:
private_plan_style = """
1.思考**所有**的可用的action中的**每个动作**是否符合当下条件，如果动作使用条件符合聊天内容就使用
2.如果相同的内容已经被执行，请不要重复执行
3.某句话如果已经被回复过，不要重复回复"""

states = [
    "是一个女大学生，喜欢上网聊天，会刷小红书。" ,
    "是一个大二心理学生，会刷贴吧和中国知网。" ,
    "是一个赛博网友，最近很想吐槽人。" 
]

state_probability = 0.3
```

这部分是麦麦的核心人设部分。负责描述麦麦的核心人格特点和身份特点。

- `personality`: 人格特质和身份特征描述，建议120字以内
- `reply_style`: 说话的表达风格和习惯
- `emotion_style`: 情感特征，影响情绪的变化情况
- `interest`: 兴趣偏好，影响麦麦对话题的回复倾向
- `plan_style`: 说话规则和行为风格
- `visual_style`: 识图规则
- `private_plan_style`: 私聊专用的说话规则
- `states` 与 `state_probability`: 配置人格多样性，按照概率替换基础 `personality`

<hr class="custom_hr"/>

```toml
[expression]
# 表达学习配置
learning_list = [ # 表达学习配置列表，支持按聊天流配置
    ["", "enable", "enable", "1.0"],  # 全局配置：使用表达，启用学习，学习强度1.0
    ["qq:1919810:group", "enable", "enable", "1.5"],  # 特定群聊配置：使用表达，启用学习，学习强度1.5
    ["qq:114514:private", "enable", "disable", "0.5"],  # 特定私聊配置：使用表达，禁用学习，学习强度0.5
    # 格式说明：
    # 第一位: chat_stream_id，空字符串表示全局配置
    # 第二位: 是否使用学到的表达 ("enable"/"disable")
    # 第三位: 是否学习表达 ("enable"/"disable")
    # 第四位: 学习强度（浮点数），影响学习频率，最短学习时间间隔 = 300/学习强度（秒）
    # 学习强度越高，学习越频繁；学习强度越低，学习越少
]

expression_groups = [
    # ["*"], # 全局共享组：所有chat_id共享学习到的表达方式（取消注释以启用全局共享）
    ["qq:1919810:private","qq:114514:private","qq:1111111:group"], # 特定互通组，相同组的chat_id会共享学习到的表达方式
    # 格式说明：
    # ["*"] - 启用全局共享，所有聊天流共享表达方式
    # ["qq:123456:private","qq:654321:group"] - 特定互通组，组内chat_id共享表达方式
    # 注意：如果为群聊，则需要设置为group，如果设置为私聊，则需要设置为private
]
```

- `learning_list` 支持按聊天流配置表达学习，可以针对不同的群聊或私聊设置不同的学习策略
- `expression_groups` 可以设置互通组，让麦麦在不同的聊天中共享学习到的表达方式

<hr class="custom_hr"/>

```toml
[relationship]
enable_relationship = true # 是否启用关系系统
```
- `enable_relationship` 开启后，麦麦会开始构建并记忆与其他人的关系。

<hr class="custom_hr"/>

```toml
[chat] #麦麦的聊天设置
talk_value = 1 #聊天频率，越小越沉默，范围0-1
mentioned_bot_reply = true # 是否启用提及必回复
max_context_size = 30 # 上下文长度
planner_smooth = 2 # 规划器平滑系数，0为关闭

enable_talk_value_rules = true # 是否启用动态发言频率规则

talk_value_rules = [
    { target = "", time = "00:00-08:59", value = 0.8 },
    { target = "", time = "09:00-22:59", value = 1.0 },
    { target = "qq:1919810:group", time = "20:00-23:59", value = 0.6 },
    { target = "qq:114514:private", time = "00:00-23:59", value = 0.3 },
]

include_planner_reasoning = false # 是否把planner推理传给回复器
```

这部分是麦麦的聊天节奏与上下文控制：
- `talk_value`: 全局聊天活跃度
- `mentioned_bot_reply`: 是否启用提及必回复
- `max_context_size`: 上下文窗口长度
- `planner_smooth`: 平滑 planner 调度，数值越高越保守
- `enable_talk_value_rules` + `talk_value_rules`: 根据时间段或 chat_id 调整 `talk_value`
- `include_planner_reasoning`: 如需调试，可让回复器看到 planner 推理

<hr class="custom_hr"/>

```toml
[memory]
max_agent_iterations = 3 # 记忆思考深度（最低为1）
```

- `max_agent_iterations`: 控制记忆检索与总结时，代理最多迭代的次数，值越大越耗时。

<hr class="custom_hr"/>

```toml
[jargon]
all_global = true # 是否开启全局黑话模式
```

- `all_global`: 开启后，所有聊天都会共享黑话词表；关闭时需手动管理已有记录。

<hr class="custom_hr"/>

```toml
[message_receive]
# 以下是消息过滤，可以根据规则过滤特定消息，将不会读取这些消息
ban_words = [
    # "403","张三"
    ]

ban_msgs_regex = [
    # 需要过滤的消息（原始消息）匹配的正则表达式，匹配到的消息将被过滤，若不了解正则表达式请勿修改
    #"https?://[^\\s]+", # 匹配https链接
    #"\\d{4}-\\d{2}-\\d{2}", # 匹配日期
]
```
- `ban_words` 是关键词黑名单，包含这些词的消息会被过滤。
- `ban_msgs_regex` 是正则表达式黑名单，匹配到的消息会被过滤。

<hr class="custom_hr"/>

```toml
[tool]
enable_tool = true # 是否启用回复工具
```

- `enable_tool` 控制是否在普通聊天中启用工具功能

<hr class="custom_hr"/>

```toml
[mood]
enable_mood = false # 是否启用情绪系统
mood_update_threshold = 1 # 情绪更新阈值,越高，更新越慢
# 情感特征，影响情绪的变化情况
emotion_style = "情绪较为稳定，但遭遇特定事件的时候起伏较大"
```

- `enable_mood`: 控制是否启用情绪系统
- `mood_update_threshold`: 情绪更新频率
- `emotion_style`: 情绪波动描述，用于 mood 模块建模

<hr class="custom_hr"/>

```toml
[emoji]
emoji_chance = 0.6 # 麦麦激活表情包动作的概率

max_reg_num = 100 # 表情包最大注册数量
do_replace = true # 开启则在达到最大数量时删除（替换）表情包，关闭则达到最大数量时不会继续收集表情包
check_interval = 10 # 检查表情包（注册，破损，删除）的时间间隔(分钟)
steal_emoji = true # 是否偷取表情包，让麦麦可以将一些表情包据为己有
content_filtration = false  # 是否启用表情包过滤，只有符合该要求的表情包才会被保存
filtration_prompt = "符合公序良俗" # 表情包过滤要求，只有符合该要求的表情包才会被保存
```

此部分用于配置表情包相关功能：
- `emoji_chance`: 主动发送表情包动作的概率
- `max_reg_num` + `do_replace`: 控制表情包容量与淘汰策略
- `check_interval`: 扫描注册/破损/删除的周期（分钟）
- `steal_emoji`: 是否允许“偷表情”
- `content_filtration`/`filtration_prompt`: 过滤条件

<hr class="custom_hr"/>

```toml
[voice]
enable_asr = false # 是否启用语音识别，启用后麦麦可以识别语音消息，启用该功能需要配置语音识别模型[model.voice]s
```

- `enable_asr` 控制是否启用语音识别功能

<hr class="custom_hr"/>

```toml
[lpmm_knowledge] # lpmm知识库配置
enable = false # 是否启用lpmm知识库
lpmm_mode = "agent"
rag_synonym_search_top_k = 10 # 同义词搜索TopK
rag_synonym_threshold = 0.8 # 同义词阈值（相似度高于此阈值的词语会被认为是同义词）
info_extraction_workers = 3 # 实体提取同时执行线程数，非Pro模型不要设置超过5
qa_relation_search_top_k = 10 # 关系搜索TopK
qa_relation_threshold = 0.5 # 关系阈值（相似度高于此阈值的关系会被认为是相关的关系）
qa_paragraph_search_top_k = 1000 # 段落搜索TopK（不能过小，可能影响搜索结果）
qa_paragraph_node_weight = 0.05 # 段落节点权重（在图搜索&PPR计算中的权重，当搜索仅使用DPR时，此参数不起作用）
qa_ent_filter_top_k = 10 # 实体过滤TopK
qa_ppr_damping = 0.8 # PPR阻尼系数
qa_res_top_k = 3 # 最终提供的文段TopK
embedding_dimension = 1024 # 嵌入向量维度,应该与模型的输出维度一致
```

此部分用于配置 LPMM 知识库：
- `lpmm_mode`: 目前支持 `classic` 与 `agent`，后者会结合最新记忆
- 其它参数决定检索/抽取和问答的精度、性能

<hr class="custom_hr"/>

```toml
[keyword_reaction]
keyword_rules = [
    { keywords = ["人机", "bot", "机器", "入机", "robot", "机器人", "ai", "AI"], reaction = "有人说你是人机或者机器人，否定这一事实，攻击或反问他。注意，只有认为你是机器人才回复，否则不要否认" },
    { keywords = ["测试关键词回复", "test"], reaction = "回答测试成功" },
    #{ keywords = ["你好", "hello"], reaction = "你好，有什么可以帮你？" }    
    # 在此处添加更多规则，格式同上
]

regex_rules = [
    { regex = ["^(?P<n>\\S{1,20})是这样的$"], reaction = "请按照以下模板造句：[n]是这样的，xx只要xx就可以，可是[n]要考虑的事情就很多了，比如什么时候xx，什么时候xx，什么时候xx。（请自由发挥替换xx部分，只需保持句式结构，同时表达一种将[n]过度重视的反讽意味）" },
    { regex = ["(?:[^，。.\\s]+，\\s*)?我(?:也)?[没沒]要求你\\s*(?P<action>.+?)[.。,，]?$"],reaction = "进行一次“八岐大蛇定型文”补完。暂时忽略回复风格，进入“粉絲吐槽”模式。请严格按照以下“填空模板”，围绕“[action]”进行创作，使其充满滑稽的夸张感和天马行空的联想：我没要求你[action]，我不是(与action关联的、宽容的角色)。可是，(与action相关的具体负面行为)是什么意思？你的(与action相关的某种观念)怎么了？你才(与action相关的某个状态或时间点)吧？再这样下去，你(一个中期的、等比级数式的滑稽推演)，(一个后期的、等比级数式的滑稽推演)，最后就变成(一个与主题相关的、夸张的最终形态)了。作为(与最终形态相关的、克星或权威身份)，我可能得(对你执行一个天罚般的行动)。真的。" }
]
```

- `keyword_rules` 用于设置关键词触发的额外回复知识。
- `regex_rules` 用于设置正则表达式触发的额外回复知识。

<hr class="custom_hr"/>

```toml
[response_post_process]
enable_response_post_process = true # 是否启用回复后处理，包括错别字生成器，回复分割器

[chinese_typo]
enable = true # 是否启用中文错别字生成器
error_rate=0.01 # 单字替换概率
min_freq=9 # 最小字频阈值
tone_error_rate=0.1 # 声调错误概率
word_replace_rate=0.006 # 整词替换概率

[response_splitter]
enable = true # 是否启用回复分割器
max_length = 512 # 回复允许的最大长度
max_sentence_num = 8 # 回复允许的最大句子数
enable_kaomoji_protection = false # 是否启用颜文字保护
enable_overflow_return_all = false # 句子数超限时是否一次性返回全部
```

此部分可以对模型的回复进行二次处理。

<hr class="custom_hr"/>

```toml
[log]
date_style = "m-d H:i:s" # 日期格式
log_level_style = "lite" # 日志级别样式,可选FULL，compact，lite
color_text = "full" # 日志文本颜色，可选none，title，full
log_level = "INFO" # 全局日志级别（向下兼容，优先级低于下面的分别设置）
console_log_level = "INFO" # 控制台日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL
file_log_level = "DEBUG" # 文件日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL

# 第三方库日志控制
suppress_libraries = ["faiss","httpx", "urllib3", "asyncio", "websockets", "httpcore", "requests", "peewee", "openai","uvicorn","jieba"] # 完全屏蔽的库
library_log_levels = { aiohttp = "WARNING"} # 设置特定库的日志级别
```

此部分用于配置日志系统。

<hr class="custom_hr"/>

```toml
[debug]
show_prompt = false # 是否显示prompt
show_replyer_prompt = false # 是否显示回复器prompt
show_replyer_reasoning = false # 是否显示回复器推理
show_jargon_prompt = false # 是否显示jargon相关提示词
show_memory_prompt = false # 是否显示记忆检索相关提示词
show_planner_prompt = false # 是否显示planner的prompt和原始返回结果
show_lpmm_paragraph = false # 是否显示lpmm找到的相关文段日志
```

- 这些开关可以按模块分别输出调试信息：prompt、推理、黑话、记忆、planner、LPMM等

<hr class="custom_hr"/>

```toml
[maim_message]
auth_token = [] # 认证令牌，用于API验证，为空则不启用验证
# 以下项目若要使用需要打开use_custom，并单独配置maim_message的服务器
use_custom = false # 是否启用自定义的maim_message服务器，注意这需要设置新的端口，不能与.env重复
host="127.0.0.1"
port=8090
mode="ws" # 支持ws和tcp两种模式
use_wss = false # 是否使用WSS安全连接，只支持ws模式
cert_file = "" # SSL证书文件路径，仅在use_wss=true时有效
key_file = "" # SSL密钥文件路径，仅在use_wss=true时有效
```

高级设置，通常无需修改。

<hr class="custom_hr"/>

```toml
[telemetry] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能
chat_prompts = []
```

- `telemetry` 控制是否发送统计信息
- `experimental.chat_prompts` 可为特定 `platform:id:type` 新增额外提示词

<hr class="custom_hr"/>

```toml
[relationship]
enable_relationship = true # 是否启用关系系统
```

- 关系系统目前暂不可用，但保留配置位，保持默认即可。

## 注意事项

1. **API密钥安全**：
    - 妥善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. **配置修改**：
    - 修改配置后需重启服务
    - 模型配置现在在独立的 `model_config.toml` 文件中
    - QQ号和群号使用数字格式(机器人QQ号除外)
    - **配置文件版本号需要递增**

3. **其他说明**：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置
    - 配置文件现在分为两个：`bot_config.toml` 和 `model_config.toml`

4. **错误排查**：
    - 配置错误：检查配置文件语法是否正确
    - 功能异常：确认相关功能开关是否启用
    - 模型问题：检查 `model_config.toml` 中的模型配置