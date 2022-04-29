/**
 * Copyright 2019 SubDev.cn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  title: 'Substrate开发框架',
  tagline: '助力区块链开发者',
  url: 'https://subdev.cn',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'kaichaosun', // Usually your GitHub org/user name.
  projectName: 'subdev', // Usually your repo name.
  onBrokenLinks: 'warn',
  themeConfig: {
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
        gtag: {
          trackingID: 'UA-128168145-2',
          // Optional fields.
          // anonymizeIP: true, // Should IPs be anonymized?
        },
      },
    ],
  ],
};
