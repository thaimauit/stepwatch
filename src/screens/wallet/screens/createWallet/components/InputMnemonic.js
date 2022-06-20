import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { isEmpty, isEqual } from 'lodash';
import { Button, Header, Text } from 'src/components';
import theme from 'src/theme';
import { Toast, Utils } from 'src/utils';

const InputMnemonic = props => {
  const { onClose, mnemonicList, onConfirm, loading } = props;
  const [dataMap, setDataMap] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const array = isEmpty(mnemonicList) ? [] : Utils.shuffleArray(mnemonicList);
    const newData = array.reduce((data, item) => {
      data[item] = -1;
      return data;
    }, {});
    setDataMap(newData);
  }, [mnemonicList]);

  const onPressShuffle = useCallback(
    item => () => {
      const index = dataMap[item];
      const isSelected = index !== -1;
      setDataMap(prev => ({
        ...prev,
        [item]: isSelected ? -1 : selected.length,
      }));
      setSelected(prev => {
        if (isSelected)
          return [...prev.slice(0, index), ...prev.slice(index + 1)];

        return [...prev, item];
      });
    },
    [dataMap, selected],
  );

  const onPressConfirm = useCallback(() => {
    if (!isEqual(selected, mnemonicList)) return Toast.show('Invalid');
    onConfirm();
  }, [selected, mnemonicList, onConfirm]);

  const renderShuffleItem = useCallback(
    (item, key) => {
      const isSelected = dataMap[item] !== -1;

      const btnStyle = { opacity: isSelected ? 0.5 : 1 };

      return (
        <View style={btnStyle} key={item + key}>
          <Button
            style={[styles.shuffleItem]}
            title={item}
            onPress={onPressShuffle(item)}
          />
        </View>
      );
    },
    [dataMap, onPressShuffle],
  );

  const renderSelectedItem = useCallback((item, key) => {
    return <Text key={item + key}>{`${item}  `}</Text>;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header hightlight title="EXPORT" onBack={onClose} />
      <View style={styles.body}>
        <Text color="red">
          Please choose Seed Phrase in order and make sure your Seed Phrase was
          correct written, once forgotten, it cannot be recovered
        </Text>
        <View style={styles.inputView}>{selected.map(renderSelectedItem)}</View>
        <View style={styles.shuffleDataView}>
          {Object.keys(dataMap).map(renderShuffleItem)}
        </View>
      </View>
      <Button
        disabled={selected.length !== 12}
        style={styles.confirm}
        title="CONFIRM"
        onPress={onPressConfirm}
        loading={loading}
      />
    </SafeAreaView>
  );
};

InputMnemonic.propTypes = {};

export default React.memo(InputMnemonic);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
    marginTop: 10,
  },
  confirm: {
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: theme.colors.button.highlight,
    marginHorizontal: '10%',
  },
  shuffleDataView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shuffleItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    marginTop: 10,
    marginRight: 20,
    backgroundColor: '#fff',
  },
  inputView: {
    height: 90,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
    padding: 10,
  },
});
