import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NftItem, TabContent, TabHeader } from 'src/components';
import { actions, selectors, types } from 'src/models';
import theme from 'src/theme';
import MyNftDetail from './screens/myNftDetail';
import WatchList from './components/WatchList';
import BoxList from './components/BoxList';

const TAB_KEYS = {
  BOX: 'box',
  WATCH: 'watch',
};

const TABS = [
  {
    key: TAB_KEYS.WATCH,
    name: 'Watch',
  },
  {
    key: TAB_KEYS.BOX,
    name: 'Box',
  },
];

const tabComponents = {
  [TAB_KEYS.BOX]: BoxList,
  [TAB_KEYS.WATCH]: WatchList,
};

const NFT = () => {
  const [currentTab, setCurrentTab] = useState(TAB_KEYS.WATCH);

  return (
    <View style={styles.container}>
      <TabHeader
        tabs={TABS}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        tabItemStyle={styles.tabHeaderItem}
        style={styles.tabHeader}
        tabItemTitleStyle={styles.tabTitle}
      />
      <TabContent
        tabs={TABS}
        tabComponents={tabComponents}
        currentTab={currentTab}
        style={{ flex: 1 }}
      />
    </View>
  );
};

NFT.propTypes = {};

export { MyNftDetail };

export default React.memo(NFT);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabHeader: {
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabHeaderItem: {
    width: '40%',
    height: 40,
    borderRadius: 40,
  },
  tabTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});
