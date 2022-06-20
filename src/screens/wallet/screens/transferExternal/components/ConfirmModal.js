import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { useBlockchainWallet } from 'src/hooks';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import { Button, Loading, Text } from 'src/components';
import theme from 'src/theme';
import { ImageAssets } from 'src/assets';
import { Logger } from 'src/utils';

const ConfirmModal = props => {
  const {
    onChangeTokens,
    visible,
    onClose,
    showInit,
    hideInitLoading,
    data,
    tokenData,
    onSuccess,
  } = props;
  const wallet = useSelector(selectors.wallet.wallet);
  const walletPin = useSelector(selectors.common.walletPin);
  const {
    loadingBalance,
    loading: accountLoading,
    initAccount,
    accountData,
    transfer,
  } = useBlockchainWallet();
  const initLoading = loadingBalance || accountLoading;
  const [estTransferLoading, setEstTransferLoading] = useState(false);
  const [est, setEst] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { tokens } = accountData;

  const msg = useMemo(() => {
    if (estTransferLoading) return 'Estimating Fee...';
    if (confirmLoading) return 'Transfering...';
    return '';
  }, [estTransferLoading, confirmLoading]);

  useEffect(() => {
    onLoadingChange();
  }, [initLoading, onLoadingChange]);

  useEffect(() => {
    if (wallet) init();
  }, [wallet, init]);

  useEffect(() => {
    if (visible) startTransfer();
  }, [visible, startTransfer]);

  useEffect(() => {
    if (!isEmpty(tokens)) onChangeTokens(tokens);
  }, [tokens, onChangeTokens]);

  const startTransfer = useCallback(async () => {
    setEstTransferLoading(true);
    setEst(0);
    const { isSuccess, value } = await transfer(
      true,
      tokenData.asset,
      data.address,
      data.amount,
    );
    setEstTransferLoading(false);
    if (!isSuccess) return onClose();

    setEst(value);
  }, [tokenData, data, transfer, onClose]);

  const onLoadingChange = useCallback(() => {
    if (!initLoading) hideInitLoading();
  }, [initLoading, hideInitLoading]);

  const init = useCallback(() => {
    showInit();
    initAccount(wallet, walletPin, () => {});
  }, [wallet, walletPin, initAccount, showInit]);

  const onConfirm = useCallback(async () => {
    setConfirmLoading(true);
    const response = await transfer(
      false,
      tokenData.asset,
      data.address,
      data.amount,
    );
    setConfirmLoading(false);
    onClose();
    if (response.isSuccess) return onSuccess();
  }, [tokenData, data, transfer, onClose, onSuccess]);

  const renderContent = useCallback(() => {
    // return <View />;
    if (initLoading)
      return (
        <View style={styles.initLoadingView}>
          <Loading size="large" />
        </View>
      );
    return (
      <View style={styles.content}>
        <Text semibold size={17}>
          Transfer Confirm
        </Text>
        <Image
          source={ImageAssets.tokens[tokenData.asset.toLowerCase()]}
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
          <Text>Address</Text>
          <Text style={styles.value} semibold>
            {data.address}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Amount</Text>
          <Text style={styles.value} semibold>
            {data.amount}
          </Text>
          <Text semibold> {tokenData.asset}</Text>
        </View>
        <View style={styles.row}>
          <Text>Estimate Fee</Text>
          <Text style={styles.value} semibold>
            {est}
          </Text>
          <Text semibold> BNB</Text>
        </View>
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
    );
  }, [
    initLoading,
    data,
    tokenData,
    est,
    msg,
    onClose,
    onConfirm,
    confirmLoading,
  ]);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>{renderContent()}</View>
    </Modal>
  );
};

ConfirmModal.propTypes = {};

export default React.memo(ConfirmModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initLoadingView: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
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
