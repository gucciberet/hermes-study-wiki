import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Hermes 쉬운 한글 위키',
  tagline: 'Hermes를 처음부터 쉽게 이해하기',
  favicon: 'img/favicon.ico',
  future: {v4: true},
  url: 'https://hermes-study-wiki.vercel.app',
  baseUrl: '/',
  organizationName: 'gucciberet',
  projectName: 'hermes-study-wiki',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'ko', locales: ['ko']},
  presets: [
    ['classic', {
      docs: {
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/gucciberet/hermes-study-wiki/tree/main/',
      },
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    } satisfies Preset.Options],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Hermes 쉬운 한글 위키',
      logo: {alt: 'Hermes', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: '문서'},
        {href: 'https://hermes-agent.nousresearch.com/docs/', label: '공식 문서', position: 'right'},
        {href: 'https://github.com/gucciberet/hermes-study-wiki', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [{title: '문서', items: [{label: '시작하기', to: '/docs/intro'}]}, {title: '공식 자료', items: [{label: 'Hermes 공식 문서', href: 'https://hermes-agent.nousresearch.com/docs/'}]}],
      copyright: `개인 학습을 위한 쉬운 한국어 안내 · ${new Date().getFullYear()}`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
