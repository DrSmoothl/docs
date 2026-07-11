import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/en/' },
  { text: 'Manual', link: '/en/manual/deployment/' },
  { text: 'Development', items: [
    { text: 'MaiBot Development', link: '/en/develop/' },
    { text: 'Plugin Development', link: '/en/plugin/' },
  ]},
  { text: 'FAQ', link: '/en/faq/' },
  { text: 'Changelog', link: '/en/changelog/' },
  { text: 'About', link: '/en/about/' },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/en/plugin/': [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Development Guide', link: '/en/plugin/' },
        { text: 'Vibe Coding Guide', link: '/en/plugin/vibe-coding' },
        { text: 'Manifest', link: '/en/plugin/manifest' },
        { text: 'Lifecycle', link: '/en/plugin/lifecycle' },
        { text: 'Configuration', link: '/en/plugin/config' },
      ]
    },
    {
      text: 'Components',
      collapsed: false,
      items: [
        { text: 'Tool', link: '/en/plugin/tools' },
        { text: 'Command', link: '/en/plugin/commands' },
        { text: 'Hook Handler', link: '/en/plugin/hooks' },
        { text: 'Event Handler', link: '/en/plugin/event-handlers' },
        { text: 'API Components', link: '/en/plugin/api-components' },
        { text: 'Message Gateway', link: '/en/plugin/message-gateway' },
        { text: 'LLMProvider', link: '/en/plugin/llmprovider' },
        { text: 'Action (Legacy)', link: '/en/plugin/actions' },
      ]
    },
    {
      text: 'Reference',
      collapsed: false,
      items: [
        { text: 'API Reference', link: '/en/plugin/api-reference' },
      ]
    },
  ],
  '/en/changelog/': [
    {
      text: 'Changelog',
      collapsed: false,
      items: [
        { text: 'Version Overview', link: '/en/changelog/' },
      ]
    },
    {
      text: 'Feature Updates',
      collapsed: false,
      items: [
        { text: '1.0.0 Feature Page', link: '/en/changelog/v1-0-0' },
      ]
    },
  ],
  '/en/faq/': [
    {
      text: 'FAQ',
      collapsed: false,
      items: [
        { text: 'FAQ', link: '/en/faq/' },
        { text: 'Error Troubleshooting', link: '/en/faq/error-troubleshooting' },
      ]
    },
  ],
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
        { text: 'Message Processing', link: '/en/manual/features/message-pipeline' },
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
        { text: 'Maisaka Reasoning', link: '/en/develop/architecture/maisaka-reasoning' },
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
      text: 'Adapter Development',
      collapsed: false,
      items: [
        { text: 'Development Guide', link: '/en/develop/adapter-dev/' },
        { text: 'PlatformIO Driver', link: '/en/develop/adapter-dev/platform-io' },
      ]
    },
  ],
  '/en/about/': [
    {
      text: 'About',
      collapsed: false,
      items: [
        { text: 'About MaiBot', link: '/en/about/' },
        { text: 'EULA', link: '/en/about/EULA' },
      ]
    },
  ],
}
