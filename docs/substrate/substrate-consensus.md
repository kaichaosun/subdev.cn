---
title: 共识
sidebar_label: 共识
---

ref: https://docs.substrate.io/learn/consensus/


所有区块链都需要某种共识机制来就区块链的状态达成一致。由于 Substrate 提供了一个构建区块链的模块化框架，因此它支持几种不同的在节点间达成共识的模型。一般来说，不同的共识模型有不同的取舍，因此为你的链选择要使用的共识类型是一个重要的考虑因素。Substrate 默认支持的共识模型需要的配置是最少的，但如果必要的话，你也可以构建自定义的共识模型。

## 两阶段共识

不像其它一些区块链，Substrate 将达成共识的过程分为两个独立的阶段：

- 生成区块，是节点用来创建新区块的过程。
- 区块最终化，是用于处理分叉并选择规范链的过程。


## 生成区块

在达成共识之前，区块链网络中的一些节点必须能够生成新的区块。区块链网络如何决定授权节点来创建区块取决于你使用的共识模型。例如，在中心化网络中，单个节点可能会创建所有区块。在没有任何可信节点的完全去中心化的网络中，必须使用某种算法在每个块高度上选择区块的生产者。

对于基于 Substrate 的区块链，你可以选择以下其中一种区块发起算法，或创建你自己的算法：

