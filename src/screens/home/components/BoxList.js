import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import { Text } from 'src/components';

const BoxList = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.boxView}>
        <View style={styles.topBox} />
        <View style={styles.centerBox}>
          <Text color="#fff" size={10} bold>
            Loot Box
          </Text>
        </View>
        <View style={styles.bottomBox} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.boxView}>
        <View style={styles.topBox} />
        <View style={styles.centerBox}>
          <Text color="#fff" size={10} bold>
            Loot Box
          </Text>
        </View>
        <View style={styles.bottomBox} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.boxView}>
        <View style={styles.topBox} />
        <View style={styles.centerBox}>
          <Text color="#fff" size={10} bold>
            Loot Box
          </Text>
        </View>
        <View style={styles.bottomBox} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.boxView}>
        <View style={styles.topBox} />
        <View style={styles.centerBox}>
          <Text color="#fff" size={10} bold>
            Loot Box
          </Text>
        </View>
        <View style={styles.bottomBox} />
      </TouchableOpacity>
    </View>
  );
};

BoxList.propTypes = {};

export default React.memo(BoxList);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  boxView: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.button.primary,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 2,
  },
  topBox: {
    height: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: 54,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  bottomBox: {
    height: 15,
    width: 58,
  },
  centerBox: {
    flex: 1,
    width: 58,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.button.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
