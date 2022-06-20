import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../Text';

const WalletDrawer = () => {
  return (
    <View style={styles.container}>
      <Text>Wallet</Text>
    </View>
  );
};

WalletDrawer.propTypes = {};

export default React.memo(WalletDrawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
