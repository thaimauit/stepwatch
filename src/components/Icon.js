import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import theme from 'src/theme';

const ICON_TYPES = {
  FONT_AWESOME: 'fontAwesome',
  ION_ICON: 'ionIcon',
  MATERIAL_ICON: 'materialIcons',
  MATERIAL_COMMUNITY: 'MaterialCommunityIcons',
  ANT_DESIGN_ICON: 'antDesign',
};

const IconCmp = props => {
  const { name, size, color, type, ...rest } = props;

  let IconComponent = MaterialIcons;

  switch (type) {
    case ICON_TYPES.FONT_AWESOME:
      IconComponent = FontAwesome;
      break;
    case ICON_TYPES.ANT_DESIGN_ICON:
      IconComponent = AntDesignIcon;
      break;
    case ICON_TYPES.ION_ICON:
      IconComponent = Ionicons;
      break;
    case ICON_TYPES.MATERIAL_COMMUNITY:
      IconComponent = MaterialCommunityIcons;
      break;
    default:
      break;
  }
  return <IconComponent name={name} size={size} color={color} {...rest} />;
};

IconCmp.propTypes = {
  size: PropTypes.number,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
};

IconCmp.defaultProps = {
  size: 20,
  color: theme.colors.text.primaryBlur,
};

const Icon = React.memo(IconCmp);

export { Icon, ICON_TYPES };

export default {
  ICON_TYPES,
  Icon,
};
