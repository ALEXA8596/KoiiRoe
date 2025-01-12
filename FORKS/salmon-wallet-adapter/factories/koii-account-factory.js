'use strict';

const KoiiAccount = require('../services/koii/KoiiAccount.js');
const { generateKeyPair } = require('../services/seed-service');
const { SOL } = require('../constants/coin-types');
// import {K2_DEFAULT_DERIVATION_PATH } from "@_koii/sdk";

const create = async ({ network, mnemonic, index = 0 }) => {
  const path = `m/44'/${SOL}'/${index}'/0'`;
  // const path = K2_DEFAULT_DERIVATION_PATH;
  const keyPair = await generateKeyPair(mnemonic, path);
  return new KoiiAccount({ network, index, path, keyPair });
};

module.exports = { create };
