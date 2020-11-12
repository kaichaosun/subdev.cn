---
id: node_template_help
title: node template 命令行
sidebar_label: node template 命令行
---

```shell
node-template 2.0.0-c8b8f61-x86_64-linux-gnu

Substrate DevHub <https://github.com/substrate-developer-hub>
A fresh FRAME-based Substrate node, ready for hacking.

USAGE:
    node-template [FLAGS] [OPTIONS]
    node-template <SUBCOMMAND>

FLAGS:
        --alice                    Shortcut for `--name Alice --validator` with session keys for `Alice` added to
                                   keystore
        --bob                      Shortcut for `--name Bob --validator` with session keys for `Bob` added to keystore
        --charlie                  Shortcut for `--name Charlie --validator` with session keys for `Charlie` added to
                                   keystore
        --dave                     Shortcut for `--name Dave --validator` with session keys for `Dave` added to keystore
        --dev                      Specify the development chain
        --discover-local           Enable peer discovery on local networks
        --eve                      Shortcut for `--name Eve --validator` with session keys for `Eve` added to keystore
        --ferdie                   Shortcut for `--name Ferdie --validator` with session keys for `Ferdie` added to
                                   keystore
        --force-authoring          Enable authoring even when offline
    -h, --help                     Prints help information
        --light                    Experimental: Run in light client mode
        --no-grandpa               Disable GRANDPA voter when running in validator mode, otherwise disable the GRANDPA
                                   observer
        --no-mdns                  Disable mDNS discovery
        --no-private-ipv4          Forbid connecting to private IPv4 addresses (as specified in
                                   [RFC1918](https://tools.ietf.org/html/rfc1918)), unless the address was passed with
                                   `--reserved-nodes` or `--bootnodes`
        --no-prometheus            Do not expose a Prometheus metric endpoint
        --no-telemetry             Disable connecting to the Substrate telemetry server
        --no-yamux-flow-control    Disable the yamux flow control. This option will be removed in the future once there
                                   is enough confidence that this feature is properly working
        --one                      Shortcut for `--name One --validator` with session keys for `One` added to keystore
        --password-interactive     Use interactive shell for entering the password used by the keystore
        --prometheus-external      Listen to all Prometheus data source interfaces
        --reserved-only            Whether to only allow connections to/from reserved nodes
        --rpc-external             Listen to all RPC interfaces
        --tmp                      Run a temporary node
        --two                      Shortcut for `--name Two --validator` with session keys for `Two` added to keystore
        --unsafe-pruning           Force start with unsafe pruning settings
        --unsafe-rpc-external      Listen to all RPC interfaces
        --unsafe-ws-external       Listen to all Websocket interfaces
        --validator                Enable validator mode
    -V, --version                  Prints version information
        --ws-external              Listen to all Websocket interfaces

OPTIONS:
    -d, --base-path <PATH>                                       Specify custom base path
        --bootnodes <ADDR>...                                    Specify a list of bootnodes
        --chain <CHAIN_SPEC>
            Specify the chain specification (one of dev, local, or staging)

        --database <DB>                                          Select database backend to use
        --db-cache <MiB>                                         Limit the memory the database cache can use
        --offchain-worker <ENABLED>
            Should execute offchain workers on every block [default: WhenValidating]  [possible values: Always, Never,
            WhenValidating]
        --execution <STRATEGY>
            The execution strategy that should be used by all execution contexts [possible values: Native, Wasm, Both,
            NativeElseWasm]
        --execution-block-construction <STRATEGY>
            The means of execution used when calling into the runtime while constructing blocks [possible values:
            Native, Wasm, Both, NativeElseWasm]
        --execution-import-block <STRATEGY>
            The means of execution used when calling into the runtime for general block import (including locally
            authored blocks) [possible values: Native, Wasm, Both, NativeElseWasm]
        --execution-offchain-worker <STRATEGY>
            The means of execution used when calling into the runtime while using an off-chain worker [possible values:
            Native, Wasm, Both, NativeElseWasm]
        --execution-other <STRATEGY>
            The means of execution used when calling into the runtime while not syncing, importing or constructing
            blocks [possible values: Native, Wasm, Both, NativeElseWasm]
        --execution-syncing <STRATEGY>
            The means of execution used when calling into the runtime for importing blocks as part of an initial sync
            [possible values: Native, Wasm, Both, NativeElseWasm]
        --in-peers <COUNT>
            Specify the maximum number of incoming connections we're accepting [default: 25]

        --enable-offchain-indexing <ENABLE_OFFCHAIN_INDEXING>
            Enable Offchain Indexing API, which allows block import to write to Offchain DB

        --ipc-path <PATH>                                        Specify IPC RPC server path
        --keystore-path <PATH>                                   Specify custom keystore path
        --listen-addr <LISTEN_ADDR>...                           Listen on this multiaddress
    -l, --log <LOG_PATTERN>...
            Sets a custom logging filter. Syntax is <target>=<level>, e.g. -lsync=debug

        --max-parallel-downloads <COUNT>
            Maximum number of peers from which to ask for the same blocks in parallel [default: 5]

        --max-runtime-instances <max-runtime-instances>          The size of the instances cache for each runtime
        --name <NAME>                                            The human-readable name for this node
        --node-key <KEY>                                         The secret key to use for libp2p networking
        --node-key-file <FILE>
            The file from which to read the node's secret key to use for libp2p networking

        --node-key-type <TYPE>
            The type of secret key to use for libp2p networking [default: Ed25519]  [possible values: Ed25519]

        --out-peers <COUNT>
            Specify the number of outgoing connections we're trying to maintain [default: 25]

        --password <password>                                    Password used by the keystore
        --password-filename <PATH>                               File that contains the password used by the keystore
        --pool-kbytes <COUNT>
            Maximum number of kilobytes of all transactions stored in the pool [default: 20480]

        --pool-limit <COUNT>
            Maximum number of transactions in the transaction pool [default: 8192]

        --port <PORT>                                            Specify p2p protocol TCP port
        --prometheus-port <PORT>                                 Specify Prometheus data source server TCP Port
        --pruning <PRUNING_MODE>
            Specify the state pruning mode, a number of blocks to keep or 'archive'

        --public-addr <PUBLIC_ADDR>...
            The public address that other nodes will use to connect to it. This can be used if there's a proxy in front
            of this node
        --reserved-nodes <ADDR>...                               Specify a list of reserved node addresses
        --rpc-cors <ORIGINS>
            Specify browser Origins allowed to access the HTTP & WS RPC servers

        --rpc-methods <METHOD SET>
            RPC methods to expose. [default: Auto]  [possible values: Auto, Safe, Unsafe]

        --rpc-port <PORT>                                        Specify HTTP RPC server TCP port
        --sentry <sentry>...                                     Enable sentry mode
        --sentry-nodes <ADDR>...                                 Specify a list of sentry node public addresses
        --state-cache-size <Bytes>                               Specify the state cache size [default: 67108864]
        --telemetry-url <URL VERBOSITY>...                       The URL of the telemetry server to connect to
        --tracing-receiver <RECEIVER>
            Receiver to process tracing messages [default: Log]  [possible values: Log, Telemetry]

        --tracing-targets <TARGETS>                              Comma separated list of targets for tracing
        --wasm-execution <METHOD>
            Method for executing Wasm runtime code [default: Interpreted]  [possible values: Interpreted, Compiled]

        --ws-max-connections <COUNT>                             Maximum number of WS RPC server connections
        --ws-port <PORT>                                         Specify WebSockets RPC server TCP port

SUBCOMMANDS:
    benchmark        Benchmark runtime pallets.
    build-spec       Build a chain specification
    check-block      Validate blocks
    export-blocks    Export blocks
    export-state     Export the state of a given block into a chain spec
    help             Prints this message or the help of the given subcommand(s)
    import-blocks    Import blocks
    purge-chain      Remove the whole chain
    revert           Revert the chain to a previous state
```