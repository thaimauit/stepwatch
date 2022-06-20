import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Text, Button, Loading } from 'src/components';
import { Logger, MessageBox, Device } from 'src/utils';
import services from 'src/services';
import theme from 'src/theme';

const ScanQRCode = () => {
  const [gaData, setGaData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateGAQRCode();
  }, [generateGAQRCode]);

  const generateGAQRCode = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success } = await services.user.generateGAQRCode();
      setLoading(false);
      if (success) setGaData(data);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const handleCopy = useCallback(
    gaCode => () => {
      MessageBox.showSuccess('Copied');
      Clipboard.setString(gaCode);
    },
    [],
  );

  const renderKey = () => {
    const GAKey = gaData.manualEntryKey;
    if (!GAKey) return;
    return (
      <View>
        <View style={styles.rowKey}>
          <Text style={styles.key}>{GAKey}</Text>
          <Button
            icon={{
              name: 'file-copy',
              size: 20,
              color: 'rgba(255,255,255,0.5)',
            }}
            transparent
            onPress={handleCopy(GAKey)}
          />
        </View>
        <Text style={styles.keyNote} color="#fff">
          {
            'Please save this Key on paper. This Key will allow you to recover your Google Authenticator in case of phone loss'
          }
        </Text>
      </View>
    );
  };

  Logger.info('gaData', gaData);

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {!!gaData.qrCodeSetupImageUrl && (
          <Image
            style={styles.img}
            source={{ uri: gaData.qrCodeSetupImageUrl }}
          />
        )}
        {loading && (
          <View style={styles.loadingView}>
            <Loading />
          </View>
        )}
        {!loading && !gaData.manualEntryKey && (
          <View style={styles.loadingView}>
            <Button
              style={styles.failBtn}
              title={'Fail. Try again'}
              onPress={generateGAQRCode}
            />
          </View>
        )}
      </View>
      {renderKey()}
    </View>
  );
};
export default React.memo(ScanQRCode);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
  },
  imgContainer: {
    backgroundColor: '#fff',
    width: Device.screenWidth * 0.8,
    height: Device.screenWidth * 0.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: Device.screenWidth * 0.7,
    height: Device.screenWidth * 0.7,
  },
  rowKey: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  key: {
    color: theme.colors.button.primary,
    fontSize: 16,
  },
  keyNote: {
    marginTop: 5,
    textAlign: 'center',
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failBtn: {
    backgroundColor: theme.colors.error,
  },
});
