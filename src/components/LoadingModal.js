import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import PropTypes from 'prop-types';
import Loading from './Loading';

const LoadingModal = props => {
  const { visible } = props;
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.loadingView}>
          <Loading size="large" />
        </View>
      </View>
    </Modal>
  );
};

LoadingModal.propTypes = {
  visible: PropTypes.bool,
};

export default React.memo(LoadingModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingView: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
