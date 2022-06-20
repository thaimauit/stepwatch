import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { actions, selectors } from 'src/models';
import { Icon, ICON_TYPES, Image } from 'src/components';
import theme from 'src/theme';
import { ImageAssets } from 'src/assets';
import { useInsets } from 'src/hooks';
import MapView from './MapView';

const { width } = Dimensions.get('window');

const ITEM_KEYS = {
  STOP: 'stop',
  RESUME: 'resume',
  PAUSE: 'pause',
  MAP: 'map',
  SNEAKER: 'sneaker',
};

const PAUSED_ITEMS = [
  {
    key: ITEM_KEYS.STOP,
    icon: {
      name: 'ios-stop',
      type: ICON_TYPES.ION_ICON,
    },
    withBorder: true,
    size: 70,
    background: '#FD7E09',
  },
  {
    key: ITEM_KEYS.RESUME,
    icon: {
      name: 'play',
      type: ICON_TYPES.ION_ICON,
    },
    withBorder: true,
    size: 70,
    background: theme.colors.button.primary,
  },
];

const RUNNING_ITEMS = [
  {
    key: ITEM_KEYS.MAP,
    size: 50,
    withBorder: true,
    image: ImageAssets.mapPlaceholder,
  },
  {
    key: ITEM_KEYS.PAUSE,
    size: 70,
    background: theme.colors.button.primary,
    withBorder: true,
    icon: {
      name: 'pause',
      color: '#fff',
    },
  },
  {
    key: ITEM_KEYS.SNEAKER,
    size: 50,
  },
];

const Action = props => {
  const { bottom } = useInsets();
  const { onStop, watch } = props;
  const dispatch = useDispatch();
  const isPaused = useSelector(selectors.run.isPaused);
  const ITEMS = isPaused ? PAUSED_ITEMS : RUNNING_ITEMS;
  const [mapVisible, setMapVisible] = useState(false);

  const onPressAction = useCallback(
    item => () => {
      const { key } = item;
      if (key === ITEM_KEYS.PAUSE) return dispatch(actions.run.pause());
      if (key === ITEM_KEYS.RESUME) return dispatch(actions.run.resume());
      if (key === ITEM_KEYS.MAP) return setMapVisible(true);
      if (key === ITEM_KEYS.STOP) return onStop();
    },
    [dispatch, onStop],
  );

  const onCloseMap = useCallback(() => {
    setMapVisible(false);
  }, []);

  const renderItem = useCallback(
    item => {
      const { key, size, withBorder, icon, image, background } = item;
      const itemStyle = {
        width: size,
        height: size,
        borderWidth: withBorder ? 2 : 0,
        borderRadius: size,
        backgroundColor: background || 'transparent',
      };
      const imgStyle = {
        width: size - 4,
        height: size - 4,
        borderRadius: size - 4,
      };
      return (
        <View
          style={isPaused ? { flex: 1, alignItems: 'center' } : {}}
          key={key}>
          <TouchableOpacity
            style={[styles.itemView, itemStyle]}
            onPress={onPressAction(item)}>
            {key !== ITEM_KEYS.SNEAKER &&
              (image ? (
                <Image source={image} style={imgStyle} />
              ) : (
                <Icon size={30} color="#fff" {...icon} />
              ))}
            {key === ITEM_KEYS.SNEAKER && !isEmpty(watch) && (
              <Image
                source={{ uri: watch.fileUri }}
                style={styles.sneaker}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      );
    },
    [onPressAction, watch, isPaused],
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom + 20,
        },
      ]}>
      {ITEMS.map(renderItem)}
      <MapView visible={mapVisible} onClose={onCloseMap} />
    </View>
  );
};

Action.propTypes = {};

export default React.memo(Action);

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: theme.colors.background.highlight,
  },
  itemView: {
    borderColor: '#000',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: width / 2,
    borderLeftColor: 'transparent',
    borderRightWidth: width / 2,
    borderRightColor: 'transparent',
    borderBottomColor: '#BCBCBC',
    borderBottomWidth: 50,
  },
  sneaker: {
    width: 50,
    height: 50,
  },
});
