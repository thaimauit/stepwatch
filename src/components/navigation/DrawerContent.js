import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import { Logger } from 'src/utils';
import AccountDrawer from './accountDrawer';
import WalletDrawer from './walletDrawer';

const DrawerContent = () => {
  const isAccountDrawer = useSelector(selectors.common.isAccountDrawer);
  Logger.info('isAccountDrawer', isAccountDrawer);

  if (isAccountDrawer) return <AccountDrawer />;
  return <WalletDrawer />;
};

DrawerContent.propTypes = {};

export default React.memo(DrawerContent);

const styles = StyleSheet.create({
  container: {},
});
