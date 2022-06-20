import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';
import { Button, Header, Text } from 'src/components';
import { selectors } from 'src/models';
import { Device, Toast } from 'src/utils';
import theme from 'src/theme';
import { useVisible } from 'src/hooks';
import ListUser from './components/ListUser';
import ListAllUser from './components/ListAllUser';

const Affiliate = props => {
  const { navigation } = props;
  const {
    visible: listAllVisible,
    show: showAll,
    hide: hideAll,
  } = useVisible(false);
  const userData = useSelector(selectors.profile.userData);
  const link = useMemo(() => {
    return `https://stepwatch.io/auth/register/${userData.id}`;
  }, [userData]);

  const onCopyLink = useCallback(() => {
    Clipboard.setString(link);
    Toast.show('Copied');
  }, [link]);

  return (
    <SafeAreaView style={styles.container}>
      <Header isLight title="AFFILIATE" navigation={navigation} />
      <ScrollView>
        <View style={styles.totalView}>
          <Text center color="#fff" semibold size={16}>
            Total Invited
          </Text>
          <Text center color="#fff" bold size={20}>
            {userData?.memberCount || 0}
          </Text>
        </View>
        <View style={styles.qrCodeView}>
          <QRCode
            value={link}
            size={Device.screenWidth * 0.5}
            style={styles.qrCode}
          />
        </View>
        <View style={styles.linkView}>
          <Text style={styles.linkContent}>{link}</Text>
          <Button
            transparent
            icon={{ name: 'file-copy' }}
            style={styles.copyBtn}
            onPress={onCopyLink}
          />
        </View>
        {/* <View style={styles.listHeader}>
          <Text color="#fff" bold size={15}>
            Invited Users
          </Text>
          <Button
            title="View All"
            titleProps={{ color: theme.colors.button.primary, bold: true }}
            transparent
            onPress={showAll}
          />
        </View>
        <ListUser notScroll /> */}
      </ScrollView>
      <ListAllUser visible={listAllVisible} onClose={hideAll} />
    </SafeAreaView>
  );
};

Affiliate.propTypes = {};

export default React.memo(Affiliate);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  totalView: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrCode: {
    marginVertical: 20,
  },
  qrCodeView: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: theme.contentPadding,
  },
  linkView: {
    paddingHorizontal: theme.contentPadding,
    paddingVertical: 7,
    backgroundColor: '#fff',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    marginTop: 10,
    paddingRight: 0,
    marginHorizontal: theme.contentPadding,
  },
  linkContent: {
    flex: 1,
  },
  copyBtn: {
    paddingVertical: 5,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: theme.contentPadding,
    borderBottomWidth: 0.5,
    borderColor: '#fff',
  },
});
