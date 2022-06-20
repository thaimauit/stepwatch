import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import theme from 'src/theme';

const OTPInput = props => {
  const { length, style, onChangeValue } = props;
  const [currentInput, setCurrentInput] = useState(0);
  const [value, setValue] = useState([]);

  useEffect(() => {
    onChangeValue(value.join(''));
  }, [value, onChangeValue]);

  useEffect(() => {
    if (!length) return;
    const initData = Array(length).fill('');
    setValue(initData);
  }, [length]);

  const inputList = useMemo(() => {
    const list = Array(length).fill(0);
    const refs = list.map((_, index) => {
      const ref = React.createRef();
      return { ref };
    });

    return refs;
  }, [length]);

  const handleFocus = useCallback(
    index => () => {
      if (index === length - 1) return;
      setCurrentInput(index);
      setValue(prevValue => {
        return [
          ...prevValue.slice(0, index),
          ...Array(length - 1 - index).fill(''),
        ];
      });
    },
    [length],
  );

  const onChangeText = useCallback(
    index => newValue => {
      const itemValue = newValue ? newValue[0] : '';
      const resValue = newValue.slice(1, length - index) || '';
      const resValueList = resValue.split('');
      setValue(prevValue => {
        return [
          ...prevValue.slice(0, index),
          itemValue,
          ...resValueList,
          ...prevValue.slice(index + 1 + resValue.length),
        ];
      });
      if (!newValue) return;
      const indexFocus = index + 1 + resValue.length;
      if (indexFocus < inputList.length)
        return inputList[indexFocus].ref.current.focus();
      else inputList[length - 1].ref.current.focus();
    },
    [inputList, length],
  );

  const onKeyPress = useCallback(
    index =>
      ({ nativeEvent: { key: keyValue } }) => {
        if (keyValue === 'Backspace')
          if (index > 0 && !value[index]) {
            const clearIndex = index - 1;
            inputList[clearIndex].ref.current.focus();
          }
      },
    [inputList, value],
  );

  const renderInputItem = ({ ref }, index) => {
    const itemValue = get(value, index, '');
    const isSelected = index === currentInput;
    const extraStyle = isSelected ? styles.selected : {};
    return (
      <TextInput
        key={index}
        autoFocus={index === 0}
        ref={ref}
        style={[styles.inputItem, extraStyle]}
        onFocus={handleFocus(index)}
        keyboardType="numeric"
        onChangeText={onChangeText(index)}
        value={itemValue}
        onKeyPress={onKeyPress(index)}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {inputList.map(renderInputItem)}
    </View>
  );
};
export default React.memo(OTPInput);

OTPInput.propTypes = {
  length: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeValue: PropTypes.func.isRequired,
};

OTPInput.defaultProps = {
  length: 6,
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    height: 35,
  },
  inputItem: {
    flex: 1,
    marginRight: 10,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    textAlign: 'center',
    color: '#000',
  },
  selected: {
    borderBottomColor: theme.colors.button.primary,
  },
});
