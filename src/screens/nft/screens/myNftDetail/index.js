import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image as RNImage,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get } from 'lodash';
import {
  Header,
  Icon,
  ICON_TYPES,
  Image,
  ProgressBar,
  Text,
} from 'src/components';
import theme from 'src/theme';
import { Device, MessageBox, Toast } from 'src/utils';
import { ImageAssets } from 'src/assets';
// import { useVisible } from 'src/hooks';
// import RepairModal from '../../components/RepairModal';
import services from 'src/services';
import constants from 'src/constants';
import { actions } from 'src/models';
import { useDispatch } from 'react-redux';
import Box from './components/Box';
import WatchAction from './components/WatchAction';
import BoxAction from './components/BoxAction';

const EXTRA_FIELDS = [
  {
    key: 'speed',
    name: 'Speed',
    color: '#FA2709',
    isRange: true,
  },
  {
    key: 'carry',
    name: 'Carry',
    color: '#8C20FD',
  },
  {
    key: 'quick',
    name: 'Quick',
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
  const dispatch = useDispatch();
  const { route, navigation } = props;
  const initData = get(route, 'params.initData', {});
  const isBox = get(route, 'params.isBox', false);
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const {
    fileUri,
    boxType,
    id,
    performance,
    // repairCost,
    cooldownProcess,
    // forSale,
    // paymentCurrency,
    // price,
    afkTime,
    durability,
    status,
    rarity,
    currentPerformance,
  } = data;

  const statusMessage = useMemo(() => {
    if (status === constants.common.SNEAKER_STATUSES.REPAIRING)
      return 'Your watch is being repair';
  }, [status]);

  useEffect(() => {
    if (id) onFetch();
  }, [id, onFetch]);

  const onRepairSuccess = useCallback(() => {
    MessageBox.showSuccess('Repair success');
    setData(prev => ({
      ...prev,
      status: constants.common.SNEAKER_STATUSES.REPAIRING,
    }));
    onFetch();
    dispatch(actions.wallet.getFundingWallet());
  }, [onFetch, dispatch]);

  const onFetch = useCallback(async () => {
    setLoading(true);
    const { success, data: newData } = await services.nft.nftDetail(id, isBox);
    setLoading(false);
    if (!success) return Toast.show('Fail');
    setData(newData);
  }, [id, isBox]);

  const renderExtraField = useCallback(
    item => {
      const { key } = item;
      let value = initData[key];
      const minValue = initData[key];
      const maxValue = initData[key + 'Max'];
      value = (minValue / maxValue) * 100;

      return (
        <View style={styles.extraItem} key={key}>
          <View style={styles.extraNameView}>
            <Text color="rgba(255,255,255,0.8)">{item.name}</Text>
          </View>
          <ProgressBar
            percent={value}
            height={20}
            style={{ flex: 1, marginRight: 10 }}
            textProps={{ color: '#fff' }}
          />
          <Text color="#fff">{minValue}</Text>
        </View>
      );
    },
    [initData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        title={(isBox && boxType) || rarity}
        isLight
        titleProps={{ color: '#fff' }}
      />
      <View style={styles.body}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onFetch}
              tintColor="#fff"
            />
          }>
          <View style={styles.sneakerView}>
            <View style={styles.bgSneakerView}>
              <Image
                source={ImageAssets.home.boxCover}
                style={styles.bgSneaker}
              />
            </View>
            {/* <View style={styles.nameWrapper}>
              <Text color="#fff" size={20} bold>
                {(isBox && boxType) || rarity}
              </Text>
            </View> */}
            <View style={[styles.nameWrapper, { marginTop: 10 }]}>
              <View style={styles.nameView}>
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
            </View>
          </View>
          {(isBox && <Box data={data} />) || (
            <>
              <View style={styles.topView}>
                <View style={[styles.topItem, styles.topItemBackgroundLeft]}>
                  <ProgressBar
                    showPercent
                    percentCenter
                    percent={afkTime || 0}
                    height={30}
                    contentStyle={styles.progressBarContent}
                  />
                  <Text style={styles.progressBarLabel} color="#fff" semibold>
                    Afk
                  </Text>
                </View>

                <View style={styles.topItem}>
                  <ProgressBar
                    percent={durability}
                    height={30}
                    showPercent
                    percentCenter
                    contentStyle={styles.progressBarContent}
                  />
                  <Text style={styles.progressBarLabel} color="#fff" semibold>
                    Durability
                  </Text>
                </View>
              </View>

              <ProgressBar
                height={20}
                style={styles.progress}
                percent={cooldownProcess}
                showPercent
                textProps={{ color: '#fff' }}
              />
              <Text color={'#fff'} semibold>
                {'Cooldown\n'}
              </Text>
              <ProgressBar
                height={20}
                style={[styles.progress, styles.progressPerformance]}
                percent={(currentPerformance * 100) / performance}
                showPercent
                textProps={{ color: '#fff' }}
              />
              <Text color={'#fff'} semibold>
                {'Performance\n\n'}
              </Text>

              {EXTRA_FIELDS.map(renderExtraField)}
            </>
          )}
        </ScrollView>

        {!!statusMessage && (
          <View style={styles.messageView}>
            <Text italic color="#fff" size={14} center>
              {statusMessage}
            </Text>
          </View>
        )}
        {(!isBox && (
          <WatchAction data={data} onRepairSuccess={onRepairSuccess} />
        )) || <BoxAction id={id} />}
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
    paddingTop: 10,
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
    backgroundColor: theme.colors.button.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
    width: '100%',
    height: '70%',
  },
  sneakerShadow: {
    width: '60%',
    height: 50,
    marginTop: 20,
  },
  topView: {
    flexDirection: 'row',
    marginTop: 20,
  },
  topItem: {
    flex: 1,
    alignItems: 'center',
  },
  topItemBackgroundLeft: {
    marginLeft: 0,
    marginRight: 10,
  },
  topItemBackground: {
    height: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: '#0086B5',
    marginLeft: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    marginBottom: 5,
    marginTop: 15,
  },
  progressPerformance: {
    marginTop: 5,
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
    marginBottom: 15,
  },
  iconView: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraNameView: {
    width: 60,
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
  progressBarLabel: {
    marginTop: 5,
  },
  messageView: {
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.messageBox.error,
    marginVertical: 15,
  },
});
