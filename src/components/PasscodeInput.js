import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './navigation';
import theme from 'src/theme';
import Text from './Text';
import Button from './Button';
import { ICON_TYPES } from './Icon';
import { ToastView } from './toast';

const PASSCODE_SOURCES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '',
  '0',
  'x',
];

const INDICATORS = [0, 1, 2, 3, 4, 5];

const PasscodeInput = props => {
  const { visible, onClose, secondStep, onFillCode } = props;
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const step1Code = useRef();
  const [toastProps, setToastProps] = useState({
    visible: false,
  });

  const onHideToast = useCallback(() => {
    setToastProps({ visible: false });
  }, []);

  useEffect(() => {
    onCodeChange(code);
  }, [code, onCodeChange]);

  const onCodeChange = useCallback(
    codeStr => {
      if (codeStr.length !== 6) return;
      if (!secondStep) return onFillCode(code);

      if (step === 1) {
        step1Code.current = code;
        setCode('');
        setStep(2);
        return;
      }
      if (code !== step1Code.current) {
        setStep(1);
        setCode('');
        setToastProps({ visible: true, content: 'Passcode not match' });
        return;
      }
      setStep(1);
      onFillCode(code);
      setCode('');
    },
    [secondStep, onFillCode, code, step],
  );

  const onPressKeyboard = useCallback(
    key => () => {
      const isX = key === 'x';
      if (isX) {
        if (!code || !code.length) return;
        const newCode = code.substring(0, code.length - 1);
        setCode(newCode);
        return;
      }
      if (!code) return setCode(key);
      if (code.length === 6) return;
      setCode(code + key);
    },
    [code],
  );

  const renderKeyboard = useCallback(
    key => {
      const isX = key === 'x';
      const isEmpty = !key;

      const keyProps = isX
        ? {
            icon: {
              name: 'ios-backspace',
              type: ICON_TYPES.ION_ICON,
              color: '#6D6D6D',
              size: 40,
            },
          }
        : { title: key };
      return (
        <View style={styles.keyWrapper} key={key}>
          {!isEmpty && (
            <Button
              transparent={isX}
              style={!isX && styles.keyItem}
              {...keyProps}
              titleStyle={{
                color: '#fff',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
              onPress={onPressKeyboard(key)}
            />
          )}
        </View>
      );
    },
    [onPressKeyboard],
  );

  const renderIndicator = useCallback(
    key => {
      const isPass = code && code.length > key;
      const style = { backgroundColor: isPass ? '#fff' : 'transparent' };
      return <View style={[styles.indicator, style]} key={key} />;
    },
    [code],
  );

  return (
    <Modal transparent visible={visible}>
      <SafeAreaView style={styles.container}>
        <Header
          onBack={onClose}
          isLight
          title="SECURE WALLET"
          titleProps={{ color: '#fff', italic: true }}
        />
        <View style={styles.body}>
          <Text color="#fff" size={20} bold italic style={styles.title}>
            {' '}
            {!secondStep ? 'Input' : step === 2 ? 'Confirm' : 'Create'} your
            passcode
          </Text>
          <View style={styles.indicatorList}>
            {INDICATORS.map(renderIndicator)}
          </View>
          <View style={styles.sourceList}>
            {PASSCODE_SOURCES.map(renderKeyboard)}
          </View>
        </View>
        <ToastView {...toastProps} onHide={onHideToast} />
      </SafeAreaView>
    </Modal>
  );
};

PasscodeInput.propTypes = {};

export default React.memo(PasscodeInput);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    margin: theme.contentPadding,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  keyWrapper: {
    width: '33%',
    alignItems: 'center',
    marginTop: '5%',
  },
  keyItem: {
    backgroundColor: '#6D6D6D',
    width: 50,
    height: 50,
    borderRadius: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: '5%',
  },
  indicatorList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 10,
  },
});
