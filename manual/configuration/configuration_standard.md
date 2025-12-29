#  配置指南

## 简介

这个配置文件主要涉及麦麦的所有行为表现

（如果你要配置哪些群可以聊天，需要到适配器设置中配置）

如果你要了解模型配置的内容，包括该选用哪些模型，请参考[模型配置教程](./configuration_model_standard)

## 配置文件结构

 MaiBot 现在使用独立的 `bot_config.toml` 文件来配置机器人行为。配置文件包含以下主要部分：

- `[bot]` - 机器人基本信息
- `[personality]` - 人设、表达风格
- `[expression]` - 表达学习配置（包含黑话配置）
- `[chat]` - 聊天节奏与上下文
- `[memory]` - 记忆模块配置
- `[dream]` - 做梦功能配置
- `[message_receive]` - 消息过滤规则
- `[tool]` - 工具开关
- `[emoji]` - 表情包功能
- `[voice]` - 语音识别
- `[lpmm_knowledge]` - LPMM知识库
- `[keyword_reaction]` - 关键词/正则触发回复
- `[response_post_process]` - 回复后处理
- `[log]` - 日志配置
- `[debug]` - 调试开关
- `[maim_message]` - maim_message 服务
- `[webui]` - WebUI 配置
- `[telemetry]` - 统计信息
- `[experimental]` - 实验性功能

## 配置文件详解
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
# 建议100字以内，描述人格特质 和 身份特征
personality = "是一个大二在读女大学生，现在正在上网和群友聊天，有时有点攻击性，有时比较温柔"  
#アイデンティティがない 生まれないらららら
# 描述麦麦说话的表达风格，表达习惯，如要修改，可以酌情新增内容，建议1-2行
reply_style = "请不要刻意突出自身学科背景。可以参考贴吧，知乎和微博的回复风格。"

# 多种回复风格，根据概率随机选择表达风格
multiple_reply_style = [
    # "你的风格平淡但不失讽刺，很简短,很白话。可以参考贴吧，微博的回复风格。",
    # "用1-2个字进行回复",
    # "用1-2个符号进行回复",
    # "言辭凝練古雅，穿插《論語》經句卻不晦澀，以文言短句為基，輔以淺白語意，持長者溫和風範，全用繁體字表達，具先秦儒者談吐韻致。",
    # "带点翻译腔，但不要太长",
]

# 使用多种回复风风格的概率
multiple_probability = 0.3

# 麦麦的说话规则和行为规则:
plan_style = """
1.思考**所有**的可用的action中的**每个动作**是否符合当下条件，如果动作使用条件符合聊天内容就使用
2.如果相同的内容已经被执行，请不要重复执行
3.你对技术相关话题，游戏和动漫相关话题感兴趣，也对日常话题感兴趣，不喜欢太过沉重严肃的话题
4.请控制你的发言频率，不要太过频繁的发言
5.如果有人对你感到厌烦，请减少回复
6.如果有人在追问你，或者话题没有说完，请你继续回复"""

# 麦麦私聊的说话规则，行为风格:
private_plan_style = """
1.思考**所有**的可用的action中的**每个动作**是否符合当下条件，如果动作使用条件符合聊天内容就使用
2.如果相同的内容已经被执行，请不要重复执行
3.某句话如果已经被回复过，不要重复回复"""

# 多重人格，根据概率随机选择人格
states = [
    "是一个女大学生，喜欢上网聊天，会刷小红书。" ,
    "是一个大二心理学生，会刷贴吧和中国知网。" ,
    "是一个赛博网友，最近很想吐槽人。" 
]

# 使用多重人格的概率
state_probability = 0.3

