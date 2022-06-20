import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text } from 'src/components';

const Box = props => {
  const { data } = props;
  const { boxDropRates } = data;

  const renderBoxRate = useCallback(item => {
    return (
      <View style={styles.rateRow} key={item.boxRarity}>
        <Text style={styles.rateName} color="#fff" size={16}>
          {item.boxRarity}
        </Text>
        <ProgressBar
          height={20}
          style={[styles.progress]}
          percent={item.rate}
          showPercent
          textProps={{ color: '#fff' }}
        />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text color="#fff" size={16} semibold>
        Box rates {'\n'}
      </Text>
      {(boxDropRates || []).map(renderBoxRate)}
    </View>
  );
};

Box.propTypes = {};

export default React.memo(Box);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    flex: 1,
    marginLeft: 10,
  },
  rateName: {
    textTransform: 'capitalize',
    width: '20%',
  },
});
