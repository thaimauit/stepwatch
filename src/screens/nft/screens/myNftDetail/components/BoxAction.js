import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'src/components';
import theme from 'src/theme';
import { useCallback } from 'react';
import { useState } from 'react';
import UnboxAnimation from './UnboxAnimation';
import services from 'src/services';
import { MessageBox } from 'src/utils';

const BoxAction = props => {
  const [unBoxLoading, setUnBoxLoading] = useState(false);
  const { id } = props;

  const onUnbox = useCallback(async () => {
    setUnBoxLoading(true);
    const { success, error } = await services.nft.unBox(id);
    setUnBoxLoading(false);
    if (!success) return MessageBox.showError(error?.msg || 'Fail');
    // MessageBox.showSuccess()
  }, [id]);

  return (
    <View style={styles.container}>
      <Button
        title="Unbox"
        titleProps={{ color: '#fff' }}
        style={styles.btn}
        disabled
        // onPress={onUnbox}
      />
      <UnboxAnimation visible={unBoxLoading} />
    </View>
  );
};

BoxAction.propTypes = {};

export default React.memo(BoxAction);

const styles = StyleSheet.create({
  container: {},
  btn: {
    height: 40,
    borderRadius: 40,
    marginBottom: 15,
  },
});
