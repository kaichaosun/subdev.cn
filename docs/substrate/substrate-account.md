---
title: 账户、地址和密钥
sidebar_label: 账户、地址和密钥
---

ref: https://docs.substrate.io/fundamentals/accounts-addresses-keys/

一个账户代表一个身份，通常是一个人或组织，可以进行交易或持有资金。虽然账户通常用于代表一个人，但也并不一定是这样。账户可用于代表用户或另一个实体执行操作，或自主执行操作。此外，任何单个人或实体都可以拥有多个账户，用于不同的目的。例如，Polkadot是一种基于Substrate的区块链，具有专门用于持有资金的账户，这些账户与用于进行交易的账户是分开的。如何实现和使用账户完全取决于作为区块链或平行链开发人员的你。


## 公钥和私钥

通常，每个账户都有一个拥有者，拥有一个公私钥对。私钥是一系列随机生成的数字，具有密码学安全性。为了方便人类阅读，可以从私钥生成一个称为秘密种子短语(secret seed phrase)或助记符(mnemonic)的随机单词序列。秘密种子短语很重要，因为如果私钥丢失，它可以用于恢复对账户的访问。

对于大多数网络，与账户关联的公钥是该账户在网络上的标识方式，它的某种形式被用作交易的目标地址。但是，基于Substrate的链使用底层公钥来派生一个或多个公共地址(public addresses)。Substrate允许您为一个账户生成多个地址和地址格式，而不是直接使用公钥。

## 地址编码和链特定地址

