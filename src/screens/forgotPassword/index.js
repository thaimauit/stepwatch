import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Header, Image, Input, ReCaptcha, Text } from 'src/components';
import { ImageAssets } from 'src/assets';
import { Device, MessageBox, Utils } from 'src/utils';
import services from 'src/services';
import SentEmailForm from './SentEmailForm';
import theme from 'src/theme';

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const ForgotPassword = props => {
  const { navigation } = props;
  const [loading, setLoading] = useState(false);
  const [isSentEmail, setIsSentEmail] = useState(false);
  const recaptcha = useRef();
  const [data, setData] = useState({});

  const labels = useMemo(() => {
    return {
      title: isSentEmail ? 'Update new password.' : 'Reset password',
      desc: isSentEmail
        ? 'We just sent OTP to your email'
        : 'Please enter your email',
      submitLabel: isSentEmail ? 'Update' : 'Request',
    };
  }, [isSentEmail]);

  const buttonDisabled = useMemo(() => {
    if (isSentEmail)
      return !data.otp || !data.password || !data.confirmPassword;

    return !data.email;
  }, [data, isSentEmail]);

  const onChangeData = useCallback(
    key => value => {
      setData(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onVerifyDone = useCallback(
    async token => {
      if (!isSentEmail) {
        setLoading(true);
        const { success, error } = await services.user.forgotPassSendRequest(
          data.email.trim(),
          token,
        );
        setLoading(false);
        if (!success)
          return MessageBox.showError(error?.msg || 'Fail. Please try again');
        setIsSentEmail(true);
        return;
      }
      if (data.password !== data.confirmPassword)
        return MessageBox.showError('Confirm password not match');
      setLoading(true);
      const { success, error } = await services.user.forgotPassResetPassword({
        email: data.email.trim(),
        password: data.password,
        otp: data.otp,
        recaptcha: token,
      });
      setLoading(false);
      if (!success)
        return MessageBox.showError(error?.msg || 'Fail. Please try again');
      navigation.goBack();
      MessageBox.showSuccess('Reset password successfully');
    },
    [data, isSentEmail, navigation],
  );

  const onSubmit = useCallback(async () => {
    if (!isSentEmail) {
      const emailValid = Utils.checkEmailValid(data.email.trim());
      if (!emailValid) return MessageBox.showError('Email is invalid');
      recaptcha.current.verify();
      return;
    }
    if (data.password !== data.confirmPassword)
      return MessageBox.showError('Confirm password not match');
    recaptcha.current.verify();
  }, [data, isSentEmail]);

  const renderTitle = useCallback(() => {
    return (
      <Image
        style={styles.logo}
        source={ImageAssets.logo}
        resizeMode="contain"
      />
    );
  }, []);

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text color="#fff" style={styles.hello} size={16} semibold>
              Hello
            </Text>
            <Text color={theme.colors.button.primary} bold size={18}>
              STEPWATCH
            </Text>
          </View>

          <RNImage
            source={ImageAssets.login.stepwatch}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Container style={styles.container} behavior="padding">
          <View style={styles.body}>
            <Text style={styles.title} bold size={18}>
              {labels.title}
            </Text>
            <Text style={styles.desc} size={14}>
              {labels.desc}
            </Text>
            {(!isSentEmail && (
              <Input
                style={styles.inputView}
                placeholder="Email"
                placeholderTextColor="rgba(0,0,0,0.2)"
                keyboardType="email-address"
                onChangeText={onChangeData('email')}
                autoCapitalize={'none'}
                autoFocus
              />
            )) || <SentEmailForm onChangeData={onChangeData} />}

            <Button
              title={labels.submitLabel}
              style={styles.submitBtn}
              onPress={onSubmit}
              loading={loading}
              disabled={buttonDisabled}
              titleProps={{ color: '#fff' }}
            />
          </View>
        </Container>
      </SafeAreaView>
      <ReCaptcha onReceiveToken={onVerifyDone} ref={recaptcha} />
    </View>
  );
};

ForgotPassword.propTypes = {};

export default React.memo(ForgotPassword);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.contentPadding,
  },
  icon: {
    width: 80,
    height: 50,
  },
  hello: {
    marginBottom: 5,
  },
  backgroundView: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  body: {
    width: '85%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    paddingHorizontal: '5%',
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  inputView: {
    marginTop: 15,
    width: '95%',
    marginBottom: 15,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
  },
  desc: {
    marginTop: 5,
    marginBottom: 20,
  },
  submitBtn: {
    borderRadius: 45,
    height: 45,
    paddingHorizontal: 50,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  registerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtn: {
    paddingHorizontal: 5,
  },
  logo: {
    height: 50,
    width: Device.screenWidth * 0.5,
  },
});
