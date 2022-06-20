import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image as RNImage,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { Header, Icon, ICON_TYPES, Image, Text } from 'src/components';
import theme from 'src/theme';
import { Device } from 'src/utils';
import { ImageAssets } from 'src/assets';

const EXTRA_FIELDS = [
  {
    key: 'strength',
    name: 'Strength',
    color: '#FA2709',
    isRange: true,
  },
  {
    key: 'intelligent',
    name: 'Intelligent',
    color: '#8C20FD',
  },
  {
    key: 'agility',
    name: 'Agility',
    color: '#FEF454',
    isRange: true,
  },
  {
    key: 'luck',
    name: 'Luck',
    color: '#16B9A6',
    isRange: true,
  },
];

const CONTENT_WIDTH = Device.screenWidth - theme.contentPadding * 2;

const NFTDetail = props => {
  const { route, navigation } = props;
  const initData = get(route, 'params.initData', {});
  const {
    fileUri,
    name,
    id,
    cooldownTime,
    performance,
    // maxPerformance,
    repairCost,
    // cooldown,
    forSale,
    paymentCurrency,
    price,
  } = initData;

  const renderExtraField = useCallback(
    item => {
      const { key, color, isRange } = item;
      let value = initData[key];
      if (isRange) {
        const minValue = initData[key + 'Min'];
        const maxValue = initData[key + 'Max'];
        value = (minValue || 0) + ' - ' + maxValue;
      }
      const iconStyle = { backgroundColor: color };

      return (
        <View style={styles.extraItem} key={key}>
          <View style={[styles.iconView, iconStyle]}>
            <Icon
              name="shoe-sneaker"
              type={ICON_TYPES.MATERIAL_COMMUNITY}
              size={15}
            />
          </View>
          <View style={styles.extraNameView}>
            <Text color="rgba(255,255,255,0.8)"> {item.name}</Text>
          </View>
          <Text color="rgba(255,255,255,0.8)" bold>
            {' '}
            {value}
          </Text>
        </View>
      );
    },
    [initData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        title="NFT DETAIL"
        isLight
        titleProps={{ color: '#fff' }}
      />
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.sneakerView}>
            <View style={styles.bgSneakerView}>
              <Image
                source={ImageAssets.sneakerBackground}
                style={styles.bgSneaker}
              />
            </View>
            <View style={styles.nameWrapper}>
              <View style={styles.nameView}>
                <Text center size={15} bold color="#fff">
                  {name}
                </Text>
                <Text center size={12} color="#fff">
                  #{id}
                </Text>
              </View>
            </View>
            <View style={styles.sneakerImgView}>
              <Image
                source={{ uri: fileUri }}
                style={styles.sneakerImg}
                resizeMode="contain"
              />
              <RNImage
                source={ImageAssets.shadowSneaker}
                style={styles.sneakerShadow}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.staticRowView}>
            <View style={styles.staticItem}>
              <View style={styles.staticValueView}>
                <Text color={'#fff'} size={16}>
                  {cooldownTime || 0}H
                </Text>
              </View>
              <Text color="#fff" size={12}>
                COOLDOWN
              </Text>
            </View>
            <View style={styles.staticItem}>
              <View style={styles.staticValueView}>
                <Text color={'#fff'} size={16}>
                  {repairCost || 0}WST
                </Text>
              </View>
              <Text color="#fff" size={12}>
                REPAIR COST
              </Text>
            </View>
          </View>
          <View style={styles.performance}>
            <Text color="#fff" size={16}>
              PERFORMANCE: {performance}M
            </Text>
          </View>
          {EXTRA_FIELDS.map(renderExtraField)}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.priceView}>
            <Text color="#fff" size={16} semibold>
              {price || 0} {paymentCurrency || 'BNB'}
            </Text>
          </View>
          <View style={{ opacity: !forSale ? 0.5 : 1 }}>
            <TouchableOpacity disabled={!forSale}>
              <LinearGradient
                colors={['#823AD9', '#D75595']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
                style={styles.buyBtn}>
                <Text color="#fff" bold size={15} italic>
                  BUY
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

NFTDetail.propTypes = {};

export default React.memo(NFTDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    paddingHorizontal: theme.contentPadding,
    paddingTop: 20,
  },
  sneakerView: {
    padding: 1,
    width: CONTENT_WIDTH,
    borderRadius: 20,
  },
  nameWrapper: {
    alignItems: 'center',
  },
  nameView: {
    backgroundColor: '#525598',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  sneakerImgView: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: Device.screenHeight * 0.3,
  },

  bgSneakerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgSneaker: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  sneakerImg: {
    width: '60%',
    height: '50%',
    marginTop: 20,
  },
  sneakerShadow: {
    width: '60%',
    height: 50,
    marginTop: 20,
  },

  staticRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  staticItem: {
    width: '40%',
    alignItems: 'center',
  },
  staticValueView: {
    width: '100%',
    height: 30,
    borderRadius: 30,
    borderColor: '#525598',
    borderWidth: 1,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  performance: {
    alignSelf: 'center',
    width: '100%',
    height: 30,
    backgroundColor: '#525598',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },

  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconView: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraNameView: {
    // width: 80,
    marginLeft: 10,
    flex: 1,
  },

  footer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 45,
    height: 45,
    borderColor: theme.colors.button.primary,
    marginBottom: 10,
  },
  priceView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    paddingHorizontal: '15%',
    height: 43,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
