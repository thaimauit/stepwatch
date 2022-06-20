import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import theme from 'src/theme';
import { Icon, Image, Input, SelectCoin, Text } from 'src/components';
import { ImageAssets } from 'src/assets';

const TradePart = props => {
  const {
    isUp,
    balance,
    asset,
    exceptAsset,
    onChangeAmount,
    onSelectCoin,
    style,
    amount,
  } = props;
  const [selectCoinVisible, setSelectCoinVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    onAmountChange(amount);
  }, [amount, onAmountChange]);

  const onAmountChange = useCallback(
    newAmount => {
      if (!isUp) return;
      if (!newAmount) setAmountInput('');
    },
    [isUp],
  );

  const onCloseSelect = useCallback(() => setSelectCoinVisible(false), []);

  const onShowSelectCoin = useCallback(() => setSelectCoinVisible(true), []);

  const onEndEdit = useCallback(() => {
    onChangeAmount(amountInput);
  }, [amountInput, onChangeAmount]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerView}>
        <Text color="rgba(0,0,0,0.4)">{isUp ? 'From' : 'To (Estimate)'}</Text>
        {isUp && <Text color="rgba(0,0,0,0.4)">Balance {balance}</Text>}
      </View>
      <View style={styles.contentView}>
        {(isUp && (
          <Input
            style={styles.input}
            onChangeText={setAmountInput}
            value={amountInput}
            placeholder="0.0"
            placeholderTextColor="rgba(0,0,0,0.4)"
            onEndEditing={onEndEdit}
            keyboardType="numeric"
            inputStyle={{ fontSize: 18 }}
          />
        )) || (
          <Text style={styles.input} size={18}>
            {amount}
          </Text>
        )}
        <TouchableOpacity
          style={styles.rightContent}
          onPress={onShowSelectCoin}>
          {!!asset && (
            <Image
              style={styles.token}
              source={ImageAssets.tokens[asset.toLowerCase()]}
            />
          )}
          <Text bold size={15}>
            {`${asset} `}
          </Text>
          <Icon name="keyboard-arrow-down" size={20} />
        </TouchableOpacity>
      </View>
      <SelectCoin
        visible={selectCoinVisible}
        onClose={onCloseSelect}
        exceptAsset={exceptAsset}
        onSelect={onSelectCoin}
      />
    </View>
  );
};

TradePart.propTypes = {};

export default React.memo(TradePart);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: theme.contentPadding,
    backgroundColor: '#fff',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentView: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 0,
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  token: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});
