import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Button, Text } from 'src/components';
import theme from 'src/theme';

const ConfirmStop = props => {
  const { visible, onClose, onExit, onSubmit } = props;
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text bold size={20} center>
            Confirm
          </Text>
          <Text center semibold size={15}>
            {'\n\nDo you want to submit your record?\n\n'}
          </Text>
          <Button
            transparent
            icon={{ name: 'close', size: 23 }}
            style={styles.closeBtn}
            onPress={onClose}
          />
          <View style={styles.actionRow}>
            <Button
              title="Exit"
              onPress={onExit}
              transparent
              titleProps={{ bold: true, color: 'rgba(0,0,0,.7)' }}
              style={[styles.actionBtn, styles.cancelBtn]}
            />
            <Button
              title="Submit"
              onPress={onSubmit}
              titleProps={{ color: '#fff' }}
              style={[styles.actionBtn]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

ConfirmStop.propTypes = {};

export default React.memo(ConfirmStop);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnLabelStyle: {
    color: theme.colors.button.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnExitLabelStyle: {
    color: theme.colors.button.primary,
    fontSize: 15,
  },
  actionBtn: {
    width: '40%',
    marginHorizontal: 5,
    paddingVertical: 0,
    height: 40,
    borderRadius: 40,
  },
});
