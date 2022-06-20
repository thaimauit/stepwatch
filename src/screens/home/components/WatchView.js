import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Loading, ProgressBar, Text, Image } from 'src/components';
import theme from 'src/theme';
import { actions, selectors, types } from 'src/models';
import { Device, Logger } from 'src/utils';
import { ImageAssets } from 'src/assets';
import constants from 'src/constants';
import BoxList from './BoxList';

const sliderWidth = Device.screenWidth - 2 * theme.contentPadding;

const SneakerView = props => {
  const { onChangeSneaker, onRun } = props;
  const dispatch = useDispatch();
  const loading = useSelector(selectors.common.loading(types.profile.GET_NFTS));
  const isStarted = useSelector(selectors.run.isStarted);
  const nfts = useSelector(selectors.profile.nfts);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const currentItem = useRef({});
  const listRef = useRef();
  const isFocused = useIsFocused();

  const currentItemData = get(nfts, currentIndex, {});
  const {
    afkProcess,
    durability,
    currentPerformance,
    performance,
    cooldownProcess,
    id,
    status,
    rarity,
  } = currentItemData;

  const performanceValue = useMemo(() => {
    if (!performance) return 0;
    return (currentPerformance * 100) / performance;
  }, [performance, currentPerformance]);

  const buttonDisabled = useMemo(() => {
    status !== constants.common.SNEAKER_STATUSES.ACTIVE;
  }, [status]);

  useEffect(() => {
    if (isFocused) onFetch();
  }, [isFocused, onFetch]);

  useEffect(() => {
    onListChange(nfts);
  }, [nfts, onListChange]);

  const onFetch = useCallback(() => {
    dispatch(actions.profile.getNFT());
  }, [dispatch]);

  const onSnapToItem = useCallback(newIndex => {
    setCurrentIndex(newIndex);
  }, []);

  useEffect(() => {
    onChangeSneaker(currentItemData);
  }, [currentItemData, onChangeSneaker]);

  useEffect(() => {
    onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  const onIndexChange = useCallback(
    curIndex => {
      currentItem.current = curIndex === -1 ? {} : get(nfts, curIndex, {});
    },
    [nfts],
  );

  const onListChange = useCallback(
    list => {
      if (isEmpty(list)) {
        setCurrentIndex(-1);
        return;
      }
      Logger.info('currentItem', currentItem);
      if (!currentItem.current.id) {
        setCurrentIndex(0);
        return;
      }
      const newIndex = list.findIndex(
        item => item.id === currentItem.current.id,
      );
      if (newIndex === -1) {
        setCurrentIndex(0);
        return;
      }
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    },
    [currentIndex],
  );

  const onPrev = useCallback(() => {
    const newIndex = currentIndex - 1;
    if (newIndex === -1) return;
    listRef.current.snapToItem(newIndex);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const onNext = useCallback(() => {
    const newIndex = currentIndex + 1;
    if (newIndex > nfts.length - 1) return;
    listRef.current.snapToItem(newIndex);
    setCurrentIndex(newIndex);
  }, [currentIndex, nfts]);

  const renderNft = useCallback(
    ({ item: nft }) => {
      const { fileUri } = nft;
      console.log(nft);
      return (
        <View style={styles.nftItem}>
          <View style={styles.idView}>
            <Text color="#fff">#{id}</Text>
          </View>

          <View style={styles.cover}>
            <Image
              source={ImageAssets.home.boxCover}
              style={styles.coverImg}
              resizeMode="contain"
            />
          </View>
          <Image
            source={{ uri: fileUri }}
            resizeMode="contain"
            style={styles.nftImg}
          />
        </View>
      );
    },
    [id],
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onFetch}
          tintColor={theme.colors.button.primary}
        />
      }>
      <View style={styles.container}>
        {/* <View style={styles.bgImg}>
            <RNImage
              source={ImageAssets.sneakerBackground}
              style={styles.bgSneaker}
            />
          </View> */}
        <Carousel
          ref={listRef}
          data={nfts}
          renderItem={renderNft}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth - 20}
          onSnapToItem={onSnapToItem}
        />
        <View style={[styles.arrowView, styles.leftArrow]}>
          <Button
            style={styles.arrowBtn}
            icon={{
              name: 'arrow-back-ios',
              size: 20,
              color: '#fff',
            }}
            onPress={onPrev}
          />
        </View>
        <View style={[styles.arrowView, styles.rightArrow]}>
          <Button
            style={[styles.arrowBtn]}
            icon={{
              name: 'arrow-forward-ios',
              size: 20,
              color: '#fff',
            }}
            onPress={onNext}
          />
        </View>

        {loading && (
          <View style={styles.loading}>
            <Loading color="#fff" />
          </View>
        )}
      </View>
      <BoxList />
      <View
        style={{ marginHorizontal: theme.contentPadding, marginBottom: 15 }}>
        <View style={styles.contentBackground}>
          <Image source={ImageAssets.squareLinearBg} style={styles.imgBg} />
        </View>
        <View style={styles.content}>
          <View style={styles.topView}>
            <View style={[styles.topItem, styles.topItemBackgroundLeft]}>
              <ProgressBar
                showPercent
                percentCenter
                percent={afkProcess || 0}
                height={30}
                contentStyle={styles.progressBarContent}
              />
              <Text style={styles.progressBarLabel} color="#fff">
                AFK
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
              <Text style={styles.progressBarLabel} color="#fff">
                DURABILITY
              </Text>
            </View>
          </View>

          <ProgressBar
            height={30}
            style={styles.progress}
            percent={cooldownProcess}
            showPercent
            textProps={{ color: '#fff' }}
            percentCenter
          />
          <Text color={'#fff'} semibold>
            {'Cooldown\n'}
          </Text>
          <ProgressBar
            height={30}
            style={[styles.progress, styles.progressPerformance]}
            percent={performanceValue}
            // numberOfParts={7}
            showPercent
            percentCenter
            textProps={{ color: '#fff' }}
          />
          <Text color={'#fff'} semibold>
            {'Performance\n'}
          </Text>
        </View>
        <View style={styles.submitView}>
          <TouchableOpacity onPress={onRun} disabled={buttonDisabled}>
            <LinearGradient
              colors={['#EF68E5', theme.colors.button.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0 }}
              style={[styles.startBtn, { opacity: buttonDisabled ? 0.5 : 1 }]}>
              <Text color="#fff" bold size={15}>
                {isStarted ? 'CONTINUE' : 'START'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Button
          transparent
          // title="How to play?"
          style={styles.howPlayBtn}
          titleProps={{ italic: true }}
        />
      </View>
    </ScrollView>
  );
};

SneakerView.propTypes = {};

export default React.memo(SneakerView);

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    // backgroundColor: theme.colors.background.highlight,
    height: Device.screenHeight * 0.32,
    borderRadius: 10,
    margin: theme.contentPadding,
    marginTop: 0,
    paddingBottom: 15,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
  },

  topView: {
    flexDirection: 'row',
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
  bgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgSneaker: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  shadowImg: { width: '60%', height: 50, marginTop: 10 },
  progressBarContent: {
    borderWidth: 1,
    borderColor: theme.colors.button.primary,
  },
  progressBarLabel: {
    marginTop: 5,
  },

  nftItem: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nftImg: {
    width: '50%',
    height: '80%',
  },
  arrowView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  arrowBtn: {
    width: 35,
    height: 35,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingLeft: 5,
  },

  progress: {
    marginBottom: 5,
    marginTop: 15,
  },
  progressPerformance: {
    marginTop: 5,
  },
  content: {
    flex: 1,
    margin: theme.contentPadding,
    marginTop: '7%',
  },
  submitView: {
    alignItems: 'center',
  },
  startBtn: {
    height: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    width: Device.screenWidth * 0.6,
    alignItems: 'center',
  },

  // nEW
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 10,
    bottom: 0,
  },
  coverImg: {
    width: '100%',
    height: Device.screenHeight * 0.32,
    opacity: 0.5,
  },
  contentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imgBg: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  howPlayBtn: {
    paddingVertical: 0,
    marginBottom: 20,
    marginTop: 10,
  },
  idView: {
    alignSelf: 'center',
    backgroundColor: theme.colors.button.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
