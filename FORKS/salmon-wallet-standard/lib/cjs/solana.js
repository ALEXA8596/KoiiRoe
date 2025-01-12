"use strict";
// This is copied from @solana/wallet-standard-chains
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkForChain = exports.isSolanaChain = exports.SOLANA_CHAINS = exports.SOLANA_TESTNET_CHAIN = exports.SOLANA_DEVNET_CHAIN = exports.SOLANA_MAINNET_CHAIN = void 0;
/** Solana Mainnet (beta) cluster, e.g. https://api.mainnet-beta.solana.com */
exports.SOLANA_MAINNET_CHAIN = 'solana:mainnet';
/** Solana Devnet cluster, e.g. https://api.devnet.solana.com */
exports.SOLANA_DEVNET_CHAIN = 'solana:devnet';
/** Solana Testnet cluster, e.g. https://api.testnet.solana.com */
exports.SOLANA_TESTNET_CHAIN = 'solana:testnet';
/** Array of all Solana clusters */
exports.SOLANA_CHAINS = [
    exports.SOLANA_MAINNET_CHAIN,
    exports.SOLANA_DEVNET_CHAIN,
    exports.SOLANA_TESTNET_CHAIN,
];
/**
 * Check if a chain corresponds with one of the Solana clusters.
 */
function isSolanaChain(chain) {
    return exports.SOLANA_CHAINS.includes(chain);
}
exports.isSolanaChain = isSolanaChain;
/**
 * Map supported Solana clusters to supported Salmon networks.
 */
function getNetworkForChain(chain) {
    switch (chain) {
        case exports.SOLANA_MAINNET_CHAIN:
            return 'mainnet';
        case exports.SOLANA_DEVNET_CHAIN:
            return 'devnet';
        case exports.SOLANA_TESTNET_CHAIN:
            return 'testnet';
        default:
            return 'mainnet';
    }
}
exports.getNetworkForChain = getNetworkForChain;
//# sourceMappingURL=solana.js.map