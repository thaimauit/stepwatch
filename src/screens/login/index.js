import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Video from 'react-native-video';
import { Button, GAInput, Input, ReCaptcha, Text } from 'src/components';
import { actions } from 'src/models';
import { ImageAssets } from 'src/assets';
import constants from 'src/constants';
import { MessageBox, Utils } from 'src/utils';
import theme from 'src/theme';

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const Login = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [gaVisible, setGaVisible] = useState(false);
  const recaptcha = useRef();
  const gaCode = useRef();

  const buttonDisabled = useMemo(() => {
    return !data.email || !data.password;
  }, [data]);

  const onChangeData = useCallback(
    key => value => {
      setData(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const verifyTokenSuccess = useCallback(
    token => {
      console.log('token', token);
      const params = {
        email: data.email.trim(),
        password: data.password,
        recaptcha: token,
      };
      if (gaCode.current) params.gaCode = gaCode.current;

      setLoading(true);
      dispatch(
        actions.profile.login(
          params,
          ({ isGaRequire }) => {
            if (isGaRequire) setGaVisible(true);
            setLoading(false);
          },
          () => setLoading(false),
        ),
      );
    },
    [dispatch, data],
  );

  const login = useCallback(() => {
    const isEmailVaid = Utils.checkEmailValid(data.email.trim());
    if (!isEmailVaid) return MessageBox.showError('Invalid email');
    gaCode.current = '';
    recaptcha.current.verify();
  }, [data]);

  const onRegister = useCallback(() => {
    navigation.navigate(constants.screens.REGISTER);
  }, [navigation]);

  const onFogotPass = useCallback(() => {
    navigation.navigate(constants.screens.FORGOT_PASS);
  }, [navigation]);

  const onSubmitGaCode = useCallback(code => {
    gaCode.current = code;
    recaptcha.current.verify();
  }, []);

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
      <Container style={styles.container} behavior="padding">
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
            Sign In
          </Text>
          <Input
            style={styles.input}
            placeholder="Email"
            onChangeText={onChangeData('email')}
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
            title="Sign In"
            onPress={login}
            loading={loading}
            disabled={buttonDisabled}
          />
        </View>
        <View style={styles.forgotPassView}>
          <Button
            transparent
            title="Forgot Password?"
            titleProps={{ color: theme.colors.button.primary, semibold: true }}
            style={styles.registerBtn}
            onPress={onFogotPass}
          />
        </View>
        <View style={styles.registerView}>
          <Text color="#fff">Don't have account?</Text>
          <Button
            transparent
            title="Register"
            titleProps={{ color: theme.colors.button.primary, semibold: true }}
            style={styles.registerBtn}
            onPress={onRegister}
          />
        </View>
      </Container>
      <GAInput
        visible={gaVisible}
        setVisible={setGaVisible}
        onSubmit={onSubmitGaCode}
      />
      <ReCaptcha onReceiveToken={verifyTokenSuccess} ref={recaptcha} />
    </SafeAreaView>
  );
};

Login.propTypes = {};

export default React.memo(Login);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: theme.contentPadding,
    paddingVertical: 10,
  },
  imgBgView: {
    position: 'absolute',
    top: 0,
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
    height: '55%',
    marginTop: '5%',
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
  },
  icon: {
    width: 80,
    height: 50,
  },
  hello: {
    marginBottom: 5,
  },
  body: {
    backgroundColor: '#1A2431',
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
  forgotPassView: {
    marginTop: 15,
  },
});
