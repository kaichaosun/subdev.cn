# Substrate Connect 中的轻客户端

ref: https://docs.substrate.io/learn/light-clients-in-substrate-connect/

通常，为区块链提供点对点网络的节点需要大量资源，包括强大的高速处理器和高容量存储设备。相比之下，轻客户端节点可以在资源受限的环境中运行，还可以嵌入到其它应用程序中，用来同步区块链的数据。

有了轻客户端节点，你可以以安全和去中心化的方式与区块链进行交互，而无需负担运行全节点所需的高性能硬件和网络容量。

## JavaScript 生态中的轻客户端

针对基于Substrate的链，轻客户端节点被实现为一个WebAssembly客户端——称为`smoldot`，它可以在浏览器中运行，并使用JSON-RPC请求与链进行交互。为了使`smoldot` WebAssembly轻客户端更容易与JavaScript和TypeScript应用程序集成，我们在`smoldot`源代码之上构建了一个名为Substrate Connect的JavaScript包。

Substrate Connect可作为一个Node.js包使用，可以通过`npm`包管理器进行安装。Substrate Connect包使轻客户端节点能够与JavaScript生态系统中的应用程序集成。在将Substrate Connect添加到应用程序后，该应用程序可以通过JSON-RPC消息与轻客户端通信，并访问区块链数据。

## 在浏览器中直接连接区块链

通过Substrate Connect，可以配置应用程序来运行一个轻节点，该轻节点运行在本地的浏览器内。应用程序的用户可以直接在浏览器中与区块链进行交互，无需连接到任何第三方节点或其他服务器。

通过消除对中介服务器的需求，Substrate Connect为区块链构建者、应用开发者和最终用户提供了好处。一些关键的好处包括：

- 提高了安全性
- 简化了网络基础设施
- 降低了维护成本
- 为初级区块链用户降低了入门门槛
- 为Web3应用程序的推广提供了更快捷的路径

## 知名的区块链网络

