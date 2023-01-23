import { useCallback, useEffect, useMemo, useState } from 'react';

import { AccountFactory, getNetworks, getPathIndex } from '4m-wallet-adapter';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

import { invertBy } from '../utils/object';
import { lock, unlock } from '../utils/password';
import stash from '../utils/stash';
import storage from '../utils/storage';
import STORAGE_KEYS from '../utils/storageKeys';

const useAccounts = () => {
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [requiredLock, setRequiredLock] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [mnemonics, setMnemonics] = useState({});
  const [accountId, setAccounId] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [pathIndex, setPathIndex] = useState(0);
  const [trustedApps, setTrustedApps] = useState({});
  const [tokens, setTokens] = useState({});

  const getDefaultPathIndex = (account, netId) => {
    return account.networksAccounts[netId]?.findIndex(Boolean) || 0;
  };

  const formatAccount = account => {
    const { id, name, avatar, networksAccounts } = account;

    const getPathIndexes = networkAccounts => {
      const mapIndex = index => {
        return networkAccounts[index] ? parseInt(index, 10) : null;
      };

      return Object.keys(networkAccounts).map(mapIndex);
    };

    return {
      id,
      name,
      avatar,
      pathIndexes: mapValues(networksAccounts, getPathIndexes),
    };
  };

  const runUpgrades = useCallback(async password => {
    const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
    if (storedWallets) {
      if (storedWallets.passwordRequired) {
        if (!password) {
          setLocked(true);
          return;
        }
        if (!('mnemonics' in storedWallets)) {
          storedWallets.wallets = await unlock(storedWallets.wallets, password);
          storedWallets.mnemonics = storedWallets.wallets.reduce(
            (m, wallet) => {
              m[wallet.address] = wallet.mnemonic;
              delete wallet.mnemonic;
              return m;
            },
            {},
          );
        } else {
          storedWallets.mnemonics = await unlock(
            storedWallets.mnemonics,
            password,
          );
        }
      } else if (!('mnemonics' in storedWallets)) {
        storedWallets.mnemonics = storedWallets.wallets.reduce((m, wallet) => {
          m[wallet.address] = wallet.mnemonic;
          delete wallet.mnemonic;
          return m;
        }, {});
      }

      const storedIndex = await storage.getItem(STORAGE_KEYS.ACTIVE);
      const activeWallet = storedWallets.wallets[storedIndex];
      const storedEndpoints = await storage.getItem(STORAGE_KEYS.ENDPOINTS);

      let newAccounts = [];
      let newMnemonics = {};
      let newAccountId;
      let newNetworkId;
      let newPathIndex;
      let newTrustedApps = {};
      let newTokens = {};

      const networks = await getNetworks();

      const grouped = invertBy(storedWallets.mnemonics);
      for (const [mnemonic, addresses] of Object.entries(grouped)) {
        let name;
        let avatar;
        let pathIndexes = {};

        for (const address of addresses) {
          const config = storedWallets.config?.[address];

          if (!name && config?.name) {
            name = config.name;
          }
          if (!avatar && config?.avatar) {
            avatar = config.avatar;
          }
          const wallet = storedWallets.wallets.find(w => w.address === address);
          const { path, chain } = wallet;

          const network = networks.find(
            ({ blockchain }) =>
              blockchain.toUpperCase() === chain.toUpperCase(),
          );

          const index = getPathIndex(path);
          if (!pathIndexes[network.id]) {
            pathIndexes[network.id] = [];
          }
          pathIndexes[network.id].push(index);

          if (config?.trustedApps) {
            if (newTrustedApps[network.id]) {
              Object.assign(newTrustedApps[network.id], config.trustedApps);
            } else {
              newTrustedApps[network.id] = { ...config.trustedApps };
            }
          }

          if (config?.tokens) {
            if (newTokens[network.id]) {
              Object.assign(newTokens[network.id], config.tokens);
            } else {
              newTokens[network.id] = { ...config.tokens };
            }
          }
        }

        const account = await AccountFactory.create({
          name,
          avatar,
          mnemonic,
          pathIndexes,
        });

        newAccounts.push(formatAccount(account));
        newMnemonics[account.id] = mnemonic;

        const current = Object.values(account.networksAccounts)
          .flat()
          .find(blockchainAccount => {
            const { path, network } = blockchainAccount;
            const { blockchain, environment } = network;
            const address = blockchainAccount.getReceiveAddress();
            return (
              path === activeWallet.path &&
              address === activeWallet.address &&
              environment === storedEndpoints[blockchain.toUpperCase()]
            );
          });
        if (current) {
          newAccountId = account.id;
          newNetworkId = current.network.id;
          newPathIndex = getPathIndex(current.path);
        }
      }

      if (!newAccountId || !newNetworkId || !newPathIndex) {
        const account = newAccounts[0];

        newAccountId = account.id;
        newNetworkId = Object.keys(account.pathIndexes)[0];
        newPathIndex = account.pathIndexes[newNetworkId].find(Number.isInteger);
      }

      if (storedWallets.passwordRequired) {
        newMnemonics = await lock(newMnemonics, password);
      }
      await storage.setItem(STORAGE_KEYS.MNEMONICS, newMnemonics);
      await storage.setItem(STORAGE_KEYS.ACCOUNTS, newAccounts);
      await storage.setItem(STORAGE_KEYS.ACCOUNT_ID, newAccountId);
      await storage.setItem(STORAGE_KEYS.NETWORK_ID, newNetworkId);
      await storage.setItem(STORAGE_KEYS.PATH_INDEX, newPathIndex);
      await storage.setItem(STORAGE_KEYS.TRUSTED_APPS, newTrustedApps);
      await storage.setItem(STORAGE_KEYS.TOKENS, newTokens);

      await storage.removeItem(STORAGE_KEYS.WALLETS);
      await storage.removeItem(STORAGE_KEYS.ACTIVE);
      await storage.removeItem(STORAGE_KEYS.ENDPOINTS);
    }

    // STORAGE_KEYS.PENDING_TXS
  }, []);

  useEffect(() => {
    stash.setItem('active_at', new Date());
  }, []);

  const checkPassword = async password => {
    try {
      const storedMnemonics = await storage.getItem(MNEMONICS);
      await unlock(storedMnemonics, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const lockAccounts = async () => {
    setLocked(true);
    await stash.removeItem('password');
  };

  const unlockAccounts = useCallback(
    async password => {
      try {
        await runUpgrades(password);

        const storedMnemonics = await storage.getItem(STORAGE_KEYS.MNEMONICS);
        setMnemonics(await unlock(storedMnemonics, password));
        setLocked(false);

        await stash.setItem('password', password);

        return true;
      } catch (error) {
        console.warn(error);
        return false;
      }
    },
    [runUpgrades],
  );

  useEffect(() => {
    const load = async () => {
      await runUpgrades();

      const storedMnemonics = await storage.getItem(STORAGE_KEYS.MNEMONICS);
      if (storedMnemonics) {
        const storedAccounts = await storage.getItem(STORAGE_KEYS.ACCOUNTS);

        setAccounts(await AccountFactory.createMany(storedAccounts));
        setAccounId(await storage.getItem(STORAGE_KEYS.ACCOUNT_ID));
        setNetworkId(await storage.getItem(STORAGE_KEYS.NETWORK_ID));
        setPathIndex(await storage.getItem(STORAGE_KEYS.PATH_INDEX));
        setTrustedApps(await storage.getItem(STORAGE_KEYS.TRUSTED_APPS));
        setTokens(await storage.getItem(STORAGE_KEYS.TOKENS));

        if (!storedMnemonics.encrypted) {
          setMnemonics(storedMnemonics);
          setRequiredLock(false);
        } else {
          setRequiredLock(true);

          let result = false;
          const password = await stash.getItem('password');
          if (password) {
            result = await unlockAccounts(password);
          }
          if (!result) {
            setLocked(true);
          }
        }
      }

      setReady(true);
    };

    load();
  }, [runUpgrades, unlockAccounts]);

  const findAccount = useCallback(
    targetId => accounts.find(({ id }) => id === targetId),
    [accounts],
  );

  const activeAccount = useMemo(
    () => findAccount(accountId),
    [findAccount, accountId],
  );

  const activeBlockchainAccount = useMemo(
    () => activeAccount?.networksAccounts?.[networkId]?.[pathIndex],
    [activeAccount, networkId, pathIndex],
  );

  const activeTrustedApps = useMemo(
    () => trustedApps[networkId] || {},
    [trustedApps, networkId],
  );

  const activeTokens = useMemo(
    () => tokens[networkId] || {},
    [tokens, networkId],
  );

  const {
    ACCOUNTS,
    MNEMONICS,
    ACCOUNT_ID,
    NETWORK_ID,
    PATH_INDEX,
    TRUSTED_APPS,
    TOKENS,
  } = STORAGE_KEYS;

  const changeAccount = async targetId => {
    if (accountId !== targetId) {
      const account = findAccount(targetId);
      if (account) {
        setAccounId(targetId);
        setPathIndex(getDefaultPathIndex(account, networkId));

        await storage.setItem(ACCOUNT_ID, targetId);
        await storage.setItem(PATH_INDEX, 0);
      }
    }
  };

  const changeNetwork = async targetId => {
    if (networkId !== targetId) {
      const { networksAccounts } = activeAccount;
      if (Object.keys(networksAccounts).includes(targetId)) {
        setNetworkId(targetId);
        setPathIndex(getDefaultPathIndex(activeAccount, targetId));

        await storage.setItem(NETWORK_ID, targetId);
        await storage.setItem(PATH_INDEX, 0);
      }
    }
  };

  const changePathIndex = async targetIndex => {
    if (pathIndex !== targetIndex) {
      const blockchainsAccounts = activeAccount.networksAccounts[networkId];
      if (targetIndex >= 0 && targetIndex < blockchainsAccounts.length) {
        setPathIndex(targetIndex);

        await storage.setItem(PATH_INDEX, targetIndex);
      }
    }
  };

  const addAccount = async (account, password) => {
    const newAccounts = [...accounts, account];
    const newMnemonics = { ...mnemonics, [account.id]: account.mnemonics };
    const newNetworkId = networkId || Object.keys(account.networksAccounts)[0];

    setAccounts(newAccounts);
    setMnemonics(newMnemonics);
    setAccounId(account.id);
    setNetworkId(newNetworkId);
    setPathIndex(getDefaultPathIndex(account, newNetworkId));

    await storage.setItem(MNEMONICS, await lock(newMnemonics, password));
    await storage.setItem(ACCOUNTS, newAccounts.map(formatAccount));
    await storage.setItem(ACCOUNT_ID, account.Id);
    await storage.setItem(NETWORK_ID, newNetworkId);
    await storage.setItem(PATH_INDEX, 0);
  };

  const editAccount = async (targetId, { name, avatar }) => {
    const index = accounts.findIndex(({ id }) => id === targetId);
    if (index >= 0) {
      const newAccounts = [...accounts];
      const newAccount = { ...accounts[index] };
      if (name) {
        newAccount.name = name;
      }
      if (avatar) {
        newAccount.avatar = avatar;
      }
      newAccounts[index] = newAccount;
      setAccounts(newAccounts);
      await storage.setItem(ACCOUNTS, newAccounts.map(formatAccount));
    }
  };

  const removeAccount = async (targetId, password) => {
    const newAccounts = accounts.filter(({ id }) => id !== targetId);
    if (newAccounts.length === 0) {
      await removeAllAccounts();
    } else {
      const newMnemonics = omit(mnemonics, targetId);
      setMnemonics(newMnemonics);
      setAccounts(newAccounts);

      if (accountId === targetId) {
        const account = accounts.find(({ id }) => id !== targetId);

        setAccounId(account.Id);
        setPathIndex(getDefaultPathIndex(account, networkId));

        await storage.setItem(ACCOUNT_ID, account.Id);
        await storage.setItem(PATH_INDEX, 0);
      }

      await storage.setItem(ACCOUNTS, newAccounts.map(formatAccount));
      await storage.setItem(MNEMONICS, await lock(newMnemonics, password));
    }
  };

  const removeAllAccounts = async () => {
    await storage.removeItem(ACCOUNTS);
    await storage.removeItem(MNEMONICS);
    await storage.removeItem(ACCOUNT_ID);
    await storage.removeItem(NETWORK_ID);
    await storage.removeItem(PATH_INDEX);
    await storage.removeItem(TRUSTED_APPS);
    await storage.removeItem(TOKENS);

    setLocked(false);
    setRequiredLock(false);
    setAccounts([]);
    setMnemonics({});
    setAccounId(null);
    setNetworkId(null);
    setPathIndex(0);
    setTrustedApps({});
    setTokens({});
  };

  const addTrustedApp = async (domain, { name, icon } = {}) => {
    const newTrustedApps = { ...trustedApps };
    merge(newTrustedApps, { [networkId]: { [domain]: { name, icon } } });
    await storage.setItem(TRUSTED_APPS, newTrustedApps);
    setTrustedApps(newTrustedApps);
  };
  const removeTrustedApp = async domain => {
    const newTrustedApps = { ...trustedApps };
    delete newTrustedApps[networkId][domain];
    await storage.setItem(TRUSTED_APPS, newTrustedApps);
    setTrustedApps(newTrustedApps);
  };

  const importTokens = async (tokenList = []) => {
    const importedTokens = tokenList
      .filter(({ address }) => address)
      .reduce(
        (obj, token) => ({ ...obj, [token.address]: omit(token, 'address') }),
        {},
      );

    const newTokens = { ...tokens };
    merge(newTokens, { [networkId]: importedTokens });
    await storage.setItem(TOKENS, newTokens);
    setTokens(newTokens);
  };

  return [
    {
      ready,
      locked,
      requiredLock,
      accounts,
      accountId,
      networkId,
      pathIndex,
      activeAccount,
      activeBlockchainAccount,
      activeTrustedApps,
      activeTokens,
    },
    {
      checkPassword,
      lockAccounts,
      unlockAccounts,
      changeAccount,
      changeNetwork,
      changePathIndex,
      addAccount,
      editAccount,
      removeAccount,
      removeAllAccounts,
      addTrustedApp,
      removeTrustedApp,
      importTokens,
    },
  ];
};

export default useAccounts;
