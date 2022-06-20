import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useVisible } from 'src/hooks';
import { actions, selectors } from 'src/models';
import { Button } from 'src/components';
import constants from 'src/constants';
import TokenList from './tokenList';
import HistoryList from './historyList';
import CreateWalletModal from './CreateWalletModal';

const Funding = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wallet = useSelector(selectors.wallet.wallet);
  const [loading, setLoading] = useState(false);
  const fundings = useSelector(selectors.wallet.fundings);
  const {
    visible: createWalletModalVisible,
    show: showCreateWallet,
    hide: onCloseCreateWallet,
  } = useVisible(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(() => {
    setLoading(true);
    dispatch(
      actions.wallet.getFundingWallet(() => {
        setLoading(false);
      }),
    );
  }, [dispatch]);

  const onCreate = useCallback(() => {
    onCloseCreateWallet();
    navigation.navigate(constants.screens.CREATE_WALLET, {
      navigateTransfer: true,
    });
  }, [navigation, onCloseCreateWallet]);

  const onImport = useCallback(() => {
    onCloseCreateWallet();
    navigation.navigate(constants.screens.IMPORT_WALLET, {
      navigateTransfer: true,
    });
  }, [navigation, onCloseCreateWallet]);

  const onTransfer = useCallback(() => {
    if (!wallet.mnemonic) return showCreateWallet();
    navigation.navigate(constants.screens.TRANSFER_FUNDING, {
      isFromFunding: true,
    });
  }, [wallet, showCreateWallet, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TokenList
          list={fundings}
          onFetch={fetchData}
          loading={loading}
          notScroll
        />
        <HistoryList />
      </ScrollView>
      <Button
        title="Transfer"
        style={styles.transferBtn}
        titleProps={{ color: '#fff', semibold: true }}
        onPress={onTransfer}
        disabled
      />
      <CreateWalletModal
        visible={createWalletModalVisible}
        onClose={onCloseCreateWallet}
        onCreate={onCreate}
        onImport={onImport}
      />
    </View>
  );
};

Funding.propTypes = {};

export default React.memo(Funding);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '5%',
  },
  transferBtn: {
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
