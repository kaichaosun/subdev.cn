ref: https://docs.substrate.io/learn/what-can-you-build/

# 你可以构建什么

在设计区块链应用程序时，你需要做的第一个决定是你想要采取什么方式来构建。例如，你需要决定你的项目是否最适合以智能合约、单个pallet、自定义runtime或平行链的形式交付。关于构建什么的决定将影响你的几乎所有其他后续决定。为了帮助你做出关于构建什么的初步判断，本节重点讲解有哪些方案可选、它们之间的差异以及你可能选择一种方法而不是另一种方法的原因。

## 智能合约

许多开发者都熟悉智能合约，并自然倾向于认为他们的项目非常适合智能合约模型。然而，在确定智能合约方式是否适合你的项目时，需要考虑其优点和缺点。

### 智能合约必须遵守其所依赖的区块链的规则

智能合约是部署在特定链上并在特定链地址上运行的指令。由于智能合约在它们无法控制的底层区块链上运行，因此它们必须遵守底层链施加的任何规则或限制。例如，底层区块链可能会限制对存储的访问或阻止某些类型的交易。

此外，接受智能合约的区块链通常将代码来源视为不受信任的——可能是恶意行为者或经验不足的开发者。为了防止不受信任的代码破坏区块链操作，底层区块链实施了本地安全措施，以限制恶意或错误的智能合约能做的事情。例如，底层链可能会收取费用或执行计量，以确保合约开发者或用户为合约消耗的计算和存储付费。合约执行的费用和规则由底层链自行决定。

### 智能合约和状态

你可以将智能合约视为在沙盒环境中执行。它们不直接修改底层区块链存储或其他合约的存储。通常，智能合约只修改自己的状态，不调用其他合约或runtime函数。通常，运行智能合约需要一些额外的开销，以确保底层区块链可以恢复交易，防止合约中的错误导致执行失败时更新错误的状态。

### 使用智能合约的场景

尽管智能合约有其限制，但在某些情况下，你的项目可能会从使用智能合约中受益。例如，智能合约的入门门槛较低，通常可以在短时间内构建和部署。减少的开发时间可能会让你在确定产品与市场的匹配度和快速迭代方面具有优势。

同样，如果你熟悉使用像Solidity这样的语言构建智能合约，你可以减少学习曲线和项目的上线时间。因为智能合约遵循它们部署所在链的功能，你可以更窄化地专注于实现合约的应用逻辑，而不用担心区块链基础设施或经济学。

如果你打算构建一个平行链，你也可以使用智能合约以一种不影响底层网络的隔离方式原型化特性或功能，然后再投资于更全面的解决方案。如果你是一个runtime开发者，你可以将合约纳入到你的社区中，让他们为你的runtime扩展和开发特性，而无需授予他们访问底层runtime逻辑的权限。你还可以使用智能合约来测试未来的runtime变更。

总的来说，在决定是否使用智能合约构建项目时，你应该考虑以下特性：

- 他们对网络本质上更安全，因为底层链内置了安全措施，但你无法控制这些安全措施所施加的任何限制、局限性或计算开销。
- 底层链提供了防止滥用的内置经济激励，但费用和计量系统由底层链定义。
- 他们在代码复杂性和部署时间方面的入门门槛较低。
- 他们可以为原型设计、测试和社区参与提供一个隔离的环境。
- 由于你利用了现有的网络，他们的部署和维护开销较低。

以下示例说明了智能合约的使用案例：

- 在现有的去中心化交易所（DEX）中添加衍生品。
- 实现自定义交易算法。
- 定义特定各方之间的合约逻辑。
- 在将应用程序转换为平行链之前进行原型设计和测试。
- 在现有链上引入第二层代币和自定义资产。 

### 对智能合约的支持

Polkadot中继链不支持智能合约。然而，连接到Polkadot的平行链可以支持任意的状态转换 (state transitions)，所以任何平行链都可以是智能合约部署的潜在平台。例如，当前Polkadot生态系统中有几个平行链支持不同类型的智能合约部署。如果你计划为Polkadot生态系统开发一个智能合约，你必须首先决定你想要构建的智能合约的类型，并确定一个支持该类型智能合约的平行链。Substrate提供了支持两种类型的智能合约的工具：

