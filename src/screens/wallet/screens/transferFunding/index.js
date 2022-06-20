import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import {
  Button,
  Header,
  Icon,
  ICON_TYPES,
  Input,
  PasscodeInput,
  SelectCoin,
  Text,
} from 'src/components';
import theme from 'src/theme';
import { actions, selectors, types } from 'src/models';
import { ImageAssets } from 'src/assets';
import { useBlockchainAccount, useVisible } from 'src/hooks';
import { MessageBox, Utils } from 'src/utils';
import ConfirmModal from './components/ConfirmModal';
import services from 'src/services';

const Container = Platform.select({
  android: View,
  ios: KeyboardAvoidingView,
});

const WALLET_TYPES = {
  WALLET: {
    name: 'Wallet',
    key: 'WALLET',
  },
  FUNDING: {
    name: 'Funding',
    key: 'FUNDING',
  },
};

const TransferFunding = props => {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const isFromFunding = get(route, 'params.isFromFunding');
  const [topType, setTopType] = useState(
    isFromFunding ? WALLET_TYPES.FUNDING : WALLET_TYPES.WALLET,
  );
  const [bottomType, setBottomType] = useState(
    isFromFunding ? WALLET_TYPES.WALLET : WALLET_TYPES.FUNDING,
  );
  const fundings = useSelector(selectors.wallet.fundings);
  const fundingLoading = useSelector(
    selectors.common.loading(types.wallet.GET_FUNDING),
  );
  const [currentToken, setCurrentToken] = useState({});
  const [amount, setAmount] = useState('');
  const isFromWallet = useMemo(() => {
    return topType.key === 'WALLET';
  }, [topType]);
  const {
    visible: selectCoinVisible,
    show: selectCoin,
    hide: hideSelectCoin,
  } = useVisible(false);
  const {
    visible: confirmVisible,
    show: showConfirm,
    hide: hideConfirm,
  } = useVisible();
  const [est, setEst] = useState(0);
  const [estLoading, setEstLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const {
    visible: passcodeVisible,
    show: showPasscode,
    hide: hidePasscode,
  } = useVisible(false);

  const { loadingBalance, tokens, transfer, init } =
    useBlockchainAccount(false);

  const availableAmount = useMemo(() => {
    const list = isFromWallet ? tokens : fundings;
    if (isEmpty(list)) return 0;
    const token = list.find(({ asset }) => asset === currentToken.asset);
    if (!token) return 0;
    if (isFromWallet) return token.balance;
    return token.amount;
  }, [currentToken, isFromWallet, tokens, fundings]);

  const confirmDisabled = useMemo(() => {
    if (!amount) return true;
    const { valid, value } = Utils.parseNumberWithResult(amount);
    const { value: balanceValue } =
      Utils.parseNumberWithResult(availableAmount);
    if (!valid) return true;
    if (value > balanceValue) return true;
  }, [amount, availableAmount]);

  const error = useMemo(() => {
    if (!amount) return '';
    const { valid, value } = Utils.parseNumberWithResult(amount);
    const { value: balanceValue } =
      Utils.parseNumberWithResult(availableAmount);
    if (!valid) return 'Invalid amount';
    if (value > balanceValue) return 'Balance not enough';
    return '';
  }, [amount, availableAmount]);

  useEffect(() => {
    if (!isEmpty(fundings)) initToken(fundings);
  }, [fundings, initToken]);

  const onConfirm = useCallback(async () => {
    showConfirm();
    if (!isFromWallet) return;
    setEstLoading(true);
    const { isSuccess, value } = await transfer(
      true,
      currentToken.asset,
      currentToken.contractAddress,
      amount,
    );
    setEstLoading(false);
    if (!isSuccess) return hideConfirm();
    setEst(value);
  }, [currentToken, amount, transfer, hideConfirm, showConfirm, isFromWallet]);

  const onSubmitConfirm = useCallback(async () => {
    setConfirmLoading(true);

    if (!isFromWallet) {
      const { success, error: errorMsg } =
        await services.wallet.withdrawToWallet(currentToken.asset, amount);
      setConfirmLoading(false);
      if (!success) return MessageBox.showError(errorMsg?.msg || 'Fail');
      navigation.goBack();
      MessageBox.showSuccess('Transfer successfully');
      return;
    }

    const { isSuccess } = await transfer(
      false,
      currentToken.asset,
      currentToken.contractAddress,
      amount,
    );
    hideConfirm();
    setConfirmLoading(false);
    if (isSuccess) {
      navigation.goBack();
      MessageBox.showSuccess('Transfer successfully');
    }
  }, [currentToken, amount, transfer, hideConfirm, navigation, isFromWallet]);

  const initToken = useCallback(
    initFundings => {
      showPasscode();
      if (!isEmpty(currentToken)) return;
      setCurrentToken(initFundings[0]);
    },
    [currentToken, showPasscode],
  );

  const onSelectCoin = useCallback(newCoin => {
    setCurrentToken(newCoin);
  }, []);

  const onSwap = useCallback(() => {
    setTopType(bottomType);
    setBottomType(topType);
  }, [topType, bottomType]);

  const onPressAll = useCallback(() => {
    setAmount(availableAmount + '');
  }, [availableAmount]);

  const onFillCode = useCallback(
    code => {
      hidePasscode();
      init(code, isSuccess => {
        if (isSuccess) dispatch(actions.common.saveData({ walletPin: code }));
      });
    },
    [dispatch, init, hidePasscode],
  );

  const onHidePasscode = useCallback(() => {
    hidePasscode();
    navigation.goBack();
  }, [hidePasscode, navigation]);

  const renderRightAmount = useCallback(() => {
    return (
      <View style={styles.rowAmount}>
        <Text>{currentToken.asset}</Text>
        <Button
          transparent
          title="All"
          style={styles.allBtn}
          titleProps={{ color: theme.colors.messageBox.error, semibold: true }}
          onPress={onPressAll}
        />
      </View>
    );
  }, [currentToken, onPressAll]);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="TRANSFER" isLight />
      <Container style={styles.body} behavior="padding">
        <ScrollView>
          {!!error && (
            <View style={styles.errorView}>
              <Text color="#fff" semibold center>
                {error}
              </Text>
            </View>
          )}
          <View style={styles.walletTypeWrapper}>
            <View style={styles.walletTypeView}>
              <View style={styles.row}>
                <Text semibold size={16}>
                  {topType.name}
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text semibold size={16}>
                  {bottomType.name}
                </Text>
              </View>
            </View>
            <Button
              style={styles.swapBtn}
              icon={{ name: 'swap-vert' }}
              onPress={onSwap}
            />
          </View>
          <Text color="#fff">Token</Text>
          <TouchableOpacity style={styles.tokenView} onPress={selectCoin}>
            <Image
              source={
                currentToken.asset
                  ? ImageAssets.tokens[currentToken.asset.toLowerCase()]
                  : ImageAssets.placeholder
              }
              style={styles.tokenImg}
            />
            <Text style={styles.assetName} size={14}>
              {currentToken.asset}
            </Text>
            <Icon
              name="chevron-down-outline"
              type={ICON_TYPES.ION_ICON}
              size={25}
              color="rgba(0,0,0,0.6)"
            />
          </TouchableOpacity>
          <Text color="#fff">Amount</Text>
          <Input
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={setAmount}
            value={amount}
            renderRight={renderRightAmount}
          />
          <View style={styles.rowAmount}>
            {(fundingLoading || loadingBalance) && (
              <ActivityIndicator color="#fff" />
            )}
            <Text color="#fff"> Balance: {availableAmount}</Text>
          </View>
          <Button
            title="CONFIRM"
            style={styles.confirmStyle}
            titleProps={{ color: '#fff', semibold: true }}
            onPress={onConfirm}
            disabled={confirmDisabled}
          />
        </ScrollView>
      </Container>
      <SelectCoin
        visible={selectCoinVisible}
        onClose={hideSelectCoin}
        onSelect={onSelectCoin}
      />
      <ConfirmModal
        visible={confirmVisible}
        onClose={hideConfirm}
        estLoading={estLoading}
        confirmLoading={confirmLoading}
        est={est}
        tokenData={currentToken}
        amount={amount}
        onConfirm={onSubmitConfirm}
        isFromWallet={isFromWallet}
      />
      <PasscodeInput
        visible={passcodeVisible}
        onClose={onHidePasscode}
        onFillCode={onFillCode}
      />
    </SafeAreaView>
  );
};

TransferFunding.propTypes = {};

export default React.memo(TransferFunding);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
  },
  walletTypeWrapper: {
    borderRadius: 10,
    padding: theme.contentPadding,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: '5%',
  },
  walletTypeView: {
    flex: 1,
  },
  row: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  swapBtn: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  tokenView: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  tokenImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 5,
  },
  assetName: {
    flex: 1,
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  confirmStyle: {
    height: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: '15%',
  },
  rowAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginLeft: 5,
  },
  errorView: {
    marginTop: '5%',
    backgroundColor: theme.colors.messageBox.error,
    borderRadius: 10,
    padding: 10,
  },
});
