import React, { useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import { Device } from 'src/utils';
import { useInsets } from 'src/hooks';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import Text from './Text';
import { ImageAssets } from 'src/assets';

const SelectCoin = props => {
  const { visible, onClose, exceptAsset, onSelect } = props;
  const { bottom: paddingBottom } = useInsets();
  const fundings = useSelector(selectors.wallet.fundings);

  const selectItem = useCallback(
    item => () => {
      onSelect(item);
      onClose();
    },
    [onClose, onSelect],
  );

  const renderItem = useCallback(
    item => {
      if (item.asset === exceptAsset) return <View key={item.asset} />;
      return (
        <TouchableOpacity
          style={styles.item}
          key={item.asset}
          onPress={selectItem(item)}>
          <Image
            source={ImageAssets.tokens[item.asset.toLowerCase()]}
            style={styles.token}
          />
          <Text>{item.asset}</Text>
        </TouchableOpacity>
      );
    },
    [exceptAsset, selectItem],
  );

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { paddingBottom }]}>
              {fundings.map(renderItem)}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

SelectCoin.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  exceptAsset: PropTypes.string,
};

export default React.memo(SelectCoin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'flex-end',
  },
  content: {
    maxHeight: Device.screenWidth * 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: theme.contentPadding,
    backgroundColor: '#fff',
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: theme.contentPadding,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  token: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
