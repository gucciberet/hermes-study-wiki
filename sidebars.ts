import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '시작하기',
      items: ['intro', 'install', 'quick-start', 'tools', 'skills-memory', 'messaging'],
    },
    {
      type: 'category',
      label: '운영 가이드',
      items: [
        'operations-overview',
        'configuration',
        'profiles',
        'gateway',
        'scheduled-tasks',
        'security',
        'troubleshooting',
      ],
    },
    {
      type: 'category',
      label: '연동과 확장',
      items: [
        'providers-models',
        'provider-routing',
        'sessions',
        'webhooks',
        'plugins',
        'mcp',
        'api-server',
        'acp-ide',
        'dashboard-extension',
      ],
    },
  ],
};

export default sidebars;
