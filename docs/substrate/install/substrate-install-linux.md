# Linux开发环境

原文：https://docs.substrate.io/install/linux/

Rust支持大多数Linux发行版，根据您使用的操作系统的发行版本，你可能需要在环境中添加一些软件依赖项。总的来说，你的开发环境应包括链接器或C兼容编译器，如`clang`，以及合适的集成开发环境（IDE）。

## 在开始之前 

请查阅你的操作系统文档，了解已安装的包的信息，以及如何下载和安装你可能需要的任何其它包。例如，如果你使用Ubuntu，你可以使用Ubuntu包管理工具（`apt`）来安装`build-essential`包：
```
sudo apt install build-essential
```
在安装Rust之前，你至少需要以下包：
```
clang curl git make
```
由于区块链需要标准加密技术来支持公钥/私钥对的生成和交易签名的验证，你还必须有一个提供加密的包，如`libssl-dev`或`openssl-devel`。

## 安装必须的包以及Rust

在Linux上安装Rust工具链：

1. 登录你的计算机并打开一个终端shell。
2. 通过运行你的Linux发行版的包管理命令，检查你在本地计算机上已安装的软件包。
3. 通过运行你的Linux发行版的包管理命令，将缺少的依赖项添加到你的本地开发环境。

例如，在Ubuntu桌面或Ubuntu服务器上，你可能会运行类似于以下的命令：
```
sudo apt install --assume-yes git clang curl libssl-dev protobuf-compiler
```

其他Linux操作系统示例：

Debian
```
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

Arch
```
pacman -Syu --needed --noconfirm curl git clang make protobuf
```

Fedora

```
sudo dnf update
sudo dnf install clang curl git openssl-devel make protobuf-compiler
```

Opensuse
```
sudo zypper install clang curl git openssl-devel llvm-devel libudev-devel make protobuf
```

请记住，不同的发行版可能使用不同的包管理器，并以不同的方式构建包。例如，Ubuntu桌面和Ubuntu服务器可能具有不同的包和不同的要求。然而，命令行示例中列出的包适用于许多常见的Linux发行版，包括Debian，Linux Mint，MX Linux和Elementary OS。

4. 下载`rustup`安装程序，通过运行以下命令来安装Rust：
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
5. 请按照提示进行默认安装。

6. 运行以下命令更新你当前的shell以包含Cargo：
```
source $HOME/.cargo/env
```
7. 运行以下命令验证你的安装：
```
rustc --version
```
8. 运行以下命令将Rust工具链配置为默认使用最新的稳定版本：
```
rustup default stable
rustup update
```
9. 运行以下命令将`nightly` release 和`nightly` WebAssembly（wasm）目标添加到你的开发环境：
```
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```
10. 运行以下命令验证你的开发环境的配置：
```
rustup show
rustup +nightly show
```
该命令显示类似于以下的输出：
```
# rustup show

active toolchain
----------------

stable-x86_64-unknown-linux-gnu (default)
rustc 1.62.1 (e092d0b6b 2022-07-16)

# rustup +nightly show

active toolchain
----------------

nightly-x86_64-unknown-linux-gnu (overridden by +toolchain on the command line)
rustc 1.65.0-nightly (34a6cae28 2022-08-09)
```

## 编译Substrate代码

现在你已经安装了Rust并为Substrate开发配置了Rust工具链，你可以通过克隆Substrate **node template** 仓库并编译Substrate节点来完成开发环境的设置。

node template 提供了一个工作环境，其中包括构建区块链所需的所有最常见功能，并且没有任何多余的模块或工具。为了确保node template为你提供一个相对稳定的实验环境，推荐的最佳实践是从Substrate开发者中心仓库克隆Substrate node template，而不是从Substrate仓库克隆。

要编译Substrate node template：

1. 运行以下命令克隆node template：
```
git clone https://github.com/substrate-developer-hub/substrate-node-template
```
在大多数情况下，你可以克隆`main`分支以获取最新的代码。然而，如果你想使用与特定Polkadot版本兼容的Substrate分支，你可以使用`--branch`命令行选项。点击[tags](https://github.com/substrate-developer-hub/substrate-node-template/tags)以查看与特定Polkadot版本兼容的分支列表。

2. 通过运行以下命令切换到node template目录的根目录：
```
cd substrate-node-template
```
如果你想保存你的更改并使这个分支易于识别，你可以通过运行类似于以下的命令创建一个新的分支：
```
git switch -c my-wip-branch
```
3. 通过运行以下命令编译node template：
```
cargo build --release
```
由于需要的包数量众多，编译node可能需要几分钟的时间。

构建成功完成后，你就可以在本地计算机上进行Substrate开发了。

## 下一步

Substrate Developer Hub 是社区资源的中心门户。根据你的兴趣和学习风格，你可能会偏好某一种方式。例如，如果你喜欢阅读源代码并且熟悉Rust，你可能想从深入研究[Rust API](https://paritytech.github.io/substrate/master)开始。

Tell me
- [Architecture](https://docs.substrate.io/learn/architecture/)
- [Networks and blockchains](https://docs.substrate.io/learn/networks-and-nodes/)
- [Build process](https://docs.substrate.io/build/build-process/)

Guide me

- [Build a local blockchain](https://docs.substrate.io/tutorials/build-a-blockchain/build-local-blockchain/)
- [Simulate a network](https://docs.substrate.io/tutorials/build-a-blockchain/simulate-network/)
- [Add trusted nodes](https://docs.substrate.io/tutorials/build-a-blockchain/add-trusted-nodes/)





