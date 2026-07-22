import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '시작하기',
      collapsed: true,
      items: ['quick-start', 'getting-started/installation'],
    },
  ],
};

export default sidebars;
