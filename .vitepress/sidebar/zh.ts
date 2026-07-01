import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '功能介绍', link: '/features/' },
  { text: '用户手册', link: '/manual/deployment/' },
  { text: '开发文档', link: '/develop/' },
  { text: '更新日志', link: '/changelog/' },
  {
    text: 'GitHub',
    items: [
      { text: 'MaiBot', link: 'https://github.com/MaiM-with-u/MaiBot' },
      { text: 'MaiBot Docs', link: 'https://github.com/MaiM-with-u/docs' },
    ]
  },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/manual/': [
    {
      text: '部署与安装',
      collapsed: false,
      items: [
        { text: '部署概览', link: '/manual/deployment/' },
        { text: '源码安装', link: '/manual/deployment/installation' },
        //{ text: 'Agent 安装指南', link: '/manual/deployment/installation-agent' },
        { text: '一键包安装', link: '/manual/deployment/one_key' },
        { text: 'Docker安装', link: '/manual/deployment/docker' },
      ]
    },
    {
      text: '适配器',
      collapsed: false,
      items: [
        { text: '适配器概览', link: '/manual/adapters/' },
        { text: 'NapCat QQ 连接', link: '/manual/adapters/napcat' },
        { text: 'GoCQ 适配器', link: '/manual/adapters/gocq' },
        { text: 'SnowLuma 适配器', link: '/manual/adapters/snowluma' },
        { text: 'Telegram 适配器', link: '/manual/adapters/telegram' },
        { text: 'Discord 适配器', link: '/manual/adapters/discord' },
      ]
    },
    {
      text: '配置说明',
      collapsed: false,
      items: [
        { text: '配置概览', link: '/manual/configuration/' },
        { text: 'Bot 配置', link: '/manual/configuration/bot-config' },
        { text: '模型配置', link: '/manual/configuration/model-config' },
        { text: '模型额外参数', link: '/manual/configuration/model-extra-params' },
        { text: 'MCP 配置', link: '/manual/configuration/mcp-config' },
        { text: 'A_Memorix 配置', link: '/manual/configuration/amemorix-config' },
      ]
    },
    {
      text: '功能介绍',
      collapsed: false,
      items: [
        { text: '功能概览', link: '/manual/features/' },
        { text: '消息是怎么处理的', link: '/manual/features/message-pipeline' },
        { text: 'MaiBot 是怎么思考的', link: '/manual/features/maisaka-reasoning' },
        { text: 'MaiBot 的记忆', link: '/manual/features/memory-system' },
        { text: '学说话', link: '/manual/features/learning' },
        { text: '表情包系统', link: '/manual/features/emoji-system' },
        { text: 'MCP 工具', link: '/manual/features/mcp' },
      ]
    },
    {
      text: 'WebUI 管理',
      collapsed: false,
      items: [
        { text: 'WebUI 概览', link: '/manual/webui/' },
        { text: '配置管理', link: '/manual/webui/config-management' },
        { text: '记忆管理', link: '/manual/webui/memory-management' },
        { text: '插件管理', link: '/manual/webui/plugin-management' },
        { text: '聊天与统计', link: '/manual/webui/chat-stats' },
      ]
    },
    {
      text: '常见问题',
      collapsed: false,
      items: [
        { text: 'FAQ', link: '/manual/faq/' },
        { text: 'EULA', link: '/manual/faq/EULA' },
      ]
    },
  ],
  '/changelog/': [
    {
      text: '更新日志',
      collapsed: false,
      items: [
        { text: '版本总览', link: '/changelog/' },
        { text: '1.0.0 更新专题', link: '/changelog/v1-0-0' },
      ]
    },
  ],
  '/develop/': [
    {
      text: '总览',
      collapsed: false,
      items: [
        { text: '开发指南', link: '/develop/' },
        { text: '架构设计', link: '/develop/architecture' },
        { text: '贡献指南', link: '/develop/contributing' },
      ]
    },
    {
      text: '架构详解',
      collapsed: false,
      items: [
        { text: '消息管线', link: '/develop/architecture/message-pipeline' },
        { text: 'Maisaka 推理引擎', link: '/develop/architecture/maisaka-reasoning' },
        { text: '记忆系统', link: '/develop/architecture/memory-system' },
        { text: 'WebUI 内部机制', link: '/develop/architecture/webui-internals' },
        { text: '事件总线 (EventBus)', link: '/develop/architecture/event-bus' },
        { text: '工具系统 (Tool System)', link: '/develop/architecture/tool-system' },
        { text: '服务层', link: '/develop/architecture/service-layer' },
        { text: '表达学习', link: '/develop/architecture/expression-learning' },
        { text: '表情系统内部', link: '/develop/architecture/emoji-internals' },
        { text: 'MCP 集成', link: '/develop/architecture/mcp-integration' },
        { text: 'Prompt 模板', link: '/develop/architecture/prompt-templates' },
        { text: '全局管理器', link: '/develop/architecture/global-managers' },
      ]
    },
    {
      text: '插件开发',
      collapsed: false,
      items: [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '开发指南', link: '/develop/plugin-dev/' },
            { text: 'Vibe Coding 指南', link: '/develop/plugin-dev/vibe-coding' },
            { text: 'Manifest', link: '/develop/plugin-dev/manifest' },
            { text: '生命周期', link: '/develop/plugin-dev/lifecycle' },
            { text: '配置管理', link: '/develop/plugin-dev/config' },
          ]
        },
        {
          text: '组件开发',
          collapsed: false,
          items: [
            { text: 'Tool', link: '/develop/plugin-dev/tools' },
            { text: 'Command', link: '/develop/plugin-dev/commands' },
            { text: 'Hook 处理器', link: '/develop/plugin-dev/hooks' },
            { text: '事件处理器', link: '/develop/plugin-dev/event-handlers' },
            { text: 'API 组件', link: '/develop/plugin-dev/api-components' },
            { text: '消息网关', link: '/develop/plugin-dev/message-gateway' },
            { text: 'LLMProvider 组件', link: '/develop/plugin-dev/llmprovider' },
            { text: 'Action (Legacy)', link: '/develop/plugin-dev/actions' },
          ]
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: 'API 参考', link: '/develop/plugin-dev/api-reference' },
          ]
        },
      ]
    },
    {
      text: '适配器开发',
      collapsed: false,
      items: [
        { text: '开发指南', link: '/develop/adapter-dev/' },
        { text: 'PlatformIO 驱动', link: '/develop/adapter-dev/platform-io' },
      ]
    },
  ],
}
