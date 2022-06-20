import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BoxItem } from 'src/components';
import { actions, selectors, types } from 'src/models';
import theme from 'src/theme';
import { Logger } from 'src/utils';

const BoxList = props => {
  const { visible } = props;
  const dispatch = useDispatch();
  const boxs = useSelector(selectors.profile.boxs);
  const loading = useSelector(selectors.common.loading(types.profile.GET_BOXS));
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && visible) fetchData();
  }, [isFocused, fetchData, visible]);

  const fetchData = useCallback(() => {
    dispatch(actions.profile.getBox());
  }, [dispatch]);

  const setKey = useCallback(item => item.id, []);

  const renderNft = useCallback(({ item }) => {
    return <BoxItem data={item} isMine />;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor={theme.colors.button.highlight}
          />
        }
        data={boxs}
        keyExtractor={setKey}
        renderItem={renderNft}
        numColumns={2}
        columnWrapperStyle={styles.contentStyle}
      />
    </View>
  );
};

BoxList.propTypes = {};

export default React.memo(BoxList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
