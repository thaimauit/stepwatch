import { constants, ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import { BlockchainUtils, MessageBox } from 'src/utils';

const useTrade = ({ upToken, downToken, amount, slippageTolerancePercent }) => {
  const swap = useRef();
  const networks = useSelector(selectors.common.systemNetworks);
  const [tradeData, setTradeData] = useState({});
  const [loading, setLoading] = useState(false);
  const walletPin = useSelector(selectors.common.walletPin);
  const wallet = useSelector(selectors.wallet.wallet);
  const account = useRef();
  const tokenList = useRef();
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    if (!isEmpty(wallet)) initAccount(wallet);
  }, [wallet, initAccount]);

  useEffect(() => {
    if (!upToken || !downToken) return;
    updateTrade(upToken, downToken, amount, slippageTolerancePercent);
  }, [upToken, downToken, amount, updateTrade, slippageTolerancePercent]);

  const initAccount = useCallback(
    currentWallet => {
      const privateKey = BlockchainUtils.aes.decrypt(
        currentWallet.privateKey,
        walletPin,
      );
      account.current = new BlockchainUtils.Account({
        privateKey,
        name: currentWallet.name,
        provider: new ethers.providers.JsonRpcProvider(networks.rpcUrl),
      });
    },
    [walletPin, networks],
  );

  const updateTrade = useCallback(async (up, down, amt, percent) => {
    setTradeData({});
    setLoading(true);
    try {
      const data = await swap.current.setTrade(up, amt, down, percent);
      setLoading(false);
      setTradeData(data);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const init = useCallback(
    tokens => {
      tokenList.current = tokens;
      swap.current = new BlockchainUtils.Swap(tokens, networks.rpcUrl);
    },
    [networks],
  );

  const startTrade = useCallback(
    async callback => {
      setTradeLoading(true);
      const address = account.current.getAccountAddress();
      const inputSwap = swap.current.getInputSwap(address);
      const provider = new ethers.providers.JsonRpcProvider(networks.rpcUrl);
      try {
        const receiptSwapTrade =
          await BlockchainUtils.Account.isValidApproveBalance(
            upToken,
            address,
            BlockchainUtils.config.PANCAKE_ROUTER_ADDRESS,
            amount,
            tokenList.current,
            provider,
          ).then(async isValid => {
            if (!isValid)
              if (!inputSwap.isUpNativeToken) {
                const receiptApproveERC20 = await account.approveERC20(
                  upToken,
                  BlockchainUtils.config.PANCAKE_ROUTER_ADDRESS,
                  constants.MaxUint256,
                );
                if (!receiptApproveERC20.isSuccess)
                  throw Error('Can not approve erc20 to pancake router');
              } else throw Error('Balance is not enough');

            return account.current.swapTrade(inputSwap);
          });
        setTradeLoading(false);
        callback(receiptSwapTrade);
      } catch (e) {
        setTradeLoading(false);
        setTimeout(() => {
          MessageBox.showError(e.message || 'Fail. Please try again');
        }, 1000);
        callback({ isSuccess: false });
      }
    },
    [amount, upToken, networks],
  );

  return {
    init,
    tradeData,
    loading,
    startTrade,
    tradeLoading,
  };
};

export default useTrade;
