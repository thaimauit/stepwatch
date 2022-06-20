import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NftItem } from 'src/components';
import services from 'src/services';
import theme from 'src/theme';
import NFTDetail from './screens/nftDetail';

const Store = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await services.nft.getListBaseNft();
    setNfts(data);
    setLoading(false);
  }, []);

  const setKey = useCallback(item => {
    return item.id;
  }, []);

  const renderNft = useCallback(({ item }) => {
    return <NftItem data={item} />;
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

Store.propTypes = {};

export { NFTDetail };

export default React.memo(Store);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000',
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