# 麦麦识图规则，不建议修改
visual_style = "请用中文描述这张图片的内容。如果有文字，请把文字描述概括出来，请留意其主题，直观感受，输出为一段平文本，最多30字，请注意不要分点，就输出一段文本"
```

这部分是麦麦的核心人设部分。负责描述麦麦的核心人格特点和身份特点。

- `personality`: 人格特质和身份特征描述，建议100字以内
- `reply_style`: 说话的表达风格和习惯，建议1-2行
- `multiple_reply_style`: 多种回复风格列表，根据概率随机选择
- `multiple_probability`: 使用多种回复风格的概率（0-1之间）
- `plan_style`: 说话规则和行为风格，包含兴趣偏好和发言控制
- `visual_style`: 识图规则
- `private_plan_style`: 私聊专用的说话规则
- `states` 与 `state_probability`: 配置人格多样性，按照概率替换基础 `personality`

<hr class="custom_hr"/>

```toml
[expression]
# 表达学习配置
learning_list = [ # 表达学习配置列表，支持按聊天流配置
    ["", "enable", "enable", "enable"],  # 全局配置：使用表达，启用学习，启用jargon学习
    ["qq:1919810:group", "enable", "enable", "enable"],  # 特定群聊配置：使用表达，启用学习，启用jargon学习
    ["qq:114514:private", "enable", "disable", "disable"],  # 特定私聊配置：使用表达，禁用学习，禁用jargon学习
    # 格式说明：
    # 第一位: chat_stream_id，空字符串表示全局配置
    # 第二位: 是否使用学到的表达 ("enable"/"disable")
    # 第三位: 是否学习表达 ("enable"/"disable") 
    # 第四位: 是否启用jargon学习 ("enable"/"disable")
]

expression_groups = [
    # ["*"], # 全局共享组：所有chat_id共享学习到的表达方式（取消注释以启用全局共享）
    ["qq:1919810:private","qq:114514:private","qq:1111111:group"], # 特定互通组，相同组的chat_id会共享学习到的表达方式
    # 格式说明：
    # ["*"] - 启用全局共享，所有聊天流共享表达方式
    # ["qq:123456:private","qq:654321:group"] - 特定互通组，组内chat_id共享表达方式
    # 注意：如果为群聊，则需要设置为group，如果设置为私聊，则需要设置为private
]

expression_checked_only = true # 麦麦只会使用检查过的表达方式

expression_self_reflect = true # 是否启用自动表达优化
expression_auto_check_interval = 600 # 表达方式自动检查的间隔时间（单位：秒），默认值：600秒（10分钟）
expression_auto_check_count = 20 # 每次自动检查时随机选取的表达方式数量，默认值：20条
expression_auto_check_custom_criteria = [] # 表达方式自动检查的额外自定义评估标准，格式：["标准1", "标准2", "标准3", ...]，这些标准会被添加到评估提示词中，作为额外的评估要求

expression_manual_reflect = false # 是否启用手动表达优化
manual_reflect_operator_id = "" # 手动表达优化操作员ID，格式：platform:id:type (例如 "qq:123456:private" 或 "qq:654321:group")
allow_reflect = [] # 允许进行表达反思的聊天流ID列表，格式：["qq:123456:private", "qq:654321:group", ...]，只有在此列表中的聊天流才会提出问题并跟踪。如果列表为空，则所有聊天流都可以进行表达反思（前提是 reflect = true）

all_global_jargon = true # 是否开启全局黑话模式，注意，此功能关闭后，已经记录的全局黑话不会改变，需要手动删除
enable_jargon_explanation = true # 是否在回复前尝试对上下文中的黑话进行解释（关闭可减少一次LLM调用，仅影响回复前的黑话匹配与解释，不影响黑话学习）
jargon_mode = "planner" # 黑话解释来源模式，可选： "context"（使用上下文自动匹配黑话） 或 "planner"（仅使用Planner在reply动作中给出的unknown_words列表）
```

- `learning_list` 支持按聊天流配置表达学习，可以针对不同的群聊或私聊设置不同的学习策略，第四位字段改为jargon学习开关
- `expression_groups` 可以设置互通组，让麦麦在不同的聊天中共享学习到的表达方式
- `expression_checked_only`: 控制是否只使用检查过的表达方式
- `expression_self_reflect`: 启用自动表达优化功能
- `expression_auto_check_interval`: 自动检查表达方式的间隔时间
- `expression_auto_check_count`: 每次自动检查时选取的表达方式数量
- `expression_auto_check_custom_criteria`: 自定义评估标准列表
- `expression_manual_reflect`: 启用手动表达优化功能
- `manual_reflect_operator_id`: 手动表达优化的操作员ID
- `allow_reflect`: 允许进行表达反思的聊天流ID列表
- `all_global_jargon`: 是否开启全局黑话模式（原jargon配置已移至此）
- `enable_jargon_explanation`: 是否在回复前解释黑话
- `jargon_mode`: 黑话解释来源模式，可选 "context" 或 "planner"

<hr class="custom_hr"/>

```toml
[chat] # 麦麦的聊天设置
talk_value = 1 # 聊天频率，越小越沉默，范围0-1
mentioned_bot_reply = true # 是否启用提及必回复
max_context_size = 30 # 上下文长度
planner_smooth = 3 # 规划器平滑，增大数值会减小planner负荷，略微降低反应速度，推荐1-5，0为关闭，必须大于等于0
think_mode = "dynamic" # 思考模式，可选：classic（默认浅度思考和回复）、deep（会进行比较长的，深度回复）、dynamic（动态选择两种模式）

