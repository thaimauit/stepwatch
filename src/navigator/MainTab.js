import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar, NavigationHeaderTab } from 'src/components';
import constants from 'src/constants';
import Home from '../screens/home';
import Wallet from '../screens/wallet';
import Store from '../screens/store';
import NFT from '../screens/nft';
import theme from 'src/theme';

const Tab = createBottomTabNavigator();

const Ranking = () => <View />;

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        header: props => <NavigationHeaderTab {...props} />,
        cardStyle: { backgroundColor: theme.colors.background.primary },
      }}
      tabBar={tabBarProps => <TabBar {...tabBarProps} />}>
      <Tab.Screen name={constants.screens.HOME} component={Home} />
      <Tab.Screen name={constants.screens.NFT} component={NFT} />
      <Tab.Screen name={constants.screens.RANKING} component={Ranking} />
      <Tab.Screen name={constants.screens.STORE} component={Store} />
    </Tab.Navigator>
  );
};

MainTabs.propTypes = {};

export default React.memo(MainTabs);
