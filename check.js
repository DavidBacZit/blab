const { Web3 } = require('web3');
const { generateMnemonic, EthHdWallet } = require('eth-hd-wallet');

// Define the RPC endpoints for various chains
const rpcEndpoints = {
    "Ethereum": [
        "https://endpoints.omniatech.io/v1/eth/mainnet/public",
        "https://1rpc.io/eth",
        "https://eth.meowrpc.com",
        "https://ethereum-rpc.publicnode.com",
        "https://eth.drpc.org",
        "https://eth-pokt.nodies.app",
        "https://eth.llamarpc.com",
        "https://rpc.builder0x69.io",
        "https://rpc.mevblocker.io",
        "https://rpc.flashbots.net",
        "https://rpc.payload.de",
        "https://eth.merkle.io",
        "https://api.stateless.solutions/ethereum/v1/demo",
    ],
    "BSC": [
        "https://endpoints.omniatech.io/v1/bsc/mainnet/public",
        "https://1rpc.io/bnb",
        "https://bsc.meowrpc.com",
        "https://bsc-rpc.publicnode.com",
        "https://bsc.drpc.org",
        "https://bsc-pokt.nodies.app",
        "https://binance.llamarpc.com",
    ],
    "Arbitrum": [
        "https://endpoints.omniatech.io/v1/arbitrum/one/public",
        "https://1rpc.io/arb",
        "https://arbitrum.meowrpc.com",
        "https://arbitrum-one-rpc.publicnode.com",
        "https://arbitrum.drpc.org",
        "https://arb-pokt.nodies.app",
        "https://arbitrum.llamarpc.com",
    ],
    "ARBN": [
        "https://arbitrum-nova-rpc.publicnode.com",
        "https://arbitrum-nova.drpc.org"
    ],
    "Base": [
        "https://base.meowrpc.com",
        "https://1rpc.io/base",
        "https://base-rpc.publicnode.com",
        "https://base.drpc.org",
        "https://base-pokt.nodies.app",
        "https://base.llamarpc.com"
    ],
    "Avalanche": [
        "https://avalanche-c-chain-rpc.publicnode.com",
        "https://1rpc.io/avax/c",
        "https://avax.meowrpc.com",
        "https://endpoints.omniatech.io/v1/avax/mainnet/publicrpc",
        "https://avax-pokt.nodies.app/ext/bc/C/rpc",
    ],
    "Polygon": [
        "https://polygon.meowrpc.com",
        "https://1rpc.io/matic",
        "https://endpoints.omniatech.io/v1/matic/mainnet/publicrpc",
        "https://polygon.drpc.org",
        "https://polygon-pokt.nodies.app",
        "https://polygon-bor-rpc.publicnode.com",
    ],
    "OP": [
        "https://endpoints.omniatech.io/v1/op/mainnet/public",
        "https://1rpc.io/op",
        "https://optimism-rpc.publicnode.com",
        "https://optimism.drpc.org",
        "https://op-pokt.nodies.app",
        "https://optimism.llamarpc.com",
    ],
    "PulseChain": [
        "https://pulsechain-rpc.publicnode.com",
    ],
    "Gnosis": [
        "https://endpoints.omniatech.io/v1/gnosis/mainnet/public",
        "https://gnosis.drpc.org",
        "https://gnosis-pokt.nodies.app",
        "https://gnosis-rpc.publicnode.com",
        "https://1rpc.io/gnosis",
        "https://endpoints.omniatech.io/v1/gnosis/mainnet/publicrpc"
    ],
    "Syscoin": [
        "https://syscoin-evm.publicnode.com"
    ],
    "OPBNB": [
        "https://1rpc.io/opbnb",
        "https://opbnb-rpc.publicnode.com",
        "https://opbnb.drpc.org"
    ],
    "ETC": [
        "https://etc.rivet.link"
    ],
    "Oasis": [
        "https://1rpc.io/oasis/emerald"
    ],
    "OasisSa": [
        "https://1rpc.io/oasis/sapphire"
    ],
    "Hamory": [
        "https://1rpc.io/one",
        "https://hmyone-pokt.nodies.app",
        "https://endpoints.omniatech.io/v1/harmony/mainnet-0/public",
        "https://harmony-0.drpc.org"
    ],
    "Fuse": [
        "https://fuse-pokt.nodies.app",
        "https://fuse.drpc.org",
        "https://lb.nodies.app/v1/0cbc3d8d26874a0fa45221f001b8b364"
    ],
    "Oasys": [
        "https://oasys-mainnet.rpc.grove.city/v1/167fa7a3",
        "https://oasys-mainnet-archival.rpc.grove.city/v1/167fa7a3"
    ],
    "Evmos": [
        "https://evmos-evm-rpc.publicnode.com",
        "https://evmos-pokt.nodies.app"
    ],
    "MOVR": [
        "https://moonriver-rpc.publicnode.com",
        "https://moonriver.drpc.org"
    ],
    "Aurora": [
        "https://endpoints.omniatech.io/v1/aurora/mainnet/public",
        "https://aurora.drpc.org"
    ],
    "Moonbeam": [
        "https://endpoints.omniatech.io/v1/moonbeam/mainnet/public",
        "https://moonbeam-rpc.publicnode.com",
        "https://moonbeam.drpc.org"
    ],
    "Fantom": [
        "https://1rpc.io/ftm",
        "https://fantom-rpc.publicnode.com",
        "https://endpoints.omniatech.io/v1/fantom/mainnet/publicrpc",
        "https://lb.nodies.app/v1/67b0982c97f342b09c1c991ff0010627"
    ],
    "Celo": [
        "https://1rpc.io/celo",
        "https://celo.drpc.org"
    ],
    "zkSync": [
        "https://1rpc.io/zksync2-era",
        "https://base.meowrpc.com"
    ],
    "Astar": [
        "https://1rpc.io/astr"
    ],
    "Klaytn": [
        "https://1rpc.io/klay",
        "https://klaytn-pokt.nodies.app"
    ],
    "zkEVM": [
        "https://1rpc.io/polygon/zkevm",
        "https://polygon-zkevm.drpc.org",
        "https://lb.nodies.app/v1/1060ddc9de32482888147aa9c29c3f57"
    ],
    "Scroll": [
        "https://1rpc.io/scroll",
        "https://scroll.drpc.org"
    ],
    "Linea": [
        "https://1rpc.io/linea",
        "https://linea.drpc.org",
        "https://linea.decubate.com"
    ],
    "OKT": [
        "https://1rpc.io/oktc",
        "https://oktc.drpc.org"
    ],
    "Mantle": [
        "https://mantle-rpc.publicnode.com",
        "https://mantle.drpc.org"
    ],
    "Cronos": [
        "https://1rpc.io/cro",
        "https://cronos.drpc.org"
    ],
    "Core": [
        "https://1rpc.io/core",
        "https://core.drpc.org"
    ],
    "Telos": [
        "https://1rpc.io/telos/evm",
        "https://telos.drpc.org"
    ],
    "Boba": [
        "https://1rpc.io/boba/eth",
        "https://bittorrent.drpc.org",
    ],
    "Kroma": [
        "https://1rpc.io/kroma"
    ],
    "Mode": [
        "https://1rpc.io/mode",
        "https://mode.drpc.org"
    ],
    "Kava": [
        "https://kava-evm-rpc.publicnode.com",
        "https://kava.drpc.org",
        "https://lb.nodies.app/v1/05b5daeba22c4ff685a72e610b0a5509"
    ],
    "Pulse": [
        "https://pulsechain-rpc.publicnode.com"
    ],
    "HAQQ": [
        "https://haqq-evm-rpc.publicnode.com",
        "https://haqq.drpc.org"
    ],
    "DYM": [
        "https://dymension-evm-rpc.publicnode.com"
    ],
    "CHZ": [
        "https://chiliz-rpc.publicnode.com"
    ],
    "Tron": [
        "https://tron-evm-rpc.publicnode.com"
    ],
    "Bahamut": [
        "https://bahamut-rpc.publicnode.com"
    ],
    "Tenet": [
        "https://tenet-evm-rpc.publicnode.com"
    ],
    "XPLA": [
        "https://xpla-evm-rpc.publicnode.com"
    ],
    "Blast": [
        "https://blast.drpc.org",
        "https://lb.nodies.app/v1/fee9a61ec5324ce3a95e17504300673d"
    ],
    "Fuse": [
        "https://fuse.drpc.org",
        "https://lb.nodies.app/v1/0cbc3d8d26874a0fa45221f001b8b364"
    ],
    "Heco": [
        "https://heco.drpc.org"
    ],
    "Metis": [
        "https://lb.nodies.app/v1/f5c5ecde09414b3384842a8740a8c998"
    ],
    "Neon": [
        "https://neon-evm.drpc.org"
    ],
    "PBG": [
        "https://playnance.drpc.org"
    ],
    "Real": [
        "https://real.drpc.org"
    ],
    "RON": [
        "https://ronin.drpc.org"
    ],
    "Thunder": [
        "https://thundercore.drpc.org"
    ],
    "Zora": [
        "https://zora.drpc.org"
    ],
    "Planq": [
        "https://lb.nodies.app/v1/bb32ee5869394fe4a876789bb8cf2c54"
    ],
    "Kinto": [
        "https://lb.nodies.app/v1/5b300e8789eb4c54a40cde759a99ad91"
    ]
};

