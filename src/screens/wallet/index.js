import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { Header, Icon, Text, ICON_TYPES } from 'src/components';
import theme from 'src/theme';
import constants from 'src/constants';
import { selectors } from 'src/models';
import Funding from './components/Funding';
import WalletCmp from './components/Wallet';
import CreateWalletModal from './components/CreateWalletModal';
import CreateWallet from './screens/createWallet';
import ImportWallet from './screens/importWallet';
import Trade from './screens/trade';
import TransferExternal from './screens/transferExternal';
import TransferFunding from './screens/transferFunding';
import { Toast } from 'src/utils';

const { width } = Dimensions.get('window');

const ICONS = {
  [constants.common.WALLET_TYPES.FUNDING]: {
    icon: {
      name: 'watch',
      size: 20,
    },
  },
  [constants.common.WALLET_TYPES.WALLET]: {
    icon: {
      name: 'account-balance-wallet',
      size: 20,
    },
  },
};

const COMPONENTS = {
  [constants.common.WALLET_TYPES.FUNDING]: Funding,
  [constants.common.WALLET_TYPES.WALLET]: WalletCmp,
};

const Wallet = props => {
  const { navigation, route } = props;

  const createSuccess = get(route, 'params.createSuccess');
  const navigateTransfer = get(route, 'params.navigateTransfer');

  const [currentType, setCurrentType] = useState(
    constants.common.WALLET_TYPES.FUNDING,
  );
  const [createWalletModalVisible, setCreateWalletModalVisible] =
    useState(false);

  const wallet = useSelector(selectors.wallet.wallet);

  useEffect(() => {
    if (createSuccess) setCurrentType(constants.common.WALLET_TYPES.WALLET);
  }, [createSuccess]);

  useEffect(() => {
    if (navigateTransfer) navigateTransferCallback();
  }, [navigateTransfer, navigateTransferCallback]);

  const navigateTransferCallback = useCallback(() => {
    navigation.navigate(constants.screens.TRANSFER_FUNDING, {
      isFromFunding: true,
    });
  }, [navigation]);

  const onPressSettings = useCallback(() => {}, []);

  const onPressTabItem = useCallback(
    item => () => {
      if (item === constants.common.WALLET_TYPES.WALLET)
        return Toast.show('Coming soon');
      // if (!wallet.mnemonic) {
      //   setCreateWalletModalVisible(true);
      //   return;
      // }

      setCurrentType(item);
    },
    [wallet],
  );

  const onCloseModal = useCallback(() => {
    setCreateWalletModalVisible(false);
  }, []);

  const onCreate = useCallback(() => {
    setCreateWalletModalVisible(false);
    navigation.navigate(constants.screens.CREATE_WALLET);
  }, [navigation]);

  const onImport = useCallback(() => {
    setCreateWalletModalVisible(false);
    navigation.navigate(constants.screens.IMPORT_WALLET);
  }, [navigation]);

  const renderWalletTypeItem = useCallback(
    item => {
      const isSelected = currentType === item;
      const itemStyle = isSelected ? styles.walletTypeSelected : {};
      return (
        <TouchableOpacity
          key={item}
          style={[styles.walletTypeItem, itemStyle]}
          onPress={onPressTabItem(item)}>
          <Icon {...ICONS[item].icon} color={'#fff'} />
          <Text color={'#fff'} italic size={15} bold style={styles.walletLabel}>
            {' '}
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [currentType, onPressTabItem],
  );

  const renderTitle = useCallback(() => {
    return (
      <View style={styles.walletTypeList}>
        {Object.values(constants.common.WALLET_TYPES).map(renderWalletTypeItem)}
      </View>
    );
  }, [renderWalletTypeItem]);

  const Container = COMPONENTS[currentType];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        isLight
        hightlight
        navigation={navigation}
        renderTitle={renderTitle}
        // rightButtons={[
        //   {
        //     icon: {
        //       name: 'settings',
        //       size: 25,
        //       color: '#fff',
        //     },
        //     onPress: onPressSettings,
        //   },
        // ]}
      />
      <Container onChangeTab={setCurrentType} />
      <CreateWalletModal
        visible={createWalletModalVisible}
        onClose={onCloseModal}
        onCreate={onCreate}
        onImport={onImport}
      />
    </SafeAreaView>
  );
};

Wallet.propTypes = {};

export { CreateWallet, ImportWallet, Trade, TransferExternal, TransferFunding };

export default React.memo(Wallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 8,
  },
  walletTypeList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    minHeight: 40,
    borderRadius: 40,
    width: 0.6 * width,
  },
  walletTypeItem: {
    flex: 1,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  walletTypeSelected: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    backgroundColor: theme.colors.button.primary,
  },
  walletLabel: {
    textTransform: 'capitalize',
  },
});
