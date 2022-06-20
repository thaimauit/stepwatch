import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import Button from '../Button';
import { Icon } from '../Icon';

const HeaderLeft = props => {
  const {
    leftButtons,
    backIcon,
    onBack,
    navigation,
    withoutBack,
    isLight,
    hightlight,
    isBlack,
  } = props;

  const handleGoBack = () => {
    if (onBack) return onBack();
    navigation.goBack();
  };

  const renderButton = (button, index) => {
    const { title: buttonTitle, icon, titleStyle, onPress } = button;
    return (
      <Button
        key={index}
        style={styles.button}
        icon={icon}
        title={buttonTitle}
        titleStyle={[styles.titleButtonStyle, titleStyle]}
        onPress={onPress}
      />
    );
  };

  if (withoutBack) return <View style={styles.container} />;

  // const leftStyle = {
  //   backgroundColor: isLight
  //     ? theme.colors.button.primary
  //     : hightlight
  //     ? theme.colors.button.highlight
  //     : 'rgba(0,0,0,0.9)',
  // };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.leftIcon,
          {
            borderColor: isBlack
              ? '#000'
              : isLight
              ? '#fff'
              : theme.colors.button.primary,
          },
        ]}
        onPress={handleGoBack}>
        <Icon
          name="keyboard-arrow-left"
          size={30}
          color={
            isBlack ? '#000' : isLight ? '#fff' : theme.colors.button.primary
          }
        />
      </TouchableOpacity>
      {leftButtons.map(renderButton)}
    </View>
  );
};

HeaderLeft.propTypes = {
  leftButtons: PropTypes.array,
  backIcon: PropTypes.object,
};

HeaderLeft.defaultProps = {
  leftButtons: [],
  backIcon: { name: 'keyboard-backspace' },
};

export default React.memo(HeaderLeft);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    paddingVertical: 0,
    width: 35,
    height: 35,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.contentPadding,
    borderWidth: 1,
    borderColor: theme.colors.button.primary,
  },
  button: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  titleButtonStyle: {
    fontWeight: '500',
    fontSize: 16,
  },
});
