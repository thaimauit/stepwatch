import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Platform, Modal } from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import Loading from './Loading';
import ProgressBar from './ProgressBar';
import Text from './Text';
import Video from 'react-native-video';

const ControlUpdate = props => {
  const { onHide } = props;
  const [updateAppVisible, setUpdateAppVisible] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    checkUpdate();
  }, [checkUpdate]);

  const checkUpdate = useCallback(async () => {
    const deploymentKey = Platform.select({
      android: Config.ANDROID_CODE_PUSH_KEY,
      ios: Config.IOS_CODE_PUSH_KEY,
    });
    CodePush.sync(
      {
        updateDialog: null,
        deploymentKey,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setUpdateAppVisible(true);
            break;
          // case CodePush.SyncStatus.INSTALLING_UPDATE:
          //   checkInitData();
          //   break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
          case CodePush.SyncStatus.UPDATE_IGNORED:
          case CodePush.SyncStatus.UNKNOWN_ERROR:
          case CodePush.SyncStatus.UP_TO_DATE:
            onHide();

            break;
        }
      },
      ({ totalBytes, receivedBytes }) => {
        setPercent((receivedBytes / totalBytes) * 100);
      },
    );
  }, [onHide]);
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/intro.mp4')}
        style={styles.logo}
        resizeMode="contain"
        repeat
      />
      {(!updateAppVisible && (
        <View style={styles.loadingView}>
          <Loading color={'#fff'} />
        </View>
      )) || (
        <View style={styles.updateContent}>
          <Text color="#fff" semibold size={16} center>
            {'Updating...\n'}
          </Text>
          <ProgressBar
            height={20}
            percent={percent}
            showPercent
            textProps={{ color: '#fff' }}
          />
        </View>
      )}
    </View>
  );
};

ControlUpdate.propTypes = {};

export default React.memo(ControlUpdate);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: '50%',
    marginTop: '10%',
  },
  content: {
    flex: 1,
  },
  loadingView: {
    alignItems: 'center',
    marginTop: 30,
  },
  updateContent: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
