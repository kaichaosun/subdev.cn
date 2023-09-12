---
title: RFC-1 灵活分配Coretime
sidebar_label: RFC-1 灵活分配 coretime
---

原文：https://github.com/polkadot-fellows/RFCs/blob/main/text/0001-agile-coretime.md

代码：https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/broker


_ChatGPT 的部分中文翻译和总结：_

## 总结

这份提案提出了一种敏捷的、周期性销售为基础的模型，用于在Polkadot Ubiquitous Computer上分配Coretime。Polkadot Ubiquitous Computer代表了Polkadot网络提供的公共服务。它是一个无需信任的、基于WebAssembly的多核、互联网原生的无处不在的虚拟机，对干扰和损坏具有高度的抵抗力。

## 现状

目前分配Polkadot Ubiquitous Computer有限资源的系统是通过一种称为“parachain slot auctions”的过程进行的。这是一种以平行链为中心的范式，其中一个核心长期分配给一个平行链，这意味着通过中继链保障和连接的Substrate/Cumulus链。Slot拍卖是链上蜡烛拍卖，持续数天，结果是将核心分配给平行链，每次长达六个月，最多提前24个月。实际上，我们只看到对两年周期的投标和租赁。

在slot拍卖中的出价资金只是被锁定，而不是消耗或支付，它们会在租赁期满时解锁并退还给出价者。有一种称为众贷的无需信任的共享存款方式，允许代币持有者为链的总存款做出贡献，而不涉及交易对手风险。

## 问题 

然而，当前系统基于“每个平行链一个核心”的模型，这是Polkadot平台的传统解释，不反映其现在的能力。通过将所有权和使用限制在这个模型上，就失去了更动态和资源高效利用Polkadot Ubiquitous Computer的方式。

具体来说，不可能租用不到六个月的核心，也似乎不切实际，无法低于两年。这排除了动态管理底层资源的能力，通常导致实验、迭代和创新受到影响。这将固化了平台对部署到其中的任何内容都是永久的假设，并限制了市场找到有限资源更优化分配的能力。

此外，可能最大的问题可能是对Polkadot生态系统的入门门槛既是一种实际上的高门槛，也是一种被认为的高门槛。通过迫使创新者要么筹集七位数的资金，要么向更广泛的代币持有社区提出申诉，Polkadot使得一小群创新者难以部署他们的技术到Polkadot上。虽然它实际上不是许可的，但它也远远不是像Polkadot这样的创新平台应该追求的无障碍、无许可的理想。

## 要求

- 解决方案应提供Polkadot网络的可接受的价值捕获机制，允许部署在Polkadot UC上的平行链和其他项目进行长期资本支出预测。
- 解决方案应该最大程度地减少生态系统的进入壁垒。
- 解决方案应在Polkadot UC最多有1,000个核心的情况下运行良好。
- 解决方案应在Polkadot UC支持的核心数量随时间变化的情况下运行良好。
- 解决方案应促进对Polkadot UC核心的工作的最优分配，包括促进以不同的间隔和不同的时间跨度交易常规核心分配。
- 解决方案应避免在Polkadot UC的交付中为Relay-chain提供的功能创建额外的依赖关系。

此外，该设计应能够及时实施和部署；在接受此RFC三个月后的时间内实施不应该是不合理的。

## 利益相关方

主要利益相关者集团包括：

- 协议研究员和开发人员，主要由Polkadot Fellowship和Parity Technologies的工程部门代表。
- Polkadot平行链团队，现在和未来，包括现有的平行链和正在开发的新平行链，以及实验性质的平行链。

## 机制解释

这一提案的核心是建议在Polkadot UC上实施一种新的资源分配模型，以取代传统的“slot auctions”和众贷模型。这一新模型被称为“Coretime”，旨在更灵活、高效地分配Polkadot UC的核心资源。以下是Coretime模型的主要特点和机制：

1. Coretime概述：Coretime是Polkadot UC的资源分配模型，用于分配核心资源。与传统的“slot auctions”不同，Coretime模型允许更动态、实验性和更高效的资源分配。

2. Bulk Coretime和Instantaneous Coretime：Coretime模型引入了两种Coretime类型：批量Coretime和即时Coretime。批量Coretime定期在Coretime链上销售，而即时Coretime则在Relay-chain上按块销售。

3. 核心分配任务：在Coretime模型中，核心分配给任务而不是“平行链”，每个中继链块都可以更改分配的任务。任务可以是用于保护Cumulus-based区块链（即平行链）的一种主要类型，但还可以是其他类型的任务。

4. Coretime销售：批量Coretime定期在Coretime链上销售，每次销售提供一组不同的Coretime区域，这些区域具有不同的核心索引，以确保它们可以独立分配。

5. 续租：Coretime模型引入了续租机制，允许对先前分配的Coretime进行续租。续租的价格有限，以确保承诺的平行链可以获得有关未来成本的价格保证。

6. 区域操作：Coretime区域的所有者可以对其进行各种操作，包括所有权转移、分割、交错使用、分配给特定任务或加入即时Coretime池，以实现高效利用。

7. 即时Coretime信用：即时Coretime信用是一种在Relay-chain上购买的信用，可以在即时Coretime销售中使用。Relay-chain负责处理即时Coretime的使用情况，并奖励提供底层Coretime的提供者。

8. Coretime-chain和Relay-chain的交互：Coretime-chain负责提供关于可用核心数量、任务分配和即时Coretime信用的信息，而Relay-chain则提供关于可调度核心数量和即时Coretime销售信息。

提案还包括一系列参数，这些参数可用于调整Coretime模型的各个方面，以满足不同需求。此外，提案还包括有关Coretime区域的操作和数据架构的详细说明，以及有关即时Coretime市场价格设置的附注。

总的来说，这份提案旨在提供一种灵活、高效的资源分配模型，以更好地满足Polkadot UC上不同类型任务和平行链的需求，同时降低进入门槛，促进创新，确保经济可行性。请注意，这只是提案的摘要，详细内容包括更多技术和经济细节，需要Polkadot社区深入审查和讨论，以确定其可行性和最终实施。