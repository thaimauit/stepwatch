import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get, isEmpty } from 'lodash';
import {
  Button,
  Header,
  Icon,
  ICON_TYPES,
  LoadingModal,
  Text,
} from 'src/components';
import theme from 'src/theme';
import { useTrade } from 'src/hooks';
import TradePart from './components/TradePart';
import PercentSetting from './components/PercentSetting';
import { MessageBox, Utils } from 'src/utils';

const DEFAULT_UP = 'BNB';
const DEFAULT_DOWN = 'WSS';

const Trade = props => {
  const { navigation, route } = props;
  const tokens = get(route, 'params.tokens', []);
  const address = get(route, 'params.address', '');
  const chainId = get(route, 'params.chainId', '');
  const [upData, setUpData] = useState({});
  const [downData, setDownData] = useState({});
  const [tradeInput, setTradeInput] = useState({
    amount: '',
    slippageTolerancePercent: '0.5',
  });
  const [percentVisible, setPercentVisible] = useState(false);
  const [error, setError] = useState('');

  const {
    tradeData,
    init: initTrade,
    loading,
    startTrade,
    tradeLoading,
  } = useTrade({
    upToken: upData.asset,
    downToken: downData.asset,
    amount: tradeInput.amount,
    slippageTolerancePercent: tradeInput.slippageTolerancePercent,
  });

  const btnDisabled = useMemo(
    () => !!error || !tradeInput.amount || !upData.balance,
    [error, upData.balance, tradeInput.amount],
  );

  useEffect(() => {
    if (!tradeInput.amount || !upData.balance) return setError('');
    const { valid, value: amountValue } = Utils.parseNumberWithResult(
      tradeInput.amount,
    );
    if (!valid) return setError('Invalid Amount');
    const { value: balanceAmount } = Utils.parseNumberWithResult(
      upData.balance,
    );
    if (amountValue > balanceAmount) return setError('Balance not enough');
    setError('');
  }, [upData.balance, tradeInput.amount]);

  useEffect(() => {
    init(tokens);
  }, [init, tokens]);

  const onTrade = useCallback(() => {
    startTrade(response => {
      if (response?.isSuccess) {
        navigation.goBack();
        return MessageBox.showSuccess('Trade successfully!!');
      }
    });
  }, [navigation, startTrade]);

  const init = useCallback(
    tokenList => {
      if (isEmpty(tokenList)) return;
      const list = tokenList.map(token => ({ ...token, chainId }));
      initTrade(list, address);
      let defaultUp = list.find(item => item.asset === DEFAULT_UP);
      if (!defaultUp) defaultUp = list[0];
      let defaultDown = list.find(item => item.asset === DEFAULT_DOWN);
      if (!defaultDown)
        defaultDown = list.find(item => item.asset !== defaultUp.asset);
      setUpData(defaultUp);
      setDownData(defaultDown);
    },
    [initTrade, address, chainId],
  );

  const onChangeUpAmount = useCallback(amount => {
    setTradeInput(prev => ({ ...prev, amount }));
  }, []);

  const onSelectUp = useCallback(
    newUp => {
      const newUpData = tokens.find(item => item.asset === newUp.asset);
      setUpData(newUpData);
    },
    [tokens],
  );

  const onSelectDown = useCallback(
    newDown => {
      const newDownData = tokens.find(item => item.asset === newDown.asset);
      setDownData(newDownData);
    },
    [tokens],
  );

  const onSwap = useCallback(() => {
    setTradeInput(prev => ({ ...prev, amount: '' }));
    setUpData(downData);
    setDownData(upData);
  }, [downData, upData]);

  const onShowPercentSetting = useCallback(() => {
    setPercentVisible(true);
  }, []);

  const onHidePercentSetting = useCallback(() => {
    setPercentVisible(false);
  }, []);

  const onSavePercent = useCallback(percent => {
    setTradeInput(prev => ({ ...prev, slippageTolerancePercent: percent }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="TRADE"
        titleProps={{ italic: true, color: '#fff' }}
        navigation={navigation}
        isLight
      />
      <View style={styles.body}>
        <ScrollView>
          <TradePart
            isUp
            balance={upData.balance}
            asset={upData.asset || ''}
            exceptAsset={downData.asset}
            amount={tradeInput.amount}
            onChangeAmount={onChangeUpAmount}
            onSelectCoin={onSelectUp}
            style={styles.tradePart}
          />
          <View style={styles.swapView}>
            <Button
              icon={{ name: 'swap-vert', color: '#fff' }}
              style={styles.swapBtn}
              onPress={onSwap}
            />
          </View>
          <TradePart
            asset={downData.asset || ''}
            exceptAsset={upData.asset}
            amount={tradeData.outAmount}
            onSelectCoin={onSelectDown}
            style={styles.tradePart}
          />
          <TouchableOpacity
            style={styles.percentView}
            onPress={onShowPercentSetting}>
            <Text color="rgba(255,255,255,0.6)">Slippage Tolerance</Text>
            <View style={styles.rightPercent}>
              <Text color="#fff" bold>
                {tradeInput.slippageTolerancePercent}%
              </Text>
              <Icon
                name="chevron-down"
                type={ICON_TYPES.ION_ICON}
                color="rgba(255,255,255,0.6)"
                size={25}
              />
            </View>
          </TouchableOpacity>
          {!!error && (
            <View style={styles.errorView}>
              <Text color="#fff" center>
                {error}
              </Text>
            </View>
          )}
          <Button
            title="Trade"
            titleProps={{ color: '#fff', bold: true, italic: true }}
            style={styles.tradeBtn}
            disabled={btnDisabled}
            onPress={onTrade}
            loading={tradeLoading}
          />
        </ScrollView>
      </View>
      <LoadingModal visible={loading || tradeLoading} />
      <PercentSetting
        visible={percentVisible}
        onClose={onHidePercentSetting}
        value={tradeInput.slippageTolerancePercent}
        onSave={onSavePercent}
      />
    </SafeAreaView>
  );
};

Trade.propTypes = {};

export default React.memo(Trade);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
  },
  tradePart: {
    // marginTop: 20,
  },
  swapView: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapBtn: {
    height: 50,
    width: 50,
    borderRadius: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  rightPercent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeBtn: {
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: 20,
  },
  errorView: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(242, 61, 41)',
    alignSelf: 'center',
  },
});
