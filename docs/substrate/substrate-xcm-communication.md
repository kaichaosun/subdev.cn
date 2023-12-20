# 跨共识消息

ref: https://docs.substrate.io/learn/xcm-communication/

跨共识通信依赖于一种消息格式——XCM，该格式旨在提供一套通用且可扩展的指令集，用于完成跨不同的共识系统、交易格式和传输协议的交易。

XCM格式包含了消息的内容。每条消息包含了一组**发送方**请求的**指令**，消息**接收方**可以接受或拒绝这些指令。消息格式与用于发送和接收消息的**消息协议**完全独立。

## 消息协议

在Polkadot生态系统中，有三种主要的通信渠道——消息协议，用于在链之间传输消息：

- Upward message passing（UMP）使得平行链能够将消息传递给其中继链。
- Downward message passing（DMP）使得中继链能够将消息传递给平行链。
- Cross-consensus message passing（XCMP）使得平行链能够与连接到同一中继链的其他平行链交换消息。

向上和向下的消息传递协议（UMP, DMP）提供了一个垂直的消息传递通道。跨共识消息传递(XCMP)可以被视为一个横向的、平行链到平行链的传输协议。由于完整的XCMP协议仍在开发中，horizontal relay-routed message passing（HRMP）通过中继链把消息路由到平行链提供了一个临时解决方案。横向中继路由消息传递（HRMP）旨在作为一个临时解决方案，当XCMP发布到生产环境时将被弃用。

尽管这些消息传递协议是Polkadot生态系统内的链之间通信的主要手段，但XCM本身并不受这些传输协议的限制。相反，你可以使用XCM来表达许多常见类型的交易，无论消息的来源和目的地在哪里。例如，你可以构造从智能合约或pallet路由的消息，通过桥，或者使用不属于Polkadot生态系统的传输协议。

