import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../Text';

export const TOAST_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const ToastView = props => {
  const { onHide, content, visible, delay = 4000, position, style } = props;

  const { top, bottom } = useSafeAreaInsets();
  const containerStyle = useMemo(() => {
    if (position === TOAST_POSITIONS.BOTTOM)
      return {
        bottom: 50 + bottom,
      };

    return {
      top: top + 50,
    };
  }, [position, bottom, top]);

  const timer = useRef();

  useEffect(() => {
    if (visible) handleHide();
  }, [visible, handleHide]);

  useEffect(() => {
    return () => {
      handleHide(true);
    };
  }, [handleHide]);

  const handleHide = useCallback(
    isDestroy => {
      clearTimeout(timer.current);
      timer.current = null;
      if (isDestroy) return onHide();
      timer.current = setTimeout(() => {
        onHide();
      }, delay);
    },
    [onHide, delay],
  );

  if (!visible) return <View />;

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Text color="#fff">{content}</Text>
    </View>
  );
};

ToastView.propTypes = {};

export default React.memo(ToastView);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
});
