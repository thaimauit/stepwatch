import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import useBlockchainWallet from './useBlockchainWallet';

const useBlockchainAccount = (autoInit = true) => {
  const wallet = useSelector(selectors.wallet.wallet);
  const walletPin = useSelector(selectors.common.walletPin);

  const { initAccount, loadingBalance, accountData, transfer } =
    useBlockchainWallet();

  useEffect(() => {
    if (wallet && walletPin && autoInit) init();
  }, [wallet, walletPin, autoInit, init]);

  const init = useCallback(
    (initPin, callback) => {
      initAccount(
        wallet,
        initPin,
        () => {
          if (callback) callback(false);
        },
        () => {
          callback(true);
        },
      );
    },
    [wallet, initAccount],
  );

  return {
    tokens: accountData.tokens || [],
    loadingBalance,
    transfer,
    init,
  };
};

export default useBlockchainAccount;