你可以使用Substrate Connect连接到任何基于Substrate的区块链。然而，你必须指定你想要连接的链的正确名称。有一些众所周知的链名称被定义为[`WellKnownChain`](https://paritytech.github.io/substrate-connect/api/enums/_substrate_connect.WellKnownChain.html)枚举类型。

你可以使用这里列出的名称连接到以下公共区块链网络：

|要连接的链 | 使用的链标识符|
| -------- | -------- |
|[Polkadot](https://polkadot.network/) | `polkadot`|
|[Kusama](https://kusama.network/) | `ksmcc3`|
|[Westend](https://wiki.polkadot.network/docs/en/maintain-networks#westend-test-network) | `westend2`|
|[Rococo](https://polkadot.network/rococo-v1-a-holiday-gift-to-the-polkadot-community/) | `rococo_v2_2`|

请注意，你必须使用在对应网络的链规范（chain spec）中出现的链标识符，而不是通常使用的网络名称。例如，你必须指定`ksmcc3`作为链标识符来连接到Kusama。对于已经分叉的链，使用正确的名称尤其重要。例如，`rococo_v2`和`rococo_v2_2`是两个不同的链。

## 集成到使用Polkadot-JS API的应用中

如果你已经构建了使用现有Polkadot-JS API的应用程序，那么`@polkadot/rpc-provider`包已经包含了`substrate-connect` RPC provider。

要将`substrate-connect`添加到你的应用程序：

1. 通过运行合适的包管理器的相应命令来安装`@polkadot/rpc-provider`包。

例如，如果你使用`yarn`，运行以下命令：
```
yarn add @polkadot/rpc-provider
```
如果你使用`npm`作为你的包管理器，运行以下命令：
```
npm i @polkadot/rpc-provider
```

2. 通过运行合适的包管理器的相应命令来安装`@polkadot/api`包。

例如，如果你使用`yarn`，运行以下命令：
```
yarn add @polkadot/api
```
如果你使用`npm`作为你的包管理器，运行以下命令：
```
npm i @polkadot/api
```

### 使用RPC provider连接到知名网络

以下示例说明了如何使用`rpc-provider`连接到诸如Polkadot、Kusama、Westend或Rococo等众所周知的网络。

```javascript
import { ScProvider, WellKnownChain } from "@polkadot/rpc-provider/substrate-connect";
import { ApiPromise } from "@polkadot/api";
// Create the provider for a known chain
const provider = new ScProvider(WellKnownChain.westend2);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

### 使用RPC provider连接到自定义网络

以下示例说明了如何使用`rpc-provider`连接到自定义网络，通过指定其链规范。

```javascript
import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
import { ApiPromise } from "@polkadot/api";
import jsonCustomSpec from "./jsonCustomSpec.json";
// Create the provider for the custom chain
const customSpec = JSON.stringify(jsonCustomSpec);
const provider = new ScProvider(customSpec);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

### 使用RPC provider连接到平行链

以下示例说明了如何使用`rpc-provider`通过指定其链规范连接到平行链。


```javascript
import { ScProvider, WellKnownChain } from "@polkadot/rpc-provider/substrate-connect";
import { ApiPromise } from "@polkadot/api";
import jsonParachainSpec from "./jsonParachainSpec.json";
// Create the provider for the relay chain
const relayProvider = new ScProvider(WellKnownChain.westend2);
// Create the provider for the parachain. Notice that
// we must pass the provider of the relay chain as the
// second argument
const parachainSpec = JSON.stringify(jsonParachainSpec);
const provider = new ScProvider(parachainSpec, relayProvider);
// Stablish the connection (and catch possible errors)
await provider.connect();
// Create the PolkadotJS api instance
const api = await ApiPromise.create({ provider });
await api.rpc.chain.subscribeNewHeads(lastHeader => {
  console.log(lastHeader.hash);
});
await api.disconnect();
```

## 配合其它库使用Substrate Connect

前一节演示了如何将Substrate Connect provider集成到使用Polkadot-JS API的应用程序中。有了这个provider，你可以创建应用程序，使用户能够通过浏览器调用Polkadot-JS API方法与链进行交互。然而，你可以在不依赖Polkadot-JS API的应用程序中安装和使用@substrate-connect。例如，如果你正在构建自己的应用程序库或编程接口，你可以通过运行合适的包管理器的相应命令来安装Substrate Connect依赖项。

例如，如果你使用`yarn`，运行以下命令：
```
yarn add @substrate/connect
```
如果你使用`npm`作为你的包管理器，运行以下命令：
```
npm i @substrate/connect
```

### 连接到知名链

以下示例说明了如何使用Substrate Connect连接到诸如Polkadot、Kusama、Westend或Rococo等众所周知的网络。

```javascript
import { WellKnownChain, createScClient } from "@substrate/connect";
// Create the client
const client = createScClient();
// Create the chain connection, while passing the `jsonRpcCallback` function.
const chain = await client.addWellKnownChain(WellKnownChain.polkadot, function jsonRpcCallback(response) {
  console.log("response", response);
});
// send a RpcRequest
chain.sendJsonRpc('{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}');
```

### 连接到平行链

以下示例说明了如何使用Substrate Connect连接到平行链。

```javascript
import { WellKnownChain, createScClient } from "@substrate/connect";
import jsonParachainSpec from "./jsonParachainSpec.json";
// Create the client
const client = createScClient();
// Create the relay chain connection. There is no need to pass a callback
// function because we will sending and receiving messages through
// the parachain connection.
await client.addWellKnownChain(WellKnownChain.westend2);
// Create the parachain connection.
const parachainSpec = JSON.stringify(jsonParachainSpec);
const chain = await client.addChain(parachainSpec, function jsonRpcCallback(response) {
  console.log("response", response);
});
// send a request
chain.sendJsonRpc('{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}');
```

## API 文档

有关substrate-connect API的更多信息，请参阅[Substrate Connect](https://paritytech.github.io/substrate-connect/api/)。

## 浏览器插件

Substrate Connect浏览器插件使用了[Substrate Connect](https://github.com/paritytech/substrate-connect)和[Smoldot轻客户端](https://github.com/smol-dot/smoldot)节点模块，并在浏览器启动时更新并同步那些知名substrate链（**Polkadot、Kusama、Rococo、Westend**）的状态，将它们的最新状态保存在浏览器插件内，以便更快地同步链。

当集成[Substrate Connect](https://github.com/paritytech/substrate-connect)的dApp（例如[polkadotJS/apps](https://polkadot.js.org/apps/?rpc=light%3A%2F%2Fsubstrate-connect%2Fpolkadot#/explorer)）在浏览器的标签页中打开时，它会从插件中接收最新的spec，而不是从dApp中最后导入的状态获取；与此同时，dApp的"已连接"状态将出现在插件中，这意味着它正在使用插件的bootnode和spec；

你可以从[Substrate Connect](https://substrate.io/developers/substrate-connect/)下载Chrome和Firefox插件，或者在[Github仓库](https://github.com/paritytech/substrate-connect/tree/main/projects/extension)上找到更多信息。

## 项目案例

- [Burnr](https://paritytech.github.io/substrate-connect/burnr/)

不安全的可赎回钱包：一种基于轻客户端的、在浏览器中使用的Substrate钱包。它旨在快速易用，但安全性比其他解决方案低。[Github](https://github.com/paritytech/substrate-connect/tree/main/projects/burnr)

- [Multi-demo](https://paritytech.github.io/substrate-connect/demo/)

简单的演示，涵盖了多链和平行链的例子。[Github](https://github.com/paritytech/substrate-connect/tree/main/projects/demo)

## Brave 浏览器 WebSocket 问题

从Brave v1.36开始，插件和网页被限制为最多使用10个活跃的WebSocket连接，以防止旁路攻击。你可以在[Partition WebSockets Limits to prevent side channels](https://github.com/brave/brave-browser/issues/19990)中找到有关此更改的更多信息。

如果你正在使用Brave浏览器，并且由于已经达到了允许的最大WebSocket连接数而无法连接，你可以禁用此限制。

要禁用WebSocket限制：

1. 在Brave浏览器中打开一个新标签。
2. 复制URL [brave://flags/#restrict-websockets-pool](https://docs.substrate.io/brave://flags/#restrict-websockets-pool)。
3. 将URL粘贴到地址栏中，以选择**Restrict WebSockets pool**设置。
4. 点击设置列表并选择**Disabled**。
![](https://docs.substrate.io/static/556406afa4cfef6f80f58a3f307ed465/268b9/brave-setting.avif)
5. 重新启动浏览器。







