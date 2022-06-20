import React, { useCallback } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Scaner from 'react-native-qrcode-scanner';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { Header } from './navigation';

const QRCodeScaner = props => {
  const { visible, onClose, onReceiveCode } = props;

  const onReadCode = useCallback(
    data => {
      onClose();
      onReceiveCode(data?.data);
    },
    [onReceiveCode, onClose],
  );

  const renderContent = useCallback(() => {
    return (
      <Scaner
        onRead={onReadCode}
        flashMode={RNCamera.Constants.FlashMode.auto}
        // topContent={
        //   <Text style={styles.centerText} color="#fff">
        //     Go to{' '}
        //     <Text style={styles.textBold} color="#fff">
        //       wikipedia.org/wiki/QR_code
        //     </Text>{' '}
        //     on your computer and scan the QR code.
        //   </Text>
        // }
        // bottomContent={
        //   <TouchableOpacity style={styles.buttonTouchable}>
        //     <Text color="#fff" style={styles.buttonText}>
        //       OK. Got it!
        //     </Text>
        //   </TouchableOpacity>
        // }
      />
    );
  }, [onReadCode]);

  return (
    <Modal transparent visible={visible}>
      <SafeAreaView style={styles.container}>
        <Header onBack={onClose} isLight />
        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </Modal>
  );
};

QRCodeScaner.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onReceiveCode: PropTypes.func.isRequired,
};

export default React.memo(QRCodeScaner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
