import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: '시작하기',
      collapsed: true,
      items: [
        'getting-started/quickstart',
        'getting-started/installation',
        'getting-started/platform-support',
        'getting-started/termux',
        'getting-started/nix-setup',
        'getting-started/updating',
        'getting-started/learning-path',
      ],
    },
    {
      type: 'category',
      label: 'Hermes 사용하기',
      collapsed: true,
      items: [
        'user-guide/cli',
        'user-guide/tui',
      ],
    },
  ],
};

export default sidebars;
