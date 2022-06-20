import React from 'react';
import { View, StyleSheet, Modalt, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'src/components';
import ListUser from './ListUser';

const ListAllUser = props => {
  const { visible, onClose } = props;
  return (
    <Modal transparent visible={visible}>
      <SafeAreaView style={styles.container}>
        <Header onBack={onClose} isLight title="Invited Users" />
        <ListUser />
      </SafeAreaView>
    </Modal>
  );
};

ListAllUser.propTypes = {};

export default React.memo(ListAllUser);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
