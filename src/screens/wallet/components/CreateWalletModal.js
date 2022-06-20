import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Text } from 'src/components';
import { selectors } from 'src/models';
import theme from 'src/theme';

const CreateWalletModal = props => {
  const { visible, onClose, onCreate, onImport } = props;
  const userAddress = useSelector(selectors.profile.userAddress);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text size={18} semibold style={styles.title}>
            POLYGON WALLET
          </Text>

          <Button
            icon={{ name: 'close' }}
            style={styles.closeBtn}
            onPress={onClose}
          />

          {!userAddress && (
            <Button
              style={styles.button}
              title="Create a new wallet"
              titleStyle={styles.btnLabelStyle}
              onPress={onCreate}
            />
          )}
          <Button
            style={[styles.button, styles.importBtn]}
            title="Import exist wallet"
            titleStyle={styles.btnLabelStyle}
            onPress={onImport}
          />
        </View>
      </View>
    </Modal>
  );
};

CreateWalletModal.propTypes = {};

export default React.memo(CreateWalletModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    padding: 15,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.button.primary,
  },
  button: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
  },
  importBtn: {
    backgroundColor: theme.colors.button.primary,
  },
  btnLabelStyle: {
    fontStyle: 'italic',
  },
});
