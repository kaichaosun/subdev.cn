# MacOS开发环境

原文：https://docs.substrate.io/install/macos/

你可以在配备Intel或Apple M1处理器的Apple macOS计算机上安装Rust并配置Substrate开发环境。

## 在你开始前

在你在macOS上安装Rust并配置开发环境之前，请验证你的计算机是否满足以下基本要求：

- 操作系统版本为10.7 Lion或更高版本。
- 处理器速度至少为2Ghz，推荐3Ghz。
- 内存至少为8 GB RAM，推荐16 GB。
- 存储空间至少有10 GB可用空间。
- 宽带互联网连接。

### 对Apple Silicon的支持

在开始构建之前，必须先安装 Protobuf。请运行以下命令安装它：
```
brew install protobuf
```

### 安装Homebrew

在大多数情况下，你应该使用Homebrew来安装和管理macOS计算机上的包。如果你的本地计算机上还没有安装Homebrew，你应该下载并安装它。

安装Homebrew：

1. 打开终端应用程序。
2. 运行以下命令下载并安装Homebrew：

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

3. 运行以下命令验证Homebrew是否已成功安装：

```
brew --version
```

命令显示类似下面的输出：

```
Homebrew 3.3.1
Homebrew/homebrew-core (git revision c6c488fbc0f; last commit 2021-10-30)
Homebrew/homebrew-cask (git revision 66bab33b26; last commit 2021-10-30)
```

## 安装 

由于区块链需要标准的加密技术来支持公钥/私钥对的生成和交易签名的验证，你还必须有一个提供加密的包，例如`openssl`。

在macOS上安装`openssl`和Rust工具链：

1. 打开终端应用程序。
2. 运行以下命令确保你有最新版本的Homebrew：

```
brew update
```

3. 运行以下命令安装openssl包：

```
brew install openssl
```

4. 下载rustup安装程序，并通过以下命令安装Rust：

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

5. 按照显示的提示进行默认安装。
6. 运行以下命令更新你当前的shell以找到Cargo：

```
source ~/.cargo/env
```

7. 运行以下命令验证你的安装：

```
rustc --version
```

8. 运行以下命令将Rust工具链配置为默认使用最新的稳定版本：

```
rustup default stable
rustup update
rustup target add wasm32-unknown-unknown
```

9. 运行以下命令，将nightly发布版和nightly WebAssembly（wasm）目标添加到你的开发环境：

```
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

10. 运行以下命令验证你的开发环境配置：

```
rustup show
rustup +nightly show
```

命令显示类似下面的输出：

```
# rustup show

active toolchain
----------------

stable-x86_64-apple-darwin (default)
rustc 1.61.0 (fe5b13d68 2022-05-18)

# rustup +nightly show

active toolchain
----------------

nightly-x86_64-apple-darwin (overridden by +toolchain on the command line)
rustc 1.63.0-nightly (e71440575 2022-06-02)

```

11. 使用以下命令安装`cmake`：
```
brew install cmake
```

## 编程Substrate节点

现在你已经安装了Rust并为Substrate开发配置了Rust工具链，你可以通过克隆Substrate **node template**项目和编译Substrate节点来完成开发环境设置。

node template提供了一个工作环境，其中包括构建区块链所需的所有最常见功能，而无需任何额外的模块或工具。为了确保node template为你提供一个相对稳定的试验环境，建议的最佳实践是从Substrate Developer Hub仓库克隆Substrate node template，而不是从核心Substrate仓库克隆。

编译Substrate node template：

1. 运行以下命令克隆node template仓库：

```
git clone https://github.com/substrate-developer-hub/substrate-node-template
```

在大多数情况下，你可以克隆`main`分支以获取最新代码。但是，如果你想使用与特定Polkadot版本兼容的Substrate分支，你可以使用`--branch`命令行选项。点击[Tags](https://github.com/substrate-developer-hub/substrate-node-template/tags)查看与特定Polkadot版本兼容的分支列表。

2. 运行以下命令切换到node template目录的根目录：

```
cd substrate-node-template
```

如果你想保存更改并使这个分支易于识别，你可以通过运行类似以下的命令创建一个新分支：

```
git switch -c my-wip-branch
```

3. 运行以下命令编译node template：

```
cargo build --release
```

由于所需的包很多，编译节点可能需要几分钟时间。

构建成功完成后，你的本地计算机已准备好开始Substrate开发活动。


## 下一步

Substrate开发者中心作为一个中央门户，可以访问社区提供的许多资源。根据你的兴趣和学习风格，你可能会更喜欢一种途径而不是另一种。例如，如果你喜欢阅读源代码并且熟悉Rust，你可能想从深入研究[Rust API](https://paritytech.github.io/substrate/master)开始。

以下是一些额外的建议，你可以在这些地方了解更多信息。

告诉我
- [Architecture](https://docs.substrate.io/learn/architecture/)
- [Networks and blockchains](https://docs.substrate.io/learn/node-and-network-types/)
- [Build process](https://docs.substrate.io/build/build-process/)

指导我
- [Build a local blockchain](https://docs.substrate.io/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](https://docs.substrate.io/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](https://docs.substrate.io/tutorials/build-a-blockchain/add-trusted-nodes/)

