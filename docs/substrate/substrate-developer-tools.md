# 开发者工具

ref: https://docs.substrate.io/install/developer-tools/

在你要用Rust编写代码之前，请确保你的开发环境具有适当的扩展和插件来与Rust协同工作。当你开始使用Substrate node template时，你会看到它包含了一套专门为Runtime开发设计的核心功能和工具。然而，还有许多其他的专门工具可供你安装，以补充和扩展你的开发环境，或处理特定的任务。

当你开始开发基于Substrate的区块链时，你可能会发现以下几个工具很有用：

- [Polkadot-JS API](https://polkadot.js.org/docs/api)

Polkadot-JS API提供了一个方法库，使你能够使用JavaScript查询和交互任何基于Substrate的链。你可以将`@polkadot/api`包添加到任何JavaScript或TypeScript工作环境。

Polkadot-JS API公开的大多数接口都是通过连接到运行中的节点动态生成的。因为哪些接口被公开是由节点的配置决定的，所以你可以使用不同的API来配合不同功能的定制链工作。要使用API，你必须确定链要连接的URL。在连接到链的节点后，Polkadot-JS API收集关于链状态和其功能的信息，然后根据收集到的关于该特定链的信息用方法填充具体的API内容。

- [前端模板](https://github.com/substrate-developer-hub/substrate-front-end-template) Substrate前端模板提供了一个预置的前端应用，你可以用它来连接到Substrate节点后端，并使用最小化配置。这个模板使你能够开始尝试Substrate节点的基本功能，而无需构建自己的自定义用户界面。这个模板使用Create React App启动项目和Polkadot-JS API构建。

- [提交交易的命令行接口](https://github.com/paritytech/subxt)

`subxt-cli`是一个命令行程序，你可以使用它通过连接到运行中的节点下载Substrate-based链的完整配置信息——[元数据 metadata](https://docs.substrate.io/reference/glossary/#metadata)。类似于Polkadot-JS API，你可以用subxt-cli程序下载元数据，这些元数据暴露了这条Substrate链的信息，使你能够与该链进行交互。你还可以使用subxt-cli程序以人类可读的格式暴露链的信息。

- [sidecar](https://github.com/paritytech/substrate-api-sidecar)

`@substrate/api-sidecar`包是一个RESTful服务，你可以使用它来连接到
用 [FRAME](https://docs.substrate.io/reference/glossary/#frame) 框架构建的Substrate节点，并与之交互。有关该服务支持的接口信息，请参阅[Substrate API Sidecar](https://paritytech.github.io/substrate-api-sidecar/dist/)。

你可能还想探索[Awesome Substrate](https://github.com/substrate-developer-hub/awesome-substrate)中列出的资源和社区项目。

[命令行工具](https://docs.substrate.io/reference/command-line-tools/) 这一篇对一些最常用的工具做了概述。


## 下一步

- [Command-line tools](https://docs.substrate.io/reference/command-line-tools/)
- [node-template](https://docs.substrate.io/reference/command-line-tools/node-template/)
- [subkey](https://docs.substrate.io/reference/command-line-tools/subkey/)
- [try-runtime](https://docs.substrate.io/reference/command-line-tools/try-runtime/)


