import React, { useMemo } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
const Text = props => {
  const {
    style,
    bold,
    size,
    color,
    semibold,
    primary,
    secondary,
    italic,
    center,
    right,
    isNumber,

    ...restProps
  } = props;
  const fontSizeStyle = size ? { fontSize: size } : {};
  const fontStyle = italic ? { fontStyle: 'italic' } : {};
  const fontWeightStyle = bold
    ? { fontWeight: 'bold' }
    : semibold
    ? { fontWeight: '500' }
    : {};
  const colorStyle = primary
    ? { color: theme.colors.text.primary }
    : secondary
    ? { color: theme.colors.text.secondary }
    : color
    ? { color }
    : { color: 'rgba(0,0,0,0.85)' };
  const textAlign = center ? 'center' : right ? 'right' : 'left';

  const fontFamily = useMemo(() => {
    if (bold) {
      if (italic) return 'Gilroy-BoldItalic';
      return 'Gilroy-Bold';
    }
    if (semibold) {
      if (!italic) return 'Gilroy-SemiBold';
      return 'Gilroy-SemiBoldItalic';
    }
    if (italic) return 'Gilroy-RegularItalic';
    return 'Gilroy-Regular';
  }, [bold, italic, semibold]);

  return (
    <RNText
      style={[
        { textAlign, fontFamily },
        styles.text,
        colorStyle,
        style,
        fontSizeStyle,
        fontStyle,
        fontWeightStyle,
      ]}
      {...restProps}
    />
  );
};

Text.propTypes = {
  bold: PropTypes.bool,
  semibold: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  italic: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  center: PropTypes.bool,
  right: PropTypes.bool,
  isNumber: PropTypes.bool,
};

Text.defaultProps = {
  italic: false,
};

export default React.memo(Text);

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.85)',
  },
});