enable_talk_value_rules = true # 是否启用动态发言频率规则

# 动态发言频率规则：按时段/按chat_id调整 talk_value（优先匹配具体chat，再匹配全局）
# 推荐格式（对象数组）：{ target="platform:id:type" 或 "", time="HH:MM-HH:MM", value=0.5 }
# 说明:
# - target 为空字符串表示全局；type 为 group/private，例如："qq:1919810:group" 或 "qq:114514:private"；
# - 支持跨夜区间，例如 "23:00-02:00"；数值范围建议 0-1，如果 value 设置为0会自动转换为0.0001以避免除以零错误。
talk_value_rules = [
    { target = "", time = "00:00-08:59", value = 0.8 },
    { target = "", time = "09:00-22:59", value = 1.0 },
    { target = "qq:1919810:group", time = "20:00-23:59", value = 0.6 },
    { target = "qq:114514:private", time = "00:00-23:59", value = 0.3 },
]
```

这部分是麦麦的聊天节奏与上下文控制：
- `talk_value`: 全局聊天活跃度
- `mentioned_bot_reply`: 是否启用提及必回复
- `max_context_size`: 上下文窗口长度
- `planner_smooth`: 规划器平滑，增大数值会减小planner负荷，略微降低反应速度，推荐1-5，0为关闭，必须大于等于0
- `think_mode`: 思考模式，可选 "classic"（默认浅度思考和回复）、"deep"（会进行比较长的，深度回复）、"dynamic"（动态选择两种模式）
- `enable_talk_value_rules` + `talk_value_rules`: 根据时间段或 chat_id 调整 `talk_value`，支持跨夜区间

<hr class="custom_hr"/>

```toml
[memory]
max_agent_iterations = 5 # 记忆思考深度（最低为1）
agent_timeout_seconds = 180.0 # 最长回忆时间（秒），默认180秒
global_memory = false # 是否允许记忆检索进行全局查询
global_memory_blacklist = [
    
] # 全局记忆黑名单，当启用全局记忆时，不将特定聊天流纳入检索。格式: ["platform:id:type", ...]，例如: ["qq:1919810:private", "qq:114514:group"]
planner_question = true # 是否使用 Planner 提供的 question 作为记忆检索问题。开启后，当 Planner 在 reply 动作中提供了 question 时，直接使用该问题进行记忆检索，跳过 LLM 生成问题的步骤；关闭后沿用旧模式，使用 LLM 生成问题
```

- `max_agent_iterations`: 控制记忆检索与总结时，代理最多迭代的次数，值越大越耗时，默认5次
- `agent_timeout_seconds`: 最长回忆时间（秒），超过此时间会停止回忆过程，默认180秒
- `global_memory`: 是否允许记忆检索进行全局查询，开启后可以跨聊天流检索记忆
- `global_memory_blacklist`: 全局记忆黑名单，当启用全局记忆时，不将特定聊天流纳入检索
- `planner_question`: 是否使用 Planner 提供的 question 作为记忆检索问题，开启后可跳过 LLM 生成问题的步骤

<hr class="custom_hr"/>

```toml
[dream]
interval_minutes = 60 # 做梦时间间隔（分钟），默认60分钟
max_iterations = 20 # 做梦最大轮次，默认20轮
first_delay_seconds = 1800 # 程序启动后首次做梦前的延迟时间（秒），默认1800秒（30分钟）

