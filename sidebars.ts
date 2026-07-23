import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Docs sidebar. Mirrors the official Hermes Agent site's sidebar id ("docs")
 * and its "Getting Started" category hierarchy, but for now exposes only the
 * single translated page: getting-started/quickstart.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: '시작하기',
      collapsed: false,
      items: ['getting-started/quickstart'],
    },
  ],
};

export default sidebars;
