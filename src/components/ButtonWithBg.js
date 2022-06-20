import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import { Icon } from './Icon';
import Loading from './Loading';
import Text from './Text';
import { ImageAssets } from 'src/assets';

const ButtonWithBg = props => {
  const {
    transparent,
    title,
    icon,
    children,
    onPress,
    loading,
    style,
    titleStyle,
    disabled,
    loadingColor,
    titleProps,
    borderRadius,
    ...rest
  } = props;

  const handlePressButton = () => {
    if (loading) return;
    onPress();
  };

  const renderButtonContent = () => {
    if (children) return children;
    if (title)
      return (
        <Text {...titleProps} style={[styles.content, titleStyle]}>
          {title}
        </Text>
      );

    if (icon) return <Icon {...icon} />;
  };

  const disabledStyle = { opacity: disabled ? 0.4 : 1 };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, disabledStyle, style]}
      onPress={handlePressButton}
      {...rest}>
      <View style={styles.background}>
        <Image
          source={ImageAssets.btnBg}
          style={[styles.imgBg, { borderRadius }]}
          resizeMode="cover"
        />
      </View>
      {renderButtonContent()}
      {loading && (
        <Loading
          style={styles.loading}
          color={loadingColor || theme.colors.text.primary}
        />
      )}
    </TouchableOpacity>
  );
};

ButtonWithBg.propTypes = {
  transparent: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.object,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  titleStyle: PropTypes.any,
  disabled: PropTypes.bool,
  titleProps: PropTypes.object,
  borderRadius: PropTypes.number,
};

ButtonWithBg.defaultProps = {
  transparent: false,
  loading: false,
  icon: null,
  disabled: false,
  onPress: () => {},
  titleProps: {},
  borderRadius: 10,
};

export default React.memo(ButtonWithBg);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.contentPadding,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: { marginLeft: 5 },
  content: {
    fontWeight: '500',
    fontSize: 14,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imgBg: {
    width: '100%',
    height: '100%',
  },
});
