import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Button, ButtonWithBg, Input, Text } from 'src/components';
import theme from 'src/theme';
import services from 'src/services';
import { Toast } from 'src/utils';

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const UpdateDisplayName = props => {
  const { visible, onClose, displayName, onUpdateSuccess } = props;
  const [value, setValue] = useState(displayName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) setValue(displayName);
  }, [visible, displayName]);

  const onUpdate = useCallback(async () => {
    setLoading(true);
    const { success } = await services.user.updateProfile({
      displayName: value,
    });
    setLoading(false);
    if (success) {
      onClose();
      onUpdateSuccess(value);
      Toast.show('Update Success');
    }
  }, [value, onUpdateSuccess, onClose]);

  return (
    <Modal visible={visible} transparent>
      <Container style={styles.container} behavior="padding">
        <View style={styles.content}>
          <Text center bold size={18}>
            {'Update Profile'}
          </Text>
          <Button
            icon={{ name: 'close', size: 25 }}
            style={styles.closeBtn}
            onPress={onClose}
            transparent
          />
          <Text style={styles.inputLabel}>Display Name</Text>
          <Input
            value={value}
            onChangeText={setValue}
            style={styles.input}
            autoFocus
          />
          <ButtonWithBg
            style={styles.submit}
            title="UPDATE"
            loading={loading}
            disabled={!value}
            onPress={onUpdate}
            titleProps={{ color: '#fff', bold: true }}
          />
        </View>
      </Container>
    </Modal>
  );
};

UpdateDisplayName.propTypes = {};

export default React.memo(UpdateDisplayName);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '85%',
    padding: theme.contentPadding,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  inputLabel: {
    marginTop: 30,
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
  },
  submit: {
    marginTop: 20,
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
  },
});
