// This is copied from @solana/wallet-standard-chains
/** Solana Mainnet (beta) cluster, e.g. https://api.mainnet-beta.solana.com */
export const SOLANA_MAINNET_CHAIN = 'solana:mainnet';
/** Solana Devnet cluster, e.g. https://api.devnet.solana.com */
export const SOLANA_DEVNET_CHAIN = 'solana:devnet';
/** Solana Testnet cluster, e.g. https://api.testnet.solana.com */
export const SOLANA_TESTNET_CHAIN = 'solana:testnet';
/** Array of all Solana clusters */
export const SOLANA_CHAINS = [
    SOLANA_MAINNET_CHAIN,
    SOLANA_DEVNET_CHAIN,
    SOLANA_TESTNET_CHAIN,
];
/**
 * Check if a chain corresponds with one of the Solana clusters.
 */
export function isSolanaChain(chain) {
    return SOLANA_CHAINS.includes(chain);
}
/**
 * Map supported Solana clusters to supported Salmon networks.
 */
export function getNetworkForChain(chain) {
    switch (chain) {
        case SOLANA_MAINNET_CHAIN:
            return 'mainnet';
        case SOLANA_DEVNET_CHAIN:
            return 'devnet';
        case SOLANA_TESTNET_CHAIN:
            return 'testnet';
        default:
            return 'mainnet';
    }
}
//# sourceMappingURL=solana.js.map