import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '专注于技术',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Substrate作为一个开源、通用的区块链开发框架，拥有无限潜力。
        加入我们一同学习Substrate区块链开发，深入研究底层架构，用技术影响世界。
      </>
    ),
  },
  {
    title: '为开发者服务',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        区块链技术的价值在于应用，广大的开发者是发掘应用场景、提升用户体验的基石。
        通过高质量的内容服务开发者，共同成长。
      </>
    ),
  },
  {
    title: '开源文化',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        区块链的生命力在于开放共享。我们支持无国界的开源运动，尊重原创，积极贡献Substrate生态相关的代码、文档和活动。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
