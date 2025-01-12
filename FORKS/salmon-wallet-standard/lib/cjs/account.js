"use strict";
// This is copied with modification from @wallet-standard/wallet
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SalmonWalletAccount_address, _SalmonWalletAccount_publicKey, _SalmonWalletAccount_chains, _SalmonWalletAccount_features, _SalmonWalletAccount_label, _SalmonWalletAccount_icon;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalmonWalletAccount = void 0;
const solana_js_1 = require("./solana.js");
const chains = solana_js_1.SOLANA_CHAINS;
const features = ['solana:signAndSendTransaction', 'solana:signMessage', 'solana:signTransaction'];
class SalmonWalletAccount {
    constructor({ address, publicKey, label, icon }) {
        _SalmonWalletAccount_address.set(this, void 0);
        _SalmonWalletAccount_publicKey.set(this, void 0);
        _SalmonWalletAccount_chains.set(this, void 0);
        _SalmonWalletAccount_features.set(this, void 0);
        _SalmonWalletAccount_label.set(this, void 0);
        _SalmonWalletAccount_icon.set(this, void 0);
        if (new.target === SalmonWalletAccount) {
            Object.freeze(this);
        }
        __classPrivateFieldSet(this, _SalmonWalletAccount_address, address, "f");
        __classPrivateFieldSet(this, _SalmonWalletAccount_publicKey, publicKey, "f");
        __classPrivateFieldSet(this, _SalmonWalletAccount_chains, chains, "f");
        __classPrivateFieldSet(this, _SalmonWalletAccount_features, features, "f");
        __classPrivateFieldSet(this, _SalmonWalletAccount_label, label, "f");
        __classPrivateFieldSet(this, _SalmonWalletAccount_icon, icon, "f");
    }
    get address() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_address, "f");
    }
    get publicKey() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_publicKey, "f").slice();
    }
    get chains() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_chains, "f").slice();
    }
    get features() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_features, "f").slice();
    }
    get label() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_label, "f");
    }
    get icon() {
        return __classPrivateFieldGet(this, _SalmonWalletAccount_icon, "f");
    }
}
exports.SalmonWalletAccount = SalmonWalletAccount;
_SalmonWalletAccount_address = new WeakMap(), _SalmonWalletAccount_publicKey = new WeakMap(), _SalmonWalletAccount_chains = new WeakMap(), _SalmonWalletAccount_features = new WeakMap(), _SalmonWalletAccount_label = new WeakMap(), _SalmonWalletAccount_icon = new WeakMap();
//# sourceMappingURL=account.js.map