- FRAME库中的contracts pallet使基于Substrate的链能够执行编译为WebAssembly的智能合约，无论使用什么语言编写智能合约。
- Frontier项目中的evm pallet使基于Substrate的链能够运行用Solidity编写的以太坊虚拟机（EVM）合约。

### 探索智能合约

如果你的项目看起来非常适合以智能合约形式存在，你可以在以下教程中看到一些简单的示例来帮助你启动：

- [开发智能合约](https://docs.substrate.io/tutorials/smart-contracts/)
- [访问EVM账户](https://docs.substrate.io/tutorials/integrate-with-tools/access-evm-accounts/)


## 独立（Individual）Pallet

在某些情况下，你可能希望将应用逻辑实现为一个独立的pallet，并将功能作为库提供给社区，而不是构建自己的自定义runtime。例如，如果你不想部署和管理一个特定应用的区块链，你可能会构建一个或多个单独的pallet，以提供在所有基于Substrate的链中广泛有用的特性，改进现有功能，或者为Polkadot生态系统定义一个标准。使用FRAME开发单独的pallet通常很容易，对于Substrate链来说，集成也很容易。

### 书写正确的代码

值得注意的是，pallet本身并不提供智能合约所提供的任何类型的保护或安全措施。使用pallet，你可以控制runtime开发者可以用之实现的逻辑功能。你提供模块所需的方法、存储项、事件和错误。pallet本身并不引入费用或计量系统。你需要确保你的pallet逻辑不允许出现不良行为，或者使使用你的pallet的网络容易受到攻击。这种缺乏内置安全措施意味着你有很大的责任编写避免错误的代码。

### Runtime开发之外的Pallet

通常，编写pallet是进入runtime开发的入口，让你有机会在不构建完整的区块链应用程序的情况下，体验现有的pallet和编码模式。单独的pallet也提供了一种你可以在不编写自己的应用程序的情况下为项目做出贡献的替代方式。

尽管编写和测试pallet通常是构建大规模应用程序的垫脚石，但有很多例子可以证明单独的pallet对整个生态系统的价值。

即使你正在构建一个单独的pallet，你也需要在runtime的上下文中对它进行测试。开发单独pallet的主要缺点是你无法控制它们被使用时runtime的其他部分。如果你将你的pallet视为孤立的代码，你可能会错过增强或改进它的机会。此外，如果你不更新你的代码以保持与这些更改同步的话，对FRAME或Substrate的更改可能会给你的独立pallet造成维护问题。

### 探索构建Pallet

如果你的项目看起来非常适合作为一个单独的pallet，你可以在以下部分看到一些简单的示例来帮助你启动：

- [自定义pallet](https://docs.substrate.io/build/custom-pallets/)
- [构建应用逻辑](https://docs.substrate.io/tutorials/build-application-logic/)
- [收藏品工作坊](https://docs.substrate.io/tutorials/collectibles-workshop/)

## 自定义runtime

在大多数情况下，决定构建一个自定义runtime，是向Polkadot生态系统构建和部署一个特定应用平行区块链（即平行链）的关键步骤。通过使用Substrate和FRAME，你可以开发一个完全定制的runtime。有了自定义runtime，你可以完全控制你的应用的所有方面，包括经济激励、治理、共识和资源管理。

有一些pallet提供了可插拔模块来实现这些特性。然而，最终由你自己决定使用哪些模块，如何根据你的需求修改它们，以及在哪里需要自定义模块。因为你控制你的网络中每个节点运行的所有底层逻辑，所以它在编码技能和经验方面的入门门槛比编写智能合约或单独的pallet要高。

与单独的pallet一样，自定义runtime并不提供任何内置的安全措施来防止恶意行为者或错误代码造成伤害。而是由你来正确评估资源消耗量，以及设计在runtime逻辑中如何收取交易费用，以充分保护网络和你的用户社区。

与智能合约或单独的pallet不同，自定义runtime是一个全功能的区块链。要使自定义runtime对其他人可用和安全，这涉及到掌握物理或云计算资源，建立一个社区，从中发现你的服务的价值，并管理网络基础设施。

对于智能合约，你的应用程序运行在现有的执行模型之上，限制了你的应用程序可以做什么。对于自定义runtime，你控制底层执行模型，并可以选择扩展它，以支持其他开发者的智能合约在上面执行。使用自定义runtime，你还可以提供比智能合约或单独pallet更复杂的功能以及用户交互。

### 探索构建自定义runtime

如果你想构建一个更完整的自定义runtime，而不是一个单独的pallet，你可以从一个简单的示例开始，比如[收藏品工作坊](https://docs.substrate.io/tutorials/collectibles-workshop/)。然而，如果你想构建一个作为独立链或平行链的PoC自定义runtime，你需要对runtime组件和FRAME pallet有更广泛、更深入的理解。最相关的主题在“[构建](https://docs.substrate.io/build/)和[测试](https://docs.substrate.io/test/)”下，并在以下部分：

- [runtime存储结构](https://docs.substrate.io/build/runtime-storage/)
- [交易、权重和费用](https://docs.substrate.io/build/tx-weights-fees/)
- [应用开发](https://docs.substrate.io/build/application-development/)
- [FRAME pallet](https://docs.substrate.io/reference/frame-pallets/)
- [FRAME宏](https://docs.substrate.io/reference/frame-macros/)

## 平行链

自定义runtime所定义的业务逻辑可以以私有网络或独立链形式存在，但如果你希望你的项目成为一个有用的生产链，那么将你的应用程序的业务逻辑和状态转换函数部署为平行链或平行线程有几个优点。

平行链和平行线程以独立的Layer 1区块链运行。每个平行链都有自己的逻辑，并与生态系统中的其他链平行运行。生态系统中的所有链都从Polkadot网络的共享安全性、治理、可扩展性和互操作性中受益。

### 平行链提供最大程度的灵活性

以平行链形式开发你的项目，你在链的设计和功能上有很大的自由度和灵活性。决定构建什么完全取决于你自己。例如，你可以定义在链上或链下存储什么数据。你可以定义你自己的经济原语、交易要求、费用政策、治理模型、财政账户和访问控制规则。你的平行链可以有尽可能少（或尽可能多）的每笔交易开销，而且你的平行链可以随着时间的推移通过升级和优化而发展。唯一的要求是，你的平行链或平行线程必须与Polkadot API兼容。

### 平行链的资源要求规划

作为一个平行链，你的项目可以以比私有链或独立链更安全的方式为更广泛的社区提供功能。然而，如果你想构建一个生产就绪的平行链，你应该记住以下额外的要求：

- 你需要一个具有足够技能和经验的开发团队，无论是在Rust编程还是在UX设计背景方面。
  开发平行链可能比其他方案需要更多的资源。
- 你需要通过市场营销、外联或生态系统开发计划来建立你的社区。
- 你需要为你的基础设施和网络维护提供资源。
  平行链是一个完整的区块链。虽然中继链为你的项目提供了安全性和共识，但你必须维护你的链和网络基础设施。除了开发者运维（DevOps），你还需要保护一个平行链插槽，设计一个众贷或拍卖策略，并积累足够的资源来扩展插槽。
- 你需要足够的时间来测试和验证你的链运维，在沙盒或模拟网络中、以及在一个完全功能的测试网络上进行测试。

### 平行链的使用案例

总的来说，如果你的项目需要复杂的操作，你应该将其构建为平行链，因为平行链提供了更快、更高效的交易执行。例如，对于以下用例，构建平行链可能是最好的选择：

- 去中心化金融（DeFi）应用
- 数字钱包
- 物联网（IOT）应用
- 游戏应用
- Web 3.0基础设施

### 探索构建平行链

如果你有一个自定义runtime，你想将其作为平行链部署，以利用中继链和Polkadot或Kusama生态系统的安全性、治理和互操作性，你可以从本地构建开始，并为初步测试设置你自己的测试网络。

要获取一些启动示例，请参阅以下部分：

- [将平行链连接到网络](https://docs.substrate.io/tutorials/build-a-parachain/)
- [在测试网络中模拟平行链](https://docs.substrate.io/test/simulate-parachains/)
- [平行链](https://docs.substrate.io/reference/how-to-guides/parachains/)

要了解更多你可以构建什么，请探索以下资源：

- [使用Polkadot构建](https://wiki.polkadot.network/docs/build-build-with-polkadot)
- [平行链开发](https://wiki.polkadot.network/docs/build-pdk)
- [智能合约](https://wiki.polkadot.network/docs/build-smart-contracts)

