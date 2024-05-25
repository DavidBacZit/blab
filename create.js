const { generateMnemonic, EthHdWallet } = require('eth-hd-wallet');
const axios = require('axios');

// Tạo seed phrase và địa chỉ ví cho Ethereum
function generateEthereumWallet(mnemonic) {
    const wallet = EthHdWallet.fromMnemonic(mnemonic);
    const address = wallet.generateAddresses(1)[0];
    return address;
}

// Danh sách các RPC endpoints
const rpcEndpoints = {
    ethereum: [
        'https://ethereum-rpc.publicnode.com',
        'https://eth.llamarpc.com',
        'https://endpoints.omniatech.io/v1/eth/mainnet/public',
        'https://1rpc.io/eth',
        'https://rpc.mevblocker.io',
        'https://rpc.flashbots.net',
        'https://eth-pokt.nodies.app'
    ],
    bsc: [
        'https://bsc-rpc.publicnode.com',
        'https://binance.llamarpc.com',
        'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
        'https://bsc-pokt.nodies.app',
        'https://1rpc.io/bnb',
        'https://bsc.meowrpc.com',
        'https://bsc.drpc.org'
    ],
    arbitrum: [
        'https://arb-pokt.nodies.app',
        'https://arbitrum.llamarpc.com',
        'https://1rpc.io/arb',
        'https://endpoints.omniatech.io/v1/arbitrum/one/public',
        'https://arbitrum-one-rpc.publicnode.com',
        'https://arbitrum.meowrpc.com',
        'https://arbitrum.drpc.org'
    ],
    polygon: [
        'https://polygon-pokt.nodies.app',
        'https://polygon.llamarpc.com',
        'https://endpoints.omniatech.io/v1/matic/mainnet/public',
        'https://1rpc.io/matic',
        'https://polygon-bor-rpc.publicnode.com',
        'https://polygon.drpc.org',
        'https://polygon.meowrpc.com'
    ],
    base: [
        'https://base.meowrpc.com',
        'https://base.llamarpc.com',
        'https://1rpc.io/base',
        'https://base-pokt.nodies.app',
        'https://base-rpc.publicnode.com',
        'https://endpoints.omniatech.io/v1/base/mainnet/public',
        'https://base.drpc.org'
    ],
    op: [
        'https://1rpc.io/op',
        'https://optimism.llamarpc.com',
        'https://op-pokt.nodies.app',
        'https://endpoints.omniatech.io/v1/op/mainnet/public',
        'https://optimism-rpc.publicnode.com',
        'https://optimism.meowrpc.com',
        'https://optimism.drpc.org'
    ]
};

async function getBalanceWithFallback(chain, address, timeout = 3000) {
    for (let url of rpcEndpoints[chain]) {
        try {
            const response = await axios.post(url, {
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address, 'latest'],
                id: 1
            }, { timeout });

            if (response.data && response.data.result) {
                const balance = parseInt(response.data.result, 16) / 1e18; // Convert từ Wei sang Ether
                return balance;
            }
        } catch (error) {
            console.error(`Error fetching ${chain} balance from ${url}:`, error.message);
        }
    }
    return 0; // Nếu tất cả các RPC endpoints đều thất bại
}

async function getEVMBalance(address) {
    const chains = ['ethereum', 'bsc', 'arbitrum', 'polygon', 'base', 'op'];
    const balances = await Promise.all(chains.map(chain => getBalanceWithFallback(chain, address)));
    return balances.reduce((acc, balance) => acc + balance, 0);
}

(async () => {
    while (true) {
        const mnemonic = generateMnemonic();
        const ethereumWallet = generateEthereumWallet(mnemonic);

        console.log(`Mnemonic: ${mnemonic}`);
        console.log(`Address: ${ethereumWallet}`);

        try {
            const EVMBalance = await getEVMBalance(ethereumWallet);

            if (EVMBalance > 0) {
                console.log('Found asset in EVM, checked. Youre rich');
                break;
            }
        } catch (error) {
            console.error('Error fetching balance:', error.message);
        }
    }
})();
