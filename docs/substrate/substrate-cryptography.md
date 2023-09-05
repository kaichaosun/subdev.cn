---
title: 密码学
sidebar_label: 密码学
---


ref: https://docs.substrate.io/learn/cryptography/


密码学提供了共识系统、数据完整性和用户安全背后的数学可验证性。虽然理解密码学的基础性应用（因为区块链会用到它们）对于普通开发人员来说非常必要，但其底层的数学处理本身并不直接相关。本页面为Parity和更广泛的生态系统中的各种密码学实现提供了上下文基础。

## Hash函数

Hashing是一种数学过程，用来创建从任何数据片段到32字节引用之间的一对一映射，每个对应的引用都使用了从0到2^255之间的某个随机且唯一的数字表示。使用哈希函数，任何数据，包括简单文本、图像或任何其他形式的文件都会被赋予一个独特的标识符。哈希用于验证数据完整性、创建数字签名以及提供安全的密码存储方式。这种映射形式被称为“鸽巢原理”，主要是为了高效的和可验证地从大型数据集中识别数据。

这些函数是确定性的，这意味着相同的输入将始终产生相同的输出。这对于确保两台不同的计算机可以就相同的数据达成一致是非常重要的。它们可以被设计成快速或慢速的，这取决于具体目的。当速度很重要时，使用快速哈希函数，而当安全性是优先考虑因素时，则使用相对较慢的哈希函数。慢速哈希函数也用于降低暴力攻击的成功的可能性，因为它大大增加了检索数据的工作量。

### 抗碰撞性

在区块链中，哈希函数也用于提供抗碰撞性。攻击者通过计算或控制两个数字的输入来试图找到两个相同的值以访问被加密的对象。对于部分碰撞，会有一个类似的方法被使用，但是只是去尝试找到两个值，其前面的一些位数相同（整个值并不相同）。

虽然只实现部分碰撞抗性可以减轻计算负担，并也能对碰撞概率提供相当强的保护了，但在面对像国家这样的资源充足的对手时，它是一种不太安全的选择，因为使用大量计算能力是可以轻松地暴力破解前几位的。也就是说，在面对平均攻击向量（即流氓行为）时，它是可以接受的。

### Blake2

在工程化一个新区块链协议或生态系统时，考虑所使用的密码学方法的计算成本是很重要的。在优先考虑效率和处理器负载的情况下，Substrate使用Blake2。

Blake2是一种相对较新的哈希方法，提供了与SHA2相同或更高的安全性，同时比其他可比较的算法快得多。虽然对它相对于其他哈希方法的确切的速度改进的准确测评相当依赖于硬件规格，但对于Substrate来说，它带来的最大的积极影响是它大大减少了新节点需要同步链时所需的时间和资源，而且在一定程度上降低了验证所需的时间。

有关Blake2的全面信息，请参阅其[官方文档](https://www.blake2.net/blake2.pdf)。

## 加密类型

有两种不同的加密算法实现方式：对称加密和非对称加密。

### 对称加密

对称加密是密码学的一个分支，不像非对称加密那样基于单向函数。它使用相同的加密密钥来加密明文和解密生成的密文。对称加密是历史上一直使用的加密类型，例如恩格玛密码和凯撒密码。它仍然广泛用于今天的web2和web3应用程序中。它只有一个单一的密钥，并且需要接收者也能够得到它，才能访问所包含的信息。

### 非对称加密

非对称加密是一种使用两个不同密钥的密码学，被称为密钥对：公钥用于加密明文，其对应的私钥用于解密密码文本。

使用公钥加密产生固定长度的消息，并且只能使用接收者的私钥（有时还需要一组密码）才能解密该消息。公钥可用于在密码学上验证一个数据片段是由对应的私钥创建的，而不会暴露私钥本身，例如数字签名。这对于身份、所有权和产权具有明显的影响，并在web2和web3中的许多不同协议中使用。

### 折中和妥协

对称加密比非对称加密更快，只需要更少的密钥位数就能达到非对称加密提供的相同安全级别。但是，它需要在通信建立之前共享一个秘钥，这会暴露其完整性问题和潜在的妥协点。另一方面，非对称加密不需要事先共享秘钥，从而实现了好得多的终端用户安全性。

混合对称和非对称加密通常用于克服非对称加密的工程问题，因为它速度较慢，需要更多的密钥位数才能达到相同的安全级别。它用于加密密钥，然后使用相对较轻量的对称密码来处理加密消息的重活。

## 数字签名

数字签名是使用非对称密钥验证文档或消息的真实性的一种方式。它们用于确保发送方或签名者的文档或消息在传输过程中没有被篡改，并且用于接收方验证所收到的数据是否准确，且来自预期的发送方。

签署数字签名只需要理解一点数学和密码学。想象一个例子——在签署支票时，人们期望支票不能被多次兑现。这不是签名系统的特性，而是支票序列化系统的特性。银行将检查支票上的序列号是否已经被使用。数字签名基本上结合了这两个概念，允许签名本身通过一个唯一的加密指纹提供序列化，并且这个指纹无法复制。

与笔和纸签名不同，一个数字签名的信息不能用于创建其他签名。数字签名通常用于行政流程，因为它们比简单地扫描签名并将其粘贴到文档上更安全。

Substrate提供了多种不同的加密方案，并且是通用的，可以支持实现[Pair trait](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Pair.html)的任何密码学算法。

## 椭圆曲线

区块链技术需要具有使用多个密钥创建签名的能力，这个签名用来提议块和验证块。为此，椭圆曲线数字签名算法（ECDSA）和Schnorr签名是最常用的两种方法之一。虽然ECDSA是一种更简单的实现，但在涉及多个签名时，Schnorr签名更有效。

Schnorr签名相对于[ECDSA](https://docs.substrate.io/learn/cryptography/#ecdsa)/EdDSA方案带来了一些显著的特点：

- 它更适合 hierarchical deterministic key derivations。
- 它通过[签名聚合](https://bitcoincore.org/en/2017/03/23/schnorr-signature-aggregation/)实现原生的多方签名（multi-signature）。
- 它通常更不容易误用。

使用Schnorr签名而不是ECDSA所做的一个牺牲是，虽然两者都需要64个字节，但ECDSA签名会传递其公钥。

### 各种实现

#### ECDSA

Substrate使用[secp256k1](https://en.bitcoin.it/wiki/Secp256k1)曲线提供[ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)签名方案。这是用于保护[比特币](https://en.wikipedia.org/wiki/Bitcoin)和[以太坊](https://en.wikipedia.org/wiki/Ethereum)的相同加密算法。

#### Ed25519

[Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519)是使用[Curve25519](https://en.wikipedia.org/wiki/Curve25519)的EdDSA签名方案。它在设计和实现的多个层面上进行了精心的工程化，在不影响安全性的情况下达到非常高的速度。

#### SR25519

[SR25519](https://research.web3.foundation/en/latest/polkadot/keys/1-accounts-more.html)基于与[Ed25519](https://docs.substrate.io/learn/cryptography/#ed25519)相同的基础曲线。但是，它使用Schnorr签名而不是EdDSA方案。

## 下一步

- [Cryptography on Polkadot](https://wiki.polkadot.network/docs/en/learn-cryptography).
- [Research at W3F: Cryptography](https://research.web3.foundation/en/latest/crypto.html).
- [Hash](https://paritytech.github.io/substrate/master/sp_runtime/traits/trait.Hash.html) trait for implementing new hashing algorithms.
- [Pair](https://paritytech.github.io/substrate/master/sp_core/crypto/trait.Pair.html) trait for implementing new cryptographic schemes.