# 做梦结果推送目标，格式为 "platform:user_id"
# 例如: "qq:123456" 表示在做梦结束后，将梦境文本额外发送给该QQ私聊用户。
# 为空字符串时不推送。
dream_send = ""

# 做梦时间段配置，格式：["HH:MM-HH:MM", ...]
# 如果列表为空，则表示全天允许做梦。
# 如果配置了时间段，则只有在这些时间段内才会实际执行做梦流程。
# 时间段外，调度器仍会按间隔检查，但不会进入做梦流程。
# 支持跨夜区间，例如 "23:00-02:00" 表示从23:00到次日02:00。
# 示例：
dream_time_ranges = [
    # "09:00-22:00",      # 白天允许做梦
    "23:00-10:00",      # 跨夜时间段（23:00到次日10:00）
]
# dream_time_ranges = []
```

- `interval_minutes`: 做梦时间间隔（分钟），默认60分钟
- `max_iterations`: 做梦最大轮次，默认20轮
- `first_delay_seconds`: 程序启动后首次做梦前的延迟时间（秒），默认1800秒（30分钟）
- `dream_send`: 做梦结果推送目标，格式为 "platform:user_id"，为空字符串时不推送
- `dream_time_ranges`: 做梦时间段配置，支持跨夜区间，列表为空表示全天允许做梦

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
enable_tool = true # 是否启用工具
```

- `enable_tool` 控制是否在普通聊天中启用工具功能

<hr class="custom_hr"/>

```toml
[emoji]
emoji_chance = 0.4 # 麦麦激活表情包动作的概率
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
enable_asr = false # 是否启用语音识别，启用后麦麦可以识别语音消息，启用该功能需要配置语音识别模型[model_task_config.voice]
```

- `enable_asr` 控制是否启用语音识别功能

<hr class="custom_hr"/>

```toml
[lpmm_knowledge] # lpmm知识库配置
enable = false # 是否启用lpmm知识库
lpmm_mode = "agent"
# 可选择classic传统模式/agent 模式，结合新的记忆一同使用
rag_synonym_search_top_k = 10 # 同义检索TopK
rag_synonym_threshold = 0.8 # 同义阈值，相似度高于该值的关系会被当作同义词
info_extraction_workers = 3 # 实体抽取同时执行线程数，非Pro模型不要设置超过5
qa_relation_search_top_k = 10 # 关系检索TopK
qa_relation_threshold = 0.5 # 关系阈值，相似度高于该值的关系会被认为是相关关系
qa_paragraph_search_top_k = 1000 # 段落检索TopK（不能过小，可能影响搜索结果）
qa_paragraph_node_weight = 0.05 # 段落节点权重（在图搜索&PPR计算中的权重，当搜索仅使用DPR时，此参数不起作用）
qa_ent_filter_top_k = 10 # 实体过滤TopK
qa_ppr_damping = 0.8 # PPR阻尼系数
qa_res_top_k = 3 # 最终提供段落TopK
embedding_dimension = 1024 # 嵌入向量维度,输出维度一致
# 性能与降级参数（低配机器可下调）
# 低配机器参考：单/双核或内存≤4GB（如轻量云主机/云函数/开发板），建议先关闭PPR并降低并发
max_embedding_workers = 3 # 嵌入/抽取并发线程数
embedding_chunk_size = 4 # 每批嵌入的条数
max_synonym_entities = 2000 # 同义边参与的实体数上限，超限则跳过
enable_ppr = true # 是否启用PPR，低配机器可关闭
```

