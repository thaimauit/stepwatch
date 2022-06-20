import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonWithBg, Header, Input, Text } from 'src/components';
import theme from 'src/theme';
import { MessageBox, Toast } from 'src/utils';
import services from 'src/services';

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const ChangePassword = props => {
  const { navigation } = props;
  const data = useRef({});
  const [loading, setLoading] = useState(false);

  const onChangeData = useCallback(
    field => value => {
      data.current[field] = value;
    },
    [],
  );

  const onSubmit = useCallback(async () => {
    const { password, oldPassword } = data.current;
    if (!password || !oldPassword)
      return MessageBox.showError('Please input old password and new password');
    // if (!password || !oldPassword)
    //   return MessageBox.showError(
    //     'New password is them same with old password',
    //   );
    setLoading(true);
    const { success, error } = await services.user.changePassword(
      oldPassword,
      password,
    );
    setLoading(false);
    if (!success)
      return MessageBox.showError(error.msg || 'Change password fail');
    navigation.goBack();
    Toast.show('Change password successfully');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Change Password"
        navigation={navigation}
        titleProps={{ color: '#fff' }}
      />
      <Container style={styles.body} behavior="padding">
        <Text color="#fff" semibold size={15}>
          Old password
        </Text>
        <Input
          onChangeText={onChangeData('oldPassword')}
          style={styles.input}
          isPassword
        />
        <Text color="#fff" semibold size={15}>
          New Password
        </Text>
        <Input
          onChangeText={onChangeData('password')}
          style={styles.input}
          isPassword
        />
        <ButtonWithBg
          title="Update"
          style={styles.btn}
          loading={loading}
          onPress={onSubmit}
          borderRadius={45}
        />
      </Container>
    </SafeAreaView>
  );
};

ChangePassword.propTypes = {};

export default React.memo(ChangePassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
    paddingTop: '10%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 45,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 5,
  },
  btn: {
    marginTop: '10%',
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
  },
});
