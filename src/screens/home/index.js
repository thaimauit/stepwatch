import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Logger } from 'src/utils';
import constants from 'src/constants';
import ProfileLoading from './components/ProfileLoading';
import WatchView from './components/WatchView';
import { Confirm } from 'src/components';
import { useVisible } from 'src/hooks';

const Home = props => {
  const { navigation } = props;
  const watch = useRef();
  const {
    visible: confirmVisible,
    show: showConfirm,
    hide: hideConfirm,
  } = useVisible(false);

  const onChangeSneaker = useCallback(newSneaker => {
    Logger.info(newSneaker);
    watch.current = newSneaker;
  }, []);

  const onRun = useCallback(() => {
    navigation.navigate(constants.screens.RUN, { sneaker: watch.current });
  }, [navigation]);

  const onConfirm = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      <WatchView onChangeSneaker={onChangeSneaker} onRun={onRun} />

      <ProfileLoading />
      <Confirm
        title="NOTICE"
        visible={confirmVisible}
        content="You canot earn token without watch"
        onClose={hideConfirm}
        onConfirm={onConfirm}
      />
    </View>
  );
};

Home.propTypes = {};

export default React.memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
