# Rust工具链

ref: https://docs.substrate.io/install/rust-toolchain/

Rust是一种现代化、类型安全且性能优越的编程语言，它提供了丰富的功能集，用于构建复杂的系统。该语言还拥有一个活跃的开发者社区和一个不断增长的共享库生态系统，称为**crates**。

## 学习Rust

Rust是用于构建基于Substrate的区块链的核心语言，所以如果你打算进行Substrate开发，你需要熟悉Rust编程语言、编译器和工具链管理。

如果你刚开始接触Rust，你应该收藏[《Rust编程语言》](https://doc.rust-lang.org/book/)并参考Rust网站上的其他[学习资源](https://www.rust-lang.org/learn)。然而，在准备你的开发环境时，有几个重点需要注意。

## 关于Rust工具链

Rust 工具链的核心工具包括 `rustc` 编译器、`cargo` 构建和软件包管理器以及 `rustup` 工具链管理器。在任何特定时间点，Rust 都有多个可用版本。例如，有稳定版stable、测试版beta和夜间版nightly 的发布渠道。你可以使用 `rustup` 程序来管理环境中可用的版本，以及不同 Rust 版本所使用的工具链版本。

`rustc` 编译器可以让你为不同的架构（称为**目标**）构建二进制文件。目标由一个字符串标识，该字符串指定了编译器应生成的输出类型。这一功能非常重要，因为 Substrate 会被编译成本地 Rust 二进制文件和 WebAssembly 目标文件。

WebAssembly 是一种可移植的二进制格式，可以在任何现代计算机硬件上执行，也可以在任何可连网的浏览器上运行。WebAssembly (Wasm) 目标使 Substrate 能够生成可移植的区块链Runtime。有关如何使用这些二进制文件的详细信息，请参阅[构建过程](https://docs.substrate.io/build/build-process/)。
