import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '用户手册', link: '/manual/deployment/' },
  { text: '开发文档', items: [
    { text: '麦麦开发', link: '/develop/' },
    { text: '插件开发', link: '/plugin/' },
  ]},
  { text: '常见问题', link: '/faq/' },
  { text: '更新日志', link: '/changelog/' },
  { text: '关于', link: '/about/' },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/plugin/': [
    {
      text: '入门',
      collapsed: false,
      items: [
        { text: '开发指南', link: '/plugin/' },
        { text: 'Vibe Coding 指南', link: '/plugin/vibe-coding' },
        { text: 'Manifest', link: '/plugin/manifest' },
        { text: '生命周期', link: '/plugin/lifecycle' },
        { text: '配置管理', link: '/plugin/config' },
      ]
    },
    {
      text: '组件开发',
      collapsed: false,
      items: [
        { text: 'Tool', link: '/plugin/tools' },
        { text: 'Command', link: '/plugin/commands' },
        { text: 'Hook 处理器', link: '/plugin/hooks' },
        { text: '事件处理器', link: '/plugin/event-handlers' },
        { text: 'API 组件', link: '/plugin/api-components' },
        { text: '消息网关', link: '/plugin/message-gateway' },
        { text: 'LLMProvider 组件', link: '/plugin/llmprovider' },
        { text: 'Action (Legacy)', link: '/plugin/actions' },
      ]
    },
    {
      text: '参考',
      collapsed: false,
      items: [
        { text: 'API 参考', link: '/plugin/api-reference' },
      ]
    },
  ],
  '/about/': [
    {
      text: '关于',
      collapsed: false,
      items: [
        { text: '关于 MaiBot', link: '/about/' },
        { text: 'EULA', link: '/about/EULA' },
      ]
    },
  ],
  '/faq/': [
    {
      text: '常见问题',
      collapsed: false,
      items: [
        { text: 'FAQ', link: '/faq/' },
        { text: '错误排查', link: '/faq/error-troubleshooting' },
      ]
    },
  ],
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
        { text: '消息处理流程', link: '/manual/features/message-pipeline' },
        { text: 'MaiBot 思考机制', link: '/manual/features/maisaka-reasoning' },
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

  ],
  '/changelog/': [
    {
      text: '更新日志',
      collapsed: false,
      items: [
        { text: '版本总览', link: '/changelog/' },
      ]
    },
    {
      text: '更新专题',
      collapsed: false,
      items: [
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
        { text: '事件总线', link: '/develop/architecture/event-bus' },
        { text: '工具系统', link: '/develop/architecture/tool-system' },
        { text: '服务层', link: '/develop/architecture/service-layer' },
        { text: '表达学习', link: '/develop/architecture/expression-learning' },
        { text: '表情系统内部', link: '/develop/architecture/emoji-internals' },
        { text: 'MCP 集成', link: '/develop/architecture/mcp-integration' },
        { text: 'Prompt 模板', link: '/develop/architecture/prompt-templates' },
        { text: '全局管理器', link: '/develop/architecture/global-managers' },
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
