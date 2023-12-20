# Runtime开发

ref: https://docs.substrate.io/learn/runtime-development/

如在[架构](https://docs.substrate.io/learn/architecture/)一篇中所讨论的，Substrate节点的Runtime包含了执行交易、保存状态的变化，和与外部节点交互的所有业务逻辑。Substrate提供了构建常见区块链组件所需的所有工具，因此你可以专注于开发定义区块链行为的Runtime逻辑。


## 状态变化及runtime

从本质上看，每个区块链本质上都是一个账本或记录，记录了链上发生的每一次变化。在基于Substrate的链中，这些改变链上状态的方式被记录在runtime中。因为是由runtime来处理这个操作，所以有时候会把runtime描述为[状态转换函数](https://docs.substrate.io/reference/glossary/#state-transition-function-stf)。

因为状态变化发生在runtime，所以在runtime中定义存储项和[交易](https://docs.substrate.io/learn/transaction-types/)行为。存储项代表区块链的[状态](https://docs.substrate.io/reference/glossary/#state)，而交易允许区块链用户改变这个状态。

![](https://docs.substrate.io/static/6effe44b9d2d6811634d627228b41c48/154d5/state-transition-function.webp)

Substrateruntime决定哪些交易是有效的，哪些是无效的，以及如何根据交易改变链状态。

## Runtime接口

正如你在[架构](https://docs.substrate.io/learn/architecture/)中学到的，节点外层的host部分负责处理节点发现、交易池、区块和交易传播、共识以及响应来自外部世界的RPC调用。这些任务经常需要外层节点查询runtime的信息或向runtime提供信息。runtime API实现了节点外层host和runtime之间的这种通信。

在Substrate中，sp_api crate提供了一个实现runtime API的接口。它旨在让你灵活性地使用[impl_runtime_apis](https://paritytech.github.io/substrate/master/sp_api/macro.impl_runtime_apis.html)宏实现自定义的接口。并且，每个runtime都必须实现[Core](https://paritytech.github.io/substrate/master/sp_api/trait.Core.html)和[Metadata](https://paritytech.github.io/substrate/master/sp_api/trait.Core.html)接口。除了这些必需的接口，大多数Substrate节点（如节点模板）实现了以下runtime接口：

- [BlockBuilder](https://paritytech.github.io/substrate/master/sp_block_builder/trait.BlockBuilder.html)用于构建块所需的功能。
- [TaggedTransactionQueue](https://paritytech.github.io/substrate/master/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html)用于验证交易。
- [OffchainWorkerApi](https://paritytech.github.io/substrate/master/sp_offchain/trait.OffchainWorkerApi.html)用于启用offchain操作。
- [AuraApi](https://paritytech.github.io/substrate/master/sp_consensus_aura/trait.AuraApi.html)用于使用一种轮询方法的共识进行区块生成和验证。
- [SessionKeys](https://paritytech.github.io/substrate/master/sp_session/trait.SessionKeys.html)用于生成和解码会话密钥。
- [GrandpaApi](https://paritytech.github.io/substrate/master/sp_consensus_grandpa/trait.GrandpaApi.html)用于将区块最终确定。
- [AccountNonceApi](https://paritytech.github.io/substrate/master/frame_system_rpc_runtime_api/trait.AccountNonceApi.html)用于查询交易索引。
- [TransactionPaymentApi](https://paritytech.github.io/substrate/master/pallet_transaction_payment_rpc_runtime_api/trait.TransactionPaymentApi.html)用于查询关于交易的信息。
- [Benchmark](https://paritytech.github.io/substrate/master/frame_benchmarking/trait.Benchmark.html)用于估计和测量完成交易所需的执行时间。


## 核心原语

Substrate还定义了runtime必须实现的核心原语。Substrate框架对你的runtime必须提供给Substrate的其他层的内容做了最少的假设。然而，有一些数据类型必须被定义，并且必须满足一个特定的接口，才能在Substrate框架中工作。

这些核心原语是：

- `Hash`：用于生成数据的加密摘要的类型。通常是256 bit。
- `DigestItem`：它是一个枚举类型，能够编码与共识和变更追踪相关的特定摘要项，以及与runtime中模块相关的任意数量 "soft-coded" 变体。
- `Digest`：一系列DigestItem，它编码了轻客户端所需的区块内的信息。
- `Extrinsic`：该类型表示来自区块链外部的单个数据片段，它能够被区块链识别。这一类型通常包含一个或多个签名，以及某种编码指令（例如，用于转移资金或调用智能合约）。
- `Header`：该类型（以加密或其他方式）代表了区块信息。它包括父区块的哈希、存储根和外部交易的trie root，摘要和区块编号。
- `Block`：本质上只是Header和一系列Extrinsics的组合，以及要使用的哈希算法的规范。
- `BlockNumber`：表示任何有效区块拥有的“祖先”总数。通常是32 bit类型。


## FRAME

[FRAME](https://docs.substrate.io/reference/glossary/#frame)是runtime开发者可用的最强大的工具之一。正如在[Substrate赋能开发者](https://docs.substrate.io/)中提到的，FRAME是**Framework for Runtime Aggregation of Modularized Entities**的缩写，它包含了大量的模块和支持库，简化了runtime开发。在Substrate中，这些模块——称为pallet，提供了针对不同用例的定制化业务逻辑和特性，你可以在自己的runtime中包含它们。例如，有些pallets提供了特定业务逻辑的框架，可以用于staking, consensus, governance等常见的活动。

关于可用的pallets的总结，请参见[FRAME pallets](https://docs.substrate.io/reference/frame-pallets/)。

除了pallets，FRAME还通过以下库和模块提供了与runtime交互的服务

- [FRAME system crate `frame_system`](https://paritytech.github.io/substrate/master/frame_system/index.html)为runtime提供了底层类型、存储和函数。
- [FRAME support crate `frame_support`](https://paritytech.github.io/substrate/master/frame_support/index.html)是一系列Rust宏、类型、trait和模块的集合，简化了Substrate pallets的开发。
- [FRAME executive pallet `frame_executive`](https://paritytech.github.io/substrate/master/frame_executive/index.html)将收到的函数调用请求调度到runtime相应的pallet中执行。

下图说明了FRAME及其system, support, 和executives模块如何为runtime环境提供服务。

![](https://docs.substrate.io/static/26bc9a1dad7d0bb2198e86a5ee6dd885/18091/runtime-and-frame.webp)

### 使用pallets组合出一个runtime

你可以在不使用FRAME的情况下构建一个基于Substrate的区块链。然而，FRAME pallets使你能够使用预定义的组件作为起点，组合定制runtime逻辑。每个pallet定义了特定的类型、存储项和函数，以实现runtime的一组特定特性或功能。

下图说明了你如何选择和组合FRAME pallets来组成一个runtime。


![](https://docs.substrate.io/static/64b2fcb61748ae77f4dd4c9ce63872b1/62cd2/compose-runtime.webp)


### 构建自定义pallets

除了预构建的FRAME pallets库外，你还可以使用FRAME库和服务来构建自定义的pallet。通过自定义pallet，你可以灵活地定义最适合你的runtime行为。因为每个pallet都有自己的独立逻辑，你可以组合预构建和自定义的pallets来控制你的区块链提供的特性和功能，以达到你想要的结果。

例如，你可能会在自己的runtime中包含[Balances pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/balances)，以使用它所实现的与加密货币相关的存储项和函数来管理代币，也可以添加自定义逻辑，当账户余额发生变化时调用你编写的pallet。

大多数pallets都是由以下部分的某种组合构成的：

- 导入和依赖
- Pallet类型声明
- runtime配置trait
- runtime存储
- runtime事件
- 在特定上下文中应执行的hooks逻辑
- 可以用来执行交易的函数调用

例如，如果你想开发一个自定义pallet，你可能会从一个类似于下面的pallet骨架结构开始：


```rust
// Add required imports and dependencies
pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
 use frame_support::pallet_prelude::*;
 use frame_system::pallet_prelude::*;

 // Declare the pallet type
 // This is a placeholder to implement traits and methods.
 #[pallet::pallet]
 #[pallet::generate_store(pub(super) trait Store)]
 pub struct Pallet<T>(_);

 // Add the runtime configuration trait
 // All types and constants go here.
 #[pallet::config]
 pub trait Config: frame_system::Config { ... }

 // Add runtime storage to declare storage items.
 #[pallet::storage]
 #[pallet::getter(fn something)]
 pub type MyStorage<T: Config> = StorageValue<_, u32>;

 // Add runtime events
 #[pallet::event]
 #[pallet::generate_deposit(pub(super) fn deposit_event)]
 pub enum Event<T: Config> { ... }

 // Add hooks to define some logic that should be executed
 // in a specific context, for example on_initialize.
 #[pallet::hooks]
 impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> { ... }

 // Add functions that are callable from outside the runtime.
 #[pallet::call]
 impl<T:Config> Pallet<T> { ... }
}
```

你可以根据需要，使用部分或全部组件来构建pallet。当你开始设计和构建你的自定义runtime时，你将更多地了解FRAME库和runtime原语，如用于定义配置项的trait、存储项、事件和错误类型，以及如何编写runtime执行所需的可调用函数。

## 下一步


现在你已经熟悉了Substrate runtime开发和使用pallet的基础知识，可以开始探索以下主题和教程。

- [Frame pallets](https://docs.substrate.io/reference/frame-pallets/)
- [将模块添加到runtime](https://docs.substrate.io/tutorials/build-application-logic/add-a-pallet/)
- [为Substrate准备的Rust](https://docs.substrate.io/learn/rust-basics/)
- [宏参考](https://docs.substrate.io/reference/frame-macros/)
- [在自定义pallet中使用宏](https://docs.substrate.io/tutorials/build-application-logic/use-macros-in-a-custom-pallet/)





