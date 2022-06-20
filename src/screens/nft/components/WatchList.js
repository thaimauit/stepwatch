import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NftItem } from 'src/components';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors, types } from 'src/models';
import theme from 'src/theme';
import { useIsFocused } from '@react-navigation/native';

const WatchList = props => {
  const { visible } = props;
  const dispatch = useDispatch();
  const nfts = useSelector(selectors.profile.nfts);
  const loading = useSelector(selectors.common.loading(types.profile.GET_NFTS));
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && visible) fetchData();
  }, [isFocused, fetchData, visible]);

  const fetchData = useCallback(() => {
    dispatch(actions.profile.getNFT());
  }, [dispatch]);

  const setKey = useCallback(item => item.id, []);

  const renderNft = useCallback(({ item }) => {
    return <NftItem data={item} isMine />;
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
        data={nfts}
        keyExtractor={setKey}
        renderItem={renderNft}
        numColumns={2}
        columnWrapperStyle={styles.contentStyle}
      />
    </View>
  );
};

WatchList.propTypes = {};

export default React.memo(WatchList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
