import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Recaptcha from 'react-native-recaptcha-that-works';
import Config from 'react-native-config';
import Loading from './Loading';
import Text from './Text';

const LoadingView = () => {
  return (
    <View style={styles.loadingView}>
      <Loading size="large" style={{ marginBottom: 10 }} />
      <Text center>Checking...</Text>
    </View>
  );
};

const RecaptchaV3 = forwardRef((props, ref) => {
  const { onReceiveToken } = props;
  const recaptcha = useRef();

  useImperativeHandle(
    ref,
    () => ({
      verify: () => {
        recaptcha.current.open();
      },
    }),
    [],
  );

  return (
    <Recaptcha
      ref={recaptcha}
      siteKey={Config.CAPTCHA_SITE_KEY}
      baseUrl={Config.CAPTCHA_DOMAIN}
      onVerify={onReceiveToken}
      size="invisible"
      loadingComponent={<LoadingView />}
      onError={e => console.log(e)}
    />
  );
});

RecaptchaV3.propTypes = {
  onReceiveToken: PropTypes.func.isRequired,
};

export default React.memo(RecaptchaV3);

const styles = StyleSheet.create({
  container: {},
  loadingView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
});