![](https://docs.substrate.io/static/b0d45f2ae0f2d3f4bc411ee44623bda3/cd5e4/xcm-channel-overview.webp)

XCM专门设计为用来沟通接收系统应该做什么，所以它可以为许多常见类型的交易提供一个灵活且中立的交易格式。

## XCM格式中的消息

使用XCM格式的消息有四个重要的原则你应该了解：

- 消息是**异步的**。在你发送一条消息后，发送方不应该等待消息被传递或执行的响应结果。
- 消息是**绝对的**，保证消息按**顺序**被传递和解释，并且**有效**地执行。
- 消息是**不对称的**，不会将任何结果返回给发送方。你只能通过额外的消息告诉接收方将结果通知给发送方。
- 消息是**中立的**，并且不对消息传递的共识系统做任何假设。

记住这些基本原则，然后你可以开始使用XCM构造消息。在Rust中，消息被定义如下：

```rust
pub struct Xcm<Call>(pub Vec<Instruction<Call>>);
```

此定义表明，消息只是一个执行一组有序指令的调用。`Instruction`是一个枚举数据类型，在构造消息时定义的集合内枚举变体的顺序通常反映了它们的执行顺序。例如，`WithdrawAsset`是第一个变体，因为它通常在其他指令如`BuyExecution`或`DepositAsset`之前执行。

大多数的XCM指令使你能够执行常见任务，如将资产转移到新的位置，或者在不同的账户中存入资产。执行此类任务的指令所构造的消息具有一致性，即无论你通信的共识系统如何配置，都能按照你的期望去执行。当然，你也可以灵活地定制指令的执行方式或使用`Transact`指令。

`Transact`指令允许你执行由消息接收方公开的任何可调用函数。通过使用`Transact`指令，你可以对接收系统上的任何函数进行调用，但它需要你了解该系统的配置情况。例如，如果你想调用另一个平行链的特定pallet，你必须知道接收方Runtime是如何配置的，以构造正确的消息并达到正确的pallet。这些信息会随着链而变化，因为每个Runtime都可以被不同地配置。


## 在虚拟机中执行


跨共识虚拟机（XCVM）是一个上层的虚拟机，它有一个XCM executor程序，该程序接收XCM指令，并按顺序执行，直到运行结束或遇到错误并停止执行。

当XCM指令被执行时，XCVM通过使用几个专门的寄存器来维护其内部状态。XCVM还可以访问执行指令的底层共识系统的状态。根据执行的操作，XCM指令可能会改变寄存器或共识系统的状态，或者两者都改变。

例如，`TransferAsset`指令指定要转移的资产和资产要转移到的位置。当执行这个指令时，**origin register**会自动设置为消息的来源，并从这个信息中确定应该从哪里取出要转移的资产。执行XCM指令时被操作的另一个寄存器是**holding register**，当需要等待对资产的后续操作指令时，holding register 用于临时存储资产。

XCVM中还有几个寄存器用于处理特定的任务。例如，有一个剩余权重寄存器（surplus weight register）用于存储费用的过高估计，还有一个退款权重寄存器（refunded weight register）用于存储剩余权重中已经退款的部分。通常，你不能直接修改存储在寄存器中的值。相反，当XCM executor 程序开始时，值会被设置，并且在特定的情况下，或者根据特定的规则，由特定的指令来操作。有关每个寄存器中包含的内容的更多信息，请参阅[XCM参考](https://docs.substrate.io/reference/xcm-reference/)。


## 配置

和Substrate其他组件以及基于FRAME的链一样，XCM executor 是模块化和可配置的。你可以使用`Config` trait来配置XCM executor 程序的许多方面，并定制实现，从而以不同的方式处理XCM指令。例如，`Config` trait提供了以下类型定义：

```rust
/// 用于参数化`XcmExecutor`的trait。
pub trait Config {
    /// 外部调用分发类型。
    type Call: Parameter + Dispatchable<PostInfo = PostDispatchInfo> + GetDispatchInfo;
    /// 如何发送一个后续的XCM消息。
    type XcmSender: SendXcm;
    /// 如何提取和存入一个资产。
    type AssetTransactor: TransactAsset;
    /// 如何从一个`OriginKind`值获取一个调用源。
    type OriginConverter: ConvertOrigin<<Self::Call as Dispatchable>::Origin>;
    /// 作为储备的（位置，资产）对的组合。
    type IsReserve: FilterAssetLocation;
    /// 作为传送器的（位置，资产）对的组合。
    type IsTeleporter: FilterAssetLocation;
    /// 用于反转位置的方法。
    type LocationInverter: InvertLocation;
    /// 是否执行给定的XCM。
    type Barrier: ShouldExecute;
    /// 用于估计XCM执行的权重的处理器。
    type Weigher: WeightBounds<Self::Call>;
    /// 用于购买XCM执行的权重信用的处理器。
    type Trader: WeightTrader;
    /// 用于处理查询的响应的处理器。
    type ResponseHandler: OnResponse;
    /// 用于处理执行后在Holding寄存器中的资产的处理器。
    type AssetTrap: DropAssets;
    /// 用于处理有索取资产的指令的处理器。
    type AssetClaims: ClaimAssets;
    /// 用于处理版本订阅请求的处理器。
    type SubscriptionService: VersionChangeNotifier;
}
```

配置信息和消息包含的XCM指令集，或者更准确地说，在接收系统上所需执行的程序，被作为XCM executor 的输入。通过XCM builder模块提供的额外类型和函数，XCM executor 按照它提供的顺序逐个解释和执行指令中包含的操作。下图提供了一个简化的工作流程概述。

![](https://docs.substrate.io/static/2d81fb1433ac45ac31e641c4a2078390/b418f/xcvm-overview.webp)


## 位置

因为XCM是一种用于在不同共识系统之间通信的语言，它需要使用一种抽象的方式来表达位置，使其具有一般性、灵活性和无歧义性。例如，XCM必须能够识别以下类型活动所包含的位置：

- 指令应该在哪里执行。
- 资产应该从哪里提取。
- 可以找到的接收资产的账户。

对于这些活动，位置可能是在中继链、平行链、外部链、特定链上的账户、特定的智能合约或单个pallet的上下文中。例如，XCM必须能够识别以下类型的位置：

- 一个layer-0的链，如Polkadot或Kusama中继链。
- 一个layer-1的链，如比特币或以太坊主网或平行链。
- 一个layer-2的智能合约，如以太坊上的ERC-20。
- 一个平行链或以太坊上的地址。
- 一个中继链或平行链上的账户。
- 一个基于Frame的Substrate链上的特定pallet。
- 一个基于Frame的Substrate链上的单个pallet实例。

为了在共识系统的上下文中描述位置，XCM使用`MultiLocation`类型。`MultiLocation`类型表示一个相对于当前位置的位置，由两个参数组成：

- `parents: u8`，用于描述在使用`interior`参数之前，从当前共识位置向上移动的层级数。
- `interior: InteriorMultiLocation`，用于描述在按照`parents`参数指定的相对路径上升后，共识系统内部的位置。

`InteriorMultiLocation`使用**junction**的概念来表示当前共识系统内部的系统，每个junction指定了相对于前一个junction更内部的位置。一个没有junction的`InteriorMultiLocation`表示当前共识系统（Here）。你可以使用junction来为XCM指令指定一个共识系统内的平行链、账户或pallet实例。

例如，以下参数从中继链的上下文中指向一个具有唯一标识符1000的平行链：

```rust
{
    "parents": 1,
    "interior": { "X1": [{ "Parachain": 1000 }]}
}
```

在这个例子中，`parents`参数上升一级到父链，`interior`指定一个内部位置，junction类型为`Parachain`，索引为`1000`。

MultiLocation遵循用于描述文件系统路径的惯例。例如，表示为`../PalletInstance(3)/GeneralIndex(42)`的MultiLocation描述了一个有一个父级（..）和两个junction（`PalletInstance{index: 3}`）和（`GeneralIndex{index: 42}`）的MultiLocation。

有关指定位置和junction的更多信息，请参阅[通用共识位置标识符](https://github.com/paritytech/xcm-format#7-universal-consensus-location-identifiers)。


## 资产


大多数区块链依赖于某种类型的数字资产来提供对网络安全至关重要的经济激励。一些区块链支持单一的原生资产，而有些区块链允许在链上管理多种资产，例如，智能合约中定义的资产或非原生代币。还有一些区块链支持非同质化的数字资产，用于独特的收藏品。为了让XCM支持这些不同类型的资产，它必须能够以一种通用、灵活和无歧义的方式表达资产。

为了描述链上的资产，XCM使用`MultiAsset`类型。`MultiAsset`类型指定资产的标识以及资产是同质的还是非同质的。通常，资产的标识是使用具体位置来指定的。如果资产是同质的的，定义中会包含它的数量。

虽然可以使用抽象标识符来识别资产，但具体标识符是一种无需使用资产名称的全局注册表就能无歧义地识别资产的方式。

具体标识符通过其在共识系统中的位置来特定地识别单一资产。然而，值得注意的是，具体的资产标识符不能在共识系统之间直接复制。相反，资产是使用每个共识系统的相对路径来转移的，构建的相对路径必须能够从接收系统的角度来解读。

对于原生资产——如Polkadot中继链上的DOT，资产标识符通常是铸造资产的链或者从一个平行链的上下文中向上一级（`..`）。如果一个资产是在一个pallet内管理的，资产标识符使用pallet实例标识符和该pallet内的索引来指定位置。例如，Karura平行链可能会引用Statemine平行链上位置为`../Parachain(1000)/PalletInstance(50)/GeneralIndex(42)`的资产。

有关指定位置和junction的更多信息，请参阅[通用资产标识符](https://github.com/paritytech/xcm-format#6-universal-asset-identifiers)。


## 指令


大多数XCM指令使你能够构造具有一致性的消息，无论你通信的共识系统如何配置，都能按照你的期望去执行。然而，也有灵活的`Transact`指令来执行消息接收方公开的任何可调用函数。通过使用`Transact`指令，你可以对接收系统上的任何函数进行调用，但它需要你了解该系统的配置情况。例如，如果你想调用另一个平行链的特定pallet，你必须知道接收方Runtime如何配置，以构造正确的消息并到达正确的pallet。不同的链有不同的信息，因为每个Runtime都可以被不同地配置。
