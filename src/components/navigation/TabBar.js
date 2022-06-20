import { get } from 'lodash';
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageAssets } from 'src/assets';
import constants from 'src/constants';
import theme from 'src/theme';
import { Logger, Toast } from 'src/utils';
import { Icon, ICON_TYPES } from '../Icon';
import Image from '../Image';

// const ICONS = {
//   [constants.screens.HOME]: {
//     icon: {
//       name: 'directions-run',
//     },
//   },
//   [constants.screens.SNEAKER]: {
//     icon: {
//       name: 'shoe-sneaker',
//       type: ICON_TYPES.MATERIAL_COMMUNITY,
//       size: 25,
//     },
//     image: ImageAssets.runIcon,
//   },
//   [constants.screens.RANKING]: {
//     icon: {
//       name: 'bar-chart',
//       size: 25,
//     },
//   },
//   [constants.screens.STORE]: {
//     icon: {
//       name: 'shopping-cart',
//       type: ICON_TYPES.FONT_AWESOME,
//     },
//   },
// };

const TabBar = props => {
  const { bottom } = useSafeAreaInsets();
  const { state, navigation } = props;

  Logger.info(props);

  const onPressTab = useCallback(
    item => () => {
      if (
        item.name === constants.screens.RANKING ||
        item.name === constants.screens.STORE
      )
        return Toast.show('Coming soon');
      navigation.navigate(item.name);
    },
    [navigation],
  );

  const renderItem = useCallback(
    (item, index) => {
      const isFocused = index === state.index;
      const { name } = item;
      const image = ImageAssets.tabs[name];
      return (
        <TouchableOpacity
          style={[styles.tab]}
          onPress={onPressTab(item)}
          key={item.key}>
          <RNImage
            source={image}
            style={styles.img}
            tintColor={'#fff'}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    },
    [onPressTab, state],
  );

  return (
    <View
      style={[styles.container, { paddingBottom: bottom > 15 ? bottom : 15 }]}>
      <LinearGradient
        colors={['#FA57CE', '#6CA2A9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0 }}
        style={styles.tabContent}>
        {state.routes.map(renderItem)}
      </LinearGradient>
    </View>
  );
};

TabBar.propTypes = {};

export default React.memo(TabBar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
  },
  tabContent: {
    height: 50,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.button.primary,
    width: '80%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    width: 20,
    height: 20,
  },
  img: {
    width: 27,
    height: 27,
  },
});
