/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Substrate 开发者社区',
  tagline: '助力区块链开发者',
  url: 'https://subdev.cn',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'substrater', // Usually your GitHub org/user name.
  projectName: 'SubDev', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '主页',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      links: [
        {to: 'docs/learn_resource', label: '学习资料', position: 'left'},
        {to: 'https://substrater.org', label: '论坛', position: 'left'},
        {to: 'blog', label: '博客', position: 'left'},
        {
          href: 'https://github.com/substrater/subdev.cn',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/doc1',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
          ],
        },
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} SubDev`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
