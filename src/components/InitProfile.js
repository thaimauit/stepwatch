import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image as RNImage,
  ImageBackground,
  Keyboard,
} from 'react-native';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { actions, selectors } from 'src/models';
import { ImageAssets } from 'src/assets';
import theme from 'src/theme';
import { Device, MessageBox } from 'src/utils';
import { useInsets, useSystemConstants } from 'src/hooks';
import services from 'src/services';
import Loading from './Loading';
import Input from './Input';
import Text from './Text';
import Button from './Button';
import Image from './Image';
import LinearGradient from 'react-native-linear-gradient';
import ButtonWithBg from './ButtonWithBg';
import Icon from './Icon';

const InputContainer = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const LogoutBtn = ({ onPress }) => {
  return (
    <Button
      transparent
      title={'Exit'}
      onPress={onPress}
      titleProps={{ color: '#fff', italic: true }}
      titleStyle={{ textDecorationLine: 'underline' }}
    />
  );
};

const InitProfile = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectors.profile.userData);
  const isSkipCode = useSelector(selectors.profile.isSkipCode);
  const [inputRefVisible, setInputRefVisible] = useState(false);
  const refCode = useRef();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { bottom } = useInsets();
  const [skipLoading, setSkipLoading] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsShowKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsShowKeyboard(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useSystemConstants();

  useEffect(() => {
    if (!isEmpty(userData) && !userData.referralId) setInputRefVisible(true);
  }, [userData]);

  const onChangeRefCode = useCallback(code => {
    refCode.current = code;
  }, []);

  const submitRefId = useCallback(async () => {
    if (!refCode.current)
      return MessageBox.showError('Please enter referal id to continue');
    setSubmitLoading(true);
    const { success } = await services.user.updateRefId(refCode.current);
    setSubmitLoading(false);
    if (!success) return MessageBox.showError('Fail. Please try again');

    dispatch(actions.profile.updateRefId(refCode.current));
    MessageBox.showSuccess('Update successfully');
  }, [dispatch]);

  const onLogout = useCallback(() => {
    dispatch(actions.profile.logout());
  }, [dispatch]);

  const onSkip = useCallback(async () => {
    // dispatch(actions.profile.saveData({ isSkipCode: true }));
    setSkipLoading(true);
    await services.user.updateRefId('123', true);
    setSkipLoading(false);
    dispatch(actions.profile.skipCode());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgView}>
        <RNImage
          source={ImageAssets.activeScreen.bg}
          style={styles.imgBg}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loadingView}>
        {!inputRefVisible && (
          <Loading color={theme.colors.button.primary} size="large" />
        )}
        {!inputRefVisible && (
          <View style={[styles.logoutBtnView, { bottom }]}>
            <LogoutBtn onPress={onLogout} />
          </View>
        )}
      </View>
      {inputRefVisible && !isSkipCode && (
        <InputContainer style={styles.refContainer} behavior="padding">
          <ImageBackground
            source={ImageAssets.activeScreen.modal}
            resizeMode="cover"
            style={styles.refView}
            imageStyle={styles.refContent}>
            <View style={styles.refBody}>
              <Text color="#fff" center size={15}>
                {
                  'We are working hard to make Stepwatch ready for everybody and we xare building up our community eco-system carefully and responsibly, thus activation code is required to enter the game. '
                }
              </Text>
              <Input
                style={styles.input}
                onChangeText={onChangeRefCode}
                autoFocus
                placeholder="Activation code"
                placeholderTextColor="rgba(0,0,0,.4)"
              />
              <ButtonWithBg
                borderRadius={10}
                style={styles.btnSubmit}
                loading={submitLoading || skipLoading}
                onPress={submitRefId}>
                <View style={styles.btnContent}>
                  <Text bold size={15}>
                    ENTER
                  </Text>
                  <RNImage
                    source={ImageAssets.activeScreen.icon}
                    style={styles.submitIcon}
                  />
                </View>
              </ButtonWithBg>

              <Button
                title="Skip"
                transparent
                style={styles.skip}
                titleProps={{ color: '#fff', semibold: true, italic: true }}
                onPress={onSkip}
                loading={skipLoading}
              />
            </View>
          </ImageBackground>
          {!isShowKeyboard && (
            <View style={[styles.logoutBtnView, { bottom }]}>
              <LogoutBtn onPress={onLogout} />
            </View>
          )}
        </InputContainer>
      )}
      {/* <Modal transparent visible={inputRefVisible}>
        <InputContainer style={styles.refContainer} behavior="padding">
          <View style={styles.refContent}>
            <Text bold size={18} center>
              Referal Code
            </Text>
            <Text size={16}>{'\nPlease enter referal code to continue\n'}</Text>
            <Input
              style={styles.input}
              onChangeText={onChangeRefCode}
              autoFocus
            />
            <Button
              title="Submit"
              style={styles.btn}
              loading={submitLoading}
              onPress={submitRefId}
              titleProps={{ color: '#fff' }}
            />
          </View>
          <View style={[styles.logoutBtnView, { bottom }]}>
            <LogoutBtn onPress={onLogout} />
          </View>
        </InputContainer>
      </Modal> */}
    </SafeAreaView>
  );
};

InitProfile.propTypes = {};

export default React.memo(InitProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo: {
    width: '70%',
    height: 60,
    marginTop: '20%',
  },
  refContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refView: {
    width: '80%',
    borderRadius: 20,
  },
  refContent: {
    width: '100%',
    borderRadius: 20,
  },
  refBody: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: theme.contentPadding,
    borderRadius: 20,
  },
  input: {
    marginBottom: 15,
    marginTop: 20,
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  btn: {
    borderRadius: 45,
    height: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: 10,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    height: 40,
    justifyContent: 'center',
    borderRadius: 40,
    width: Device.screenWidth * 0.4,
    alignItems: 'center',
  },
  logoutBtnView: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  imgView: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  imgBg: {
    width: '100%',
    height: '60%',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  btnSubmit: {
    marginTop: 10,
  },
  skip: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 15,
  },
});
