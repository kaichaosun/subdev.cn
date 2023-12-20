---
id: extrinsics
title: Extrinsics
sidebar_label: Extrinsics交易
---

在Substrate的上下文里，extrinsic指的是来自链外的信息，并且会被纳入到区块中。 Extrinsic分为三类：inherents, 签名交易和无签名交易。

需要注意的是，执行函数时触发的 [事件](../runtime/events) 不属于extrinsic。 发出的事件为链本身固有的信息。 举个例子，质押奖励是事件，而不是extrinsic，因为奖励是由链上逻辑触发而生成的。

## 区块结构

Substrate 中的每一个区块都是由一个区块头和一组extrinsic组合而成。 区块头包含  
区块高度、父区块哈希值、extrinsic根哈希值、链上状态根哈希值，以及摘要等信息。 本节仅关注其中的extrinsic根哈希值部分。

Extrinsics 被打包到一起进入当前区块中并会被执行，每个extrinsic都在runtime进行了定义。 而extrinsic根哈希值则是由这组待执行交易通过加密算法计算得出的信息摘要。 Extrinsic根哈希值主要有两个用途。 首先，它可以在区块头构建和分发完成之后，防止任何人对该区块头中所含extrinsic内容进行篡改。 其次，它提供了一种方法，在只有区块头信息的条件下，可以帮助轻客户端快速地验证某一区块中存在某笔交易。

- [Block Reference](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Block.html)

## Inherents

Inherent指的是那些仅能由区块创建者插入到区块当中的无签名信息， 他们不会在网络上传播或存储在交易队列中。 从技术角度来说，inherent也可以在网络中传播，不过这样的话，基于交易费用的垃圾信息保护机制会失效。

Inherents以一种主观意见的方式来表示数据，此类数据是描述有效信息的其中一类。 只要有足够多的区块验证人认可该inherent的合理性，那么这条inherent就是“有效的”。

例如，区块创建者可以向区块插入了一条包含时间戳的inherent信息。 时间戳合法性的验证和转账合法性的验证不同，转账可通过签名来验证，而时间戳不行。 相反，验证人根据其他验证人认为该时间戳的合理性来接受或拒绝该块，也就意味着该时间戳在这些验证人自己系统时钟的一些可接受范围内。

- [Inherents Reference](https://substrate.dev/rustdocs/latest/sp_inherents/index.html)

## 签名交易

签名交易里包含了签发该交易的账户私钥签名，这意味着此账户同意承担相应的区块打包费用。 由于签名交易打包上链的费用在交易执行前就可以被识别，所以在网络节点中传播此类交易造成信息泛滥的风险很小。

Substrate中的签名交易与以太坊和比特币体系中的“交易”概念一致。

## 不具签名交易

有些情况需要使用不具签名交易。 但因其验证难度很高，所以使用无签名交易时要谨慎。

不具签名交易意味着无人支付交易费用。 这使得交易队列无法用有效的经济手段来防止无签名交易被滥用。 再者，无签名交易里缺失nonce字段来辅助识别交易执行顺序，从而难以防止“重放攻击”的危害。 少数交易能够安全使用不具签名的形式，前提是它们需要提供[signed extension](#signed-extension)的自定义实现，来防止垃圾交易，也就是说signed extension可以用于不具签名交易。

Substrate 中一个不具签名交易的例子，就是由验证节点定时发送的 [I'm Online](../runtime/frame#im-online)心跳交易。 这种交易虽然包含了一个会话密钥签名，但会话密钥并不能控制资金，因此也无法支付交易费用。 交易池通过检查在某个session内验证人是不是已经提交了一个心跳来防止垃圾信息，如果已经存在会拒绝新的心跳交易。

## Signed Extension

`SignedExtension` 是一个trait ，通过它可以使用额外的数据或逻辑来扩展交易。 在交易执行之前，任何时候需要获取某笔特定交易信息时，都可以使用签名扩展来实现。 因此，"签名扩展"在交易队列中被大量使用。

Runtime会使用“签名扩展”提供的一些数据，比如用来计算可调用函数`Call`的交易费用。 签名扩展还包含一个名为`AdditionalSigned`的字段，这个字段可存放任意可编码数据，因而能够在打包或者发送交易之前，被用来执行自定义逻辑。 而为了避免将可能失败的交易打包进区块中，交易队列还会定期调用`SignedExtension`的函数来验证即将进入区块的交易。

尽管带“签名”字眼，`SignedExtension`也可以用于验证无签名交易。 我们可通过实现`*_unsigned`的一系列方法，来封装信息核验、防垃圾信息和重放保护等逻辑，供交易池使用。

- [Signed Extension Reference](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.SignedExtension.html)

## 延伸阅读

- [引用文档](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Extrinsic.html)
- [Runtime执行原理](../runtime/execution)
- [交易费用](../runtime/fees)
- [交易池](../learn-substrate/tx-pool)
