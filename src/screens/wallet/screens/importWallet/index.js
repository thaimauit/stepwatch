import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Header, PasscodeInput, Text } from 'src/components';
import theme from 'src/theme';
import { BlockchainUtils, MessageBox } from 'src/utils';
import { actions, selectors } from 'src/models';
import constants from 'src/constants';
import { get } from 'lodash';
import services from 'src/services';

const ImportWallet = props => {
  const { navigation, route } = props;
  const navigateTransfer = get(route, 'params.navigateTransfer');
  const [seeds, setSeeds] = useState('');
  const [passcodeVisible, setPasscodeVisible] = useState(false);
  const currentWallet = useRef('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const userAddress = useSelector(selectors.profile.userAddress);

  const seedArray = useMemo(() => {
    const trimText = seeds.replace(/\s+/g, ' ').trim();
    return trimText.split(' ');
  }, [seeds]);

  const importDisabled = useMemo(() => {
    return seedArray.length !== 12;
  }, [seedArray]);

  const onClosePasscode = useCallback(() => {
    setPasscodeVisible(false);
  }, []);

  const importWallet = useCallback(() => {
    const seedStr = seedArray.join(' ');

    setLoading(true);
    setTimeout(() => {
      const wallet = BlockchainUtils.wallet.importMnemonic(seedStr);
      setLoading(false);
      if (!wallet) return MessageBox.showError('Import fail');

      if (userAddress && wallet.address !== userAddress)
        return MessageBox.showError('Please import correct Seed Phrase');

      if (wallet) {
        currentWallet.current = wallet;
        setPasscodeVisible(true);
      }
    }, 500);
  }, [seedArray, userAddress]);

  const onFillCode = useCallback(
    async code => {
      setPasscodeVisible(false);
      const { mnemonic, privateKey, address, ...rest } = currentWallet.current;
      const encodeWallet = {
        mnemonic: BlockchainUtils.aes.encrypt(mnemonic, code),
        privateKey: BlockchainUtils.aes.encrypt(privateKey, code),
        address,
        ...rest,
      };

      setLoading(true);

      if (!userAddress) {
        const { success: isUpdateSuccess, error } =
          await services.user.updateWalletAddress(address);
        setLoading(false);
        if (!isUpdateSuccess)
          return MessageBox.showError(error?.msg || 'Import fail');
      }

      dispatch(actions.wallet.saveData({ wallet: encodeWallet }));
      navigation.navigate(constants.screens.WALLET, {
        createSuccess: true,
        navigateTransfer,
      });
      MessageBox.showSuccess('Import Success');
    },
    [navigation, dispatch, navigateTransfer, userAddress],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="IMPORT WALLET" />
      <View style={styles.body}>
        <View style={styles.content}>
          <Text>Seed Phrase</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Seed Phrase word and separate with space"
            onChangeText={setSeeds}
            multiline
          />
        </View>
        <Button
          title="IMPORT WALLET"
          style={styles.importBtn}
          onPress={importWallet}
          disabled={importDisabled}
          loading={loading}
        />
      </View>
      <PasscodeInput
        visible={passcodeVisible}
        onClose={onClosePasscode}
        secondStep
        onFillCode={onFillCode}
      />
    </SafeAreaView>
  );
};

ImportWallet.propTypes = {};

export default React.memo(ImportWallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
  },
  content: { flex: 1 },
  input: {
    height: '30%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    padding: theme.contentPadding,
    fontStyle: 'italic',
    paddingTop: 15,
    marginTop: 5,
  },
  importBtn: {
    backgroundColor: theme.colors.button.highlight,
    paddingVertical: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
});
