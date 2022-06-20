import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import constants from 'src/constants';
import { Device } from 'src/utils';
import Text from './Text';
import Image from './Image';
import theme from 'src/theme';
import Button from './Button';

const BoxItem = props => {
  const navigation = useNavigation();
  const { data, isMine, onUnbox } = props;
  const { boxType, id, fileUri, isUnbox } = data;

  const onPressItem = useCallback(() => {
    navigation.navigate(
      isMine ? constants.screens.MY_NFT_DETAIL : constants.screens.NFT_DETAIL,
      { initData: data, isBox: true },
    );
  }, [navigation, data, isMine]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPressItem}>
      <View style={styles.body}>
        <View style={styles.nameView}>
          <Text color="#fff" semibold>
            {boxType}
          </Text>
        </View>
        <View style={styles.contentView}>
          <Image
            source={{ uri: fileUri }}
            style={styles.img}
            resizeMode="contain"
          />
          <View style={styles.idView}>
            {/* <View style={styles.idSign}>
              <Text color="#fff" size={15}>

              </Text>
            </View> */}
            <Text color="#fff" center style={styles.idLabel} size={10}>
              #{id}
            </Text>
          </View>
        </View>
      </View>
      <Button
        style={styles.priceView}
        title="Unbox"
        titleProps={{ color: '#F58B52', bold: true }}
        // disabled={isUnbox}
        disabled
        onPress={onPressItem}
      />
    </TouchableOpacity>
  );
};

BoxItem.propTypes = {};

export default React.memo(BoxItem);

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginBottom: 15,
    width: (Device.screenWidth - 20 - 10) / 2,
    borderWidth: 1,
    borderColor: '#0F2B36',
  },

  nameView: {
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  contentView: {
    alignItems: 'center',
  },
  img: {
    width: '60%',
    height: 100,
  },
  idView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderWidth: 1,
    borderRadius: 29,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  idSign: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#222845',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bscIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  body: {
    backgroundColor: '#191E30',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  idLabel: { marginHorizontal: 10 },
});
