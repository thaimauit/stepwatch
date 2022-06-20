import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonWithBg,
  Header,
  Icon,
  ICON_TYPES,
  Image,
  Text,
  Toggle,
} from 'src/components';
import { actions, selectors } from 'src/models';
import { useInsets } from 'src/hooks';
import theme from 'src/theme';
import { Device, Toast } from 'src/utils';
import { ImageAssets } from 'src/assets';
import constants from 'src/constants';
import Toggle2FA from './screens/toggle2FA';
import ChangePassword from './screens/changePassword';
import UpdateModal from './components/UpdateModal';
import LinearGradient from 'react-native-linear-gradient';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { top, bottom } = useInsets();
  const [updateVisible, setUpdateVisible] = useState(false);
  const { displayName, email, id, gaEnable } = useSelector(
    selectors.profile.userData,
  );

  const appVersion = useRef(Device.getAppVersion());

  const onUpdateSuccess = useCallback(
    newName => {
      dispatch(actions.profile.updateDisplayName(newName));
    },
    [dispatch],
  );

  const onLogout = useCallback(() => {
    dispatch(actions.profile.logout());
  }, [dispatch]);

  const copy = useCallback(
    text => () => {
      Clipboard.setString(text + '');
      Toast.show('Copied');
    },
    [],
  );

  const openLink = useCallback(
    link => () => {
      Linking.openURL(link);
    },
    [],
  );

  const showUpdate = useCallback(() => {
    setUpdateVisible(true);
  }, []);

  const onCloseUpdate = useCallback(() => {
    setUpdateVisible(false);
  }, []);

  const onToggleGa = useCallback(() => {
    navigation.navigate(constants.screens.TOGGLE_2FA, { isEnable: !gaEnable });
  }, [gaEnable, navigation]);

  const onChangePassword = useCallback(() => {
    navigation.navigate(constants.screens.CHANGE_PASSWORD);
  }, [navigation]);

  const onOpenAffiliate = useCallback(() => {
    navigation.navigate(constants.screens.AFFILIATE);
  }, [navigation]);

  const paddingTop = top;
  const paddingBottom = bottom;

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <LinearGradient
        colors={['#FA57CE', '#6CA2A9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0 }}
        style={[styles.header, { paddingTop }]}>
        <Header navigation={navigation} isLight />
        <View style={styles.userHeader}>
          <Image source={ImageAssets.iconAcc} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text size={18} bold style={styles.displayName} color="#fff">
              {displayName}
            </Text>

            <Text color="#fff">{email}</Text>
          </View>
          <Button
            transparent
            icon={{
              name: 'edit',
              type: ICON_TYPES.ANT_DESIGN_ICON,
              color: '#fff',
            }}
            style={styles.arrowBtn}
            onPress={showUpdate}
          />
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.rowInfo}>
            <Text style={styles.infoTitle} bold>
              Invitation Code
            </Text>
            <Text size={17} semibold>
              {id || '0'}
            </Text>
            <Button
              transparent
              icon={{ name: 'file-copy' }}
              style={styles.copyBtn}
              onPress={copy(id)}
            />
          </View>
          <TouchableOpacity style={styles.rowInfo} onPress={onOpenAffiliate}>
            <Text style={styles.infoTitle} bold>
              Affiliate
            </Text>
            <Icon
              name="arrow-forward-ios"
              color="rgba(0,0,0,.5)"
              style={styles.forward}
            />
          </TouchableOpacity>
          <View style={styles.rowInfo}>
            <Text style={styles.infoTitle} bold>
              2FA
            </Text>
            <Toggle value={gaEnable} onValueChange={onToggleGa} />
            {/* <Text size={17} semibold>
            {id || '0'}
          </Text>
          <Button
            transparent
            icon={{ name: 'file-copy' }}
            style={styles.copyBtn}
            onPress={copy(id)}
          /> */}
          </View>
          <TouchableOpacity style={styles.rowInfo} onPress={onChangePassword}>
            <Text style={styles.infoTitle} bold>
              Change Password
            </Text>
            <Icon
              name="arrow-forward-ios"
              color="rgba(0,0,0,.5)"
              style={styles.forward}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowInfo}
            onPress={openLink(
              'https://undefined-281.gitbook.io/stepwatch-english',
            )}>
            <Text style={styles.infoTitle} bold>
              Whitepaper
            </Text>
            <Icon
              name="arrow-forward-ios"
              color="rgba(0,0,0,.5)"
              style={styles.forward}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowInfo}
            onPress={openLink(
              'https://stepwatch.io/wp-content/uploads/2022/05/litepaper-en.pdf',
            )}>
            <Text style={styles.infoTitle} bold>
              Lite paper
            </Text>
            <Icon
              name="arrow-forward-ios"
              color="rgba(0,0,0,.5)"
              style={styles.forward}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ButtonWithBg
        title="Logout"
        onPress={onLogout}
        style={styles.logoutBtn}
        titleProps={{ color: '#fff' }}
        borderRadius={45}
      />
      <Text center italic>{`Version ${appVersion.current}`}</Text>
      <UpdateModal
        visible={updateVisible}
        onClose={onCloseUpdate}
        displayName={displayName}
        onUpdateSuccess={onUpdateSuccess}
      />
    </View>
  );
};

Profile.propTypes = {};

export { Toggle2FA, ChangePassword };

export default React.memo(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: theme.colors.button.primary,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: theme.contentPadding,
  },
  avatar: {
    width: 70,
    height: 70,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  arrowBtn: {
    paddingRight: theme.contentPadding,
  },
  displayName: {
    marginBottom: 5,
  },
  body: {
    flex: 1,
    padding: theme.contentPadding,
    paddingTop: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  infoTitle: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  logoutBtn: {
    alignSelf: 'center',
    borderRadius: 45,
    paddingHorizontal: 45,
    marginBottom: 15,
  },
  copyBtn: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  forward: {
    marginLeft: 10,
    marginTop: 10,
  },
});
