# 给Substrate开发者的Rust说明书

ref: https://docs.substrate.io/learn/rust-basics/

Substrate之所以能成为一个灵活和可扩展的框架，用于创建关键任务软件，很大程度上要归功于[Rust](https://www.rust-lang.org/)。作为Substrate的首选语言，Rust是一种高性能的编程语言，有以下几个方面的考量：

- Rust是快速的：它在编译时是静态类型的，使得编译器可以优化代码的速度，开发者也可以针对特定的编译目标进行优化。
- Rust是可移植的：它设计为可以运行在嵌入式设备上，并支持任何类型的操作系统。
- Rust是内存安全的：它没有垃圾回收器，并且检查你使用的每一个变量和每一个内存地址，以避免任何内存泄漏。
- Rust是Wasm优先的：它有一流的工具支持编译到WebAssembly。


## Substrate中的Rust

在[架构](https://docs.substrate.io/learn/rust-basics/)部分，你将了解到Substrate由两个不同的架构层面的组件组成：外层节点和Runtime。虽然Rust的一些更复杂的特性，如多线程和异步Rust，被用于外层节点代码中，但它们并没有直接暴露给Runtime工程师，这使得Runtime工程师更容易专注于他们的节点的业务逻辑。

一般来说，根据他们的关注点，开发者应该了解：

- 基本的[Rust习惯用法](https://rust-unofficial.github.io/patterns/idioms/index.html)，[使用no_std](https://docs.rust-embedded.org/book/intro/no-std.html)以及使用什么宏和为什么（针对于Runtime工程师）。
- [异步Rust](https://rust-lang.github.io/async-book/01_getting_started/01_chapter.html)（适用于开发外层节点（客户端）的高级开发者）。 

在深入Substrate之前，有必要熟悉一下Rust——有许多资源可以学习Rust，包括[Rust语言编程书](https://doc.rust-lang.org/book/)和[Rust示例](https://doc.rust-lang.org/rust-by-example/)。本节的其余部分将重点讲解一下在Substrate中使用Rust的一些核心特性的方式，以帮助刚开始学习Runtime开发的开发者。


## 编译目标

当构建一个Substrate节点时，我们使用`wasm32-unknown-unknown`编译目标，这意味着Substrate Runtime工程师只能编写能够编译成Wasm的Runtime。这意味着你不能依赖一些典型的标准库类型和函数，而必须只使用`no_std`兼容的crate来编写大部分的Runtime代码。Substrate有很多自己的原始类型和相关的trait，使得它可以绕过`no_std`的要求，以使得编码更加容易。


## 宏

当你学习如何使用和编写FRAME pallets时，你会发现有许多宏对可重用的代码进行了抽象，用于常见的任务或强制执行Runtime特定的要求。这些宏让你可以专注于编写符合Rust惯用法和特定应用的逻辑代码，而不是与Runtime交互所需的通用样板代码。

Rust宏是一个强大的工具，可以帮助确保满足某些要求（而不需要重写代码），例如逻辑要以特定的方式格式化，进行特定的检查，或者一些逻辑由特定的数据结构组成。这对于帮助开发者编写可以与Substrate Runtime 集成的代码（通常比较复杂）特别有用。例如，`#[frame_system::pallet]`宏是所有FRAME pallets所必需的，它可以帮助你正确地实现一些必需的属性——例如存储项或外部可调用函数，并使其与`construct_runtime`中的构建过程兼容。

开发Substrate Runtime涉及到大量使用Rust的属性宏，它们有两种风格：派生属性和自定义属性。当你开始使用Substrate时，知道它们如何工作并不是那么重要，而是要知道它们的存在，能够让你编写正确的Runtime代码。

派生属性对于需要满足某些trait的自定义Runtime类型很有用，例如，让类型在Runtime执行期间可以被节点解码。

其他属性宏也在Substrate的代码库中很常见，用于：

- 指定一个代码片段只编译到`no_std`，或者可以使用`std`库。 
- 构建自定义的FRAME pallets。 
- 指定Runtime的构建方式。

## 泛型和配置trait

Rust中的trait类似于Java等语言中的接口，它们提供了一种给类型赋予高级功能的方法。

如果你已经了解了pallets，你可能已经注意到每个pallet都有一个`Config` trait，它允许你定义pallet所依赖的类型和接口。

这个trait本身继承了一些来自`frame_system::pallet::Config` trait 的核心Runtime类型，这使得在编写Runtime逻辑时更容易访问常见的类型。此外，在任何FRAME pallet中，`Config` trait拥有一个泛型，泛型参数为`T`（关于泛型的更多内容在下一节）。在这些核心Runtime类型中，常见的有  `T::AccountId`，用于在Runtime中区分常用的用户类型，`T::BlockNumber`，Runtime中使用的区块编号类型。

关于Rust中的泛型和trait的更多信息，请参阅Rust Book中的[泛型](https://doc.rust-lang.org/book/ch10-01-syntax.html)、[trait](https://doc.rust-lang.org/book/ch10-02-traits.html)和[高级trait](https://doc.rust-lang.org/book/ch19-03-advanced-traits.html)部分。

使用Rust泛型，Substrate Runtime开发者可以编写完全不依赖于特定实现细节的pallets，从而充分利用Substrate的灵活性、可扩展性和模块化能力。

`Config` trait中的所有类型都定义成被trait约束的泛型，并在Runtime实现中具体化。这不仅意味着你可以编写支持同一类型的不同规范的pallets（例如，Substrate和Ethereum链的地址），而且你还可以根据自己的需要以最小的开销定制泛型实现（例如，将区块编号改为`u32`）。

这给开发者提供了编写代码的灵活性，使代码不需要对你所做的核心区块链架构决策做出任何假设。

Substrate最大限度地利用泛型来提供最大的灵活性。由你来定义泛型如何具体化以适应你的目的。

关于Rust中的泛型和trait的更多信息，请参阅Rust Book中的[泛型](https://doc.rust-lang.org/book/ch10-01-syntax.html)部分。


## 下一步

现在你已经知道Substrate是如何依赖于几个关键的Rust特性——如trait、泛型和宏，接下来你可以探索以下资源来学习更多知识。


- [Rust book](https://doc.rust-lang.org/book/)
- [为什么使用Rust?](https://www.parity.io/blog/why-rust) (blog by Parity)
- [Cargo and crates.io](https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html)
- [为什么用Rust写智能合约?](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts) (ink! 文档)
