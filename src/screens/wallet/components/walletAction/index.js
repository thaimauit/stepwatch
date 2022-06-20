import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { SelectCoin } from 'src/components';
import { useVisible } from 'src/hooks';
import constants from 'src/constants';
import { ACTIONS, ACTION_KEYS } from './constants';
import ActionItem from './ActionItem';
import ReceiceModal from './ReceiceModal';

const WalletAction = props => {
  const { address, tokens, chainId } = props;
  const navigation = useNavigation();
  const [receiveVisible, setReceiveVisible] = useState(false);
  const {
    visible: selectCoinVisible,
    show: showSelectCoin,
    hide: hideSelectCoin,
  } = useVisible(false);

  const onCloseReceive = useCallback(() => {
    setReceiveVisible(false);
  }, []);

  const onPressItem = useCallback(
    item => {
      if (item.key === ACTION_KEYS.TRADE) {
        if (isEmpty(tokens)) return;
        return navigation.navigate(item.screen, { tokens, address, chainId });
      }
      if (address && item.key === ACTION_KEYS.RECEIVE)
        return setReceiveVisible(true);
      if (item.key === ACTION_KEYS.TRANSFER_OUT) return showSelectCoin();
      if (item.key === ACTION_KEYS.TRANSFER_IN)
        return navigation.navigate(constants.screens.TRANSFER_FUNDING);
    },
    [navigation, address, tokens, chainId, showSelectCoin],
  );

  const onSelectCoin = useCallback(
    token => {
      navigation.navigate(constants.screens.TRANSFER_EXTERNAL, { token });
    },
    [navigation],
  );

  const renderItem = useCallback(
    item => {
      return (
        <ActionItem data={item} onPressItem={onPressItem} key={item.key} />
      );
    },
    [onPressItem],
  );

  return (
    <View style={styles.container}>
      {ACTIONS.map(renderItem)}
      <ReceiceModal
        visible={receiveVisible}
        onClose={onCloseReceive}
        address={address}
      />
      <SelectCoin
        visible={selectCoinVisible}
        onClose={hideSelectCoin}
        onSelect={onSelectCoin}
      />
    </View>
  );
};

WalletAction.propTypes = {};

export default React.memo(WalletAction);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
