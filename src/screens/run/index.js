import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Header, Icon, Text } from 'src/components';
import theme from 'src/theme';
import { ImageAssets } from 'src/assets';
import { actions, selectors } from 'src/models';
import { useLocationTracking } from 'src/hooks';
import services from 'src/services';
import { GoogleFitUtil, Logger, MessageBox, Toast } from 'src/utils';
import Action from './components/Action';
import ConfirmStop from './components/ConfirmStop';
import constants from 'src/constants';

const Run = props => {
  const { navigation, route } = props;
  const constantsData = useSelector(selectors.common.constants);
  const earnToken =
    constantsData.earnToken || constants.common.DEFAULT_EARN_TOKEN;

  const currentProgress = useSelector(selectors.run.currentProgress);
  const {
    duration = 0,
    steps = 0,
    startTime,
    endTime,
    isPaused,
    distance,
    watch,
    locations,
    currentLocation,
    estimateEarn = 0,
  } = currentProgress;

  const timerEst = useRef();
  const progressRef = useRef({});

  const preIsPaused = useRef(isPaused);
  const [confirmStopVisible, setConfirmStopVisible] = useState(false);

  const isStarted = useSelector(selectors.run.isStarted);
  const dispatch = useDispatch();
  const timerRef = useRef();

  const { start: startLocationTracking, stop: stopLocationTracking } =
    useLocationTracking();

  const speedValue = useMemo(() => {
    const ms = currentLocation?.speed || 0;
    const kmh = ms * 3.6;
    return kmh.toFixed(1);
  }, [currentLocation]);

  const durationFormated = useMemo(() => {
    const durationData = moment.duration(
      duration + (endTime - startTime),
      'milliseconds',
    );
    const hours = durationData.hours();
    const minutes = durationData.minutes();
    const seconds = durationData.seconds();

    const hoursString = isNaN(hours) ? '' : hours > 0 ? hours + ':' : '';
    const minutesString =
      (isNaN(minutes) ? '00' : minutes < 10 ? '0' + minutes : minutes) + ':';
    const secondStrings = isNaN(seconds)
      ? '00'
      : seconds < 10
      ? '0' + seconds
      : seconds;

    return hoursString + minutesString + secondStrings;
  }, [duration, startTime, endTime]);

  useEffect(() => {
    progressRef.current = currentProgress;
  }, [currentProgress]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
      clearInterval(timerEst.current);
      timerEst.current = null;
    };
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    handlePausedChange(isPaused);
    preIsPaused.current = isPaused;
  }, [isPaused, handlePausedChange]);

  const onCloseConfirmStop = useCallback(() => {
    setConfirmStopVisible(false);
  }, []);

  const handlePausedChange = useCallback(
    async paused => {
      if (paused) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        stopLocationTracking();
        GoogleFitUtil.stopStepTracking();
        return;
      }
      if (preIsPaused.current && isStarted) {
        await GoogleFitUtil.startStepTracking(handleStepChange);
        startLocationTracking();
        timerRef.current = setInterval(() => {
          dispatch(actions.run.updateTimer());
        }, 1000);
      }
    },
    [
      stopLocationTracking,
      startLocationTracking,
      handleStepChange,
      dispatch,
      isStarted,
    ],
  );

  const handleStepChange = useCallback(
    newSteps => {
      if (!isPaused) dispatch(actions.run.updateStep(newSteps));
    },
    [dispatch, isPaused],
  );

  const handleEarn = useCallback(async () => {
    const progressEarn = progressRef.current || {};
    const {
      steps: stepEarn,
      watch: watchEarn,
      duration: durationEarn,
      endTime: endTimeEarn,
      startTime: startTimeEarn,
      distance: distanceEarn,
      locations: locationsEarn,
    } = progressEarn;

    if (!stepEarn || stepEarn === 0 || !watchEarn.id) return;

    const locationsMap = (locationsEarn || []).map(item => [
      item.latitude,
      item.longitude,
    ]);
    const { data, success } = await services.run.estimateRunning({
      watchId: watchEarn.id,
      timeSeconds: (durationEarn + (endTimeEarn - startTimeEarn)) / 1000,
      distance: distanceEarn,
      stepCount: stepEarn,
      path: locationsMap,
    });
    if (!success) return;
    const newEarn = data.estimateEarn || 0;
    dispatch(actions.run.updateEstEarn(newEarn));
  }, [dispatch]);

  const checkEarn = useCallback(() => {
    timerEst.current = setInterval(handleEarn, 5000);
  }, [handleEarn]);

  const init = useCallback(async () => {
    checkEarn();
    try {
      let endTimeValue = '';
      if (isStarted) {
        if (isPaused) return;
        const now = Date.now();
        endTimeValue = now - (now % 1000);
      }

      const { success } = await GoogleFitUtil.startStepTracking(
        handleStepChange,
      );
      if (!success) {
        navigation.goBack();
        return Toast.show('Error. Try again');
      }

      startLocationTracking();
      if (!isStarted) dispatch(actions.run.start(route.params.sneaker));

      timerRef.current = setInterval(() => {
        dispatch(actions.run.updateTimer(endTimeValue));
        endTimeValue = '';
      }, 1000);
    } catch (e) {
      Logger.info(e);
    }
  }, [
    dispatch,
    handleStepChange,
    startLocationTracking,
    route,
    navigation,
    isPaused,
    isStarted,
    checkEarn,
  ]);

  const handleStop = useCallback(() => {
    setConfirmStopVisible(true);
    stopLocationTracking();
    GoogleFitUtil.stopStepTracking();
    // dispatch(actions.run.stop());
    // navigation.goBack();
  }, [stopLocationTracking]);

  const onSubmitRunning = useCallback(async () => {
    setConfirmStopVisible(false);
    const locationsMap = (locations || []).map(item => [
      item.latitude,
      item.longitude,
    ]);
    const { success, error } = await services.run.submitRunning({
      watchId: watch.id,
      timeSeconds: duration / 1000,
      distance: distance,
      stepCount: steps,
      path: locationsMap,
    });
    if (!success) return MessageBox.showError(error?.msg || 'Fail');

    navigation.goBack();
    MessageBox.showSuccess('Success');
    dispatch(actions.wallet.getFundingWallet());
    dispatch(actions.run.stop());
  }, [navigation, dispatch, watch, duration, steps, locations, distance]);

  const onExitRunning = useCallback(() => {
    setConfirmStopVisible(false);
    dispatch(actions.run.stop());
    navigation.goBack();
  }, [navigation, dispatch]);

  const distanceValue = useMemo(() => {
    const value = (distance / 1000).toFixed(2);
    if (isNaN(value)) return '0.0';
    return value;
  }, [distance]);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.sneakerHeader}>
        <View style={styles.sneakerHeaderInfo}>
          <Text color="#fff" bold size={15}>
            {watch?.rarity}
          </Text>
        </View>
      </View>
    );
  }, [watch]);

  return (
    <SafeAreaView style={styles.container}>
      <Header isLight renderTitle={renderHeader} navigation={navigation} />
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.dataRow}>
            <View style={styles.rowItem}>
              <Text color="#fff" bold size={20}>
                {durationFormated}
              </Text>
              <Icon
                name="access-time"
                color="rgba(255,255,255,.6)"
                size={25}
                style={{ marginTop: 5 }}
              />
            </View>
            <View style={styles.rowItem}>
              <Text color="#fff" bold size={20}>
                {speedValue} km/h
              </Text>
              <Image
                source={ImageAssets.speed}
                style={styles.speedIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.rowItem}>
              <Text color="#fff" bold size={20}>
                {steps}
              </Text>
              <Image source={ImageAssets.steps} style={styles.rowIcon} />
            </View>
          </View>
          <Text size={80} color={'#fff'} style={styles.distanceValue} center>
            {distanceValue}
          </Text>
          <Text color="rgba(255,255,255,.8)" size={15} center>
            Kilometers
          </Text>
          <View style={styles.footerWrapper}>
            <View style={styles.footer}>
              <Image
                source={ImageAssets.tokens[earnToken.toLowerCase()]}
                style={styles.tokenIcon}
              />

              <Text
                color={theme.colors.messageBox.error}
                size={45}
                bold
                isNumber>
                +{estimateEarn.toFixed(2)}
              </Text>
            </View>
            <Text size={16} color="#fff">
              {earnToken}
            </Text>
          </View>
        </ScrollView>
      </View>

      <Action onStop={handleStop} watch={watch} />
      <ConfirmStop
        visible={confirmStopVisible}
        onClose={onCloseConfirmStop}
        onSubmit={onSubmitRunning}
        onExit={onExitRunning}
      />
    </SafeAreaView>
  );
};

Run.propTypes = {};

export default React.memo(Run);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
  },
  sneakerHeader: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
  },
  sneakerHeaderInfo: {
    alignItems: 'center',
  },
  footerWrapper: { alignItems: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '5%',
    marginTop: 20,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginTop: 12,
  },
  dataRow: {
    flexDirection: 'row',
    marginTop: '10%',
  },
  rowItem: {
    flex: 1,
    alignItems: 'center',
  },
  rowIcon: {
    width: 20,
    height: 20,
    tintColor: 'rgba(255,255,255,.6)',
    marginTop: 5,
  },
  speedIcon: {
    width: 80,
    height: 50,
    tintColor: 'rgba(255,255,255,.6)',
    marginTop: 5,
  },
  distanceValue: {
    marginTop: '15%',
  },
});
