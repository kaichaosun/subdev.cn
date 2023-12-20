# Rust相关问题解决方案

ref: https://docs.substrate.io/install/troubleshoot-rust-issues/

如果编译 [Substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) 失败，问题很可能是由开发环境中 Rust 的配置造成的。本节将介绍如何诊断和修复配置问题。

## 检查你当前的配置

要查看当前使用的 Rust 工具链的信息，请运行以下命令：

```shell
rustup show
```

该命令的输出类似于下面的 Ubuntu 示例：

```shell
Default host：x86_64-unknown-linux-gnu
rustup home：  /home/user/.rustup

installed toolchains
--------------------

stable-x86_64-unknown-linux-gnu (默认)
nightly-2020-10-06-x86_64-unknown-linux-gnu
nightly-x86_64-unknown-linux-gnu

installed targets for active toolchain
--------------------------------------

wasm32-unknown-unknown
x86_64-unknown-linux-gnu

active toolchain
----------------

stable-x86_64-unknown-linux-gnu (默认)
rustc 1.50.0 (cb75ad5db 2021-02-10)
```

在本示例中，默认工具链来自 x8664 架构 Linux 的`稳定版`发布渠道。上面输出还显示，`nightly-x8664-unknown-linux-gnu`工具链已安装，并且安装了两个目标：

- `x86_64-unknown-linux-gnu` Linux 原生 Rust 目标。
- `wasm32-unknown-unknown` 是 WebAssembly 目标。

该环境还安装了 `nightly-2020-10-06-x86_64-unknown-linux-gnu` 工具链，但该工具链只有在命令行选项中明确指定时才会使用。有关在命令行选项中指定特定工具链的示例，请参阅[Specify a nightly version](https://docs.substrate.io/install/troubleshoot-rust-issues/#specifying-nightly-version)。

## 为 WebAssembly 使用 nightly 发布通道

Substrate 使用 WebAssembly (Wasm) 生成可移植的区块链Runtime。你必须将 Rust 编译器配置为使用nightly构建版本，以便将 Substrate Runtime代码编译为 Wasm 目标代码。

## 升级工具链

一般来说，你应该始终使用最新版本的 Rust stable版和nightly版，因为 Substrate 的变化往往取决于 Rust nightly编译器构建的上游变化。为确保 Rust 编译器始终是最新版本，应运行以下命令：

```shell
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

运行 rustup update 可以更新nightly工具链和stable工具链，使其使用最新版本。如果在更新nightly工具链后无法编译 WebAssembly 目标，可以回滚到较早版本的工具链，并将该版本作为命令行选项指定。有关获取早期版本的nightly工具链并将该版本指定为命令行选项的更多信息，请参见[降级工具链](https://docs.substrate.io/install/troubleshoot-rust-issues/#downgrading-rust-nightly)。

## 使用指定的nightly工具链

如果你想保证在更新 Rust 和其他依赖时，你的构建能在你的计算机上正常工作，应该使用特定的 Rust nightly工具链，并知道它与你正在使用的 Substrate 版本是兼容的。不同的项目用的nightly特定版本可能有不同。例如，Polkadot 在其[版本发布公告](https://github.com/paritytech/polkadot/releases)中披露了这一信息。

确定要使用的特定nightly工具链版本后，可以通过运行类似下面的命令将其安装到开发环境中：

```shell
rustup install nightly-<yyyy-MM-dd>
```

例如
```shell
rustup install nightly-2022-02-16
```

安装特定版本的 nightly 工具链后，运行类似下面的命令配置 WebAssembly 目标来使用它：

```shell
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

例如

```shell
rustup target add wasm32-unknown-unknown --toolchain nightly-2022-02-16
```

### 在环境变量中指定工具链版本

例如，你可以设置 WASM_BUILD_TOOLCHAIN 环境变量来指定编译 WebAssembly 时使用的nightly工具链版本：

```shell
WASM_BUILD_TOOLCHAIN=nightly-<yyyy-MM-dd> cargo build --release
```

该命令使用指定的 nightly 工具链构建Runtime。项目的其他部分将使用默认工具链编译，即使用已安装的stable工具链的最新版本。

### 降级nightly工具链

如果你的计算机配置为使用最新的 Rust nightly工具链，而你想降级到特定的nightly版本，则必须先卸载最新的nightly工具链。例如，你可以卸载最新的nightly工具链，然后通过运行类似下面的命令来使用特定版本的nightly工具链：
```
rustup uninstall nightly
rustup install nightly-<yyyy-MM-dd>
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

## 确保PATH被正确设置

如果安装 Rust 后，命令行似乎不起作用，出现`command not found: rustup` 等错误，请确保正确配置了 PATH。

目前，rustup 安装程序默认安装在 bash 配置文件中（在 mac 上）。如果使用的是其他 shell，请确保在配置文件（如 .zshrc）中添加此行：
```
source "$HOME/.cargo/env"
```


## M1 macOS用户请安装cmake或protobuf

目前，使用装有 M1 芯片的 macOS 电脑上预装的软件包编译 Substrate 节点时存在问题。

```shell
error: failed to run custom build command for prost-build v0.10.4
```
如果看到此错误，有两种解决方案。

- 运行以下命令安装 `cmake`：

```shell
brew install cmake
```

- 运行以下命令安装正确的预编译工具 `protoc`：

```shell
git clone https://github.com/protocolbuffers/protobuf.git
cd protobuf

brew install autoconf
brew install automake
brew install Libtool

autoreconf -i
./autogen.sh
./configure
make
make check
sudo make install

export PATH=/opt/usr/local/bin:$PATH

```

