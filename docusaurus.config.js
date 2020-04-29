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
  organizationName: 'substrater', // Usually your GitHub org/user name.
  projectName: 'SubDev', // Usually your repo name.
  themeConfig: {
    gtag: {
      trackingID: 'UA-128168145-2',
      // Optional fields.
      // anonymizeIP: true, // Should IPs be anonymized?
    },
    navbar: {
      title: '主页',
      logo: {
        alt: 'SubDev',
        src: 'img/substrate-logo.png',
      },
      links: [
        {to: 'docs/learn_resource', label: '学习资料', position: 'left'},
        {to: 'docs/course', label: '课程', position: 'left'},
        {to: 'docs/live_stream', label: 'Web3.0直播', position: 'left'},
        {to: 'blog', label: '博客', position: 'left'},
        {href: 'https://substrate.dev', label: '开发者中心', position: 'right'},
        {href: 'https://zhuanlan.zhihu.com/substrate', label: '专栏', position: 'right'},
        {href: 'https://space.bilibili.com/67358318', label: '视频', position: 'right'},
        {href: 'https://substrater.org', label: '论坛', position: 'right'},
        {
          href: 'https://github.com/ParityAsia/subdev.cn',
          label: 'Github',
          position: 'right',
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
              label: '学习资料',
              to: 'docs/learn_resource',
            },
            {
              label: '开发者中心',
              href: 'https://substrate.dev',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: '论坛',
              href: 'https://substrater.org',
            }
          ],
        },
        {
          title: '社交',
          items: [
            {
              label: '博客',
              to: 'blog',
            },
          ],
        },
      ],
      // logo: {
      //   alt: 'Facebook Open Source Logo',
      //   src: 'https://docusaurus.io/img/oss_logo.png',
      // },
      copyright: `Copyright © ${new Date().getFullYear()} subdev.cn • <a target="_blank" href="http://www.beian.miit.gov.cn/">陕ICP备19025653号</a>`,
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
