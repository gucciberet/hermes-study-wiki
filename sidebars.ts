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
      ],
    },
  ],
};

export default sidebars;
