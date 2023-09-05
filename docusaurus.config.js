// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Substrate开发框架',
  tagline: '助力区块链开发者',
  url: 'https://subdev.cn',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'kaichaosun', // Usually your GitHub org/user name.
  projectName: 'subdev', // Usually your repo name.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl:
          //   'https://github.com/kaichaosun/subdev.cn/tree/master/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'UA-128168145-2',
          // Optional fields.
          // anonymizeIP: true, // Should IPs be anonymized?
        },
      }),
    ],
  ],

  themeConfig: 
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
    navbar: {
      hideOnScroll: true,
      title: '主页',
      logo: {
        alt: 'SubDev',
        src: 'img/substrate-logo.png',
      },
      items: [
        { to: 'docs/resources/learn_resource', label: '文档', position: 'left' },
        { to: 'docs/dappchain/install', label: '公链', position: 'left' },
        { to: 'docs/consortium/features', label: '联盟链', position: 'left' },
        {
          href: 'https://github.com/kaichaosun/subdev.cn/discussions',
          label: '论坛',
          position: 'right',
        },
        {
          href: 'https://substrate.io?utm_source=subdevcn&utm_medium=post&utm_campaign=weekly_post',
          label: 'substrate.io',
          position: 'right'
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '中文资料',
              to: 'docs/resources/learn_resource',
            },
            {
              label: 'substrate.io',
              href: 'https://substrate.io?utm_source=subdevcn&utm_medium=post&utm_campaign=weekly_post',
            },
            {
              label: '知乎',
              href: 'https://zhuanlan.zhihu.com/substrate',
            },
            {
              label: 'Bilibili',
              href: 'https://space.bilibili.com/67358318',
            },
          ],
        },
        {
          title: '开发者支持',
          items: [
            {
              label: 'Web3.0 训练营',
              to: 'https://bootcamp.web3.foundation',
            },
            {
              label: 'Substrate Builder Program',
              to: 'https://substrate.io/ecosystem/substrate-builders-program/',
            },
            {
              label: 'Web3 Grants',
              to: 'https://web3.foundation/grants/',
            },
          ],
        },
        {
          title: '社交',
          items: [
            {
              label: '博客',
              to: 'blog',
            },
            {
              label: 'Github',
              to: 'https://github.com/kaichaosun/subdev.cn',
            },
          ],
        },
      ],
      // logo: {
      //   alt: 'Facebook Open Source Logo',
      //   src: 'https://docusaurus.io/img/oss_logo.png',
      // },
      copyright: `Copyright © ${new Date().getFullYear()} subdev.cn`,
    },
  }),
};

module.exports = config;
