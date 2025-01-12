import { registerWallet } from './register.js';
import { SalmonWallet } from './wallet.js';
export function initialize(salmon) {
    registerWallet(new SalmonWallet(salmon));
}
//# sourceMappingURL=initialize.js.map