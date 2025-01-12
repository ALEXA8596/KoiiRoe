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
var _SalmonWallet_instances, _SalmonWallet_listeners, _SalmonWallet_version, _SalmonWallet_name, _SalmonWallet_icon, _SalmonWallet_account, _SalmonWallet_salmon, _SalmonWallet_on, _SalmonWallet_emit, _SalmonWallet_off, _SalmonWallet_connected, _SalmonWallet_disconnected, _SalmonWallet_reconnected, _SalmonWallet_connect, _SalmonWallet_disconnect, _SalmonWallet_signAndSendTransaction, _SalmonWallet_signTransaction, _SalmonWallet_signMessage;
import { VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { SalmonWalletAccount } from './account.js';
import { icon } from './icon.js';
import { getNetworkForChain, isSolanaChain, SOLANA_CHAINS } from './solana.js';
import { bytesEqual } from './util.js';
export class SalmonWallet {
    constructor(salmon) {
        _SalmonWallet_instances.add(this);
        _SalmonWallet_listeners.set(this, {});
        _SalmonWallet_version.set(this, '1.0.0');
        _SalmonWallet_name.set(this, 'Salmon');
        _SalmonWallet_icon.set(this, icon);
        _SalmonWallet_account.set(this, null);
        _SalmonWallet_salmon.set(this, void 0);
        _SalmonWallet_on.set(this, (event, listener) => {
            __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]?.push(listener) || (__classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event] = [listener]);
            return () => __classPrivateFieldGet(this, _SalmonWallet_instances, "m", _SalmonWallet_off).call(this, event, listener);
        });
        _SalmonWallet_connected.set(this, () => {
            const address = __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").publicKey?.toBase58();
            if (address) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const publicKey = __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").publicKey.toBytes();
                const account = __classPrivateFieldGet(this, _SalmonWallet_account, "f");
                if (!account || account.address !== address || !bytesEqual(account.publicKey, publicKey)) {
                    __classPrivateFieldSet(this, _SalmonWallet_account, new SalmonWalletAccount({ address, publicKey }), "f");
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
        _SalmonWallet_connect.set(this, async ({ silent } = {}) => {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f")) {
                await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").connect(silent ? { onlyIfTrusted: true } : undefined);
            }
            __classPrivateFieldGet(this, _SalmonWallet_connected, "f").call(this);
            return { accounts: this.accounts };
        });
        _SalmonWallet_disconnect.set(this, async () => {
            await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").disconnect();
            __classPrivateFieldGet(this, _SalmonWallet_disconnected, "f").call(this);
        });
        _SalmonWallet_signAndSendTransaction.set(this, async (...inputs) => {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { transaction, account, chain, options } = inputs[0];
                const { minContextSlot, preflightCommitment, skipPreflight, maxRetries } = options || {};
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                if (!isSolanaChain(chain))
                    throw new Error('invalid chain');
                const network = chain ? getNetworkForChain(chain) : undefined;
                const { signature } = await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signAndSendTransaction(VersionedTransaction.deserialize(transaction), network, {
                    preflightCommitment,
                    minContextSlot,
                    maxRetries,
                    skipPreflight,
                });
                outputs.push({ signature: bs58.decode(signature) });
            }
            else if (inputs.length > 1) {
                for (const input of inputs) {
                    outputs.push(...(await __classPrivateFieldGet(this, _SalmonWallet_signAndSendTransaction, "f").call(this, input)));
                }
            }
            return outputs;
        });
        _SalmonWallet_signTransaction.set(this, async (...inputs) => {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { transaction, account, chain } = inputs[0];
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                if (chain && !isSolanaChain(chain))
                    throw new Error('invalid chain');
                const network = chain ? getNetworkForChain(chain) : undefined;
                const signedTransaction = await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signTransaction(VersionedTransaction.deserialize(transaction), network);
                outputs.push({ signedTransaction: signedTransaction.serialize() });
            }
            else if (inputs.length > 1) {
                let chain = undefined;
                for (const input of inputs) {
                    if (input.account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                        throw new Error('invalid account');
                    if (input.chain) {
                        if (!isSolanaChain(input.chain))
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
                const network = chain ? getNetworkForChain(chain) : undefined;
                const transactions = inputs.map(({ transaction }) => VersionedTransaction.deserialize(transaction));
                const signedTransactions = await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signAllTransactions(transactions, network);
                outputs.push(...signedTransactions.map((signedTransaction) => ({ signedTransaction: signedTransaction.serialize() })));
            }
            return outputs;
        });
        _SalmonWallet_signMessage.set(this, async (...inputs) => {
            if (!__classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                throw new Error('not connected');
            const outputs = [];
            if (inputs.length === 1) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { message, account } = inputs[0];
                if (account !== __classPrivateFieldGet(this, _SalmonWallet_account, "f"))
                    throw new Error('invalid account');
                const { signature } = await __classPrivateFieldGet(this, _SalmonWallet_salmon, "f").signMessage(message);
                outputs.push({ signedMessage: message, signature });
            }
            else if (inputs.length > 1) {
                for (const input of inputs) {
                    outputs.push(...(await __classPrivateFieldGet(this, _SalmonWallet_signMessage, "f").call(this, input)));
                }
            }
            return outputs;
        });
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
        return SOLANA_CHAINS.slice();
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
_SalmonWallet_listeners = new WeakMap(), _SalmonWallet_version = new WeakMap(), _SalmonWallet_name = new WeakMap(), _SalmonWallet_icon = new WeakMap(), _SalmonWallet_account = new WeakMap(), _SalmonWallet_salmon = new WeakMap(), _SalmonWallet_on = new WeakMap(), _SalmonWallet_connected = new WeakMap(), _SalmonWallet_disconnected = new WeakMap(), _SalmonWallet_reconnected = new WeakMap(), _SalmonWallet_connect = new WeakMap(), _SalmonWallet_disconnect = new WeakMap(), _SalmonWallet_signAndSendTransaction = new WeakMap(), _SalmonWallet_signTransaction = new WeakMap(), _SalmonWallet_signMessage = new WeakMap(), _SalmonWallet_instances = new WeakSet(), _SalmonWallet_emit = function _SalmonWallet_emit(event, ...args) {
    // eslint-disable-next-line prefer-spread
    __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]?.forEach((listener) => listener.apply(null, args));
}, _SalmonWallet_off = function _SalmonWallet_off(event, listener) {
    __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event] = __classPrivateFieldGet(this, _SalmonWallet_listeners, "f")[event]?.filter((existingListener) => listener !== existingListener);
};
//# sourceMappingURL=wallet.js.map