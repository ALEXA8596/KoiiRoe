import type { SolanaSignAndSendTransactionFeature, SolanaSignMessageFeature, SolanaSignTransactionFeature } from '@solana/wallet-standard-features';
import type { Wallet } from '@wallet-standard/base';
import type { ConnectFeature, DisconnectFeature, EventsFeature } from '@wallet-standard/features';
import { SalmonWalletAccount } from './account.js';
import type { Salmon } from './window.js';
export declare type SalmonFeature = {
    'salmon:': {
        salmon: Salmon;
    };
};
export declare class SalmonWallet implements Wallet {
    #private;
    get version(): "1.0.0";
    get name(): "Salmon";
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
    get chains(): ("solana:mainnet" | "solana:devnet" | "solana:testnet")[];
    get features(): ConnectFeature & DisconnectFeature & EventsFeature & SolanaSignAndSendTransactionFeature & SolanaSignTransactionFeature & SolanaSignMessageFeature & SalmonFeature;
    get accounts(): SalmonWalletAccount[];
    constructor(salmon: Salmon);
}
//# sourceMappingURL=wallet.d.ts.map