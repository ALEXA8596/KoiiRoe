'use strict';

const http = require('axios');
const { SALMON_API_URL } = require('../../constants/environment');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');

const find = async (network, address, id) => {
  const connection = new Connection(network.config.nodeUrl, 'confirmed');
  // const url = `${SALMON_API_URL}/v1/${network.id}/account/${address}/transactions/${id}`;

  // const { data } = await http.get(url);
  const transaction = await connection.getParsedConfirmedTransaction(id);
  const data = {
    id: transaction.transaction.signatures[0],
    timestamp: transaction.blockTime,
    status: transaction.meta.err ? 'failed' : 'completed',
    fee: {
      amount: transaction.meta.fee,
      decimals: 9,
      symbol: 'KOII',
    },
    inputs: transaction.transaction.message.instructions
      .map(instruction => {
        if (instruction.parsed.type === 'transfer') {
          return {
            source: instruction.parsed.info.source,
            amount: instruction.parsed.info.lamports,
            mint: instruction.parsed.info.mint,
            decimals: 9,
            symbol: 'SOL',
            name: 'Wrapped SOL',
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            contract: 'So11111111111111111111111111111111111111112',
          };
        }
      })
      .filter(input => input !== undefined),
    outputs: transaction.transaction.message.instructions
      .map(instruction => {
        if (instruction.parsed.type === 'transfer') {
          return {
            destination: instruction.parsed.info.destination,
            amount: instruction.parsed.info.lamports,
            mint: instruction.parsed.info.mint,
            decimals: 9,
            symbol: 'SOL',
            name: 'Wrapped SOL',
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            contract: 'So11111111111111111111111111111111111111112',
          };
        }
      })
      .filter(output => output !== undefined),
  };

  return data;
};

const list = async (network, address, paging) => {
  const connection = new Connection(network.config.nodeUrl, 'confirmed');
  const publicKey = new PublicKey(address);

  // Fetch transaction signatures
  const signatures = await connection.getConfirmedSignaturesForAddress2(
    publicKey,
    {
      limit: 25,
    },
  );

  const transactions = await connection.getParsedConfirmedTransactions(
    signatures.map(signature => signature.signature),
  );
  console.log(transactions);

  let type = 'unknown';
  const parsedTransactions = transactions
    .map(transaction => {
      if (
        transaction &&
        // transaction.transaction &&
        transaction.transaction.message
      ) {
        const {
          transaction: { message, signatures },
          meta,
        } = transaction;
        const inputs = [];
        const outputs = [];

        message.instructions.forEach(async instruction => {
          console.log(instruction);
          if (
            // instruction.hasOwnProperty('program') &&
            // (instruction.program === 'spl-token' || instruction.program === 'system')
            true
          ) {
            const parsed = instruction.parsed;
            if (parsed.type === 'transfer') {
              const source = parsed.info.source;
              const destination = parsed.info.destination;
              const amount = parsed.info.lamports;
              const mint = parsed.info.mint;

              if (destination === publicKey.toString()) {
                const { data } =
                  /* source !== 'So11111111111111111111111111111111111111112'
                    ? await http.get(
                        'https://kpltoken.api.koii.network/api/metadata/retrieveOne?splTokenAddress=' +
                          source +
                          '&networkConfiguration=https://mainnet.koii.network',
                      )
                    : */ {
                    data: {
                      decimals: 9,
                      symbol: 'SOL',
                      name: 'Wrapped SOL',
                      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
                      contract: 'So11111111111111111111111111111111111111112',
                    },
                  };
                inputs.push({
                  source,
                  amount,
                  mint,
                  decimals: data.decimals || undefined,
                  symbol: data.symbol || undefined,
                  name: data.name || undefined,
                  logo: data.logoURI || undefined,
                  contract: data.address,
                });
                type = 'receive';
              } else if (source === publicKey.toString()) {
                const { data } =
                  source !== 'So11111111111111111111111111111111111111112'
                    ? await http.get(
                        'https://kpltoken.api.koii.network/api/metadata/retrieveOne?splTokenAddress=' +
                          source +
                          '&networkConfiguration=https://mainnet.koii.network',
                      )
                    : {
                        data: {
                          decimals: 9,
                          symbol: 'SOL',
                          name: 'Wrapped SOL',
                          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
                          contract:
                            'So11111111111111111111111111111111111111112',
                        },
                      };
                outputs.push({
                  destination,
                  amount,
                  mint,
                  decimals: data.decimals || undefined,
                  symbol: data.symbol || undefined,
                  name: data.name || undefined,
                  logo: data.logoURI || undefined,
                  contract: data.address,
                });
                type = 'send';
              }
            }
          }
        });

        const fee = meta.fee;

        const status = meta.err ? 'failed' : 'completed';
        console.log(type);
        return {
          id: signatures[0],
          timestamp: transaction.blockTime,
          status,
          type,
          inputs,
          outputs,
          fee: {
            amount: fee,
            decimals: 9,
            symbol: 'KOII',
          },
        };
      }
    })
    .filter(tx => tx !== undefined);

  console.log(parsedTransactions);

  return { data: parsedTransactions };
  // const { nextPageToken, pageSize } = paging || {};

  // const url = `${SALMON_API_URL}/v1/${network.id}/account/${address}/transactions`;

  // const params = {};
  // if (nextPageToken) {
  //   params.pageToken = nextPageToken;
  // }
  // if (pageSize) {
  //   params.pageSize = pageSize;
  // }

  // const { data } = await http.get(url, { params });

  // return data;
};

module.exports = { find, list };
