import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button, Text } from 'src/components';
import { ImageAssets } from 'src/assets';
import theme from 'src/theme';

const ConfirmModal = props => {
  const {
    visible,
    onClose,
    estLoading,
    confirmLoading,
    onConfirm,
    tokenData,
    amount,
    est,
    isFromWallet,
  } = props;

  const msg = useMemo(() => {
    if (estLoading) return 'Estimating Fee...';
    if (confirmLoading) return 'Transfering...';
    return '';
  }, [estLoading, confirmLoading]);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text semibold size={17}>
            Transfer Confirm
          </Text>
          <Image
            source={ImageAssets.tokens[(tokenData.asset || '').toLowerCase()]}
            style={styles.tokenImg}
          />

          {!!msg && (
            <View style={styles.loadingMsg}>
              <ActivityIndicator
                size={'small'}
                color={theme.colors.button.primary}
              />
              <Text>{`  ${msg}`}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text>Transfer</Text>
            <Text style={styles.value} semibold>
              {isFromWallet
                ? 'From Wallet to Funding'
                : 'From Funding to Wallet'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Amount</Text>
            <Text style={styles.value} semibold>
              {amount}
            </Text>
            <Text semibold> {tokenData.asset}</Text>
          </View>
          {isFromWallet && (
            <View style={styles.row}>
              <Text>Estimate Fee</Text>
              <Text style={styles.value} semibold>
                {est}
              </Text>
              <Text semibold> BNB</Text>
            </View>
          )}
          <View style={styles.actionRow}>
            <Button
              title="Cancel"
              style={[styles.btnAction, styles.btnCancel]}
              onPress={onClose}
              disabled={confirmLoading}
            />
            <Button
              title="Confirm"
              style={styles.btnAction}
              titleProps={{ color: '#fff' }}
              onPress={onConfirm}
              loading={confirmLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

ConfirmModal.propTypes = {};

export default React.memo(ConfirmModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: theme.contentPadding,
    alignItems: 'center',
  },
  tokenImg: {
    width: 40,
    height: 40,
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    fontSize: 15,
  },
  loadingMsg: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  btnAction: {
    width: '40%',
    height: 45,
    borderRadius: 10,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    backgroundColor: 'transparent',
  },
});
