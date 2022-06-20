import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, ButtonWithBg } from 'src/components';
import { MessageBox, Toast } from 'src/utils';
import services from 'src/services';
import { actions } from 'src/models';

const Submit = ({ onClose, isDisabled }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dataInput, setDataInput] = useState({});
  const dispatch = useDispatch();

  const onChangeInput = useCallback(
    field => value => {
      setDataInput(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const onSubmitSuccess = useCallback(() => {
    navigation.goBack();
    Toast.show(`${isDisabled ? 'Disable' : 'Enable'} successfully`);
    dispatch(actions.profile.updateUserData({ gaEnable: !isDisabled }));
  }, [navigation, isDisabled, dispatch]);

  const onSubmitFail = useCallback(error => {
    let msg = error?.msg;
    if (error?.code === 'GACODE_WRONG') msg = 'Wrong GA Code';
    if (error?.code === 'PASSWORD_WRONG') msg = 'Wrong Password';

    MessageBox.showError(msg || 'Fail. Please try again');
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) return;
    const { password, gaCode } = dataInput;
    if (!password) return MessageBox.showError('Invalid password');
    if (!gaCode) return MessageBox.showError('Please input GA code');
    setLoading(true);
    const { success, error } = await services.user.updateGA({
      enable: !isDisabled,
      password,
      gaCode,
    });
    setLoading(false);
    if (!success) return onSubmitFail(error);
    onSubmitSuccess();
  }, [loading, onSubmitSuccess, onSubmitFail, dataInput, isDisabled]);

  return (
    <View style={styles.container}>
      <TextInput
        secureTextEntry
        value={dataInput.password}
        onChangeText={onChangeInput('password')}
        placeholder={'Password'}
        placeholderTextColor="rgba(0,0,0,0.4)"
        style={styles.input}
      />
      <TextInput
        value={dataInput.gaCode}
        onChangeText={onChangeInput('gaCode')}
        placeholder={'GA code'}
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="rgba(0,0,0,0.4)"
      />
      <ButtonWithBg
        title={isDisabled ? 'Disable' : 'Enable'}
        style={styles.submitBtn}
        onPress={onSubmit}
        loading={loading}
        borderRadius={45}
      />
    </View>
  );
};
export default React.memo(Submit);

Submit.propTypes = {
  isDisabled: PropTypes.bool,
};

Submit.defaultProps = {
  isDisabled: false,
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 45,
    height: 45,
    paddingHorizontal: 15,
  },
  submitBtn: {
    height: 45,
    paddingVertical: 0,
    alignItems: 'center',
    borderRadius: 45,
    marginTop: '10%',
  },
});