- 基于权威的轮流调度（[Aura](https://docs.substrate.io/reference/glossary/#authority-round-aura)）。
- Blind assignment of blockchain extension（[BABE](https://docs.substrate.io/reference/glossary/#blind-assignment-of-blockchain-extension-babe)）槽位调度。
- 基于工作量证明的调度。

Aura 和 BABE 共识模型需要一个已知的验证人节点集合，这些节点被允许生成区块。在这两种共识模型中，时间被分成离散的槽位。在每个槽位中，只有一些验证人可以生成区块。在 Aura 共识模型中，可以创建区块的验证人按照顺序进行轮换。在 BABE 共识模型中，验证人是基于可验证随机函数（VRF）而不是按顺序轮换进行选择的。

在工作量证明共识模型中，任何节点都可以在任何时间生成区块，只要该节点已经解决了一个计算密集型问题。解决问题需要 CPU 时间，因此节点只能按照其拥有的计算资源的比例生成一定量的区块。Substrate 提供了一个工作量证明的区块产生引擎。

## 最终化和分叉

区块作为一种基本结构，包含区块头和[交易](https://docs.substrate.io/learn/transaction-types/)。每个区块头都包含对其父区块的引用，因此你可以追溯到链的起源。当两个区块引用相同的父区块时，就出现了分叉。区块最终化是一种解决分叉的机制，它使得只有规范链存在。

分叉选择规则是一种算法，用于选择哪条分叉链应该作为最佳链被扩展。Substrate 通过 [SelectChain](https://paritytech.github.io/substrate/master/sp_consensus/trait.SelectChain.html) trait 将分叉选择规则暴露出来。你可以使用该 trait 编写自定义的分叉选择规则，或直接使用 [GRANDPA](https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf)，这是 Polkadot 和类似链中使用的最终性机制。

在 GRANDPA 协议中，最长链规则简单地确定最佳链就是最长链。Substrate 提供了 [LongestChain](https://paritytech.github.io/substrate/master/sc_consensus/struct.LongestChain.html) 结构体来实现这一链选择规则。GRANDPA 在其投票机制中使用最长链规则。

![](https://docs.substrate.io/static/e6863a42bc2c496b4a0eeefd969d93f4/e8455/consensus-longest.webp)

最长链规则的一个缺点是攻击者可以创建一个在出块上更快的区块链，并有效地劫持主区块链。Greedy Heaviest Observed SubTree（GHOST）规则是指，从创世区块开始，每个分叉都通过选择具有最多块构建的最重分支来解决。

![](https://docs.substrate.io/static/3a4345cd135b5201993824e71dc29a7a/095a5/consensus-ghost.webp)

在这个图表中，最重的链是已经构建在其上的累积了大多数块的分支。如果你正在使用 GHOST 规则进行链选择，则会选择此分支作为主要链，即使它的块长度比最长链分支少。

## 确定性的最终性

用户自然希望知道何时交易已经最终化，并通过某些事件（例如交付收据或签署文件）发出信号。然而，到目前为止仅仅通过提到的区块生成和分叉选择规则，交易并不能完全最终化。始终存在更长或更重的链可能会有撤销交易的机会。但是，建立在特定区块之上的区块越多，它被撤销的可能性就越小。通过这种方式，区块生成以及适当的分叉选择规则提供了概率最终性。

如果你的区块链需要确定性的最终性，则可以将最终性机制添加到区块链逻辑中。例如，你可以让固定权威集合的成员发起最终性投票。当某个块获得足够的投票时，该块被视为最终。在大多数区块链中，此阈值为三分之二。已经最终化的块不能在没有外部协调（例如硬分叉）的情况下被撤消。

在某些共识模型中，区块生产和区块最终性被合并，并且新的 N+1 块在 N 块被最终化之前无法创建。正如你所看到的，在 Substrate 中，这两个过程是相互隔离的。通过将生成区块与区块最终化分开，Substrate 使你可以使用任何具有概率最终性的区块生成算法，或将其与最终性机制相结合以实现确定性的最终性。

如果你的区块链使用了最终性机制，则必须修改分叉选择规则以考虑最终性投票的结果。例如，节点不会采用最长链，而是采用包含最近已经确定的块的最长链。

## 默认共识机制

虽然你可以实现自己的共识机制，但 [Substrate 节点模板](https://github.com/substrate-developer-hub/substrate-node-template)默认使用 Aura 生成区块和 GRANDPA 用于区块最终化。Substrate 还提供了 BABE 和工作量证明共识模型的实现。

### Aura

[Aura](https://paritytech.github.io/substrate/master/sc_consensus_aura/index.html) 提供基于插槽的区块生成机制。在 Aura 中，已知的权威集合轮流生产块。

### BABE

[BABE](https://paritytech.github.io/substrate/master/sc_consensus_babe/index.html) 提供基于插槽的区块生成，具有已知的验证人集合，常用于权益证明区块链。与 Aura 不同，插槽分配基于可验证随机函数（VRF）执行结果的评估。它在每个时期为每个验证人分配一个权重。这个时期被进一步分成插槽，验证人在每个插槽中评估其 VRF 的产出结果。对于验证人的 VRF 输出低于其权重的每个插槽，这个验证人都可以创建一个块。

因为多个验证人可能在同一插槽内产生一个块，所以 BABE 中的分叉比 Aura 中更常见，即使在良好的网络条件下也是如此。

Substrate 的 BABE 实现还具有当在给定插槽中未选择任何出块人时的回退机制。这些次要插槽分配机制让 BABE 可以保持恒定的出块时间。

### 工作量证明（PoW）

[工作量证明](https://paritytech.github.io/substrate/master/sc_consensus_pow/index.html)生成区块不是基于插槽的，也不需要已知的出块人集合。在工作量证明中，任何人都可以随时生成一个块，只要他们可以解决一个计算上具有挑战性的问题（通常是哈希 preimage 搜索）。这个问题的难度可以被调整，以提供统计学上的一致目标出块时间。

### GRANDPA

[GRANDPA](https://paritytech.github.io/substrate/master/sc_consensus_grandpa/index.html) 提供区块最终化。它具有像 BABE 一样的已知加权权威集合。但是，GRANDPA 不会生成块，它只是接收区块生成的消息。GRANDPA 验证人对链进行投票，而不是块。GRANDPA 验证人对他们认为最好的块进行投票，这些投票再传递性地应用于先前所有的块。在 GRANDPA 权威（验证人）的三分之二已经为特定块投票之后，该块被视为最终化的块。

所有确定性的最终性算法，包括 GRANDPA，都需要至少 2f + 1 个非故障节点，其中 f 是故障或恶意节点的数量。要了解更多关于这个阈值来自哪里以及为什么它是理想的，可以参考开创性的论文《[Reaching Agreement in the Presence of Faults](https://lamport.azurewebsites.net/pubs/reaching.pdf)》或《[Wikipedia: Byzantine Fault](https://en.wikipedia.org/wiki/Byzantine_fault)》。

并非所有共识协议都定义单一的规范链。当两个具有相同父项的块没有冲突的状态更新时，一些协议验证[有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)（DAG）。请参见 [AlephBFT](https://github.com/aleph-zero-foundation/aleph-node)，它们提供了一个示例。


## 下一步

- [BABE 研究](https://research.web3.foundation/en/latest/polkadot/block-production/Babe.html)
- [GRANDPA 研究](https://research.web3.foundation/en/latest/polkadot/finality.html)
