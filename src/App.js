import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isEmpty } from 'lodash';
import { AppNavigator } from './navigator';
import { useInitProfile, useVisible } from './hooks';
import { actions, selectors } from './models';
import { InitProfile, Intro, UpdateControl } from './components';

const App = () => {
  const { loading, stopLoading } = useInitProfile();
  const userData = useSelector(selectors.profile.userData);

  const { visible: updateControlVisible, hide: hideUpdateControl } =
    useVisible(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.common.getSystemNetworks());
  }, [dispatch]);

  const renderContent = useCallback(() => {
    if (updateControlVisible)
      return <UpdateControl onHide={hideUpdateControl} />;

    if (
      loading ||
      (!isEmpty(userData) && !userData.referralId && !userData.skipReferral)
    )
      return <InitProfile onLogout={stopLoading} />;
    return <AppNavigator />;
  }, [loading, userData, stopLoading, hideUpdateControl, updateControlVisible]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        {renderContent()}
      </View>
    </SafeAreaProvider>
  );
};

App.propTypes = {};

export default React.memo(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
