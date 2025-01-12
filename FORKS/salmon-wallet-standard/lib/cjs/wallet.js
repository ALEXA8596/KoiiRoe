"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SalmonWallet_instances, _SalmonWallet_listeners, _SalmonWallet_version, _SalmonWallet_name, _SalmonWallet_icon, _SalmonWallet_account, _SalmonWallet_salmon, _SalmonWallet_on, _SalmonWallet_emit, _SalmonWallet_off, _SalmonWallet_connected, _SalmonWallet_disconnected, _SalmonWallet_reconnected, _SalmonWallet_connect, _SalmonWallet_disconnect, _SalmonWallet_signAndSendTransaction, _SalmonWallet_signTransaction, _SalmonWallet_signMessage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalmonWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const account_js_1 = require("./account.js");
const icon_js_1 = require("./icon.js");
const solana_js_1 = require("./solana.js");
const util_js_1 = require("./util.js");
class SalmonWallet {
    constructor(salmon) {
        _SalmonWallet_instances.add(this);
        _SalmonWallet_listeners.set(this, {});
        _SalmonWallet_version.set(this, '1.0.0');
        _SalmonWallet_name.set(this, 'Salmon');
        _SalmonWallet_icon.set(this, icon_js_1.icon);
        _SalmonWallet_account.set(this, null);
        _SalmonWallet_salmon.set(this, void 0);
        _SalmonWallet_on.set(this, (event, listener) => {
            var _a;
            ((_a = __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.push(listener)) || (__classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event] = [listener]);
            return () => __classPrivateFieldGet(this, _SalmonWallet_instances, "m", _SalmonWallet_off).call(this, event, listener);
        });
        _SalmonWallet_connected.set(this, () => {
            var _a;
            const address = (_a = __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").publicKey) === null || _a === void 0 ? void 0 : _a.toBase58();
            if (address) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const publicKey = __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").publicKey.toBytes();
                const account = __classPrivateFieldGet(this, _SalmonWallet_account, "f");
                if (!account || account.address !== address || !(0, util_js_1.bytesEqual)(account.publicKey, publicKey)) {
                    __classPrivateFieldSet(this, _SalmonWallet_account, new account_js_1.SalmonWalletAccount({ address, publicKey }), "f");
                    __classPrivateFieldGet(this, _SalmonWallet_instances, "m", _SalmonWallet_emit).call(this, 'change', { accounts: this.accounts });
                }
            }
        });
        _SalmonWallet_disconnected.set(this, () => {
            if (__classPrivateFieldGet(this, _SalmonWallet_account, "f")) {
                __classPrivateFieldSet(this, _SalmonWallet_account, null, "f");
                __classPrivateFieldGet(this, _SalmonWallet_instances, "m", _SalmonWallet_emit).call(this, 'change', { accounts: this.accounts });
            }
        });
        _SalmonWallet_reconnected.set(this, () => {
            if (__classPrivateFieldGet(this, _SalmonWallet_salmon, "f").publicKey) {
                __classPrivateFieldGet(this, _SalmonWallet_connected, "f").call(this);
            }
            else {
                __classPrivateFieldGet(this, _SalmonWallet_disconnected, "f").call(this);
            }
        });
        _SalmonWallet_connect.set(this, ({ silent } = {}) => __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f")) {
                yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").connect(silent ? { onlyIfTrusted: true } : undefined);
            }
            __classPrivateFieldGet(this, _SalmonWallet_connected, "f").call(this);
            return { accounts: this.accounts };
        }));
        _SalmonWallet_disconnect.set(this, () => __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").disconnect();
            __classPrivateFieldGet(this, _SalmonWallet_disconnected, "f").call(this);
        }));
        _SalmonWallet_signAndSendTransaction.set(this, (...inputs) => __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { transaction, account, chain, options } = inputs[0];
                const { minContextSlot, preflightCommitment, skipPreflight, maxRetries } = options || {};
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                if (!(0, solana_js_1.isSolanaChain)(chain))
                    throw new Error('invalid chain');
                const network = chain ? (0, solana_js_1.getNetworkForChain)(chain) : undefined;
                const { signature } = yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signAndSendTransaction(web3_js_1.VersionedTransaction.deserialize(transaction), network, {
                    preflightCommitment,
                    minContextSlot,
                    maxRetries,
                    skipPreflight,
                });
                outputs.push({ signature: bs58_1.default.decode(signature) });
            }
            else if (inputs.length > 1) {
                for (const input of inputs) {
                    outputs.push(...(yield __classPrivateFieldGet(this, _SalmonWallet_signAndSendTransaction, "f").call(this, input)));
                }
            }
            return outputs;
        }));
        _SalmonWallet_signTransaction.set(this, (...inputs) => __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { transaction, account, chain } = inputs[0];
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                if (chain && !(0, solana_js_1.isSolanaChain)(chain))
                    throw new Error('invalid chain');
                const network = chain ? (0, solana_js_1.getNetworkForChain)(chain) : undefined;
                const signedTransaction = yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signTransaction(web3_js_1.VersionedTransaction.deserialize(transaction), network);
                outputs.push({ signedTransaction: signedTransaction.serialize() });
            }
            else if (inputs.length > 1) {
                let chain = undefined;
                for (const input of inputs) {
                    if (input.account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                        throw new Error('invalid account');
                    if (input.chain) {
                        if (!(0, solana_js_1.isSolanaChain)(input.chain))
                            throw new Error('invalid chain');
                        if (chain) {
                            if (input.chain !== chain)
                                throw new Error('conflicting chain');
                        }
                        else {
                            chain = input.chain;
                        }
                    }
                }
                const network = chain ? (0, solana_js_1.getNetworkForChain)(chain) : undefined;
                const transactions = inputs.map(({ transaction }) => web3_js_1.VersionedTransaction.deserialize(transaction));
                const signedTransactions = yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signAllTransactions(transactions, network);
                outputs.push(...signedTransactions.map((signedTransaction) => ({ signedTransaction: signedTransaction.serialize() })));
            }
            return outputs;
        }));
        _SalmonWallet_signMessage.set(this, (...inputs) => __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { message, account } = inputs[0];
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                const { signature } = yield __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signMessage(message);
                outputs.push({ signedMessage: message, signature });
            }
            else if (inputs.length > 1) {
                for (const input of inputs) {
                    outputs.push(...(yield __classPrivateFieldGet(this, _SalmonWallet_signMessage, "f").call(this, input)));
                }
            }
            return outputs;
        }));
        if (new.target === SalmonWallet) {
            Object.freeze(this);
        }
        __classPrivateFieldSet(this, _SalmonWallet_salmon, salmon, "f");
        salmon.on('connect', __classPrivateFieldGet(this, _SalmonWallet_connected, "f"), this);
        salmon.on('disconnect', __classPrivateFieldGet(this, _SalmonWallet_disconnected, "f"), this);
        salmon.on('accountChanged', __classPrivateFieldGet(this, _SalmonWallet_reconnected, "f"), this);
        __classPrivateFieldGet(this, _SalmonWallet_connected, "f").call(this);
    }
    get version() {
        return __classPrivateFieldGet(this, _SalmonWallet_version, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _SalmonWallet_name, "f");
    }
    get icon() {
        return __classPrivateFieldGet(this, _SalmonWallet_icon, "f");
    }
    get chains() {
        return solana_js_1.SOLANA_CHAINS.slice();
    }
    get features() {
        return {
            'standard:connect': {
                version: '1.0.0',
                connect: __classPrivateFieldGet(this, _SalmonWallet_connect, "f"),
            },
            'standard:disconnect': {
                version: '1.0.0',
                disconnect: __classPrivateFieldGet(this, _SalmonWallet_disconnect, "f"),
            },
            'standard:events': {
                version: '1.0.0',
                on: __classPrivateFieldGet(this, _SalmonWallet_on, "f"),
            },
            'solana:signAndSendTransaction': {
                version: '1.0.0',
                supportedTransactionVersions: ['legacy', 0],
                signAndSendTransaction: __classPrivateFieldGet(this, _SalmonWallet_signAndSendTransaction, "f"),
            },
            'solana:signTransaction': {
                version: '1.0.0',
                supportedTransactionVersions: ['legacy', 0],
                signTransaction: __classPrivateFieldGet(this, _SalmonWallet_signTransaction, "f"),
            },
            'solana:signMessage': {
                version: '1.0.0',
                signMessage: __classPrivateFieldGet(this, _SalmonWallet_signMessage, "f"),
            },
            'salmon:': {
                salmon: __classPrivateFieldGet(this, _SalmonWallet_salmon, "f"),
            },
        };
    }
    get accounts() {
        return __classPrivateFieldGet(this, _SalmonWallet_account, "f") ? [__classPrivateFieldGet(this, _SalmonWallet_account, "f")] : [];
    }
}
exports.SalmonWallet = SalmonWallet;
_SalmonWallet_listeners = new WeakMap(), _SalmonWallet_version = new WeakMap(), _SalmonWallet_name = new WeakMap(), _SalmonWallet_icon = new WeakMap(), _SalmonWallet_account = new WeakMap(), _SalmonWallet_salmon = new WeakMap(), _SalmonWallet_on = new WeakMap(), _SalmonWallet_connected = new WeakMap(), _SalmonWallet_disconnected = new WeakMap(), _SalmonWallet_reconnected = new WeakMap(), _SalmonWallet_connect = new WeakMap(), _SalmonWallet_disconnect = new WeakMap(), _SalmonWallet_signAndSendTransaction = new WeakMap(), _SalmonWallet_signTransaction = new WeakMap(), _SalmonWallet_signMessage = new WeakMap(), _SalmonWallet_instances = new WeakSet(), _SalmonWallet_emit = function _SalmonWallet_emit(event, ...args) {
    var _a;
    // eslint-disable-next-line prefer-spread
    (_a = __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener.apply(null, args));
}, _SalmonWallet_off = function _SalmonWallet_off(event, listener) {
    var _a;
    __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event] = (_a = __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.filter((existingListener) => listener !== existingListener);
};
//# sourceMappingURL=wallet.js.map