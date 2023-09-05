---
title: Substrate架构及Rust库介绍
sidebar_label: Substrate架构及Rust库介绍
---

ref: https://docs.substrate.io/learn/architecture/

正如[区块链基础知识](https://docs.substrate.io/learn/blockchain-basics/)中所述，区块链依赖于一个去中心化的计算机网络，网络中的计算机被称为节点，它们之间会相互通信。

因为节点是任何区块链的核心组件，所以了解是什么使 Substrate 节点如此独特非常重要。这些东西包括默认提供的核心服务和库，以及如何自定义和扩展节点以适应不同的项目目标。


## 客户端和运行时Runtime

从高层次上看，Substrate 节点由两个主要部分组成：

- 核心客户端，包含了外层节点服务，能够处理网络活动，例如发现其他对等节点、管理交易请求、与对等节点达成共识以及响应 RPC 调用等。 
- 运行时runtime，包含执行区块链状态转换函数的所有业务逻辑。 

以下图表以简化形式说明了这种职责分离，以帮助你以可视化的方式理解Substrate的架构，及其提供的用于构建区块链的模块化框架。

![](https://docs.substrate.io/static/ba5a48a1993a5eddabf1e91c3eb9974f/3cc59/simplified-architecture.webp)

## 客户端外层节点服务

核心客户端包括多个外层节点服务，它们负责处理Runtime之外的活动。例如，处理对等节点发现、管理交易池、与其他节点通信以达成共识，并响应来自外部世界的 RPC 请求。

一些最重要的由核心客户端服务处理的活动涉及以下组件：

- [存储](https://docs.substrate.io/learn/state-transitions-and-storage/)：外层节点使用简单且高效的键值存储层持久化 Substrate 区块链的演变状态。 
- [点对点网络](https://docs.substrate.io/learn/networks-and-nodes/)：外层节点使用 Rust 实现的 [libp2p 网络栈](https://libp2p.io/)与其他网络参与者通信。 
- [共识](https://docs.substrate.io/learn/consensus/)：外层节点与其他网络参与者通信，以确保他们对区块链的状态达成一致。 
- [远程过程调用（RPC）API](https://docs.substrate.io/build/remote-procedure-calls/)：外层节点接受入站 HTTP 和 WebSocket 请求，以允许区块链用户与区块链网络交互。 
- [遥测](https://docs.substrate.io/maintain/monitor/)：外层节点通过嵌入式 [Prometheus](https://prometheus.io/) 服务器收集并提供对节点指标的访问。 
- [执行环境](https://docs.substrate.io/build/build-process/)：外层节点负责选择运行时使用的执行环境（WebAssembly 或本机 Rust），然后将调用分派到所选运行时。

Substrate 通过其核心区块链组件提供了处理这些活动的默认实现。原则上，你可以将任何组件的默认实现修改或替换为自己的代码。实际上，很少有区块链允许应用程序更改任何底层功能，但 Substrate 允许你更改，以便你可以自由创新。

执行这些任务通常需要客户端节点服务与运行时Runtime通信。这种通信通过调用专门的[Runtime API](https://docs.substrate.io/reference/runtime-apis/) 处理。

## 运行时Runtime

Runtime确定交易的有效性或无效性，并负责处理区块链状态的更改。来自外部的请求通过客户端进入Runtime，Runtime负责状态转换函数和存储生成的状态。

由于Runtime执行其接收到的函数调用，因此它控制着如何将交易包含在块中以及如何将块返回给外层节点进行网络传播或导入到其他节点。实质上，Runtime负责处理发生在链上的所有事情。构建 Substrate 区块链时，runtime是组成节点的核心组件。

Substrate Runtime被设计为编译成 [WebAssembly（Wasm）](https://docs.substrate.io/reference/glossary/#webassembly-wasm)字节码。这种设计决策使得：

- 支持无分叉升级。 
- 多平台兼容性。 
- Runtime有效性检查。 
- 中继链共识机制的验证证明。 

与外层节点提供信息给Runtime的方式类似，Runtime使用专门的[host functions](https://paritytech.github.io/substrate/master/sp_io/index.html)与外层节点或外部世界通信。

## 核心库

为了保持节点模板的简单性，Substrate区块链在许多方面都配置成默认实现。例如，有默认的网络层、数据库和共识机制实现，你可以直接使用它们来运行区块链，而无需进行大量自定义。但是，Substrate架构依赖的底层库非常灵活，可以用来定义自己的区块链组件。

就像节点由两个主要部分组成一样，即提供各种服务的核心客户端，以及Runtime，类似地，Substrate 库分为三个主要责任领域：

- 外层节点服务的核心客户端库
- 运行时的 FRAME 库
- 用于底层功能和接口的基础库，用于上层库之间的通信。

以下图表说明了这些库如何反映核心客户端外层节点和运行时的职责，以及primitive库如何提供两者之间的通信层。

![](https://docs.substrate.io/static/dae77f7ece855ad265b5c93651f4881b/b0783/libraries.webp)

### 核心客户端库


使 Substrate 节点能够处理其网络事务（包括共识和块执行）的库是使用 `sc_` 作为前缀的 Rust crate。例如，[`sc_service`](https://paritytech.github.io/substrate/master/sc_service/index.html) 库负责为 Substrate 区块链构建网络层，管理网络参与者和交易池之间的通信。

### 面向Runtime的FRAME库

你可以使用带有 `frame_` 前缀的 Rust crates 来构建运行时逻辑并对传入和传出Runtime的信息进行编码和解码。

`frame_*` 库提供了运行时的基础设施。例如，[frame_system](https://paritytech.github.io/substrate/master/frame_system/index.html) 库提供了一组基本函数，用于与其他 Substrate 组件交互，而 [frame_support](https://paritytech.github.io/substrate/master/frame_support/index.html) 则使你能够声明运行时存储项、错误和事件。

除了 `frame_*` 库提供的基础设施外，Runtime还可以包括一个或多个 `pallet_*` 库。每个使用 `pallet_` 前缀的 Rust crate 都代表一个单独的 FRAME 模块。在大多数情况下，你使用 `pallet_*` 库来组装你希望在区块链中包含的功能，以适应你的项目。

你可以使用 primitives 库而不使用 `frame_*` 或 `pallet_*` 库来构建 Substrate 运行时。但是，`frame_*` 或 `pallet_*` 库提供了构造 Substrate 运行时的最有效途径。


### Primitive 库


在 Substrate 架构的最底层是primitive库，它们使你能够控制底层操作并在核心客户端服务和Runtime之间进行通信。primitive库使用 sp_ 作为前缀。

Primitive库提供了最低级别的抽象，以暴露接口给核心客户端或Runtime使用，用来执行操作或相互交互。

例如：

- [sp_arithmetic](https://paritytech.github.io/substrate/master/sp_arithmetic/index.html) 库定义了运行时可用的定点算术原语和类型。 
- [sp_core](https://paritytech.github.io/substrate/master/sp_core/index.html) 库提供了一组可共享的 Substrate 类型。 
- [sp_std](https://paritytech.github.io/substrate/master/sp_std/index.html) 库从 Rust 标准库中导出原语，使它们可用于任何依赖于运行时的代码。

## 模块化架构

Substrate 核心库的分离提供了一个灵活且模块化的架构，用于编写区块链逻辑。primitive库为核心客户端和运行时提供了一个基础，它们可以在不直接相互通信的情况下分别进行开发。primitive类型和trait在它们自己单独的 crates 中暴露，因此它们可以在不引入循环依赖问题的情况下提供给外层节点服务和运行时组件。

## 下一步

现在你已经熟悉了用于构建 Substrate 节点 和与 Substrate 节点交互的架构和库，你可能希望更深入地探索这些库。要了解任何库的技术细节，你应该查看该库的 [Rust API](https://paritytech.github.io/substrate/master/) 文档。
