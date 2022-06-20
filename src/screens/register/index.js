import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  ButtonWithDuration,
  Header,
  Image,
  Input,
  ReCaptcha,
  Text,
} from 'src/components';
import { ImageAssets } from 'src/assets';
import theme from 'src/theme';
import { Device, MessageBox, Utils } from 'src/utils';
import services from 'src/services';
import Video from 'react-native-video';

const Container = Platform.select({ android: View, ios: KeyboardAvoidingView });

const Register = props => {
  const { navigation } = props;
  const [data, setData] = useState({});
  const recaptcha = useRef();
  const [loadingCode, setLoadingCode] = useState(false);
  const { email, password, code } = data;
  const [sentEmail, setSentEmail] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const isSendCode = useRef(true);
  const callbackDuration = useRef();

  const sunmitBtnDisabled = useMemo(() => {
    return !email || !password || !code || loadingCode;
  }, [email, password, code, loadingCode]);

  const onChangeData = useCallback(
    key => value => {
      setData(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onVerifyDone = useCallback(
    async token => {
      if (isSendCode.current) {
        setLoadingCode(true);
        setSentEmail('');
        const { success, error } = await services.user.requestRegisterCode(
          email.trim(),
          token,
        );
        setLoadingCode(false);
        if (!success) return MessageBox.showError(error?.msg || 'Fail');
        setSentEmail(email.trim());
        callbackDuration.current && callbackDuration.current();
        return;
      }
      setSubmitLoading(true);
      const { success, error } = await services.user.register({
        email: email.trim(),
        password,
        otp: code,
        recaptcha: token,
      });
      setSubmitLoading(false);
      if (!success)
        return MessageBox.showError(
          error?.msg || 'Register fail. Please try again',
        );
      MessageBox.showSuccess('Register success');
      navigation.goBack();
    },
    [email, password, code, navigation],
  );

  const sendCode = useCallback(
    callback => {
      if (!email || !Utils.checkEmailValid(email.trim()))
        return MessageBox.showError('Email is invalid');
      recaptcha.current.verify();
      isSendCode.current = true;
      callbackDuration.current = callback;
    },
    [email],
  );

  const onSubmit = useCallback(async () => {
    const isValidEmail = Utils.checkEmailValid(email.trim());
    if (!isValidEmail) return MessageBox.showError('Invalid email');
    isSendCode.current = false;

    recaptcha.current.verify();
  }, [email]);

  const onSignIn = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderSendCode = useCallback(() => {
    return (
      <ButtonWithDuration
        title="Send"
        transparent
        onPress={sendCode}
        loading={loadingCode}
        loadingColor={theme.colors.button.highlight}
        disabled={submitLoading}
        buttonStyle={{ paddingHorizontal: 0 }}
      />
    );
  }, [sendCode, loadingCode, submitLoading]);

  return (
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
      <View style={styles.container}>
        <View style={styles.imgBgView}>
          <Video
            repeat
            source={require('../../assets/intro.mp4')}
            style={styles.character}
            resizeMode="contain"
          />
        </View>
        <View style={styles.body}>
          <Text color="#fff" bold size={16}>
            Sign Up
          </Text>
          {!!sentEmail && (
            <View style={styles.sentEmailView}>
              <Text
                color="rgba(0,0,0,0.4)"
                center
                style={
                  styles.sentEmailLabel
                }>{`We just sent verification to email ${sentEmail}`}</Text>
            </View>
          )}
          <Input
            style={styles.input}
            placeholder="Email"
            onChangeText={onChangeData('email')}
            isLight
          />
          <Input
            placeholder="Email verification code"
            style={styles.input}
            onChangeText={onChangeData('code')}
            renderRight={renderSendCode}
            keyboardType="numeric"
            isLight
          />
          <Input
            isPassword
            style={styles.input}
            placeholder="Password"
            onChangeText={onChangeData('password')}
            isLight
          />
          <Button
            style={styles.confirmBtn}
            title="Sign Up"
            disabled={sunmitBtnDisabled}
            onPress={onSubmit}
            loading={submitLoading}
          />
        </View>
        <View style={styles.registerView}>
          <Text color="#fff">Already have an account?</Text>
          <Button
            transparent
            title="Sign In"
            titleProps={{ color: theme.colors.button.primary, semibold: true }}
            style={styles.registerBtn}
            onPress={onSignIn}
          />
        </View>
      </View>
      <ReCaptcha onReceiveToken={onVerifyDone} ref={recaptcha} />
    </SafeAreaView>
  );
};

Register.propTypes = {};

export default React.memo(Register);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  imgBgView: {
    position: 'absolute',
    top: '5%',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  lineView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  line: {
    width: '80%',
    height: '50%',
    marginTop: '10%',
  },
  character: {
    width: '100%',
    height: '50%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.contentPadding,
    marginTop: 10,
  },
  icon: {
    width: 80,
    height: 50,
  },
  hello: {
    marginBottom: 5,
  },
  body: {
    backgroundColor: '#13121A',
    alignItems: 'center',
    width: '90%',
    borderRadius: 10,
    padding: theme.contentPadding,
  },
  input: {
    height: 45,
    borderRadius: 10,
    backgroundColor: '#000',
    marginTop: 20,
  },
  confirmBtn: {
    height: 45,
    borderRadius: 45,
    marginTop: '10%',
    paddingVertical: 0,
    alignItems: 'center',
    width: '80%',
  },
  registerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  registerBtn: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  sentEmailView: {
    backgroundColor: 'rgba(169, 221, 235, .5)',
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    marginHorizontal: 15,
  },
  sentEmailLabel: {
    marginHorizontal: 15,
  },
});
