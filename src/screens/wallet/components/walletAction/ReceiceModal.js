import React, { useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import PropTypes from 'prop-types';
import Clipboard from '@react-native-clipboard/clipboard';
import { Device, Toast } from 'src/utils';
import theme from 'src/theme';
import { Button, Text } from 'src/components';
import { useInsets } from 'src/hooks';

const ReceiveModal = props => {
  const { visible, onClose, address } = props;
  const { bottom: paddingBottom } = useInsets();

  const onCopy = useCallback(() => {
    Clipboard.setString(address);
    onClose();
    Toast.show('Copied');
  }, [onClose, address]);

  return (
    <Modal transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.container]}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { paddingBottom }]}>
              <Text bold size={16}>
                {'RECEIVE\n'}
              </Text>
              <View style={styles.chainView}>
                <Text>BNB Smart Chain (BEP20)</Text>
              </View>
              <View style={styles.qrCode}>
                <QRCode
                  value={address}
                  size={Device.screenWidth * 0.5}
                  style={styles.qrCode}
                />
              </View>
              <Text center>Scan address to receive payment</Text>
              <Text style={styles.address}>{address}</Text>
              <Button
                title="COPY ADDRESS"
                titleProps={{ bold: true, italic: true, color: '#fff' }}
                style={styles.btn}
                onPress={onCopy}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

ReceiveModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default React.memo(ReceiveModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'flex-end',
  },
  content: {
    maxHeight: Device.screenHeight * 0.8,
    padding: theme.contentPadding,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  chainView: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#e5a624',
  },
  qrCode: {
    marginVertical: 20,
  },
  address: {
    borderWidth: 0.5,
    borderRadius: 13,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  btn: {
    width: '80%',
    height: 45,
    borderRadius: 45,
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: 20,
  },
});
