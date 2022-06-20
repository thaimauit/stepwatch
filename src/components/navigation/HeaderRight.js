import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from '../Button';

const HeaderRight = props => {
  const { rightButtons } = props;

  const renderButton = (button, index) => {
    const { title: buttonTitle, icon, titleStyle, onPress } = button;
    return (
      <Button
        key={index}
        style={styles.button}
        icon={icon}
        title={buttonTitle}
        titleStyle={[styles.titleButtonStyle, titleStyle]}
        onPress={onPress}>
        {/* {image && <Image source={image} style={styles.image} />} */}
      </Button>
    );
  };

  return <View style={styles.container}>{rightButtons.map(renderButton)}</View>;
};

HeaderRight.propTypes = {
  rightButtons: PropTypes.array.isRequired,
};

export default React.memo(HeaderRight);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 0,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  titleButtonStyle: {
    fontWeight: '500',
    fontSize: 16,
  },
  image: {
    width: 20,
    height: 20,
  },
});
