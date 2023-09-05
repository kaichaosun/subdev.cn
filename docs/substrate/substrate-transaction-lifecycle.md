---
title: 交易的生命周期
sidebar_label: 交易的生命周期
---


Ref: https://docs.substrate.io/learn/transaction-lifecycle/


在 Substrate 中，交易包含要进块的数据。由于交易中的数据源于运行时之外，因此有时将交易更广泛地称为外部数据或就叫 extrinsics。但是，最常见的extrinsics是签名交易。因此，本文讨论交易生命周期的重点是如何验证和执行签名交易。

您已经了解到，签名交易包括发送请求以执行某个运行时调用的帐户的签名。通常，请求由提交这个请求的帐户的私钥进行签名。在大多数情况下，提交请求的帐户还需要支付交易费用。但是其实，交易费用和交易处理的其他元素取决于运行时逻辑是如何定义的。

## 交易在哪里定义

如 [Runtime development](https://docs.substrate.io/learn/runtime-development/) 中所讨论的，Substrate 运行时包含定义了交易属性的业务逻辑，包括：

- 由什么构成一个有效的交易
- 交易是以签名还是未签名的方式发送
- 以及交易如何改变链的状态。

通常，你使用 pallet 来组合运行时函数并实现你希望链支持的交易。在编译运行时之后，用户与区块链进行交互以提交请求，这些请求将以交易的形式被处理。例如，用户可能会提交请求以将资金从一个帐户转移到另一个帐户，该请求就变成了包含该用户帐户签名的签名交易，如果用户帐户中有足够的资金支付交易费用，则交易将成功执行并进行资金转移。

## 交易在一个出块节点上是被如何处理的

根据你的网络配置，你可能会有一组被授权用于生成块的节点和一组未被授权（用于生成块）的节点。如果一个 Substrate 节点被授权生成块，则它可以处理接收到的已签名和未签名交易。以下图表说明了提交到网络并由授权节点处理的交易的生命周期。

![](https://docs.substrate.io/static/05e81b6aa161457fbf3aec95141f90a2/0fe02/transaction-lifecycle.avif)

任何发送到[非授权节点](https://docs.substrate.io/learn/transaction-lifecycle/)的已签名或未签名交易都会被传播到网络中的其他节点，并进入它们的交易池，直到被授权节点接收。

## 交易的验证以及交易队列

如 [Consensus](https://docs.substrate.io/learn/consensus/) 中所讨论的，网络中的大多数节点必须就块中交易的顺序达成一致，以达成对区块链状态的一致，并进而安全地添加块。为了达成共识，三分之二的节点必须就交易的执行顺序和导致的状态的变化达成一致。为了给共识做准备，交易首先在本地节点上进行验证并排队在交易池中。

### 验证交易池中的交易

使用运行时中定义的规则，交易池检查每个交易的有效性。这些检查确保只有满足特定条件的有效交易才会排队以等待包含在块中。例如，交易池可能执行以下检查以确定交易是否有效：

- 交易索引（也称为交易 nonce）是否正确？ 
- 用于签署交易的帐户是否有足够的资金支付相关费用？ 
- 用于签署交易的签名是否有效？

在进行初始有效性检查之后，交易池会定期检查池中现有的交易是否仍然有效。如果发现某个交易无效或已过期，则会从池中删除。

交易池仅处理交易的有效性以及被放在交易队列中的有效交易的顺序。有关验证机制如何工作的具体细节，包括处理费用、帐户或签名的方式，请参见 [validate_transaction](https://paritytech.github.io/substrate/master/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html#method.validate_transaction) 方法。

### 将有效交易添加到交易队列中

如果将交易标识为有效，则交易池将该交易移动到交易队列中。对于有效交易，有两个交易队列：

- 就绪队列包含那些可以被纳入新的待生成块中的交易。如果运行时使用 FRAME 构建，则交易必须遵从其被置于就绪队列中的确切顺序。 

- 未来队列包含可能在未来变为有效的交易。例如，如果某个交易的 nonce 对于其帐户来说过高，则它可以在未来队列中等待，直到链中包含了帐户所需的适当数量的交易。


### 无效交易的处理

如果交易无效，例如因为它太大或不包含有效的签名，则会被拒绝，并且不会添加到块中。交易可能因以下原因而被拒绝：

- 交易已经包含在块中，因此从验证队列中删除。 
- 交易的签名无效，因此立即被拒绝。 
- 交易太大，无法适应当前块，因此将其放回队列以进入新的验证轮。

## 按优先级进行交易排序

如果节点是下一个块的出块节点，则节点使用优先级系统为下一个块执行交易排序。交易按从高到低的优先级排序，直到块达到最大容量（weight）或长度。

交易优先级在运行时中计算，并作为附加在交易上的标记提供给外部节点。在 FRAME 运行时中，使用一个特定的 pallet 根据与交易相关的权重和费用来计算优先级。除了 inherents 之外，此优先级计算适用于所有交易类型。inherents 始终由 [EnsureInherentsAreFirst](https://paritytech.github.io/substrate/master/frame_support/traits/trait.EnsureInherentsAreFirst.html) trait 确保排在最前面。

### 基于账户的交易定序

如果您的运行时使用 FRAME 构建，则每个签名交易都包含一个 nonce，该 nonce 在一个帐户进行新交易时递增。例如，新帐户的第一笔交易的 nonce = 0，而同一帐户的第二笔交易的 nonce = 1。出块节点会在排序要包含在块中的交易时使用 nonce。

对于具有依赖关系的交易，排序要考虑这个交易支付的费用以及它包含的与其他交易的依赖关系。例如：

- 如果有一个具有 TransactionPriority::max_value() 的未签名交易和另一个签名交易，则未签名交易将首先放置在队列中。 
- 如果有两个来自不同发送人的交易，则由 priority 确定哪个交易更重要，应首先包含在块中。 
- 如果有两个来自相同发送人且具有相同 nonce 的交易：只能将一个交易包含在块中，因此只有具有更高费用的交易才会包含在队列中。

## 执行交易并产生块

在将有效交易置于交易队列中之后，由一个单独的执行模块协调如何执行交易以生成块。执行模块调用运行时模块中的函数，并按特定顺序执行这些函数。

作为运行时开发人员，了解执行模块如何与system pallet和组成区块链业务逻辑的其他pallet交互非常重要，因为你可以在以下地方插入逻辑以供执行模块执行：

- 初始化块 
- 执行要包含在块中的交易 
- 完成块构建

### 初始化块 

为了初始化块，执行模块首先调用system pallet中的 on_initialize 函数，然后调用所有其他运行时pallet 中的 on_initialize 函数。on_initialize 函数使你能够定义应在执行交易之前完成的业务逻辑。system pallet 的 on_initialize 函数始终首先执行。其余 pallet 按照它们在 construct_runtime! 宏中定义的顺序进行调用。

在执行完所有 on_initialize 函数之后，执行模块会检查块头中的父哈希和 trie 根以验证信息是否正确。

### 执行交易
 
在块初始化之后，每个有效交易按交易优先级顺序执行。重要的是要记住，在执行之前不会缓存状态。相反，在执行期间的状态更改会被直接写入存储。如果交易在执行过程中失败，则在遇到错误之前发生的任何状态更改都不会被还原，这会使块处于不可恢复状态。于是，在将任何状态更改提交到存储之前，运行时逻辑应执行所有必要的检查以确保 extrinsic 能成功运行。

请注意，[事件](https://docs.substrate.io/build/events-and-errors/)也会写入存储。因此，在完成所有逻辑之前，运行时不应发出事件。如果在发出事件之后交易失败了，也不会撤消该事件。

### 完成块 

在所有排队的交易都已执行后，执行模块调用每个 pallet 的 on_idle 和 on_finalize 函数，以执行应在块末尾进行的最终的业务逻辑。这些模块再次按照它们在 construct_runtime! 宏中定义的顺序进行执行，但在这种情况下，system pallet 中的 on_finalize 函数最后执行。

在所有 on_finalize 函数都已执行后，执行模块会检查块头中的摘要和存储根是否与初始化块时计算的内容匹配。

如果有剩余的块权重，on_idle 函数会执行，从而允许基于区块链使用情况多执行一些计算。

## 块签发和块导入

到目前为止，你已经了解了本地节点生成的块中如何包含交易。如果本地节点被授权生成块，则交易生命周期遵循以下路径：

- 本地节点在网络上侦听交易。 
- 验证每个交易。 
- 将有效交易放置在交易池中。 
- 交易池在适合的交易队列中将有效交易排序，执行模块调用运行时以开始准备下一个块。 
- 执行交易并将状态更改存储在本地内存中。 
- 构建的块发布到网络。 

发布块到网络后，其他节点可以导入该块。块导入队列是每个 Substrate 节点中的一部分。块导入队列监听传入的块和与共识相关的消息，并将它们添加到一个池子中。在池子中，会检查这些到来的信息的有效性，如果无效则会被丢弃。在验证块或消息有效后，块导入队列将这些信息导入到本地节点状态，并将其添加到节点中的用来存储块的数据库中。

在大多数情况下，你不需要了解交易如何被传播，以及块是如何被网络上的其他节点导入的。但是，如果你计划写一些自定义共识逻辑，或想了解有关块导入队列实现的更多信息，则可以在 Rust API 文档中找到详细信息。

- [ImportQueue](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.ImportQueue.html)
- [Link](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.Link.html)
- [BasicQueue](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/struct.BasicQueue.html)
- [Verifier](https://paritytech.github.io/substrate/master/sc_consensus/import_queue/trait.Verifier.html)
- [BlockImport](https://paritytech.github.io/substrate/master/sc_consensus/block_import/trait.BlockImport.html)


## 下一步去哪

- [Seminar: Lifecycle of a transaction](https://www.youtube.com/watch?v=3pfM0GOp02c)
- [Accounts, addresses, and keys](https://docs.substrate.io/learn/accounts-addresses-keys/)


