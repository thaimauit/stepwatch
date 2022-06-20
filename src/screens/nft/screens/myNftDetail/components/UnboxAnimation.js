import React from 'react';
import { View, StyleSheet, Modal, Image } from 'react-native';
import PropTypes from 'prop-types';
import { ImageAssets } from 'src/assets';

const UnboxAnimation = props => {
  const { visible } = props;

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <Image
          source={ImageAssets.unboxAnimation}
          style={styles.boxGif}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

UnboxAnimation.propTypes = {};

export default React.memo(UnboxAnimation);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  boxGif: {
    width: '100%',
    height: '100%',
  },
});
