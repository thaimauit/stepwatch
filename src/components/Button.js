import React from 'react';
import { TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import { Icon } from './Icon';
import Loading from './Loading';
import Text from './Text';

const Button = props => {
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

  const backgroundColor = transparent
    ? theme.colors.transparent
    : theme.colors.button.primary;

  const disabledStyle = { opacity: disabled ? 0.4 : 1 };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, disabledStyle, { backgroundColor }, style]}
      onPress={handlePressButton}
      {...rest}>
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

Button.propTypes = {
  transparent: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.object,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  titleStyle: PropTypes.any,
  disabled: PropTypes.bool,
  titleProps: PropTypes.object,
};

Button.defaultProps = {
  transparent: false,
  loading: false,
  icon: null,
  disabled: false,
  onPress: () => {},
  titleProps: {},
};

export default React.memo(Button);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.contentPadding,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  loading: { marginLeft: 5 },
  content: {
    fontWeight: '500',
    fontSize: 14,
  },
});
