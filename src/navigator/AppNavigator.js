import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { selectors } from 'src/models';
import { DrawerContent, Message, ToastMessage } from 'src/components';
import constants from 'src/constants';
import theme from '../theme';
import Wallet, {
  CreateWallet,
  ImportWallet,
  Trade,
  TransferExternal,
  TransferFunding,
} from '../screens/wallet';
import Login from '../screens/login';
import Run from '../screens/run';
import MainTab from './MainTab';
import Profile, { ChangePassword, Toggle2FA } from '../screens/profile';
import Register from '../screens/register';
import ForgotPassword from '../screens/forgotPassword';
import { NFTDetail } from '../screens/store';
import { MyNftDetail } from '../screens/nft';
import Affiliate from '../screens/affiliate';

export const navigationRef = React.createRef();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <DrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
      drawerStyle: { width: '90%' },
    }}>
    <Drawer.Screen name={constants.screens.MAIN_TAB} component={MainTab} />
  </Drawer.Navigator>
);

export default function AppNavigator() {
  const isSigned = useSelector(selectors.profile.isSigned);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background.primary },
        }}>
        {!isSigned ? (
          <>
            <Stack.Screen
              name={constants.screens.LOGIN}
              component={Login}
              // options={{
              //   title: Locales.locale(Locales.Scopes),
              // }}
            />
            <Stack.Screen
              name={constants.screens.REGISTER}
              component={Register}
              // options={{
              //   title: Locales.locale(Locales.Scopes),
              // }}
            />
            <Stack.Screen
              name={constants.screens.FORGOT_PASS}
              component={ForgotPassword}
              // options={{
              //   title: Locales.locale(Locales.Scopes),
              // }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={constants.screens.MAIN}
              component={DrawerNavigator}
              options={{
                cardStyle: { backgroundColor: theme.colors.background.primary },
              }}
            />
            {/* With header */}
            <Stack.Group
              screenOptions={{
                headerShown: true,
                cardStyle: { backgroundColor: theme.colors.background.primary },
                headerStyle: {
                  backgroundColor: theme.colors.background.secondary,
                  borderBottomWidth: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                  elevation: 0,
                },
                headerTitleStyle: { color: '#fff' },
                headerBackTitle: () => <View />,
                headerTintColor: 'rgba(255,255,255, 0.4)',
              }}>
              {/* <Stack.Screen
                name={constants.screens.WALLET}
                component={Wallet}
              /> */}
            </Stack.Group>
            {/* no header  */}
            <Stack.Group
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
              }}>
              <Stack.Screen name={constants.screens.RUN} component={Run} />
              <Stack.Screen
                name={constants.screens.NFT_DETAIL}
                component={NFTDetail}
              />
              <Stack.Screen
                name={constants.screens.MY_NFT_DETAIL}
                component={MyNftDetail}
              />
              <Stack.Screen
                name={constants.screens.PROFILE}
                component={Profile}
              />
              <Stack.Screen
                name={constants.screens.WALLET}
                component={Wallet}
              />
              <Stack.Screen
                name={constants.screens.CREATE_WALLET}
                component={CreateWallet}
              />
              <Stack.Screen
                name={constants.screens.IMPORT_WALLET}
                component={ImportWallet}
              />
              <Stack.Screen
                name={constants.screens.TOGGLE_2FA}
                component={Toggle2FA}
              />
              <Stack.Screen
                name={constants.screens.CHANGE_PASSWORD}
                component={ChangePassword}
              />
              <Stack.Screen
                name={constants.screens.TRADE}
                component={Trade}
                // options={{
                //   title: Locales.locale(Locales.Scopes),
                // }}
              />
              <Stack.Screen
                name={constants.screens.TRANSFER_EXTERNAL}
                component={TransferExternal}
              />
              <Stack.Screen
                name={constants.screens.TRANSFER_FUNDING}
                component={TransferFunding}
              />
              <Stack.Screen
                name={constants.screens.AFFILIATE}
                component={Affiliate}
              />
              {/* TODO: No header */}
            </Stack.Group>
            {/* Modal From bottom - no header  */}
            <Stack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
              }}
            />
          </>
        )}
      </Stack.Navigator>
      {/* <ActionModal /> */}
      <Message />
      <ToastMessage />
    </NavigationContainer>
  );
}
