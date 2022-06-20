import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { ImageAssets } from 'src/assets';
import Text from './Text';

const EmptyData = () => {
  return (
    <View style={styles.container}>
      <Image
        source={ImageAssets.nodata}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text color="rgba(255,255,255,0.5)" bold size={15}>
        {'No Data'}
      </Text>
    </View>
  );
};

EmptyData.propTypes = {};

export default React.memo(EmptyData);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: 'rgba(255,255,255,0.5)',
  },
});
