import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from './Button';
import Text from './Text';
import theme from 'src/theme';

const ButtonWithDuration = props => {
  const { duration, onPress, style, buttonStyle, ...btnProps } = props;
  const [timer, setTimer] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if (timer === 0) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [timer]);

  const onBtnPress = useCallback(() => {
    if (onPress)
      onPress(() => {
        startTimer();
      });
  }, [onPress, startTimer]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTimer(duration);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === 0) return prev;
        return prev - 1;
      });
    }, 1000);
  }, [duration]);

  return (
    <View style={[styles.container, style]}>
      {(timer !== 0 && (
        <Text color={theme.colors.button.highlight} bold>
          {timer}s
        </Text>
      )) || (
        <Button
          transparent
          style={[styles.btn, buttonStyle]}
          titleStyle={{ color: theme.colors.button.highlight }}
          {...btnProps}
          onPress={onBtnPress}
        />
      )}
    </View>
  );
};

ButtonWithDuration.propTypes = {
  duration: PropTypes.number,
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ButtonWithDuration.defaultProps = {
  duration: 60,
};

export default React.memo(ButtonWithDuration);

const styles = StyleSheet.create({
  container: {},
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
