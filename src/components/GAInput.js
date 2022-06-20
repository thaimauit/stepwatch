import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import Text from './Text';
import OTPInput from './OTPInput';
import Button from './Button';

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const GAInput = props => {
  const { visible, setVisible, onSubmit, onClose } = props;
  const [gaCode, setGaCode] = useState('');

  const handleConfirm = useCallback(() => {
    if (onClose) onClose(true);
    else setVisible(false);

    onSubmit(gaCode);
    setGaCode('');
  }, [gaCode, onSubmit, setVisible, onClose]);

  const handleClose = useCallback(() => setVisible(false), [setVisible]);

  return (
    <Modal transparent visible={visible}>
      <Container style={styles.container} behavior="padding">
        <View style={styles.content}>
          <Text center style={styles.title} bold size={18}>
            Google Authenticator
          </Text>
          <Text semibold center size={15} style={styles.desc}>
            Enter GA code to continue
          </Text>
          <OTPInput style={styles.input} onChangeValue={setGaCode} />

          <View style={styles.actionView}>
            <Button
              title={'Cancel'}
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={handleClose}
            />
            <Button
              title={'Submit'}
              style={styles.actionBtn}
              onPress={handleConfirm}
              titleProps={{ color: '#fff' }}
            />
          </View>
        </View>
      </Container>
    </Modal>
  );
};

GAInput.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

export default React.memo(GAInput);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '85%',
    padding: theme.contentPadding,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  title: {
    marginBottom: 20,
    marginTop: 5,
  },
  desc: {
    marginBottom: 20,
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 15,
    height: 45,
    borderRadius: 45,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
