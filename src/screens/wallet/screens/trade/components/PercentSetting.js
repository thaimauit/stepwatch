import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button, Input, Text } from 'src/components';
import theme from 'src/theme';
import { Utils } from 'src/utils';

const DEFAULT_LIST = ['0.1', '0.5', '1'];

const Container = Platform.select({
  ios: KeyboardAvoidingView,
  android: View,
});

const PercentSettings = props => {
  const { value, visible, onClose, onSave } = props;
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    if (visible) onShow();
  }, [visible, onShow]);

  const submitDisabled = useMemo(() => {
    if (!currentValue) return true;
    const { valid, value: percentValue } =
      Utils.parseNumberWithResult(currentValue);
    if (!valid) return true;
    if (percentValue > 50) return true;
  }, [currentValue]);

  const errorStr = useMemo(() => {
    if (!currentValue) return '';
    if (currentValue === '0') return 'Transaction may fail';
    const { valid, value: percentValue } =
      Utils.parseNumberWithResult(currentValue);
    if (!valid) return 'Invalid';
    if (percentValue === 0) return 'Transaction may fail';
    if (percentValue > 50) return 'Slippage Tolerance should be less than 50%';
    return '';
  }, [currentValue]);

  const onShow = useCallback(() => {
    setCurrentValue(value);
  }, [value]);

  const onSelectDefaultItem = useCallback(
    item => () => {
      setCurrentValue(item);
    },
    [],
  );

  const onConfirm = useCallback(() => {
    const { value: percentValue } = Utils.parseNumberWithResult(currentValue);
    onSave(percentValue + '');
    onClose();
  }, [onSave, currentValue, onClose]);

  const renderDefaultItem = useCallback(
    item => {
      const isSelected = currentValue === item;
      const style = isSelected
        ? { backgroundColor: theme.colors.button.primary }
        : {};

      return (
        <TouchableOpacity
          key={item}
          style={[styles.item, style]}
          onPress={onSelectDefaultItem(item)}>
          <Text bold italic color={isSelected ? '#fff' : '#000'}>
            {item}%
          </Text>
        </TouchableOpacity>
      );
    },
    [currentValue, onSelectDefaultItem],
  );

  return (
    <Modal transparent visible={visible}>
      <Container style={styles.container} behavior="padding">
        <View style={styles.body}>
          <Text italic bold size={16} center>
            SETTING
          </Text>

          <Text color="rgba(0,0,0,0.6)">{'\n\nSlippage Tolerance\n'}</Text>
          <View style={styles.defaultList}>
            {DEFAULT_LIST.map(renderDefaultItem)}
          </View>

          <Input
            style={styles.input}
            value={currentValue}
            keyboardType="numeric"
            onChangeText={setCurrentValue}
            autoFocus
            rightTitle="%"
          />
          {!!errorStr && (
            <Text color={theme.colors.error}>{`\n${errorStr}`}</Text>
          )}

          <View style={styles.actionView}>
            <Button
              style={[styles.actionBtn, styles.cancelBtn]}
              title="Cancel"
              onPress={onClose}
            />
            <Button
              style={[styles.actionBtn]}
              title="Confirm"
              onPress={onConfirm}
              disabled={submitDisabled}
              titleProps={{ color: '#fff' }}
            />
          </View>

          <Button
            icon={{ name: 'close', size: 25 }}
            transparent
            onPress={onClose}
            style={styles.closeBtn}
          />
        </View>
      </Container>
    </Modal>
  );
};

PercentSettings.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default React.memo(PercentSettings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  body: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: theme.contentPadding,
    width: '85%',
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  defaultList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    width: '30%',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 5,
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  cancelBtn: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 0,
    marginRight: 10,
  },
  input: {
    marginTop: 20,
    borderRadius: 5,
    height: 45,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 15,
  },
});
