import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import PropTypes from 'prop-types';
import constants from 'src/constants';
import { useVisible } from 'src/hooks';
import RepairModal from '../../../components/RepairModal';
import { ImageAssets } from 'src/assets';
import { Icon, ICON_TYPES } from 'src/components';
import { Toast } from 'src/utils';
import theme from 'src/theme';

const NftAction = props => {
  const { data, onRepairSuccess } = props;
  const { durability, status } = data;
  const canRepair =
    durability === 0 && status !== constants.common.SNEAKER_STATUSES.REPAIRING;
  const {
    visible: repairVisible,
    show: showRepair,
    hide: hideRepair,
  } = useVisible(false);

  const onSend = useCallback(() => {
    Toast.show('Coming soon');
  }, []);

  const onBuy = useCallback(() => {
    Toast.show('Coming soon');
  }, []);

  return <View />;

  return (
    <View style={styles.actionView}>
      <TouchableOpacity
        style={[
          styles.actionBtn,
          styles.repairBtn,
          { opacity: canRepair ? 1 : 0.5 },
        ]}
        disabled={!canRepair}
        onPress={showRepair}>
        <RNImage source={ImageAssets.repair} style={styles.btnIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn} onPress={onSend}>
        <Icon name="exit-to-app" color="#fff" size={25} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn} onPress={onBuy}>
        <Icon
          name="rocket-sharp"
          type={ICON_TYPES.ION_ICON}
          color="#fff"
          size={25}
        />
      </TouchableOpacity>
      <RepairModal
        visible={repairVisible}
        onClose={hideRepair}
        data={data}
        onRepairSuccess={onRepairSuccess}
      />
    </View>
  );
};

NftAction.propTypes = {};

export default React.memo(NftAction);

const styles = StyleSheet.create({
  container: {},
  actionView: {
    borderRadius: 45,
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.button.primary,
    flexDirection: 'row',
    marginBottom: 15,
  },
  actionBtn: {
    flex: 1,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repairBtn: {
    backgroundColor: theme.colors.button.primary,
    borderRadius: 43,
  },
  btnIcon: {
    width: 25,
    height: 25,
  },
});