通过从单个公钥派生多个地址，您可以与多个链进行交互，而无需为每个网络创建单独的公私钥对。默认情况下，与帐户的公钥关联的地址使用Substrate [SS58地址格式](https://docs.substrate.io/reference/glossary/#ss58-address-format)。 SS58地址格式是[base-58编码](https://datatracker.ietf.org/doc/html/draft-msporny-base58-01)的增强版本。 SS58地址格式包含以下重要特征：

- 编码地址由58个字母数字字符组成，比十六进制编码的地址更短且更易识别。
- 地址不使用在字符串中难以区分的字符。例如，SS58地址不使用字符0、O、I和l。
- 地址可以包括特定于网络的前缀，因此您可以使用相同的公钥派生不同链的地址。
- 地址可以使用派生路径从同一公钥创建多个地址，因此您可以为不同目的使用不同的地址。例如，您可以创建用于分离资金或执行特定类型交易的子帐户。
- 地址可以通过checksum进行校验，以防止输入错误。

### 检查网络特定地址

因为单个公钥可以用于派生不同Substrate链的地址，所以单个帐户可以具有多个链特定地址。例如，如果你检查alice帐户的公钥0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d的地址，则取决于链特定的地址类型。

Chain address type	| Address
Polkadot (SS58)	| 15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5
Kusama (SS58)	| HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F
Generic Substrate chain (SS58)	| 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

### 注册特定于网络的地址

每个基于Substrate的区块链都可以注册自定义前缀以创建特定于网络的地址类型。例如，所有Polkadot地址都以1开头。所有Kusama地址都以大写字母开头。所有未注册的Substrate链都以5开头。

您可以使用subkey inspect命令和--network命令行选项或使用[Subscan](https://polkadot.subscan.io/tools/format_transform)查找公钥的特定于网络的地址。

请参见[subkey](https://docs.substrate.io/reference/command-line-tools/subkey/)查看有关生成公私钥对并检查地址的信息。有关注册特定于链的地址的信息，请参阅[SS58仓库](https://github.com/paritytech/ss58-registry)中的说明。

## FRAME中的账户信息

从概念上讲，帐户表示具有一个或多个公开地址的公私钥对的身份。但是，在使用FRAME构建的runtime中，帐户被定义为长度为32字节的地址标识符和相应的帐户信息（例如这个帐户已操作的交易数量、依赖于帐户的模块数量和帐户余额）的存储映射。

帐户属性（例如AccountId）可以在frame_system模块中通用地定义。然后，通用类型在runtime实现中解析为特定类型，并最终分配特定的值。例如，FRAME中的Account类型依赖于关联的AccountId类型。而AccountId类型是一个泛型，直到为需要此信息的 pallet在runtime实现中给它分配类型为止。

有关在frame_system pallet 中定义帐户以及Account存储映射中的帐户属性的更多信息，请参见 [Account数据结构](https://docs.substrate.io/reference/account-data-structures/)。有关使用泛型的更多信息，请参见 [Rust for Substrate](https://docs.substrate.io/learn/rust-basics/#generic-types)。

## 特定账户

作为一个灵活的模块化区块链开发框架，Substrate本身不需要你定义或使用任何特定类型的帐户。但是，不同的链可以实现不同的规则，以确定用于控制他们（这些规则）的帐户和密钥如何被使用。例如，如果您的应用程序需要：

- 自定义加密方案
- 复杂或多用户签名规则
- 对特定功能的限制访问
- 对特定 pallet 的访问限制

在大多数情况下，专门的帐户要么在特定的FRAME pallet的上下文中实现，要么在预构建的 pallet（例如[Staking](https://paritytech.github.io/substrate/master/pallet_staking/index.html)或[Multisig](https://paritytech.github.io/substrate/master/pallet_multisig/index.html)）中实现，要么在你设计的自定义 pallet中实现。

例如，Staking pallet接受想要提供保证金的原生的FRAME系统帐户，并生成stash和controller帐户抽象以标识执行特定操作所需的帐户。您可以在Polkadot生态中看到这些帐户抽象的实现。但是，您可以使用相同的框架来实现不同的帐户规则或帐户类型，或者将其作为灵感设计具有自己的帐户抽象的自定义 pallet。


### 多签账户

通常，帐户只有一个所有者，该所有者持有用于签署交易的私钥。 Multisig pallet使你能够为执行需要被多个帐户所有者批准的交易配置专门的帐户。多签帐户是一个具有公钥但没有私钥的地址。多重签名帐户的公开地址是从确定性的授权帐户签署人列表、相关交易请求块高度和extrinsic索引标识符派生的。

Multisig pallet使多方共享执行某些交易的责任。任何帐户的持有者都可以指定允许批准多签交易的帐户，以及调用被分派到runtime所需的最小批准数量。

### 代理和无密钥账户

Proxy pallet提供了另一种使用FRAME为基于Substrate的链配置专用帐户的方法。有了代理帐户这个功能，主帐户所有者可以指定一个或多个其他帐户代表他们行事。代理帐户可用于通过将主帐户资金与分配给特定角色的帐户隔离来添加一层安全性，这些角色可以代表主帐户完成任务。

通过配置一个或多个代理帐户，帐户所有者可以执行以下操作：

- 指定最多允许提交代表主帐户所有者提交交易的代理帐户数量。
- 为每个代理配置交易执行的时间延迟。
- 设置每个代理可以发出的交易类型的限制。
- 在执行交易之前在网络中传递(announce)由代理执行的交易。
- 取消或拒绝由代理执行传递过来的交易。
- 创建匿名(纯代理)帐户，这些帐户没有私钥，可以通过其配置的代理进行操作，而无需拥有帐户所有权。

#### Runtime实现

虽然Proxy pallet提供了配置代理帐户的框架，但runtime开发人员需要自己实现细节。例如，默认的Proxy pallet基于代理类型过滤一个代理帐户可以分派的调用。但是，runtime实现定义了代理类型和每个代理类型允许执行的交易。Polkadot使您能够使用以下代理类型限制代理帐户的交易：

- Any
- NonTransfer
- Governance
- Staking
- IdentityJudgement
- CancelProxy
- Auction

这些代理类型列表以及匹配代理类型与交易的逻辑在[Polkadot runtime](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs)中定义。


#### 匿名代理账户

匿名或纯代理帐户是一种具有随机生成的地址和无对应私钥的特殊代理帐户。通常，如果你想将权限委派给可以在没有你干预和无需访问你的密钥的情况下调用函数的帐户，则可创建此类型的代理帐户。当具有委派权限的新帐户被创建后，可以将该帐户用作接收者以burn fund或持有用于转账的token。


## 下一步

在Substrate中，帐户需要公钥和私钥才能接收资金，签署交易和执行交易。在高层次上，有三种类型的帐户：

- 用户帐户，使终端用户能够与区块链交互。
- 网络帐户，通过限制某些质押和治理操作为验证器和提名人提供额外的安全性。
- pallet 帐户，由有效的origin执行，以执行 pallet特定的操作。

有关使用帐户、地址和密钥的更多信息，请参见以下资源：

- [SS58 接口实现](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Ss58Codec.html)
- [SS58 注册仓库](https://github.com/paritytech/ss58-registry/)
- [命令参考：subkey](https://docs.substrate.io/reference/command-line-tools/subkey/)
- [Account数据结构](https://docs.substrate.io/reference/account-data-structures/)
- [密码学](https://docs.substrate.io/learn/cryptography/)
