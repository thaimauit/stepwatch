import apis from './apis';
import request from './request';

export const getFundding = () => {
  return request(apis.wallet.fundings);
};

export const withdrawToWallet = (asset, amount) => {
  return request(apis.wallet.withdraw, {
    method: 'POST',
    body: {
      asset,
      amount,
    },
  });
};
