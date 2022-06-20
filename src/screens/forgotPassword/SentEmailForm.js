import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from 'src/components';

const SentEmailForm = props => {
  const { onChangeData } = props;
  return (
    <View style={styles.container}>
      <Input
        style={styles.inputView}
        placeholder="OTP"
        placeholderTextColor="rgba(0,0,0,0.2)"
        onChangeText={onChangeData('otp')}
        keyboardType="numeric"
      />
      <Input
        style={styles.inputView}
        placeholder="New Password"
        placeholderTextColor="rgba(0,0,0,0.2)"
        isPassword
        onChangeText={onChangeData('password')}
      />
      <Input
        style={styles.inputView}
        placeholder="Confirm password"
        placeholderTextColor="rgba(0,0,0,0.2)"
        isPassword
        onChangeText={onChangeData('confirmPassword')}
      />
    </View>
  );
};

SentEmailForm.propTypes = {};

export default React.memo(SentEmailForm);

const styles = StyleSheet.create({
  container: {},
  inputView: {
    marginTop: 15,
    width: '95%',
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
  },
});
