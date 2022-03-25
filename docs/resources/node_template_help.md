---
id: node_template_help
title: Node template 命令行
sidebar_label: Node template 命令行
---

```shell
node-template 4.0.0-dev-5f8949a-aarch64-macos
Substrate DevHub <https://github.com/substrate-developer-hub>
A fresh FRAME-based Substrate node, ready for hacking.

USAGE:
    node-template [OPTIONS]
    node-template <SUBCOMMAND>

OPTIONS:
        --alice
            Shortcut for `--name Alice --validator` with session keys for `Alice` added to keystore

        --allow-private-ipv4
            Always accept connecting to private IPv4 addresses (as specified in
            [RFC1918](https://tools.ietf.org/html/rfc1918)). Enabled by default for chains marked as
            "local" in their chain specifications, or when `--dev` is passed

        --bob
            Shortcut for `--name Bob --validator` with session keys for `Bob` added to keystore

        --bootnodes <ADDR>...
            Specify a list of bootnodes

        --chain <CHAIN_SPEC>
            Specify the chain specification

        --charlie
            Shortcut for `--name Charlie --validator` with session keys for `Charlie` added to
            keystore

    -d, --base-path <PATH>
            Specify custom base path

        --database <DB>
            Select database backend to use [possible values: rocksdb, paritydb, paritydb-
            experimental, auto]

        --dave
            Shortcut for `--name Dave --validator` with session keys for `Dave` added to keystore

        --db-cache <MiB>
            Limit the memory the database cache can use

        --detailed-log-output
            Enable detailed log output

        --dev
            Specify the development chain

        --disable-log-color
            Disable log color output

        --discover-local
            Enable peer discovery on local networks

        --enable-log-reloading
            Enable feature to dynamically update and reload the log filter

        --enable-offchain-indexing <ENABLE_OFFCHAIN_INDEXING>
            Enable Offchain Indexing API, which allows block import to write to Offchain DB

        --eve
            Shortcut for `--name Eve --validator` with session keys for `Eve` added to keystore

        --execution <STRATEGY>
            The execution strategy that should be used by all execution contexts [possible values:
            Native, Wasm, Both, NativeElseWasm]

        --execution-block-construction <STRATEGY>
            The means of execution used when calling into the runtime while constructing blocks
            [possible values: Native, Wasm, Both, NativeElseWasm]

        --execution-import-block <STRATEGY>
            The means of execution used when calling into the runtime for general block import
            (including locally authored blocks) [possible values: Native, Wasm, Both,
            NativeElseWasm]

        --execution-offchain-worker <STRATEGY>
            The means of execution used when calling into the runtime while using an off-chain
            worker [possible values: Native, Wasm, Both, NativeElseWasm]

        --execution-other <STRATEGY>
            The means of execution used when calling into the runtime while not syncing, importing
            or constructing blocks [possible values: Native, Wasm, Both, NativeElseWasm]

        --execution-syncing <STRATEGY>
            The means of execution used when calling into the runtime for importing blocks as part
            of an initial sync [possible values: Native, Wasm, Both, NativeElseWasm]

        --ferdie
            Shortcut for `--name Ferdie --validator` with session keys for `Ferdie` added to
            keystore

        --force-authoring
            Enable authoring even when offline

    -h, --help
            Print help information

        --in-peers <COUNT>
            Maximum number of inbound full nodes peers [default: 25]

        --in-peers-light <COUNT>
            Maximum number of inbound light nodes peers [default: 100]

        --ipc-path <PATH>
            Specify IPC RPC server path

        --ipfs-server
            Join the IPFS network and serve transactions over bitswap protocol

        --kademlia-disjoint-query-paths
            Require iterative Kademlia DHT queries to use disjoint paths for increased resiliency in
            the presence of potentially adversarial nodes

        --keep-blocks <COUNT>
            Specify the number of finalized blocks to keep in the database

        --keystore-path <PATH>
            Specify custom keystore path

        --keystore-uri <KEYSTORE_URI>
            Specify custom URIs to connect to for keystore-services

    -l, --log <LOG_PATTERN>...
            Sets a custom logging filter. Syntax is <target>=<level>, e.g. -lsync=debug

        --light
            Experimental: Run in light client mode

        --listen-addr <LISTEN_ADDR>...
            Listen on this multiaddress

        --max-parallel-downloads <COUNT>
            Maximum number of peers from which to ask for the same blocks in parallel [default: 5]

        --max-runtime-instances <MAX_RUNTIME_INSTANCES>
            The size of the instances cache for each runtime

        --name <NAME>
            The human-readable name for this node

        --no-grandpa
            Disable GRANDPA voter when running in validator mode, otherwise disable the GRANDPA
            observer

        --no-mdns
            Disable mDNS discovery

        --no-private-ipv4
            Always forbid connecting to private IPv4 addresses (as specified in
            [RFC1918](https://tools.ietf.org/html/rfc1918)), unless the address was passed with
            `--reserved-nodes` or `--bootnodes`. Enabled by default for chains marked as "live" in
            their chain specifications

        --no-prometheus
            Do not expose a Prometheus exporter endpoint

        --no-telemetry
            Disable connecting to the Substrate telemetry server

        --node-key <KEY>
            The secret key to use for libp2p networking

        --node-key-file <FILE>
            The file from which to read the node's secret key to use for libp2p networking

        --node-key-type <TYPE>
            The type of secret key to use for libp2p networking [default: Ed25519] [possible values:
            Ed25519]

        --offchain-worker <ENABLED>
            Should execute offchain workers on every block [default: WhenValidating] [possible
            values: Always, Never, WhenValidating]

        --one
            Shortcut for `--name One --validator` with session keys for `One` added to keystore

        --out-peers <COUNT>
            Specify the number of outgoing connections we're trying to maintain [default: 25]

        --password <PASSWORD>
            Password used by the keystore. This allows appending an extra user-defined secret to the
            seed

        --password-filename <PATH>
            File that contains the password used by the keystore

        --password-interactive
            Use interactive shell for entering the password used by the keystore

        --pool-kbytes <COUNT>
            Maximum number of kilobytes of all transactions stored in the pool [default: 20480]

        --pool-limit <COUNT>
            Maximum number of transactions in the transaction pool [default: 8192]

        --port <PORT>
            Specify p2p protocol TCP port

        --prometheus-external
            Expose Prometheus exporter on all interfaces

        --prometheus-port <PORT>
            Specify Prometheus exporter TCP Port

        --pruning <PRUNING_MODE>
            Specify the state pruning mode, a number of blocks to keep or 'archive'

        --public-addr <PUBLIC_ADDR>...
            The public address that other nodes will use to connect to it. This can be used if
            there's a proxy in front of this node

        --reserved-nodes <ADDR>...
            Specify a list of reserved node addresses

        --reserved-only
            Whether to only synchronize the chain with reserved nodes

        --rpc-cors <ORIGINS>
            Specify browser Origins allowed to access the HTTP & WS RPC servers

        --rpc-external
            Listen to all RPC interfaces

        --rpc-max-payload <RPC_MAX_PAYLOAD>
            Set the the maximum RPC payload size for both requests and responses (both http and ws),
            in megabytes. Default is 15MiB

        --rpc-methods <METHOD SET>
            RPC methods to expose. [default: Auto] [possible values: Auto, Safe, Unsafe]

        --rpc-port <PORT>
            Specify HTTP RPC server TCP port

        --runtime-cache-size <RUNTIME_CACHE_SIZE>
            Maximum number of different runtimes that can be cached [default: 2]

        --state-cache-size <Bytes>
            Specify the state cache size [default: 67108864]

        --sync <SYNC_MODE>
            Blockchain syncing mode [default: Full] [possible values: Full, Fast, FastUnsafe, Warp]

        --telemetry-url <URL VERBOSITY>
            The URL of the telemetry server to connect to

        --tmp
            Run a temporary node

        --tracing-receiver <RECEIVER>
            Receiver to process tracing messages [default: Log] [possible values: Log]

        --tracing-targets <TARGETS>
            Sets a custom profiling filter. Syntax is the same as for logging: <target>=<level>

        --two
            Shortcut for `--name Two --validator` with session keys for `Two` added to keystore

        --unsafe-pruning
            Force start with unsafe pruning settings

        --unsafe-rpc-external
            Listen to all RPC interfaces

        --unsafe-ws-external
            Listen to all Websocket interfaces

    -V, --version
            Print version information

        --validator
            Enable validator mode

        --wasm-execution <METHOD>
            Method for executing Wasm runtime code [default: Compiled] [possible values:
            interpreted-i-know-what-i-do, compiled]

        --wasm-runtime-overrides <PATH>
            Specify the path where local WASM runtimes are stored

        --ws-external
            Listen to all Websocket interfaces

        --ws-max-connections <COUNT>
            Maximum number of WS RPC server connections

        --ws-max-out-buffer-capacity <WS_MAX_OUT_BUFFER_CAPACITY>
            Set the the maximum WebSocket output buffer size in MiB. Default is 16

        --ws-port <PORT>
            Specify WebSockets RPC server TCP port

SUBCOMMANDS:
    benchmark        Benchmark runtime pallets.
    build-spec       Build a chain specification
    check-block      Validate blocks
    export-blocks    Export blocks
    export-state     Export the state of a given block into a chain spec
    help             Print this message or the help of the given subcommand(s)
    import-blocks    Import blocks
    key              Key management cli utilities
    purge-chain      Remove the whole chain
    revert           Revert the chain to a previous state
    try-runtime      Try some command against runtime state. Note: `try-runtime` feature must be
                         enabled
```
