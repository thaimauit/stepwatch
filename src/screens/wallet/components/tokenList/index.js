import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image as RNImage,
} from 'react-native';
import { isEmpty } from 'lodash';
import { Image, Text } from 'src/components';
import { ImageAssets } from 'src/assets';
import theme from 'src/theme';

const TokenList = props => {
  const { list = [], onFetch, loading, isWallet, notScroll } = props;

  const renderItem = useCallback(
    (item, index) => {
      const isLast = index === list.length - 1;
      const borderBottomWidth = isLast ? 0 : 1;

      return (
        <View style={[styles.itemView, { borderBottomWidth }]} key={item.asset}>
          <RNImage
            source={ImageAssets.tokens[item.asset.toLowerCase()]}
            style={styles.icon}
          />
          <Text style={styles.fundingName} bold color="#fff">
            {item.asset}
          </Text>
          <Text color="#fff">{isWallet ? item.balance : item.amount}</Text>
        </View>
      );
    },
    [list, isWallet],
  );

  if (isEmpty(list)) return <View />;

  if (notScroll)
    return <View style={styles.contentList}>{list.map(renderItem)}</View>;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onFetch} />
      }>
      <View style={styles.contentList}>{list.map(renderItem)}</View>
    </ScrollView>
  );
};

TokenList.propTypes = {
  list: PropTypes.array,
  onFetch: PropTypes.func,
  loading: PropTypes.bool,
  isWallet: PropTypes.bool,
};

export default React.memo(TokenList);

const styles = StyleSheet.create({
  contentList: {
    margin: theme.contentPadding,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
  },
  fundingName: {
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
