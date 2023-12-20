
# 状态转变和存储

ref: https://docs.substrate.io/learn/state-transitions-and-storage/

Substrate使用一个简单的键值数据存储方案，它实现为基于数据库的Merkle树变种。所有Substrate的[更高级别的存储抽象](https://docs.substrate.io/build/runtime-storage/)都是建立在这个简单的键值存储层之上的。

## 键-值数据库

Substrate使用[RocksDB](https://rocksdb.org/)作为其存储数据库，这是一种持久化键值存储，用于快速存储环境。Substrate还支持实验性的[Parity DB](https://github.com/paritytech/parity-db)。

这种键值数据库用于所有需要持久性存储的Substrate组件，例如：
- Substrate客户端
- Substrate轻客户端
- Offchain Worker

### Trie抽象

使用简单的键值存储的一个优点是，你可以轻松地在其上抽象存储结构。
Substrate使用来自[paritytech/trie](https://github.com/paritytech/trie)的Base-16 Modified Merkle Patricia树（“trie”）提供一个trie结构，其内容可以被修改，其根哈希可以高效地被重新计算。
Trie允许高效地存储和共享历史块状态。trie根是trie内部数据的顶层表示；也就是说，具有不同数据的两个trie将始终具有不同的根。因此，两个区块链节点可以通过比较它们的trie根轻松验证它们是否具有相同的状态。
访问trie数据是昂贵的。每个读取操作需要O(log N)时间，其中N是存储在trie中的元素数量。为了缓解这种情况，我们使用了键值缓存。
所有trie节点都存储在数据库中，并且trie状态的一部分可以被修剪，即当键值对对于非归档节点超出修剪范围时，可以从存储中删除。出于性能原因，我们不使用[引用计数](http://en.wikipedia.org/wiki/Reference_counting)。

### 状态trie

基于Substrate的链有一个单一的主trie，称为状态trie，其根哈希放置在每个块头中。这可用于轻松验证区块链的状态，并为轻客户端提供验证证明的基础。
这个trie只存储规范链的内容，而不包含分叉的内容。有一个单独的[state_db层](https://paritytech.github.io/substrate/master/sc_state_db/index.html)，用于维护非规范的（分叉块的）trie状态，这些状态在内存中使用内存计数来维护。

### 子trie

Substrate还提供了一个API来生成具有自己根哈希的新子trie，这些trie可以在runtime中使用。
子trie与主状态trie相同，只是子trie的根存储在，并更新为主trie中的一个节点，而不是放在块头。由于它们的头是主状态trie的一部分，因此当包括子trie时仍然很容易验证完整的节点状态。
当你想要自己独立的trie并具有单独的根哈希以验证该trie中的特定内容时，子trie非常有用。主状态的子树不能自动算出hash值，因此在有些场合下使用子trie是非常有用的。

## 获取存储数据

使用Substrate构建的区块链会公开一个远程过程调用（RPC）服务器，可用于查询Runtime存储。当你使用Substrate RPC访问存储项时，只需要提供该项的[键](https://docs.substrate.io/learn/state-transitions-and-storage/#key-value-database)即可。Substrate的[运行时存储API](https://docs.substrate.io/build/runtime-storage/)公开了许多存储项类型；继续阅读以了解如何计算不同类型存储项的存储键。

### Storage value的键

要计算简单[存储值](https://docs.substrate.io/build/runtime-storage/#storage-value)的键，请获取包含存储值的模块名称的[TwoX 128哈希](https://github.com/Cyan4973/xxHash)，并将其附加到存储值本身名称的TwoX 128哈希。例如，[Sudo](https://paritytech.github.io/substrate/master/pallet_sudo/index.html)模块公开了一个名为`Key`的存储值项。
```
twox_128("Sudo") = "0x5c0d1176a568c1f92944340dbfed9e9c"
twox_128("Key") = "0x530ebca703c85910e7164cb7d1c9e47b"
twox_128("Sudo") + twox_128("Key") = "0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b"
```
假如我们熟悉的`Alice`账户是sudo用户，则读取Sudo模块的`Key`存储值的RPC请求和响应可以表示为：
```
state_getStorage("0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b") = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
```
在这种情况下，返回的值（`“0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d”`）是Alice的[SCALE](https://docs.substrate.io/reference/scale-codec/)编码帐户ID（`5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`）。

你可能已经注意到，[非加密](https://docs.substrate.io/build/runtime-storage/#cryptographic-hashing-algorithms)的TwoX 128哈希算法用于生成存储值键，这是因为不必支付与加密哈希函数相关的性能成本，因为哈希函数的输入（模块和存储项的名称）由运行时开发人员确定，而不是由潜在的恶意用户确定。

### 存储map的键

与存储value一样，[存储map](https://docs.substrate.io/build/runtime-storage/#storage-map)的键等于包含map的模块名称的TwoX 128哈希，该哈希前缀为存储map本身名称的TwoX 128哈希。要从map中检索元素，请将所需map键的哈希附加到存储map的存储键上。对于具有两个键（存储double map）的map，请将第一个map键的哈希后跟第二个map键的哈希附加到double map的存储键上。
与存储值一样，Substrate使用TwoX 128哈希算法来处理模块和存储map名称，但你需要确保在确定map中元素的hash键时使用正确的[hash算法](https://docs.substrate.io/build/runtime-storage/#hashing-algorithms)（在[#[pallet::storage]宏](https://docs.substrate.io/build/runtime-storage/#declaring-storage-items)中声明的算法）。
以下是一个示例，说明了如何查询名为Balances的模块中名为FreeBalance的存储map以获取Alice账户余额。在此示例中，FreeBalance map使用[透明Blake2 128 Concat hash算法](https://docs.substrate.io/build/runtime-storage/#transparent-hashing-algorithms)：
```
twox_128("Balances") = "0xc2261276cc9d1f8598ea4b6a74b15c2f"
twox_128("FreeBalance") = "0x6482b9ade7bc6657aaca787ba1add3b4"
scale_encode("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY") = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
blake2_128_concat("0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d") = "0xde1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
state_getStorage("0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d") = "0x0000a0dec5adc9353600000000000000"
```
从存储查询返回的值（在上面的示例中为“0x0000a0dec5adc9353600000000000000”）是Alice帐户余额的[SCALE](https://docs.substrate.io/reference/scale-codec/)编码值（在此示例中为“1000000000000000000000”）。请注意，在哈希Alice的帐户ID之前，它必须进行SCALE编码。还要注意，blake2_128_concat函数的输出由32个十六进制字符和函数的输入组成。这是因为Blake2 128 Concat是一种[透明哈希算法](https://docs.substrate.io/build/runtime-storage/#transparent-hashing-algorithms)。
尽管上面的示例可能使这种特性看起来多余，但当目标是迭代map中的键（而不是检索与单个键关联的值）时，其实用性变得更加明显。能够迭代map中的键是一种常见要求，以便允许人们以看似自然的方式使用map（例如UI）：首先，用户会看到map中元素的列表，然后，该用户可以选择他们感兴趣的元素，并查询有关该特定元素的更多详细信息。

以下是另一个示例，它使用相同的存储map示例（名为`FreeBalances`的使用Blake2 128 Concat hash算法的map，在名为`Balances`的模块中），演示了使用Substrate RPC通过`state_getKeys` RPC端点查询存储map以获取其键列表：
```
twox_128("Balances") = "0xc2261276cc9d1f8598ea4b6a74b15c2f"
twox_128("FreeBalance") = "0x6482b9ade7bc6657aaca787ba1add3b4"
state_getKeys("0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4") = [
 "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b4de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
 "0xc2261276cc9d1f8598ea4b6a74b15c2f6482b9ade7bc6657aaca787ba1add3b432a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f",
 ...
]
```
Substrate RPC的`state_getKeys`接口返回的列表中的每个元素都可以直接用作RPC的`state_getStorage`接口的输入。实际上，上面示例列表中的第一个元素等于先前示例中用于`state_getStorage`查询（用于查找`Alice`余额）的输入。因为这些键所属的map使用透明哈希算法生成其键，所以可以确定列表中第二个元素关联的帐户。请注意，列表中的每个元素都是以相同的64个字符开头的十六进制值；这是因为每个列表元素表示同一map中的一个键，并且该map由连接两个TwoX 128哈希（每个哈希均为128位或32个十六进制字符）而标识。在丢弃列表中第二个元素的此前缀部分后，你将得到`0x32a5935f6edc617ae178fef9eb1e211fbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f`。

你在先前的示例中看到，这代表某些用SCALE编码的帐户ID的Blake2 128 Concat哈希。Blake 128 Concat哈希算法由将哈希算法的输入附加（连接）到其Blake 128哈希组成。这意味着Blake2 128 Concat哈希的前128位（或32个十六进制字符）表示Blake2 128哈希，其余部分表示传递给Blake 2 128哈希算法的值。在此示例中，在删除表示Blake2 128哈希的前32个十六进制字符（即`0x32a5935f6edc617ae178fef9eb1e211f`）后，剩下的是十六进制值`0xbe5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f`，这是一个SCALE编码帐户ID。解码此值将产生结果`5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY`，这正是我们熟悉的`Alice_Stash`账户的帐户ID。

## Runtime 存储API

Substrate的[FRAME Support crate](https://paritytech.github.io/substrate/master/frame_support/index.html)提供了用于为Runtime存储项生成唯一确定性键的辅助工具。这些存储项放置在[状态trie](https://docs.substrate.io/learn/state-transitions-and-storage/#trie-abstraction)中，并可通过生成的键来[查询](https://docs.substrate.io/learn/state-transitions-and-storage/#querying-storage)状态trie。

## 下一步

- [Runtime 存储](https://docs.substrate.io/build/runtime-storage/)
- [类型编码 (SCALE)](https://docs.substrate.io/reference/scale-codec/)

