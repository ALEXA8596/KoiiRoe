const ROE_PER_KOII = 1000000000;

const toMax3Decimals = (value) =>
  +parseFloat(String(+value)).toFixed(3);

const getKoiiFromRoe = (roe) =>
  toMax3Decimals(roe / ROE_PER_KOII);

const getDenominationFromMainUnit = (
  value,
  decimals
) => {
  return value * 10 ** decimals;
};

const getMainUnitFromDenomination = (
  value,
  decimals
) => {
  return value / 10 ** decimals;
};

const getRoeFromKoii = (koii) => koii * ROE_PER_KOII;

const getFullKoiiFromRoe = (roe) => roe / ROE_PER_KOII;

export {
    getKoiiFromRoe,
    getDenominationFromMainUnit,
    getMainUnitFromDenomination,
    getRoeFromKoii,
    getFullKoiiFromRoe,
}