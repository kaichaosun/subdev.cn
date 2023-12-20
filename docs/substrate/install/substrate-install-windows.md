# Windows开发环境

原文：https://docs.substrate.io/install/windows/

一般来说，基于UNIX的操作系统——如macOS或Linux——为构建基于Substrate的区块链提供了更好的开发环境。Substrate [教程](https://docs.substrate.io/tutorials/)和[操作指南](https://docs.substrate.io/reference/how-to-guides/)中的所有代码示例和命令行指令都演示了如何使用与UNIX兼容的命令在终端与Substrate交互。

然而，如果你的本地计算机使用的是Microsoft Windows而不是基于UNIX的操作系统，你可以通过额外的软件配置它，使其成为构建基于Substrate的区块链的合适开发环境。为了在运行Microsoft Windows的计算机上准备开发环境，你可以使用Windows子系统Linux（WSL）来模拟UNIX操作环境。

## 开始之前

在Microsoft Windows上安装之前，请验证以下基本要求：

- 你有一台运行支持WSL2的Microsoft Windows操作系统的计算机。 
- 你必须运行Microsoft Windows 10，版本2004或更高版本，或Microsoft Windows 11，才能在具有Windows桌面操作系统的计算机上安装Windows子系统Linux。 
- 你必须运行Microsoft Windows Server 2019或更高版本，才能在具有Windows服务器操作系统的计算机上安装Windows子系统Linux。 
- 你的本地计算机有良好的互联网连接，并可以访问shell终端。

## 配置Windows的Linux子系统

Windows子系统Linux（WSL）使你能够在使用Windows操作系统的计算机上模拟Linux环境。采用这种方法进行Substrate开发的主要优势是，你可以使用Substrate文档中描述的所有代码和命令行示例。例如，你可以不加修改地运行常见命令——如`ls`和`ps`。通过使用Windows子系统Linux，你可以避免配置虚拟机映像或双启动操作系统。

使用Windows子系统Linux准备开发环境：

1. 检查你的Windows版本和构建编号，看看Windows子系统Linux是否默认启用。

如果你有Microsoft Windows 10，版本2004（构建19041及更高版本），或Microsoft Windows 11，Windows子系统Linux默认可用，你可以继续下一步。

如果你安装了较旧版本的Microsoft Windows，请参阅[旧版本的WSL手动安装步骤](https://docs.microsoft.com/en-us/windows/wsl/install-manual)。如果你的计算机有Windows 10，版本1903或更高版本，你可以下载并安装WLS 2。

2. 从开始菜单中选择Windows PowerShell或命令提示符，右键单击，然后**以管理员身份运行**。

3. 在PowerShell或命令提示符终端中，运行以下命令：

```
wsl --install
```

此命令启用Windows操作系统的必要WSL2组件，下载最新的Linux内核，并默认安装Ubuntu Linux发行版。

如果你想查看其他可用的Linux发行版，请运行以下命令：

```
wsl --list --online
```

4. 下载发行版后，关闭终端。

5. 点击开始菜单，选择**关机或注销**，然后点击**重启**以重启计算机。

重启计算机是安装Linux发行版所必需的。重启后，安装可能需要几分钟时间才能完成。

有关[设置WSL作为开发环境](https://docs.microsoft.com/en-us/windows/wsl/setup/environment)的更多信息，请参阅设置WSL开发环境。

## 安装依赖包和Rust

在WSL上安装Rust工具链：

1. 点击开始菜单，然后选择**Ubuntu**。
2. 输入UNIX用户名以创建用户账户。
3. 为你的UNIX用户输入一个密码，然后重新输入密码以确认。
4. 使用Ubuntu高级包装工具（`apt`）下载Ubuntu发行版的最新更新，运行以下命令：

```
sudo apt update
```

5. 运行以下命令为Ubuntu发行版添加所需的包：

```
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

6. 下载`rustup`安装程序，并运行以下命令为Ubuntu发行版安装Rust：

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

7. 按照显示的提示进行默认安装。

8. 运行以下命令更新你当前的shell以找到Cargo：

```
source ~/.cargo/env
```

9. 运行以下命令验证你的安装：

```
rustc --version
```

10. 运行以下命令配置Rust工具链，使用最新的稳定版本作为默认工具链：

```
rustup default stable
rustup update
```

11. 运行以下命令，将工具链的`nightly`版本和`nightly` WebAssembly（`wasm`）目标添加到你的开发环境：

```
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

12. 运行以下命令验证你的开发环境配置：

```
rustup show
rustup +nightly show
```

命令显示类似下面的输出：

```
# rustup show

active toolchain
----------------

stable-x86_64-unknown-linux-gnu (default)
rustc 1.61.0 (fe5b13d68 2022-05-18)

# rustup +nightly show

active toolchain
----------------

nightly-x86_64-unknown-linux-gnu (overridden by +toolchain on the command line)
rustc 1.63.0-nightly (e71440575 2022-06-02)
```

## 编译Substrate节点

现在你已经安装了Rust并为Substrate开发配置了Rust工具链，你可以通过克隆Substrate **node template**和编译Substrate节点来完成开发环境的设置。

node template提供了一个工作环境，其中包括构建区块链所需的所有最常见功能，而无需任何额外的模块或工具。为了确保node template为你提供一个相对稳定的试验环境，建议的最佳实践是从Substrate Developer Hub仓库克隆Substrate node template，而不是从核心Substrate仓库克隆。

编译Substrate node template：

1. 运行以下命令克隆节点模板仓库：

```
git clone https://github.com/substrate-developer-hub/substrate-node-template
```

在大多数情况下，你可以克隆main分支以获取最新代码。但是，如果你想使用与特定Polkadot版本兼容的Substrate分支，你可以使用--branch命令行选项。点击[Tags](https://github.com/substrate-developer-hub/substrate-node-template/tags)查看与特定Polkadot版本兼容的分支列表。

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

由于所需的包数量比较多，编译节点可能需要几分钟时间。

构建成功完成后，你的本地计算机已准备好进行Substrate开发。



## Where to go next
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

