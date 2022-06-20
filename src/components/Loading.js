import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';

const Loading = props => {
  const { style, size, color } = props;
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
};

Loading.defaultProps = {
  size: 'small',
  color: '#000',
};

export default React.memo(Loading);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
