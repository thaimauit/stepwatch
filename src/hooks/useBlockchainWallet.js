import { ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors, types } from 'src/models';
import { BlockchainUtils, Logger, MessageBox, Toast } from 'src/utils';

const useBlockchainWallet = () => {
  const dispatch = useDispatch();
  const loadingSystemNetwork = useSelector(
    selectors.common.loading(types.common.GET_NETWORKS),
  );
  const [loadingBalance, setLoadingBalance] = useState(false);
  const systemNetworks = useSelector(selectors.common.systemNetworks);
  const account = useRef();
  const [accountData, setAccountData] = useState({});
  const fundings = useSelector(selectors.wallet.fundings);

  const systemNetworkError = useMemo(() => {
    return !loadingSystemNetwork && isEmpty(systemNetworks);
  }, [systemNetworks, loadingSystemNetwork]);

  useEffect(() => {
    dispatch(actions.common.getSystemNetworks());
  }, [dispatch]);

  const getBalance = useCallback(async () => {
    setLoadingBalance(true);
    const tokenBalance = await account.current.getArrTokenBalance(fundings);
    const chainId = account.current.getChainId();
    setAccountData(prev => ({ ...prev, tokens: tokenBalance, chainId }));
    setLoadingBalance(false);
  }, [fundings]);

  const initAccount = useCallback(
    (wallet, code, onFail, onSuccess) => {
      const privateKey = BlockchainUtils.aes.decrypt(wallet.privateKey, code);
      if (!privateKey) {
        Toast.show('Invalid key');
        if (onFail) onFail();
        return;
      }
      account.current = new BlockchainUtils.Account({
        privateKey: privateKey,
        name: wallet.name,
        provider: new ethers.providers.JsonRpcProvider(systemNetworks.rpcUrl),
      });

      const address = account.current.getAccountAddress();
      setAccountData({
        address,
      });

      getBalance();

      if (onSuccess) onSuccess();
    },
    [systemNetworks, getBalance],
  );

  const transfer = useCallback(
    async (isEstimate, asset, address, amount) => {
      if (isEmpty(accountData.tokens))
        return {
          isSuccess: false,
        };
      try {
        const result = await account.current.transferERC20(
          isEstimate,
          accountData.tokens,
          asset,
          address,
          amount,
        );
        if (isEstimate)
          return {
            isSuccess: true,
            value: result,
          };
        return result;
      } catch (e) {
        MessageBox.showError(e?.message || 'Fail');
        return {
          isSuccess: false,
        };
      }
    },
    [accountData],
  );

  return {
    systemNetworkError,
    initAccount,
    accountData,
    loading: loadingSystemNetwork,
    getBalance,
    loadingBalance,
    transfer,
  };
};

export default useBlockchainWallet;
