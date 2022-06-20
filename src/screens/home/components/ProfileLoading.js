import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { selectors, types } from 'src/models';
import { Loading } from 'src/components';
import theme from 'src/theme';

const ProfileLoading = () => {
  const loading = useSelector(
    selectors.common.loading(types.profile.GET_PROFILE),
  );

  return (
    <Modal transparent visible={loading}>
      <View style={styles.container}>
        <View style={styles.loadingView}>
          <Loading color={theme.colors.button.highlight} size="large" />
        </View>
      </View>
    </Modal>
  );
};

ProfileLoading.propTypes = {};

export default React.memo(ProfileLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  loadingView: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
