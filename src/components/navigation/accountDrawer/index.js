import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../../Text';

const AccountDrawer = () => {
  return (
    <View style={styles.container}>
      <Text>Account</Text>
    </View>
  );
};

AccountDrawer.propTypes = {};

export default React.memo(AccountDrawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
