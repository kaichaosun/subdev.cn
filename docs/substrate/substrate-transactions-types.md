# 交易和块基础

ref: https://docs.substrate.io/learn/transaction-types/

在这篇文章中，你将学习到可以创建的不同类型的交易，以及了解如何在Runtime中使用它们。广义地说，交易决定了哪些数据会进入到区块链中的区块。通过学习不同类型交易的用途，你能更合理地选择适合你需求的类型。

## 交易是什么

一般来说，交易提供了一种机制，用于对状态进行更改，并且其本身可以包含在一个区块中。在Substrate中，有三种不同的交易类型：

- [签名交易](https://docs.substrate.io/learn/transaction-types/#signed-transactions)
- [无签名交易](https://docs.substrate.io/learn/transaction-types/#unsigned-transactions)
- [内在交易](https://docs.substrate.io/learn/transaction-types/#inherent-transactions)

在Substrate中，这三种交易类型通常被更广泛地称为**外部数据（extrinsic）**。Extrinsic这个术语一般指的是任何来源于Runtime之外的信息。

但是，在实际使用时，更有意义的是分别考查每种交易类型，并确定每种类型最适用的场景。

### 签名交易

签名交易必须包含发起请求的帐户的签名，这些请求用来调用某些Runtime接口。通常，请求是使用提交请求的帐户的私钥进行签名的。在大多数情况下，提交请求的帐户也要支付交易费用。然而，交易费用和交易处理的其他内容取决于Runtime逻辑的定义。

签名交易是最常见的交易类型。举个例子，假设你有一个帐户，里面有一些代币。如果你想把代币转给Alice，你可以调用Balances pallet中的`pallet_balances::Call::transfer`函数。因为你的帐户被用来发起这个调用，所以你的帐户密钥被用来签署交易。作为请求者，你通常需要支付处理请求所需的费用。你也可以选择给区块生产者小费，以提高你的交易优先级。

### 无签名交易

无签名交易不需要签名，也不包含任何关于是谁提交了交易的信息。

对于无签名交易，没有经济上的威慑手段来防止垃圾请求或重放攻击。你必须定义验证无签名交易的条件，以及保护网络免受滥用和攻击所需的逻辑。因为无签名交易需要自定义验证，所以这种交易类型比签名交易消耗更多的资源。

`pallet_im_online::Call::heartbeat`函数使用无签名交易，使验证节点能够向网络发送信号，表明节点在线。这个函数只能由在网络中注册为验证人的节点调用。该函数包含内部逻辑来验证节点是否为验证人，从而允许节点使用无签名交易调用该函数，避免支付任何费用。

### 内在交易

内在交易——有时也被称为inherent，是一种特殊类型的无签名交易。使用这种类型的交易，区块生成节点可以直接向区块中添加信息。内在交易只能由调用它们的区块生成节点插入到区块中。通常，这种类型的交易不会被传播给其他节点或存储在交易队列中。使用内在交易插入的数据被认为是有效的，而不需要特定的验证。

例如，如果一个区块生成节点向一个区块中插入一个时间戳，就没有办法证明这个时间戳是准确的。相反，验证者可能根据时间戳是否在他们自己的系统时钟的某个可接受范围内来接受或拒绝这个区块。

作为一个例子，`pallet_timestamp::Call::now`函数使一个区块生成节点能够在每个它产生的区块中插入一个当前时间戳。类似地，`paras_inherent::Call::enter`函数使一个平行链collator节点能够向它的中继链发送中继链期望的验证数据。

## 区块是什么


在Substrate中，一个区块由一个头部和一个交易数组组成。头部包含以下属性：

- 区块高度
- 父哈希
- 交易根
- 状态根
- 摘要

所有的交易被打包成一个序列，按照Runtime定义的方式执行。你将在[交易生命周期](https://docs.substrate.io/learn/transaction-lifecycle/)中了解更多关于交易排序的内容。交易根是这个序列的一个加密摘要。这个加密摘要有两个作用：

- 它防止在区块头部构建和分发后对交易序列进行任何修改。
- 它使轻客户端只需要知道头部的信息，就能够简洁地验证一个给定的交易是否存在于一个区块中。


## 下一步

现在你已经熟悉了交易类型和区块中包含哪些信息，你可以探索以下主题来了解更多。


- [交易生命周期](https://docs.substrate.io/learn/transaction-lifecycle/)
- [状态转换和存储](https://docs.substrate.io/learn/state-transitions-and-storage/)
- [交易、权重和费用](https://docs.substrate.io/build/tx-weights-fees/)
- [交易格式](https://docs.substrate.io/reference/transaction-format/)
- [块引用](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.Block.html)


