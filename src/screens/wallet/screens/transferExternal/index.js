import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { get } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Header,
  ICON_TYPES,
  Input,
  QRCodeScaner,
  Text,
} from 'src/components';
import theme from 'src/theme';
import { ImageAssets } from 'src/assets';
import { useVisible } from 'src/hooks';
import ConfirmModal from './components/ConfirmModal';
import { MessageBox, Utils } from 'src/utils';

const Conatiner = Platform.select({
  ios: View,
  android: KeyboardAvoidingView,
});

const TransferExternal = props => {
  const { navigation, route } = props;
  const [data, setData] = useState({});
  const [tokenData, setTokenData] = useState(get(route, 'params.token', {}));
  const { visible: scanVisible, show: showScan, hide: hideScan } = useVisible();
  const [inputSelection, setInputSelection] = useState(null);
  const {
    visible: confirmVisible,
    show: showConfirm,
    hide: hideConfirm,
  } = useVisible(false);
  const {
    visible: initLoading,
    hide: hideInit,
    show: showInit,
  } = useVisible(false);

  const confirmDisabled = useMemo(() => {
    if (!data.amount || !data.address) return true;
    const { valid, value } = Utils.parseNumberWithResult(data.amount);
    const { value: balanceValue } = Utils.parseNumberWithResult(
      tokenData.balance,
    );
    if (!valid) return true;
    if (value > balanceValue) return true;
  }, [data, tokenData]);

  const error = useMemo(() => {
    if (!data.amount) return '';
    const { valid, value } = Utils.parseNumberWithResult(data.amount);
    const { value: balanceValue } = Utils.parseNumberWithResult(
      tokenData.balance,
    );
    if (!valid) return 'Invalid amount';
    if (value > balanceValue) return 'Balance not enough';
    return '';
  }, [data, tokenData]);

  const onFocus = useCallback(() => {
    setInputSelection(null);
  }, []);

  const onBlur = useCallback(() => {
    setInputSelection({ start: 0, end: 0 });
  }, []);

  const onChangeTokens = useCallback(
    tokens => {
      const newTokenData = tokens.find(
        ({ asset }) => asset === tokenData.asset,
      );
      if (newTokenData) setTokenData(newTokenData);
    },
    [tokenData],
  );

  const onChangeData = useCallback(
    key => value => {
      setData(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onReceiveCode = useCallback(newAdd => {
    setData(prev => ({ ...prev, address: newAdd }));
  }, []);

  const onSuccess = useCallback(() => {
    navigation.goBack();
    MessageBox.showSuccess('Transfer successfully');
  }, [navigation]);

  const onPressMax = useCallback(() => {
    setData(prev => ({ ...prev, amount: tokenData.balance + '' }));
  }, [tokenData]);

  const renderScan = useCallback(() => {
    return (
      <Button
        icon={{ name: 'line-scan', type: ICON_TYPES.MATERIAL_COMMUNITY }}
        transparent
        style={styles.scanBtn}
        onPress={showScan}
      />
    );
  }, [showScan]);

  const renderRightAmount = useCallback(() => {
    return (
      <View style={styles.row}>
        <Text>{tokenData.asset}</Text>
        <Button
          title="All"
          transparent
          titleProps={{ color: theme.colors.button.primary, bold: true }}
          style={styles.allBtn}
          onPress={onPressMax}
        />
      </View>
    );
  }, [tokenData.asset, onPressMax]);

  return (
    <SafeAreaView style={styles.container}>
      <Header isLight title="SEND TO" navigation={navigation} />
      <Conatiner style={styles.body}>
        <ScrollView>
          <View style={styles.imgView}>
            <Image
              source={ImageAssets.tokens[tokenData.asset.toLowerCase()]}
              style={styles.img}
            />
          </View>
          {!!error && (
            <View style={styles.errorView}>
              <Text color="#fff" semibold center>
                {error}
              </Text>
            </View>
          )}
          <Text color="rgba(255,255,255, 0.9)">To Address</Text>
          <Input
            style={styles.input}
            renderRight={renderScan}
            value={data?.address}
            onChangeText={onChangeData('address')}
            selection={inputSelection}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Text color="rgba(255,255,255, 0.9)">Amount</Text>
          <Input
            style={[styles.input, { marginBottom: 5 }]}
            renderRight={renderRightAmount}
            value={data?.amount}
            onChangeText={onChangeData('amount')}
            keyboardType="numeric"
          />
          <View style={styles.row}>
            {initLoading && <ActivityIndicator size="small" color="#fff" />}
            <Text color="#fff"> Balance: {tokenData.balance}</Text>
          </View>

          <Button
            title="Confirm"
            titleProps={{ color: '#fff', semibold: true }}
            style={styles.confirmStyle}
            onPress={showConfirm}
            disabled={confirmDisabled}
            loading={initLoading}
          />
        </ScrollView>
      </Conatiner>
      <QRCodeScaner
        visible={scanVisible}
        onClose={hideScan}
        onReceiveCode={onReceiveCode}
      />
      <ConfirmModal
        onChangeTokens={onChangeTokens}
        visible={confirmVisible}
        onClose={hideConfirm}
        hideInitLoading={hideInit}
        showInit={showInit}
        data={data}
        tokenData={tokenData}
        onSuccess={onSuccess}
      />
    </SafeAreaView>
  );
};

TransferExternal.propTypes = {};

export default React.memo(TransferExternal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
  },
  imgView: {
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  scanBtn: {
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  confirmStyle: {
    height: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: '10%',
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorView: {
    marginTop: 20,
    backgroundColor: theme.colors.messageBox.error,
    borderRadius: 10,
    padding: 10,
  },
});
