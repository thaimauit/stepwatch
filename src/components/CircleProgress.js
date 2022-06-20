import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Text as SVGText } from 'react-native-svg';
import theme from 'src/theme';

const CircularProgress = props => {
  const {
    size,
    strokeWidth,
    text,
    bgColor,
    pgColor,
    textSize,
    textColor,
    percent,
  } = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = 100 - percent;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <Circle
          stroke={pgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          strokeWidth={strokeWidth}
        />

        {/* Text */}
        <SVGText
          fontSize={textSize}
          x={size / 2}
          y={size / 2 + (props.textSize / 2 - 1)}
          textAnchor="middle"
          fontFamily="Gilroy-Medium"
          fill={textColor}>
          {text}
        </SVGText>
      </Svg>
    </View>
  );
};

CircularProgress.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  bgColor: PropTypes.string,
  pgColor: PropTypes.string,
  textSize: PropTypes.number,
  textColor: PropTypes.string,
  percent: PropTypes.number,
  text: PropTypes.string,
};

CircularProgress.defaultProps = {
  size: 30,
  bgColor: 'rgba(255,255,255,0.4)',
  pgColor: theme.colors.button.primary,
  strokeWidth: 2,
  textSize: 8,
  textColor: '#fff',
  percent: 0,
  text: '',
};

export default CircularProgress;

const styles = StyleSheet.create({
  // container: { margin: 10 },
});
