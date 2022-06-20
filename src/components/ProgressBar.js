import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import Text from './Text';

const ProgressBar = props => {
  const {
    percent,
    background,
    progressColor,
    height,
    style,
    numberOfParts = 0,
    textProps = {},
    showPercent,
    contentStyle,
    percentCenter,
    children,
  } = props;

  const percentValue = percent < 5 ? 0 : percent < 10 ? 10 : percent;

  const partData = useMemo(() => {
    if (numberOfParts === 0) return [];
    return Array(numberOfParts).fill(0);
  }, [numberOfParts]);

  const progressStyle = {
    height: height - 2,
    width: `${percentValue}%`,
    borderRadius: height - 2,
    backgroundColor: progressColor,
  };

  const containerStyle = {
    height,
    borderRadius: height,
    backgroundColor: background,
    flex: 1,
    justifyContent: 'center',
    ...(numberOfParts && numberOfParts > 0
      ? { borderWidth: 0.3, borderColor: theme.colors.button.primary }
      : {}),
  };

  const renderPart = useCallback(
    (_, index) => {
      const isLast = index === numberOfParts - 1;
      const isFirst = index === 0;
      const partStyle = {
        borderLeftWidth: isFirst ? 0 : 1,
        borderRightWidth: isLast ? 0 : 0.5,
        borderLeftColor: '#000',
        borderRightColor: progressColor,
        height: height,
        flex: 1,
      };
      return <View style={partStyle} key={index} />;
    },
    [numberOfParts, progressColor, height],
  );

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[containerStyle, contentStyle]}>
        <View style={progressStyle} />
        <View style={styles.partView}>{partData.map(renderPart)}</View>
      </View>
      <View style={styles.childern}>
        {showPercent && percentCenter && (
          <Text color="#fff" size={16}>
            {(percent || 0).toFixed(1)}%
          </Text>
        )}
        {children}
      </View>
      {showPercent && !percentCenter && (
        <Text {...textProps}> {Math.floor(percent)}%</Text>
      )}
    </View>
  );
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
  background: PropTypes.string,
  progressColor: PropTypes.string,
  numberOfPaths: PropTypes.number,
  showPercent: PropTypes.bool,
};

ProgressBar.defaultProps = {
  percent: 0,
  background: 'rgba(255,255,255,0.1)',
  progressColor: theme.colors.button.primary,
  numberOfParts: 0,
};

export default React.memo(ProgressBar);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  childern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
