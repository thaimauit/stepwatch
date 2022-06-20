import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import {
  Button,
  LoadingModal,
  PasscodeInput,
  Text,
  TOAST_POSITIONS,
} from 'src/components';
import { actions, selectors } from 'src/models';
import constants from 'src/constants';
import { useBlockchainWallet } from 'src/hooks';
import theme from 'src/theme';
import { BlockchainUtils, Toast } from 'src/utils';
import TokenList from './tokenList';
import WalletAction from './walletAction';
import { useIsFocused } from '@react-navigation/native';

const Wallet = props => {
  const dispatch = useDispatch();
  const { onChangeTab } = props;
  const wallet = useSelector(selectors.wallet.wallet);
  const walletPin = useSelector(selectors.common.walletPin);
  const [passcodeVisible, setPasscodeVisible] = useState(false);
  const {
    loading,
    initAccount,
    systemNetworkError,
    accountData,
    getBalance,
    loadingBalance,
  } = useBlockchainWallet();
  const isFocused = useIsFocused();

  const bnbValue = useMemo(() => {
    const tokens = get(accountData, 'tokens', []);
    const bnbToken = tokens.find(({ asset }) => asset === 'BNB');
    return bnbToken?.balance || '0';
  }, [accountData]);

  useEffect(() => {
    if (wallet && wallet.privateKey) onInitWallet();
  }, [wallet, onInitWallet]);

  useEffect(() => {
    if (isFocused) onFocus();
  }, [isFocused, onFocus]);

  const onFocus = useCallback(() => {
    const tokens = get(accountData, 'tokens', []);
    if (isEmpty(tokens)) return;
    getBalance();
  }, [accountData, getBalance]);

  const onInitWallet = useCallback(() => {
    if (!walletPin) return setPasscodeVisible(true);
    onFillCode(walletPin);
  }, [walletPin, onFillCode]);

  const loadSystem = useCallback(() => {
    dispatch(actions.common.getSystemNetworks());
  }, [dispatch]);

  const onClosePasscode = useCallback(() => {
    setPasscodeVisible(false);
    onChangeTab(constants.common.WALLET_TYPES.FUNDING);
  }, [onChangeTab]);

  const onFillCode = useCallback(
    code => {
      if (!walletPin) dispatch(actions.common.saveData({ walletPin: code }));
      setPasscodeVisible(false);

      initAccount(wallet, code, () => {
        onChangeTab(constants.common.WALLET_TYPES.FUNDING);
        dispatch(actions.common.saveData({ walletPin: '' }));
        Toast.show('Invalid code');
      });
    },
    [wallet, onChangeTab, initAccount, walletPin, dispatch],
  );

  const copyAddress = useCallback(() => {
    Clipboard.setString(accountData.address);
    Toast.show('Copied', TOAST_POSITIONS.TOP);
  }, [accountData]);

  return (
    <View style={styles.container}>
      {systemNetworkError && (
        <View style={styles.errorView}>
          <Text color="#fff" center onPress={loadSystem}>
            System error. Click here to try again
          </Text>
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loadingBalance} onRefresh={getBalance} />
        }>
        {!!accountData.address && (
          <>
            <Text bold italic size={20} color="#fff" center>
              {'\n'}
              {bnbValue} BNB {'\n'}
            </Text>
            <View style={styles.addressView}>
              <Text color="#fff">
                {BlockchainUtils.utils.formatAddress(accountData.address)}
              </Text>
              <Button
                transparent
                icon={{ name: 'file-copy', color: theme.colors.button.primary }}
                onPress={copyAddress}
              />
            </View>
          </>
        )}

        <WalletAction
          address={accountData?.address}
          tokens={accountData?.tokens}
          chainId={accountData?.chainId}
        />

        <TokenList
          list={accountData.tokens}
          onFetch={getBalance}
          loading={loadingBalance}
          isWallet
          notScroll
        />
      </ScrollView>
      <PasscodeInput
        visible={passcodeVisible}
        onClose={onClosePasscode}
        onFillCode={onFillCode}
      />
      <LoadingModal visible={loading && isFocused} />
    </View>
  );
};

Wallet.propTypes = {};

export default React.memo(Wallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.contentPadding,
  },
  errorView: {
    backgroundColor: '#ed4337',
    marginVertical: theme.contentPadding,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
