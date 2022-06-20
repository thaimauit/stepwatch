import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Image, MessageView, Text } from 'src/components';
import theme from 'src/theme';
import services from 'src/services';
import constants from 'src/constants';

const RepairModal = props => {
  const { data, visible, onClose, onRepairSuccess } = props;
  const { fileUri, type, id, repairHours, repairCost } = data;
  const [messageProps, setMessageProps] = useState({ visible: false });
  const [loading, setLoading] = useState(false);

  const timeFormated = useMemo(() => {
    const duration = moment.duration(repairHours, 'hours');
    const hours = duration.hours();
    const days = duration.days();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const time =
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds);

    return (days > 0 ? days + ' days - ' : '') + time;
  }, [repairHours]);

  const onHideMsg = useCallback(() => {
    setMessageProps({ visible: false });
  }, []);

  const onRepair = useCallback(async () => {
    setLoading(true);
    const { success, error } = await services.nft.repair(id);
    setLoading(false);
    if (!success)
      return setMessageProps({
        visible: true,
        content: error.msg || 'Repair Fail. Please try again',
        type: constants.common.MESSAGE_TYPES.ERROR,
      });
    onClose();
    onRepairSuccess();
  }, [id, onRepairSuccess, onClose]);

  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <Text style={styles.title} bold center size={18}>
              REPAIR SNEAKERS
            </Text>
            <Button
              style={[styles.headerSide, styles.closeBtn]}
              icon={{
                name: 'close',
                color: theme.colors.button.primary,
                size: 25,
              }}
              onPress={onClose}
              disabled={loading}
              transparent
            />
          </View>
          <MessageView
            {...messageProps}
            onHide={onHideMsg}
            isModal={false}
            style={{ marginTop: 20 }}
          />
          <ScrollView>
            <View style={styles.body}>
              <Image
                source={{ uri: fileUri }}
                style={styles.sneakerImg}
                resizeMode="contain"
              />
              <View style={styles.rowInfo}>
                <Text color="rgba(0,0,0,.5)" size={16}>
                  TYPE:
                </Text>
                <Text color="rgba(0,0,0,.5)" size={16} style={styles.value}>
                  {type}
                </Text>
              </View>
              <View style={styles.rowInfo}>
                <Text color="rgba(0,0,0,.5)" size={16}>
                  ID:
                </Text>
                <Text color="rgba(0,0,0,.5)" size={16} style={styles.value}>
                  {id}
                </Text>
              </View>
              <View style={styles.rowInfo}>
                <Text color="rgba(0,0,0,.5)" size={16}>
                  TIME:
                </Text>
                <Text color="rgba(0,0,0,.5)" size={16} style={styles.value}>
                  {timeFormated}
                </Text>
              </View>
              <View style={styles.rowInfo}>
                <Text color="rgba(0,0,0,.5)" size={16}>
                  COST:
                </Text>
                <Text color="rgba(0,0,0,.5)" size={16} style={styles.value}>
                  {repairCost} WST
                </Text>
              </View>
            </View>
          </ScrollView>
          <LinearGradient
            colors={[theme.colors.button.primary, '#C83C87']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={styles.repairBtnView}>
            <Button
              title="Repair"
              transparent
              style={styles.repairBtn}
              titleProps={{ color: '#fff', bold: true }}
              onPress={onRepair}
              loading={loading}
            />
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

RepairModal.propTypes = {};

export default React.memo(RepairModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.8)',
    paddingBottom: 10,
  },
  headerSide: {
    width: 35,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginHorizontal: 10,
  },
  closeBtn: {
    width: 35,
    height: 35,
    borderRadius: 35,
    borderColor: theme.colors.button.primary,
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
  },
  sneakerImg: {
    width: '50%',
    height: 100,
    marginBottom: 20,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  value: {
    textTransform: 'uppercase',
  },
  repairBtnView: {
    alignSelf: 'center',
    height: 45,
    borderRadius: 45,
    marginTop: 20,
    width: '50%',
    marginBottom: 15,
  },
  repairBtn: {
    borderRadius: 45,
    height: '100%',
    paddingVertical: 0,
    justifyContent: 'center',
  },
});
