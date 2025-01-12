const { PublicKey } = require('@solana/web3.js');

/* eslint-disable prettier/prettier */
const SOL_DECIMALS = 6;
const SOL_SYMBOL = 'SOL';
const SOL_NAME = 'Solana';
const SOL_LOGO =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

const KOII_DECIMALS = 8;
const KOII_SYMBOL = 'KOII';
const KOII_NAME = 'Koii';
const KOII_LOGO =
  'https://raw.githubusercontent.com/koii-network/koii.X/main/.github/images/koii_logo.svg';
const KOII_ADDRESS = 'So11111111111111111111111111111111111111112';

const USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const NEAR_NAME = 'Near';

const BTC_LOGO = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png';

const ETH_ADDRESS = 'eth';
const ETH_DECIMALS = 9;
const ETH_SYMBOL = 'ETH';
const ETH_NAME = 'Ether';
const ETH_LOGO = 'https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const ME_PROGRAM_ID = "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K";

module.exports = {
  SOL_DECIMALS,
  SOL_SYMBOL,
  SOL_NAME,
  SOL_LOGO,
  SOL_ADDRESS,
  KOII_DECIMALS,
  KOII_SYMBOL,
  KOII_NAME,
  KOII_LOGO,
  KOII_ADDRESS,
  TOKEN_PROGRAM_ID,
  USDC_ADDRESS,
  NEAR_NAME,
  BTC_LOGO,
  ETH_ADDRESS,
  ME_PROGRAM_ID,
  ETH_DECIMALS,
  ETH_SYMBOL,
  ETH_NAME,
  ETH_LOGO
};
