import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Text from './Text';

const Input = props => {
  const {
    style,
    inputStyle,
    rightTitle,
    renderRight,
    isPassword,
    isLight,
    ...inputProps
  } = props;
  const color = isLight ? '#fff' : '#000';
  return (
    <View style={[styles.container, style]}>
      <TextInput
        secureTextEntry={isPassword}
        style={[styles.input, { color }, inputStyle]}
        placeholderTextColor="rgba(255,255,255,.4)"
        {...inputProps}
      />
      {!!renderRight && renderRight()}
      {!!rightTitle && <Text secondary>{rightTitle}</Text>}
    </View>
  );
};

Input.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rightTitle: PropTypes.string,
  isPassword: PropTypes.bool,
  isLight: PropTypes.bool,
};

export default React.memo(Input);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,36,38,.15)',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    height: 35,
    flex: 1,
    padding: 0,
    marginRight: 10,
  },
});
