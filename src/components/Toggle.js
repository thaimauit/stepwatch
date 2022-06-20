import React from 'react';
import { Switch } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';

const Toggle = props => {
  const { value, onValueChange } = props;
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#767577', true: theme.colors.button.primary }}
      thumbColor={'#fff'}
      ios_backgroundColor={'#808080'}
    />
  );
};

Toggle.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
};

export default React.memo(Toggle);
