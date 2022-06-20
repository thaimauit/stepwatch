import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Button, Header, PasscodeInput, Text } from 'src/components';
import { BlockchainUtils, MessageBox, Utils } from 'src/utils';
import theme from 'src/theme';
import constants from 'src/constants';
import { actions } from 'src/models';
import InputMnemonic from './components/InputMnemonic';
import { get } from 'lodash';
import services from 'src/services';

const CreateWallet = props => {
  const { navigation, route } = props;
  const navigateTransfer = get(route, 'params.navigateTransfer');
  const [passcodeVisible, setPasscodeVisible] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const currentCode = useRef('');
  const [isInput, setIsInput] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const mnemonicList = useMemo(() => {
    if (!mnemonic) return [];
    return mnemonic.split(' ');
  }, [mnemonic]);

  useEffect(() => {
    setPasscodeVisible(true);
  }, []);

  const onCloseInput = useCallback(() => {
    setIsInput(false);
  }, []);

  const onClosePasscode = useCallback(() => {
    setPasscodeVisible(false);
    navigation.goBack();
  }, [navigation]);

  const onFillCode = useCallback(code => {
    setPasscodeVisible(false);
    currentCode.current = code;
    const newMnemonic = BlockchainUtils.wallet.generateMnemonic();
    setMnemonic(newMnemonic);
  }, []);

  const nextStep = useCallback(() => {
    setIsInput(true);
  }, []);

  const onConfirmInput = useCallback(async () => {
    setLoading(true);
    await Utils.delay(100);
    const data = BlockchainUtils.wallet.createAccount(
      mnemonic,
      currentCode.current,
    );
    if (!data) {
      setLoading(false);
      return MessageBox.showError('Fail');
    }

    const { success: isUpdateWalletSuccess } =
      await services.user.updateWalletAddress(data.address);
    setLoading(false);
    onCloseInput();
    if (!isUpdateWalletSuccess) return MessageBox.showError('Fail');

    MessageBox.showSuccess('Create wallet success');

    dispatch(
      actions.wallet.saveData({
        wallet: data,
      }),
    );
    navigation.navigate(constants.screens.WALLET, {
      createSuccess: true,
      navigateTransfer,
    });
  }, [mnemonic, navigation, dispatch, onCloseInput, navigateTransfer]);

  const renderMnemonic = useCallback((item, key) => {
    return (
      <View style={styles.mnemonic} key={key}>
        <Text color="rgba(0,0,0,0.3)">{key + 1}</Text>
        <Text color="rgba(0,0,0,0.9)">{`  ${item}`}</Text>
      </View>
    );
  }, []);

  if (isInput)
    return (
      <InputMnemonic
        onClose={onCloseInput}
        mnemonicList={mnemonicList}
        onConfirm={onConfirmInput}
        loading={loading}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Create New Wallet" />
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.content}>
            <Text center color="red">
              {
                "Don't risk losing your funds. Protect your wallet by saving your Seed Phrase in aplace you trust.\n"
              }
            </Text>
            <Text bold color="red" center>
              {
                "It's the only way to recover your wallet if you get locked out of the app or get a new device"
              }
            </Text>
            <View style={styles.mnemonicList}>
              <View>{mnemonicList.map(renderMnemonic)}</View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Button
        style={styles.submitBtn}
        title="I HAVE WRITE DOWN"
        onPress={nextStep}
      />
      <PasscodeInput
        visible={passcodeVisible}
        onClose={onClosePasscode}
        secondStep
        onFillCode={onFillCode}
      />
    </SafeAreaView>
  );
};

CreateWallet.propTypes = {};

export default React.memo(CreateWallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  content: {
    margin: theme.contentPadding,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: theme.contentPadding,
  },
  submitBtn: {
    backgroundColor: theme.colors.button.highlight,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    marginHorizontal: '10%',
    marginVertical: 15,
  },
  mnemonicList: {
    alignItems: 'center',
  },
  mnemonic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
});
