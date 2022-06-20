import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';

const Header = props => {
  const {
    navigation,
    title,
    renderTitle,
    backIcon,
    leftButtons,
    rightButtons,
    onBack,
    withoutBack,
    titleStyle,
    isLight,
    hightlight,
    titleProps = {},
    isBlack,
  } = props;

  const renderCenter = () => {
    if (renderTitle) return renderTitle();
    if (title) {
      const isLightStyle = isLight ? { color: '#fff' } : {};
      return (
        <Text
          style={[styles.title, isLightStyle, titleStyle]}
          bold
          {...titleProps}>
          {title}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLeft
        leftButtons={leftButtons}
        backIcon={backIcon}
        onBack={onBack}
        navigation={navigation}
        withoutBack={withoutBack}
        isLight={isLight}
        hightlight={hightlight}
        isBlack={isBlack}
      />
      <View style={styles.content}>{renderCenter()}</View>
      <HeaderRight rightButtons={rightButtons} />
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  backIcon: PropTypes.object,
  leftButtons: PropTypes.array,
  rightButtons: PropTypes.array,
  onBack: PropTypes.func,
  withoutBack: PropTypes.bool,
  isLight: PropTypes.bool,
  hightlight: PropTypes.bool,
  titleProps: PropTypes.object,
};

Header.defaultProps = {
  backIcon: { name: 'keyboard-backspace' },
  leftButtons: [],
  rightButtons: [],
};

export { HeaderRight };

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    padding: 0,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    padding: 0,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleButtonStyle: {
    fontWeight: '500',
    fontSize: 16,
  },
});
