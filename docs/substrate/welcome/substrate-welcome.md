---
title: 欢迎来到Substrate
sidebar_label: 欢迎来到Substrate
---


ref: https://docs.substrate.io/learn/welcome-to-substrate/


Substrate 是一个软件开发工具包（SDK），它允许你构建面向特定应用的区块链。它可以作为独立服务运行，也可以与其他链并行运行，共享 Polkadot 生态系统提供的安全性。

## 简单且自由创新

使用 Substrate，你可以完全控制你想要构建的应用程序。可以从大量开源模块和模板库中选择预定义的应用程序逻辑，以加快开发时间。在当前库中找不到你需要的内容？这不是问题，这是一个机会，可以使用可重用的 Rust 宏和脚手架代码构建自定义模块。如果你想更加冒险，或有新颖的想法，你可以通过使用低级原语来创新区块链设计。

![](https://docs.substrate.io/static/c9882d38950de8f51743890233f18ef6/70fb9/development-complexity.webp)

## 使用模板和模块进行构建

大多数项目都从模板开始，以减少开发时间和复杂性。然后通过修改现有模块和添加新模块来往前推进。模块、宏和库是 FRAME 开发环境的核心组件。FRAME 的主要目的是提供一个模块化和灵活的组件集合，用于构建定制的 Substrate runtime。

FRAME 开发环境使你能够选择并配置你想要在runtime中使用的特定模块（称为pallet）。pallet提供可定制的业务逻辑，用于常见业务：如管理账户余额和投票提案等。pallet还提供区块链正常运转所需的业务逻辑，如抵押和共识。

## 组建一个runtime

每个pallet定义了特定类型、存储项和函数，以实现runtime的某个特定功能集合。你可以选择并组合适合你的应用程序的pallet来组成自定义runtime。例如，如果你的应用程序需要管理账户余额，可以在runtime逻辑的配置中简单地包含 Balances pallet。然后，你可以修改自定义runtime中pallet的配置以适配当前应用程序。

下图中runtime由九个pallet组成，它们实现了共识层、给块提供时间戳、管理资产和余额等功能，以及为治理和管理资金池等。

![](https://docs.substrate.io/static/64b2fcb61748ae77f4dd4c9ce63872b1/62cd2/compose-runtime.webp)

除了给你提供在runtime中使用的可选的功能性的pallet外，FRAME 还依赖于一些底层系统服务来构建和启用runtime之外的客户端节点服务，并与runtime交互。这些底层服务由以下必要模块提供：

- FRAME 系统类crate frame_system 为runtime提供低级类型、存储和函数。 
- FRAME 支持类crate frame_support 是一个 Rust 宏、类型、traits和模块的集合，简化了Substrate pallet的开发。 
- FRAME 执行类pallet frame_executive 用于对传入的调用runtime中各个pallet的函数进行编排并执行。 

你可以在构建runtime代码的过程中使用很多现成的 pallet 构建砖块。你可以在 Substrate 仓库或 Rust 文档中查看可用pallet的列表。有关最常见pallet的简要概述，请参阅 FRAME pallet。

如果你找不到所需功能的pallet，你可以使用 FRAME 创建自己的自定义pallet，然后将该自定义pallet添加到你的自定义runtime中。

## 建构自定义pallet

FRAME 开发环境包括使构建自定义pallet相对容易的库。使用自定义pallet，您可以灵活地定义最适合您应用程序的runtime行为。由于每个pallet都有自己的业务逻辑，您可以将现有的开源pallet与自定义pallet结合起来，以提供应用程序所需的特定功能。例如，您可能在runtime中包含 Balances pallet，以使用其函数和存储项管理账户余额，又添加了一个自定义pallet，在账户余额发生变化时向服务发送通知。

## 为什么应该使用Substrate进行开发

Substrate 是一个完全**模块化**和**灵活**的框架，它允许你通过选择和定制最适合你的项目的基础设施组件来组成链。例如，你可以更改网络层、共识模型、交易格式或治理方法，以部署专为你的应用程序设计的区块链，同时也可以随着你的需求的变化而演变。

除了可组合性和可适配性外，Substrate 还设计为**可升级**。状态转换逻辑（也就是Substrate runtime）是一个独立的 WebAssembly 对象，你可以在需要引入新功能或更新现有功能时完全更改它。由于runtime是一个独立的对象，你可以在不中断服务，或无需节点下线的情况下在整个网络中实行runtime升级操作。在大多数情况下，节点无需采取任何操作即可使用新runtime，因此你可以随着时间的推移无缝演变网络协议，以满足用户需求。

Substrate 也是一个**开源项目**，所有 Substrate 库和工具都在开源许可下提供。此外，Substrate 框架的核心组件使用开放协议（如 `libp2p` 和 `jsonRPC`），同时赋予你自由地决定要在多大程度上自定义区块链架构的能力。Substrate 还拥有一个庞大、活跃且乐于助人的开发者社区，为生态系统做出贡献。来自社区的贡献增强了整个生态系统的能力，而当你的区块链不断演化时，可以充分使用这些能力。

另外，Substrate 支持**跨共识消息传递（XCM）**，以使不同系统能够相互传递消息。