此部分用于配置 LPMM 知识库：
- `lpmm_mode`: 目前支持 `classic`（传统模式）与 `agent`（模式，结合新的记忆一同使用）
- `rag_synonym_search_top_k`: 同义检索TopK
- `rag_synonym_threshold`: 同义阈值，相似度高于该值的关系会被当作同义词
- `info_extraction_workers`: 实体抽取同时执行线程数，非Pro模型不要设置超过5
- `qa_relation_search_top_k`: 关系检索TopK
- `qa_relation_threshold`: 关系阈值，相似度高于该值的关系会被认为是相关关系
- `qa_paragraph_search_top_k`: 段落检索TopK（不能过小，可能影响搜索结果）
- `qa_paragraph_node_weight`: 段落节点权重（在图搜索&PPR计算中的权重，当搜索仅使用DPR时，此参数不起作用）
- `qa_ent_filter_top_k`: 实体过滤TopK
- `qa_ppr_damping`: PPR阻尼系数
- `qa_res_top_k`: 最终提供段落TopK
- `embedding_dimension`: 嵌入向量维度，输出维度一致
- `max_embedding_workers`: 嵌入/抽取并发线程数（性能与降级参数，低配机器可下调）
- `embedding_chunk_size`: 每批嵌入的条数（性能与降级参数）
- `max_synonym_entities`: 同义边参与的实体数上限，超限则跳过（性能与降级参数）
- `enable_ppr`: 是否启用PPR，低配机器可关闭（性能与降级参数）

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
enable_overflow_return_all = false # 是否在句子数量超出回复允许的最大句子数时一次性返回全部内容
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
auth_token = [] # 认证令牌，用于旧版API验证，为空则不启用验证

# 新版API Server配置（额外监听端口）
enable_api_server = false # 是否启用额外的新版API Server
api_server_host = "0.0.0.0" # 新版API Server主机地址
api_server_port = 8090 # 新版API Server端口号
api_server_use_wss = false # 新版API Server是否启用WSS
api_server_cert_file = "" # 新版API Server SSL证书文件路径
api_server_key_file = "" # 新版API Server SSL密钥文件路径
api_server_allowed_api_keys = [] # 新版API Server允许的API Key列表，为空则允许所有连接
```

高级设置，通常无需修改。

<hr class="custom_hr"/>

```toml
[webui] # WebUI 独立服务器配置
# 注意: WebUI 的监听地址(host)和端口(port)已移至 .env 文件中的 WEBUI_HOST 和 WEBUI_PORT
enabled = true # 是否启用WebUI
mode = "production" # 模式: development(开发) 或 production(生产)

# 防爬虫配置
anti_crawler_mode = "loose" # 防爬虫模式: false(禁用) / strict(严格) / loose(宽松) / basic(基础-只记录不阻止)
allowed_ips = "127.0.0.1" # IP白名单（逗号分隔，支持精确IP、CIDR格式和通配符）
                          # 示例: 127.0.0.1,192.168.1.0/24,172.17.0.0/16
trusted_proxies = "" # 信任的代理IP列表（逗号分隔），只有来自这些IP的X-Forwarded-For才被信任
                     # 示例: 127.0.0.1,192.168.1.1,172.17.0.1
trust_xff = false # 是否启用X-Forwarded-For代理解析（默认false）
                  # 启用后，仍要求直连IP在trusted_proxies中才会信任XFF头
secure_cookie = false # 是否启用安全Cookie（仅通过HTTPS传输，默认false）
```

此部分用于配置 WebUI 独立服务器：
- `enabled`: 是否启用WebUI
- `mode`: 模式，可选 "development"（开发）或 "production"（生产）
- `anti_crawler_mode`: 防爬虫模式，可选 false（禁用）、"strict"（严格）、"loose"（宽松）、"basic"（基础-只记录不阻止）
- `allowed_ips`: IP白名单（逗号分隔，支持精确IP、CIDR格式和通配符）
- `trusted_proxies`: 信任的代理IP列表（逗号分隔）
- `trust_xff`: 是否启用X-Forwarded-For代理解析
- `secure_cookie`: 是否启用安全Cookie（仅通过HTTPS传输）

**注意**: WebUI 的监听地址(host)和端口(port)已移至 .env 文件中的 WEBUI_HOST 和 WEBUI_PORT

<hr class="custom_hr"/>

```toml
[telemetry] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能
# 为指定聊天添加额外的prompt配置
# 格式: ["platform:id:type:prompt内容", ...]
# 示例:
# chat_prompts = [
#     "qq:114514:group:这是一个摄影群，你精通摄影知识",
#     "qq:19198:group:这是一个二次元交流群",
#     "qq:114514:private:这是你与好朋友的私聊"
# ]
chat_prompts = []
```

- `telemetry` 控制是否发送统计信息
- `experimental.chat_prompts` 可为特定 `platform:id:type` 新增额外提示词，格式为 `["platform:id:type:prompt内容", ...]`

<hr class="custom_hr"/>

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