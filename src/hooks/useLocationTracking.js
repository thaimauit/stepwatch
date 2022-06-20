import { useCallback, useEffect } from 'react';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import { Logger } from 'src/utils';
import { useDispatch } from 'react-redux';
import { actions } from 'src/models';

const useLocationTracking = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    init();
    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, [init]);

  const init = useCallback(() => {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 10,
      notificationTitle: 'StepWatch',
      notificationText: 'Running',
      debug: false,
      startOnBoot: false,
      pauseLocationUpdates: false,
      startForeground: true,
      stopOnTerminate: true,
      notificationsEnabled: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 5000,
      stopOnStillActivity: false,
      url: null,
    });

    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      dispatch(actions.run.updateLocation(location));

      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', stationaryLocation => {
      // handle stationary locations here
      // Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', error => {
      Logger.info('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      Logger.info('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      Logger.info('[INFO] BackgroundGeolocation service has been stopped');
    });

    // BackgroundGeolocation.on('authorization', status => {
    //   Logger.info(
    //     '[INFO] BackgroundGeolocation authorization status: ' + status,
    //   );
    //   if (status !== BackgroundGeolocation.AUTHORIZED)
    //     // we need to set delay or otherwise alert may not be shown
    //     setTimeout(
    //       () =>
    //         Alert.alert(
    //           'App requires location tracking permission',
    //           'Would you like to open app settings?',
    //           [
    //             {
    //               text: 'Yes',
    //               onPress: () => BackgroundGeolocation.showAppSettings(),
    //             },
    //             {
    //               text: 'No',
    //               onPress: () => Logger.info('No Pressed'),
    //               style: 'cancel',
    //             },
    //           ],
    //         ),
    //       1000,
    //     );
    // });

    BackgroundGeolocation.on('background', () => {
      // BackgroundGeolocation.switchMode(BackgroundGeolocation.BACKGROUND_MODE);
      Logger.info('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      // BackgroundGeolocation.switchMode(BackgroundGeolocation.FOREGROUND_MODE);
      Logger.info('[INFO] App is in foreground');
    });
  }, [dispatch]);

  const start = useCallback(() => {
    BackgroundGeolocation.start();
  }, []);

  const stop = useCallback(() => {
    BackgroundGeolocation.stop();
  }, []);

  return {
    start,
    stop,
  };
};

export default useLocationTracking;
