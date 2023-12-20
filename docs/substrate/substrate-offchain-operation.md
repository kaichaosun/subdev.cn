# 链下操作

ref: https://docs.substrate.io/learn/offchain-operations/

在许多使用场景中，你可能想要从一个链下数据源查询数据，或者在更新链上状态之前，不使用链上资源处理数据，而是在链下先处理一下。将链下数据集成到链上的传统方法是连接到[预言机]((https://docs.substrate.io/reference/glossary/#oracle))，它从一些传统的数据源获取并提供数据。使用预言机是一种处理链下数据源的方法，但预言机在安全性、可扩展性和基础设施效率方面存在局限。

为了使链下数据集成更加安全和高效，Substrate通过以下特性支持链下操作：

- **链下工作机**（offchain worker）是一组子系统组件，它可以执行需要长时间运行或者输出非确定性结果的任务，例如：

  - 网站服务请求 
  - 数据的加密、解密和签名 
  - 随机数生成 
  - CPU密集型计算 
  - 链上数据的枚举或聚合 

链下工作机使你能够将需要过多执行时间的任务移出区块处理队列。任何可能超过允许的最大区块执行时间的任务都适合放在链下工作机中进行处理。

- **链下存储**（offchain storage）是存储在Substrate节点本地的存储，可以被链下工作机和链上逻辑访问：
  - 链下工作机对链下存储有读写权限。 
  - 链上逻辑通过链下索引对链下存储有写权限，但没有读权限。链下存储允许不同的工作线程彼此通信，并存储不需要在整个网络上达成共识的用户特定或节点特定的数据。 

- **链下索引**（offchain indexing）是一种可选服务，它允许Runtime直接向链下存储写入数据，而不依赖于链下工作机。链下索引为链上逻辑提供临时存储，并补充链上状态。


## 链下工作机

链下工作机在Substrate Runtime之外的自己的Wasm执行环境中运行。这种事务的分离确保了区块生产不受长时间运行的链下任务的影响。然而，由于链下工作机是在与Runtime相同的代码中声明的，它们可以轻松地访问链上状态进行计算。

![](https://docs.substrate.io/static/505c4ec510929c01c0e608225c5c598a/40f64/off-chain-workers-v2.webp)

链下工作机可以访问扩展的API来与外部世界通信：

- 能够[提交交易](https://paritytech.github.io/substrate/master/sp_runtime/offchain/trait.TransactionPool.html)——无论是签名的还是未签名的，发布计算结果到链上。
- 一个功能齐全的HTTP客户端，允许工作机访问和获取来自外部服务的数据。
- 访问本地密钥库来签名和验证声明或交易。
- 一个额外的、本地的[键值数据库](https://paritytech.github.io/substrate/master/sp_runtime/offchain/trait.OffchainStorage.html)，由所有的链下工作机线程共享。
- 一个安全的、本地的熵源，用于随机数生成。
- 访问节点的精确[本地时间](https://paritytech.github.io/substrate/master/sp_runtime/offchain/struct.Timestamp.html)。
- 休眠和恢复工作的能力。

请注意，链下工作机的结果不受常规交易验证的约束。因此，你应该确保链下操作包含一个验证方法，以确定什么信息能进入链上。例如，你可以通过实现一个投票、平均或检查发送者签名的机制来验证链下交易。

你还应该注意，链下工作机默认没有任何特定的权限或许可。因此，这里面存在恶意用户可能会利用的潜在攻击向量。在大多数情况下，在写入存储之前检查交易是否由链下工作机提交是不足以保护网络的。在没有保护性验证措施的情况下，不应该假设链下工作机可以被信任。你应该有意识地设置限制性的权限，限制它的访问权限以及它可以做什么。

链下工作机在每个区块导入时被生成，然而，在初始的区块链同步期间，它们不会被执行。


## 链下存储

链下存储总是存储在Substrate节点本地，不与链上的任何其他区块链节点共享，也不受共识的约束。你可以使用有读写权限的链下工作机线程或通过使用链下索引的链上逻辑来访问存储在链下存储中的数据。

由于每次导入区块时都会生成一个链下工作机线程，因此在任何给定时间都可能有多个链下工作机线程在运行。与任何多线程编程环境一样，当链下工作机线程访问链下存储时，有一些实用工具可以对链下存储进行[互斥锁定](https://en.wikipedia.org/wiki/Lock_(computer_science))，以确保数据的一致性。

链下存储充当了链下工作机线程之间以及链下和链上逻辑之间通信的桥梁。它也可以通过远程过程调用（RPC）来读取，因此它适合存储无限增长的数据而不过度消耗链上存储的宝贵空间。


## 链下索引

在区块链的背景下，存储通常与链上状态有关。然而，链上状态是昂贵的，因为它必须被网络中的多个节点达成一致并填充。因此，你不应该使用链上存储来存储历史数据或用户生成的数据，这些数据会随着时间的推移无限增长。

为了解决访问历史数据或用户生成数据的需求，Substrate通过链下索引提供了对链下存储的访问。链下索引允许Runtime直接写入链下存储，而不使用链下工作机线程。你可以通过使用`–-enable-offchain-indexing`命令行选项启动Substrate节点来启用此功能以持久化数据。

与链下工作机不同，链下索引每次处理一个区块时都会填充链下存储。通过在每个区块处理时填充数据，链下索引确保数据始终一致，并且对于每个启动了链下索引功能的节点来说，数据都是完全相同的。

## 下一步

你现在已经熟悉了链下工作机、链下存储和链下索引如何能够处理无法存储在链上的数据，你可能还想要探索以下链下工作机的示例，以及如何在Runtime开发中使用它们。

- [Example: Offchain worker](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/examples/offchain-worker)
- [Example: Submit transactions](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/transactions.md)
- [Example: Use HTTP requests to fetch data](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/http-json.md)
- [Example: Offchain storage](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/storage.md)
- [Example: Offchain indexing](https://github.com/JoshOrndorff/recipes/blob/master/text/off-chain-workers/indexing.md)