async function fetchBalance(rpc, address, retries = 3, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc, { signal: controller.signal }));
        const balance = await web3.eth.getBalance(address);
        clearTimeout(timeoutId);
        return balance;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.type === 'invalid-json') {
            console.error(`Invalid JSON response from ${rpc}`);
            return 0;
        } else if ((error.code === 'ECONNRESET' || error.name === 'AbortError') && retries > 0) {
            console.warn(`Network error with ${rpc}. Retrying... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, 1000)); // Wait for 1 second before retrying
            return fetchBalance(rpc, address, retries - 1, timeout);
        } else {
            console.error(`Error fetching balance from ${rpc}:`, error);
            return 0;
        }
    }
}

async function checkBalances(seedPhrase, address) {
    const chainNames = Object.keys(rpcEndpoints);

    const promises = chainNames.map(async chainName => {
        for (let rpc of rpcEndpoints[chainName]) {
            const balance = await fetchBalance(rpc, address);
            if (balance > 0) {
                const balanceInEther = Web3.utils.fromWei(balance, 'ether');
                console.log(`Balance on ${chainName}: ${balanceInEther} Ether`);
                return true;
            }
        }
        return false;
    });

    for await (const result of promises) {
        if (result) return true;
    }

    return false;
}

(async () => {
    while (true) {
        const seedPhrase = generateMnemonic();
        const wallet = EthHdWallet.fromMnemonic(seedPhrase);
        const address = wallet.generateAddresses(1)[0];
        console.log(`Generated address: ${address}`);
        console.log(`Seed phrase: ${seedPhrase}`);

        const balanceFound = await checkBalances(seedPhrase, address);
        if (balanceFound) {
            console.log(`Seed phrase with balance: ${seedPhrase}`);
            break;
        }
    }
})();