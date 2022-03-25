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

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>专注于技术</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Substrate作为一个开源、通用的区块链开发框架，拥有无限潜力。
        加入我们一同学习Substrate区块链开发，深入研究底层架构，用技术影响世界。
      </>
    ),
  },
  {
    title: <>为开发者服务</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        区块链技术的价值在于应用，广大的开发者是发掘应用场景、提升用户体验的基石。
        通过高质量的内容服务开发者，共同成长。
      </>
    ),
  },
  {
    title: <>开源文化</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        区块链的生命力在于开放共享。我们支持无国界的开源运动，尊重原创，积极贡献Substrate生态相关的代码、文档和活动。
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Substrate开发者社区，是由国内的区块链爱好者自发组建的，旨在帮助开发者快速学习和上手Substrate开发框架。">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/resources/learn_resource')}>
              开始学习
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
