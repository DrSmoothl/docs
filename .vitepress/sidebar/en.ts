import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/en/' },
  { text: 'Features', link: '/en/features/' },
  { text: 'Manual', link: '/en/manual/deployment/' },
  { text: 'Development', link: '/en/develop/' },
  { text: 'Changelog', link: '/en/changelog/' },
  {
    text: 'GitHub',
    items: [
      { text: 'MaiBot', link: 'https://github.com/MaiM-with-u/MaiBot' },
      { text: 'MaiBot Docs', link: 'https://github.com/MaiM-with-u/docs' },
    ]
  },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/en/manual/': [
    {
      text: 'Quick Start',
      collapsed: false,
      items: [
        { text: 'Get Started in 5 Minutes', link: '/en/manual/getting-started/' },
      ]
    },
    {
      text: 'Deployment & Installation',
      collapsed: false,
      items: [
        { text: 'Deployment Overview', link: '/en/manual/deployment/' },
        { text: 'Installation Guide', link: '/en/manual/deployment/installation' },
        { text: 'One-Click Package', link: '/en/manual/deployment/one_key' },
        { text: 'Docker Deployment', link: '/en/manual/deployment/docker' },
      ]
    },
    {
      text: 'Configuration',
      collapsed: false,
      items: [
        { text: 'Configuration Overview', link: '/en/manual/configuration/' },
        { text: 'Bot Config', link: '/en/manual/configuration/bot-config' },
        { text: 'Model Config', link: '/en/manual/configuration/model-config' },
        { text: 'Model Extra Parameters', link: '/en/manual/configuration/model-extra-params' },
        { text: 'MCP Configuration', link: '/en/manual/configuration/mcp-config' },
        { text: 'A_Memorix Config', link: '/en/manual/configuration/amemorix-config' },
      ]
    },
    {
      text: 'Features',
      collapsed: false,
      items: [
        { text: 'Features Overview', link: '/en/manual/features/' },
        { text: 'How Messages are Processed', link: '/en/manual/features/message-pipeline' },
        { text: 'How MaiBot Thinks', link: '/en/manual/features/maisaka-reasoning' },
        { text: 'MaiBot\'s Memory', link: '/en/manual/features/memory-system' },
        { text: 'Learning to Speak', link: '/en/manual/features/learning' },
        { text: 'Emoji System', link: '/en/manual/features/emoji-system' },
        { text: 'MCP Tools', link: '/en/manual/features/mcp' },
      ]
    },
    {
      text: 'WebUI Management',
      collapsed: false,
      items: [
        { text: 'WebUI Overview', link: '/en/manual/webui/' },
        { text: 'Config Management', link: '/en/manual/webui/config-management' },
        { text: 'Memory Management', link: '/en/manual/webui/memory-management' },
        { text: 'Plugin Management', link: '/en/manual/webui/plugin-management' },
        { text: 'Chat & Stats', link: '/en/manual/webui/chat-stats' },
      ]
    },
    {
      text: 'Adapters',
      collapsed: false,
      items: [
        { text: 'Adapters Overview', link: '/en/manual/adapters/' },
        { text: 'NapCat QQ Connection', link: '/en/manual/adapters/napcat' },
        { text: 'GoCQ Adapter', link: '/en/manual/adapters/gocq' },
        { text: 'SnowLuma Adapter', link: '/en/manual/adapters/snowluma' },
        { text: 'Telegram Adapter', link: '/en/manual/adapters/telegram' },
        { text: 'Discord Adapter', link: '/en/manual/adapters/discord' },
      ]
    },
    {
      text: 'FAQ',
      collapsed: false,
      items: [
        { text: 'FAQ', link: '/en/manual/faq/' },
        { text: 'Error Troubleshooting', link: '/en/manual/faq/error-troubleshooting' },
        { text: 'EULA', link: '/en/manual/faq/EULA' },
      ]
    },
  ],
  '/en/develop/': [
    {
      text: 'Overview',
      collapsed: false,
      items: [
        { text: 'Development Guide', link: '/en/develop/' },
        { text: 'Architecture Design', link: '/en/develop/architecture' },
        { text: 'Contributing Guide', link: '/en/develop/contributing' },
      ]
    },
    {
      text: 'Architecture',
      collapsed: false,
      items: [
        { text: 'Message Pipeline', link: '/en/develop/architecture/message-pipeline' },
        { text: 'Maisaka Reasoning Engine', link: '/en/develop/architecture/maisaka-reasoning' },
        { text: 'Memory System', link: '/en/develop/architecture/memory-system' },
        { text: 'WebUI Internals', link: '/en/develop/architecture/webui-internals' },
        { text: 'Event Bus', link: '/en/develop/architecture/event-bus' },
        { text: 'Tool System', link: '/en/develop/architecture/tool-system' },
        { text: 'Service Layer', link: '/en/develop/architecture/service-layer' },
        { text: 'Expression Learning', link: '/en/develop/architecture/expression-learning' },
        { text: 'Emoji Internals', link: '/en/develop/architecture/emoji-internals' },
        { text: 'MCP Integration', link: '/en/develop/architecture/mcp-integration' },
        { text: 'Prompt Templates', link: '/en/develop/architecture/prompt-templates' },
        { text: 'Global Managers', link: '/en/develop/architecture/global-managers' },
      ]
    },
    {
      text: 'Plugin Development',
      collapsed: false,
      items: [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Development Guide', link: '/en/develop/plugin-dev/' },
            { text: 'Vibe Coding Guide', link: '/en/develop/plugin-dev/vibe-coding' },
            { text: 'Manifest', link: '/en/develop/plugin-dev/manifest' },
            { text: 'Lifecycle', link: '/en/develop/plugin-dev/lifecycle' },
            { text: 'Configuration', link: '/en/develop/plugin-dev/config' },
          ]
        },
        {
          text: 'Components',
          collapsed: false,
          items: [
            { text: 'Tool', link: '/en/develop/plugin-dev/tools' },
            { text: 'Command', link: '/en/develop/plugin-dev/commands' },
            { text: 'Hook Handler', link: '/en/develop/plugin-dev/hooks' },
            { text: 'Event Handler', link: '/en/develop/plugin-dev/event-handlers' },
            { text: 'API Component', link: '/en/develop/plugin-dev/api-components' },
            { text: 'Message Gateway', link: '/en/develop/plugin-dev/message-gateway' },
            { text: 'LLMProvider Component', link: '/en/develop/plugin-dev/llmprovider' },
            { text: 'Action (Legacy)', link: '/en/develop/plugin-dev/actions' },
          ]
        },
        {
          text: 'Reference',
          collapsed: false,
          items: [
            { text: 'API Reference', link: '/en/develop/plugin-dev/api-reference' },
          ]
        },
      ]
    },
    {
      text: 'Adapter Development',
      collapsed: false,
      items: [
        { text: 'Development Guide', link: '/en/develop/adapter-dev/' },
        { text: 'PlatformIO Driver', link: '/en/develop/adapter-dev/platform-io' },
      ]
    },
  ],
}
